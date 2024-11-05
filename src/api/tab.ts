import { focusWindow } from "./window"

export function listAllTabs(): Promise<chrome.tabs.Tab[]> {
    return chrome.tabs.query({ currentWindow: true })
}

export function listTabByGroupId(groupId: number): Promise<chrome.tabs.Tab[]> {
    return chrome.tabs.query({ groupId })
}

export async function listTabByWindowId(windowId: number | undefined): Promise<chrome.tabs.Tab[]> {
    if (windowId === undefined) return []
    return chrome.tabs.query({ windowId })
}

export async function removeTab(id: number | undefined): Promise<void> {
    if (id === undefined) return
    return chrome.tabs.remove(id)
}

export async function focusTab(id: number): Promise<void> {
    // Active tab
    const tab = await chrome.tabs.update(id, { active: true })
    // Focus window
    await focusWindow(tab.windowId)
}

export function getTab(id: number): Promise<chrome.tabs.Tab> {
    return chrome.tabs.get(id)
}

export function createTab(windowId: number | undefined): Promise<chrome.tabs.Tab> {
    return chrome.tabs.create({ windowId })
}

export async function createTabOfGroup(group: chrome.tabGroups.TabGroup): Promise<chrome.tabs.Tab> {
    const { windowId, id: groupId } = group || {}
    const tab = await chrome.tabs.create({ windowId })
    const tabId = tab?.id
    if (tabId) {
        chrome.tabs.group({ tabIds: [tabId], groupId })
    }
    return tab
}

export async function ungroupTabs(tabIds?: (number | undefined)[]): Promise<void> {
    const ids = tabIds?.filter(id => id !== undefined)
    if (!ids?.length) return
    return chrome.tabs.ungroup(ids)
}

export async function moveTabs2Win(tabIds: (number | undefined)[] | undefined, windowId: number | undefined): Promise<void> {
    const ids = tabIds?.filter(id => id !== undefined)
    if (!ids?.length || !windowId) return
    await Promise.all(ids.map(id => chrome.tabs.move(id, { index: -1, windowId })))
}

export async function moveTabs2Group(tabIds: (number | undefined)[] | undefined, groupId: number | undefined): Promise<void> {
    const ids = tabIds?.filter(id => id !== undefined)
    if (!ids?.length || !groupId) return
    chrome.tabs.group({ groupId, tabIds: ids })
}
