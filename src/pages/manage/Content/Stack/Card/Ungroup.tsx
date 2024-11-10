import { PlusOutlined } from "@ant-design/icons"
import { createTab, ungroupTabs } from "@api/tab"
import { useAppContext } from "@manage/context"
import { UngroupDragData } from "@manage/DragLayer/Content"
import { useMount } from "ahooks"
import { Button, Card, Flex, Tag, theme } from "antd"
import { CSSProperties, useMemo, useRef, useState } from "react"
import TabItem from "../TabItem"
import { ItemType, parseTabsFromItem, useMyDrag, useMyDrop } from "../useDnd"
import { GROUP_BODY_STYLE, GROUP_HEADER_INNER_STYLE, GROUP_HEADER_STYLE } from "./common"

const UngroupHeader = ({ tabs, onClick }: {
    tabs: chrome.tabs.Tab[],
    onClick?: () => void,
}) => {
    const { windowId } = useAppContext()

    const [_, dragRef] = useMyDrag<UngroupDragData, string, { isDragging: boolean }>({ type: "ungrouped", item: { tabs } })

    const handleHeaderClick = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = ev.target
        if (!(target instanceof HTMLDivElement)) return
        target.classList?.contains('tab-group-header') && onClick?.()
    }

    const [over, setOver] = useState(false)
    const { token } = theme.useToken()

    return (
        <Flex
            ref={dragRef}
            justify="space-between"
            align="center"
            style={{
                ...GROUP_HEADER_INNER_STYLE,
                backgroundColor: over ? token.colorBgLayout : undefined,
            }}
            onMouseEnter={() => setOver(true)}
            onMouseLeave={() => setOver(false)}
            onClick={handleHeaderClick}
        >
            <div>
                <Tag color="default">Ungrouped</Tag>
            </div>
            <Flex align="center">
                <Button
                    type="text"
                    size="small"
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={() => createTab(windowId)}
                />
            </Flex>
        </Flex>
    )
}

type UngroupProps = {
    tabs: chrome.tabs.Tab[]
    forceOpen?: boolean
    onShowContextmenu?: (ev: MouseEvent) => void
}

const Ungroup = (props: UngroupProps) => {
    const {
        tabs, forceOpen,
        onShowContextmenu,
    } = props
    const ref = useRef<HTMLDivElement>(null)
    const {
        ungroupCollapsed: collapsed,
        setUngroupCollapsed: setCollapsed,
        clearSelectedTab,
    } = useAppContext()

    useMount(() => {
        const rightClickListener = (ev: MouseEvent) => {
            const headEl = ref.current?.querySelector?.('.ant-card-head')
            if (headEl?.contains?.(ev.target as Node)) {
                onShowContextmenu?.(ev)
                ev.preventDefault()
            }
        }

        window.addEventListener('contextmenu', rightClickListener)

        return () => window.removeEventListener('contextmenu', rightClickListener)
    })

    const [{ canDrop }, dropRef] = useMyDrop({
        accept: ['tab', 'grouped'],
        drop(item, monitor) {
            const type = monitor.getItemType() as ItemType
            const tabs = parseTabsFromItem(item, type)
            const tabIds = tabs
                ?.filter(t => t.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE)
                ?.map(t => t.id)
            ungroupTabs(tabIds)
            clearSelectedTab('MoveToUngroup')
        },
        collect: monitor => ({ canDrop: monitor.canDrop() })
    })

    const [display, realCollapsed] = useMemo(() => {
        let display: CSSProperties['display'] = undefined
        let realCollapsed: boolean = collapsed && !forceOpen
        if (!tabs.length) {
            // No tabs and not dropping, hide
            if (!canDrop) display = 'none'
            realCollapsed = true
        }
        return [display, realCollapsed]
    }, [collapsed, forceOpen, tabs, canDrop])

    const revertCollapsed = () => setCollapsed(!collapsed)

    return (
        <div ref={ref} style={{ display }}>
            <Card
                ref={dropRef}
                size="small"
                title={<UngroupHeader tabs={tabs} onClick={revertCollapsed} />}
                onMouseOver={() => { }}
                styles={{
                    header: {
                        ...GROUP_HEADER_STYLE,
                        borderRadius: realCollapsed ? 8 : undefined,
                    },
                    body: {
                        ...GROUP_BODY_STYLE,
                        display: realCollapsed ? 'none' : undefined,
                    }
                }}
            >
                {tabs.map(tab => <TabItem key={`ungrouped-${tab.id}`} value={tab} />)}
            </Card>
        </div>
    )
}

export default Ungroup