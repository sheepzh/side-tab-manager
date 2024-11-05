import { Configuration } from '@rspack/core'
import path from 'path'
import manifest from "../src/manifest"
import { commonConfig } from './rspack.common'

manifest.name = 'SIDE_TAB_MANAGER_DEV'

export default {
    devServer: {
        devMiddleware: {
            writeToDisk: true,
        },
    },
    ...commonConfig({
        mode: 'development',
        manifest,
        outputPath: path.join(__dirname, '..', 'dist_dev'),
    }),
} satisfies Configuration
