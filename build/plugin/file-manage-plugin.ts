import { Compiler, RspackPluginInstance } from "@rspack/core"
import archiver from "archiver"
import { createWriteStream, existsSync } from "fs"
import { cp, mkdir, rm } from "fs/promises"
import { Glob } from "glob"
import path from "path"

type Endpoint = 'onEnd' | 'onStart'
// Sequence
type OperationSeq = Partial<Record<CommandName, CommandConfig>>
type CommandName = 'delete' | 'copy' | 'archive' | 'move'
type CommandConfig = string[] | { source: string, destination: string }[]

type Events = Partial<Record<Endpoint, OperationSeq[]>>

const PLUGIN_NAME = 'file-manage-plugin'

async function doDelete(target: string): Promise<void> {
    const g = new Glob(target, {})
    for await (const file of g) {
        await rm(file, { recursive: true, force: true })
    }
    await rm(target, { recursive: true, force: true })
}

async function createParentDirIfNotExist(destination: string): Promise<void> {
    const dirPath = path.dirname(destination)
    if (!existsSync(dirPath)) {
        await mkdir(dirPath)
    }
}

async function doArchive(source: string, destination: string): Promise<void> {
    console.log("started to archive source: " + source)
    createParentDirIfNotExist(destination)

    let output = createWriteStream(destination)
    const archive = archiver('zip', { zlib: { level: 9 } })

    archive.pipe(output)
    archive.directory(source, false)
    await archive.finalize()
}

/**
 * Rewrite according to: https://www.npmjs.com/package/filemanager-webpack-plugin
 */
class FileManagePlugin implements RspackPluginInstance {
    private events: Events

    constructor(config: { events: Events }) {
        this.events = config.events || {}
    }

    apply(compiler: Compiler) {
        compiler.hooks.afterDone.tap(PLUGIN_NAME, async () => {
            for await (const seq of this.events.onEnd || []) {
                await this.processSequence(seq)
            }
        })

        compiler.hooks.initialize.tap(PLUGIN_NAME, async () => {
            for await (const seq of this.events?.onStart || []) {
                await this.processSequence(seq)
            }
        })
    }

    private async processSequence(seq: Partial<Record<CommandName, CommandConfig>>): Promise<void> {
        for await (const [key, conf] of Object.entries(seq || {})) {
            const cmd = key as CommandName
            if (cmd === 'delete') {
                await this.processDelete(conf)
            } else if (cmd === 'copy') {
                await this.processCopy(conf)
            } else if (cmd === 'archive') {
                await this.processArchive(conf)
            } else {
                throw new Error("Unsupported command: " + cmd)
            }
        }
    }

    private async processDelete(cfg: CommandConfig): Promise<void> {
        for await (const item of cfg || []) {
            const target = typeof item === 'string' ? item : item?.source
            if (!target) continue
            console.log(`[${PLUGIN_NAME}] deleted ${target}`)
            await doDelete(target)
        }
    }

    private async processCopy(cfg: CommandConfig): Promise<void> {
        for await (const item of cfg || []) {
            if (typeof item !== 'object') return
            const { source, destination } = item
            console.log(`[${PLUGIN_NAME}] copied [${source}] to [${destination}]`)
            await cp(source, destination, { recursive: true, force: true })
        }
    }

    private async processArchive(cfg: CommandConfig): Promise<void> {
        for await (const item of cfg || []) {
            if (typeof item !== 'object') return
            const { source, destination } = item
            await doArchive(source, destination)
            console.log(`[${PLUGIN_NAME}] archived [${source}] to [${destination}]`)
        }
    }
}

export default FileManagePlugin