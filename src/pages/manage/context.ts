import { listAllGroups, onGroupUpdated, TagGroupExtend } from "@api/group"
import { useMount, useRequest } from "ahooks"
import { createContext, useContext, useMemo, useState } from "react"

export type TabSelectState = 'full' | 'none' | 'half'

export type AppContextValue = {
    groups: TagGroupExtend[]
    ungroupedTabs: chrome.tabs.Tab[]
    ungroupCollapsed: boolean
    setUngroupCollapsed: (val: boolean) => void
    selectedTabIds: number[]
    selectedTabCount: number
    windowId: number
    selectedState: TabSelectState
    getTabs: (tabId: (number | undefined)[] | undefined) => chrome.tabs.Tab[]
    selectTab: (tabId: number) => void
    unselectTab: (tabId: number) => void
    getSelectedTabs: () => chrome.tabs.Tab[]
    clearSelectedTab: () => void
    selectAllTab: () => void
    refreshGroups: () => void
}

const AppContext = createContext<Partial<AppContextValue>>({})

export default AppContext

export const useAppContext = () => useContext(AppContext) as AppContextValue

export const createAppContextValue = (option: { windowId: number }): AppContextValue => {
    const { windowId } = option || {}
    const [selectedTabIds, setSelectedTabIds] = useState<number[]>([])
    const selectedTabCount = useMemo(() => selectedTabIds?.length ?? 0, [selectedTabIds])
    const [ungroupCollapsed, setUngroupCollapsed] = useState(false)

    const selectTab = (tabId: number) => setSelectedTabIds([tabId, ...selectedTabIds || []])
    const unselectTab = (tabId: number) => setSelectedTabIds(selectedTabIds?.filter(selected => selected !== tabId) || [])
    const clearSelectedTab = () => setSelectedTabIds([])
    const selectAllTab = () => {
        const allIds: number[] = []
        Object.values(tabMap).map(t => t.id).forEach(id => id && allIds.push(id))
        setSelectedTabIds(allIds)
    }

    const {
        data: [groups, ungroupedTabs] = [[], []],
        refresh: refreshGroups,
    } = useRequest(() => listAllGroups(windowId))

    const tabMap = useMemo(() => {
        const map: Record<number, chrome.tabs.Tab> = {}
        groups?.flatMap(g => g.tabs)?.forEach(t => t.id && (map[t.id] = t))
        ungroupedTabs?.forEach(t => t.id && (map[t.id] = t))
        return map
    }, [groups, ungroupedTabs])

    const selectedState = useMemo<TabSelectState>(() => {
        let length = selectedTabIds?.length ?? 0
        if (length === 0) return 'none'
        if (length === Object.keys(tabMap).length) return 'full'
        return 'half'
    }, [selectedTabIds, tabMap])

    const getTabs = (ids: (number | undefined)[] | undefined): chrome.tabs.Tab[] => {
        const result: chrome.tabs.Tab[] = []
        ids?.forEach(id => {
            if (!id) return
            const tab = tabMap[id]
            tab && result.push(tab)
        })
        return result
    }

    const getSelectedTabs = () => {
        return getTabs(selectedTabIds)
    }

    useMount(() => {
        onGroupUpdated(refreshGroups)

        chrome.windows.onFocusChanged.addListener(refreshGroups)

        chrome.tabs.onActivated.addListener(info => info.windowId === windowId && refreshGroups())
        chrome.tabs.onReplaced.addListener(refreshGroups)
        chrome.tabs.onCreated.addListener(tab => tab.windowId === windowId && refreshGroups())
        chrome.tabs.onMoved.addListener((_tabId, info) => info.windowId === windowId && refreshGroups())
        chrome.tabs.onUpdated.addListener(refreshGroups)
        chrome.tabs.onRemoved.addListener((_tabId, info) => info.windowId === windowId && refreshGroups())
        chrome.tabs.onDetached.addListener((_tabId, info) => info.oldWindowId === windowId && refreshGroups())
        chrome.tabs.onAttached.addListener((_tabId, info) => info.newWindowId === windowId && refreshGroups())
    })

    return {
        groups,
        ungroupedTabs,
        ungroupCollapsed,
        setUngroupCollapsed,
        windowId,
        selectedTabIds,
        selectedTabCount,
        selectedState,
        refreshGroups,
        selectTab, unselectTab, clearSelectedTab, selectAllTab,
        getTabs, getSelectedTabs,
    }
}