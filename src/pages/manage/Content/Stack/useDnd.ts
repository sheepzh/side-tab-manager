import { TagGroupExtend } from "@api/group"
import { useMount } from "ahooks"
import { ConnectDragSource, ConnectDropTarget, DragSourceHookSpec, DropTargetHookSpec, FactoryOrInstance, useDrag, useDrop } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"
import { UngroupDragData } from "../../DragLayer/Content"

export type ItemType = 'tab' | 'grouped' | 'ungrouped'
    & DragSourceHookSpec<any, any, any>['type']

export function useMyDrag<DragObject = unknown, DropResult = unknown, CollectedProps = unknown>(
    specArg: FactoryOrInstance<Omit<DragSourceHookSpec<DragObject, DropResult, CollectedProps>, 'type'> & { type: ItemType }>,
    deps?: unknown[]
): [CollectedProps, ConnectDragSource] {
    const [dragObject, dragRef, preview] = useDrag<DragObject, DropResult, CollectedProps>(specArg, deps)
    useMount(() => preview(getEmptyImage()))

    return [dragObject, dragRef]
}

export function useMyDrop<DragObject = unknown, DropResult = unknown, CollectedProps = unknown>(
    specArg: FactoryOrInstance<Omit<DropTargetHookSpec<DragObject, DropResult, CollectedProps>, 'accept'> & { accept: ItemType | ItemType[] }>,
    deps?: unknown[]
): [CollectedProps, ConnectDropTarget] {
    return useDrop<DragObject, DropResult, CollectedProps>(specArg, deps)
}

export function parseTabsFromItem(item: unknown, itemType: ItemType): chrome.tabs.Tab[] | undefined {
    let tabs: chrome.tabs.Tab[] = []
    if (itemType === 'tab') {
        tabs = item as chrome.tabs.Tab[]
    } else if (itemType === 'grouped') {
        tabs = (item as TagGroupExtend)?.tabs
    } else if (itemType === 'ungrouped') {
        tabs = (item as UngroupDragData)?.tabs
    }
    return tabs
}