export async function listAllWindows(): Promise<chrome.windows.Window[]> {
    const windows = await chrome.windows.getAll()
    return windows.sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0))
}

export function getCurrentWindow(): Promise<chrome.windows.Window> {
    return chrome.windows.getCurrent()
}

export function getWindow(id: number): Promise<chrome.windows.Window> {
    return chrome.windows.get(id)
}

export function createWindow(): Promise<chrome.windows.Window> {
    return chrome.windows.create()
}

export function focusWindow(id: number): Promise<chrome.windows.Window> {
    return chrome.windows.update(id, { focused: true })
}

export type WindowListener = (w: chrome.windows.Window) => void

export function onWindowCreated(listener: WindowListener) {
    chrome.windows.onCreated.addListener(listener)
}

export function onWindowFocusChanged(listener: WindowListener) {
    chrome.windows.onCreated.addListener(listener)
}

export function onWindowRemoved(listener: (id: number) => void) {
    chrome.windows.onRemoved.addListener(listener)
}