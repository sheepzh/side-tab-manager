/**
 * Build the manifest.json in chrome extension directory via this file
 */
// Not use path alias in manifest.json
import packageInfo from "../package.json"
const { version, author: { email }, homepage } = packageInfo

const _default: chrome.runtime.ManifestV3 = {
    name: 'Side Tab Manager',
    description: "Vertical tabs for chrome in side panel",
    version,
    author: { email },
    // default_locale: 'en',
    homepage_url: homepage,
    manifest_version: 3,
    icons: {
        16: "public/icon.png",
        48: "public/icon.png",
        128: "public/icon.png",
    },
    background: {
        service_worker: 'worker.js'
    },
    permissions: [
        'tabs',
        'tabGroups',
        'sidePanel',
        'processes',
    ],
    action: {
        default_icon: "public/icon.png",
    },
}

export default _default