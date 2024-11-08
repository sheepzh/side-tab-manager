import { TagGroupExtend } from "@api/group"
import { includesIgnoreCase } from "@util/string"

export function filterTabs(tabs: chrome.tabs.Tab[], query?: string): chrome.tabs.Tab[] {
    if (!tabs?.length) return []
    if (!query) return tabs
    return tabs.filter(t => includesIgnoreCase(t.title, query) || includesIgnoreCase(t.url, query))
}

export function filterGroups(groups: TagGroupExtend[], query?: string): TagGroupExtend[] {
    if (!groups?.length) return []
    if (!query) return groups
    const result: TagGroupExtend[] = []
    groups.forEach(g => {
        const tabs = filterTabs(g.tabs, query)
        if (!tabs.length) return
        result.push({ ...g, tabs })
    })
    return result
}
