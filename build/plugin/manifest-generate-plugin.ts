import { Compiler, RspackPluginInstance, Stats } from "@rspack/core"
import { writeFileSync } from "fs"
import { join } from "path"

export type ManifestGenerateOption = {
    manifest: chrome.runtime.ManifestV3
}

class ManifestGeneratePlugin implements RspackPluginInstance {
    private option: ManifestGenerateOption
    private hasWrite: boolean = false

    constructor(option: ManifestGenerateOption) {
        if (!option) {
            throw new Error('Option is required for ManifestGenerateOption')
        }
        this.option = option
    }

    name: string = 'ManifestGeneratePlugin'
    pre?: string[] | undefined
    post?: string[] | undefined
    remove?: string[] | undefined

    apply(compiler: Compiler) {
        const { manifest } = this.option || {}
        if (!manifest) {
            throw new Error('Manifest is required')
        }
        const config = compiler.options

        const outputPath = config?.output?.path
        if (!outputPath) {
            throw new Error("Failed to found output path")
        }

        const manifestPath = join(outputPath, 'manifest.json')

        compiler.hooks.afterDone.tap('ManifestGeneratePlugin', (_stats: Stats) => {
            if (this.hasWrite) return
            writeFileSync(manifestPath, JSON.stringify(manifest))
            this.hasWrite = true
        })
    }
}

export default ManifestGeneratePlugin