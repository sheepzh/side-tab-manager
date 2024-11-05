import { IS_CHROME, IS_EDGE } from "./env"

/**
 * The page of extension detail
 */
let updatePage = null

if (IS_CHROME) {
    updatePage = `chrome://extensions/?id=${chrome.runtime.id}`
} else if (IS_EDGE) {
    // on the management page with developing-mode open
    updatePage = 'edge://extensions'
}

export const UPDATE_PAGE = updatePage

/**
 * Test whether the url belongs to the browser
 *
 * @param url
 */
export function isBrowserUrl(url: string) {
    return /^chrome.*?:\/\/.*$/.test(url)
        || /^about(-.+)?:/.test(url)
        // Firefox addons' pages
        || /^moz-extension:/.test(url)
        || /^edge.*?:\/\/.*$/.test(url)
        // Edge extensions' pages
        || /^extension:/.test(url)
        || /^safari.*?:\/\/.*/.test(url)
}
