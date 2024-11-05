import { Configuration } from '@rspack/core'
import path from 'path'
import manifest from "../src/manifest"
import { commonConfig } from './rspack.common'
import FileManagePlugin from './plugin/file-manage-plugin'
import { name, version } from "../package.json"

const outputPath = path.join(__dirname, '..', 'dist_prod')
const marketPkgPath = path.join(__dirname, '..', 'market_packages')
const normalZipFilePath = path.join(marketPkgPath, `${name}-${version}.zip`)

const {
    plugins,
    ...base
} = commonConfig({
    mode: 'production',
    manifest,
    outputPath: path.join(__dirname, '..', 'dist_prod'),
})

export default {
    plugins: [
        ...plugins || [],
        new FileManagePlugin({
            events: {
                onEnd: [
                    {
                        delete: [
                            path.join(outputPath, '*.LICENSE.txt'),
                            path.join(outputPath, '*.map'),
                        ]
                    },
                    // Define plugin to archive zip for different markets
                    {
                        delete: [normalZipFilePath],
                        archive: [{
                            source: outputPath,
                            destination: normalZipFilePath,
                        }],
                    },
                ]
            }
        })
    ],
    devtool: false,
    ...base,
} satisfies Configuration
