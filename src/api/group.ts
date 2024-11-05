import { groupBy } from "@util/array"
import { listAllTabs, listTabByGroupId, listTabByWindowId, removeTab, ungroupTabs } from "./tab"
import { getCurrentWindow } from "./window"

export type TagGroupExtend = chrome.tabGroups.TabGroup & {
    tabs: chrome.tabs.Tab[]
}

export async function listAllGroups(windowId?: number): Promise<[TagGroupExtend[], ungroupedTabs: chrome.tabs.Tab[]]> {
    if (!windowId) {
        const win = await getCurrentWindow()
        windowId = win.id
    }
    const groups = await chrome.tabGroups.query({ windowId })
    const groupExtends = groups.map(g => ({ ...g, tabs: [] } satisfies TagGroupExtend))
    const groupMap: { [key: string]: TagGroupExtend } = groupBy(groupExtends, g => g.id, g => g[0])

    const tabs = windowId ? await listTabByWindowId(windowId) : await listAllTabs()
    const ungroupedTabs: chrome.tabs.Tab[] = []

    tabs.forEach(tab => {
        const groupId = tab.groupId
        const group = groupMap[groupId]
        if (!group) {
            ungroupedTabs.push(tab)
        } else {
            group.tabs.push(tab)
        }
    })
    return [groupExtends, ungroupedTabs]
}

export async function removeGroup(id: number) {
    const tabs = await listTabByGroupId(id)
    if (!tabs?.length) return
    for (const tab of tabs) {
        const { id: tabId } = tab || {}
        await removeTab(tabId)
    }
}

export async function ungroup(id: number | undefined) {
    if (!id) return
    const tabs = await listTabByGroupId(id)
    await ungroupTabs(tabs?.map(t => t.id))
}

export async function moveGroup2Win(group: TagGroupExtend | undefined, windowId: number | undefined): Promise<void> {
    // Move group will crash
    // await chrome.tabGroups.move(groupId, { windowId, index: -1 })

    if (!group || !windowId) return
    const newGroupId = await createNewGroup(windowId, group.tabs)
    if (!newGroupId) return
    await chrome.tabGroups.update(newGroupId, { title: group.title, collapsed: false, color: group.color })
}

export async function createNewGroup(windowId: number | undefined, tabs: chrome.tabs.Tab[]): Promise<number | null> {
    const tabIds = tabs?.map(t => t.id)?.filter(id => id !== undefined)
    if (!tabIds?.length || !windowId) return null
    return chrome.tabs.group({ tabIds, createProperties: { windowId } })
}

export async function updateGroupCollapsed(id: number, collapsed: boolean): Promise<void> {
    await chrome.tabGroups.update(id, { collapsed: !!collapsed })
}

export function updateGroupTitle(id: number, title: string): Promise<chrome.tabGroups.TabGroup> {
    return chrome.tabGroups.update(id, { title })
}

export function updateGroupColor(id: number, color: chrome.tabGroups.ColorEnum): Promise<chrome.tabGroups.TabGroup> {
    return chrome.tabGroups.update(id, { color })
}

export async function onGroupUpdated(listener: (idOrGroup: number | chrome.tabGroups.TabGroup) => void): Promise<void> {
    if (!listener) return
    chrome.tabGroups.onCreated.addListener(listener)
    chrome.tabGroups.onMoved.addListener(listener)
    chrome.tabGroups.onUpdated.addListener(listener)
    chrome.tabGroups.onRemoved.addListener(listener)
}