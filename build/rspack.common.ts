import { join } from "path"
import FileManagePlugin from "./plugin/file-manage-plugin"
import ManifestGeneratePlugin from "./plugin/manifest-generate-plugin"
import { Configuration, HtmlRspackPlugin } from "@rspack/core"

type CommonExtend = {
    mode: Configuration['mode']
    manifest: chrome.runtime.ManifestV3
    outputPath: string
}

export const commonConfig = ({ manifest, outputPath, mode }: CommonExtend): Configuration => {
    return {
        mode,
        entry: {
            manage: './src/pages/manage',
            worker: './src/worker',
        },
        output: {
            path: outputPath,
        },
        optimization: {
            splitChunks: false,
        },
        plugins: [
            new ManifestGeneratePlugin({ manifest }),
            new HtmlRspackPlugin({
                filename: 'manage.html',
                chunks: ['manage'],
            }),
            new FileManagePlugin({
                events: {
                    onStart: [
                        { delete: [outputPath] },
                    ],
                    onEnd: [{
                        copy: [
                            { source: join(__dirname, '..', 'public'), destination: join(outputPath, 'public') }
                        ]
                    }]
                },
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /^(node_modules|test|script)/,
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: "typescript",
                                tsx: true
                            },
                            transform: {
                                react: {
                                    runtime: "automatic",
                                    development: mode === 'development',
                                    refresh: false,
                                }
                            }
                        },
                    },
                }, {
                    test: /\.svg$/,
                    issuer: /\.[jt]sx?$/,
                    use: ["@svgr/webpack"],
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.tsx', ".js", '.css'],
            alias: {
                "@api": join(__dirname, "..", "src", "api"),
                "@util": join(__dirname, "..", "src", "util"),
                "@icon": join(__dirname, "..", "src", "icon"),
                "@manage": join(__dirname, "..", "src", "pages", "manage"),
            },
        },
        experiments: {
            css: true,
        },
    }
}

