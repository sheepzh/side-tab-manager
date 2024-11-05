export async function openSidePanel(windowId: number | undefined): Promise<void> {
    if (!windowId) return
    return chrome.sidePanel.open({ windowId })
}

export async function closeSidePanel(windowId: number | undefined): Promise<void> {
    if (!windowId) return
    return chrome.sidePanel.setOptions({})
}