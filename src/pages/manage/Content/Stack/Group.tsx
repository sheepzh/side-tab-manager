import { CloseCircleFilled, FolderOutlined, PlusOutlined, SearchOutlined, UpOutlined } from "@ant-design/icons"
import { TagGroupExtend, updateGroupCollapsed } from "@api/group"
import { createTab, createTabOfGroup, moveTabs2Group, ungroupTabs } from "@api/tab"
import { useAppContext } from "@manage/context"
import { clzNames } from "@util/style"
import { useMount, useThrottleFn } from "ahooks"
import { Button, Flex, Input, InputRef, Tag, theme } from "antd"
import Card from "antd/es/card/Card"
import { useRef, useState } from "react"
import { UngroupDragData } from "../../DragLayer/Content"
import TabItem from "./TabItem"
import { cvtTagColor } from "./color"
import { filterTabs } from "./common"
import { ItemType, parseTabsFromItem, useMyDrag, useMyDrop } from "./useDnd"

export const GroupTag = ({ title, color }: Pick<TagGroupExtend, 'color' | 'title'>) => {
    return <Tag
        color={cvtTagColor(color)}
        style={{
            color: color === 'yellow' || color === 'orange' ? '#202124' : '#FFF',
            fontWeight: 400,
            marginRight: 0,
            borderRadius: 7
        }}
    >
        {title || <span>&ensp;</span>}
    </Tag>
}

type HeaderProps = {
    value: TagGroupExtend
}

const Header = (props: HeaderProps) => {
    const { value } = props
    const { id, title, collapsed, color } = value || {}

    const handleCollapsedChange = () => {
        if (!id) return
        updateGroupCollapsed(id, value.collapsed = !collapsed)
    }

    const [_, dragRef] = useMyDrag<{}, string, { isDragging: boolean }>({ type: "grouped", item: value })

    return (
        <div
            ref={dragRef}
            className="tab-group-header"
            onClick={handleCollapsedChange}
        >

            <div className="tab-group-header-left">
                <GroupTag title={title} color={color} />
            </div>
            <div className="tab-group-header-right">
                <Button
                    className="only-hover"
                    type="text"
                    size="small"
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={ev => {
                        createTabOfGroup(value)
                        ev.stopPropagation()
                    }}
                />
                <Button
                    icon={collapsed ? <FolderOutlined /> : <UpOutlined />}
                    size="small"
                    shape="circle"
                    type={collapsed ? 'primary' : 'text'}
                    onClick={handleCollapsedChange}
                />
            </div>
        </div >
    )
}

type Props = {
    value: TagGroupExtend
    forceOpen?: boolean
    onShowContextmenu?: (ev: MouseEvent) => void
}

export const Group = (props: Props) => {
    const {
        value, forceOpen,
        onShowContextmenu,
    } = props
    const { collapsed, tabs } = value || {}
    const ref = useRef<HTMLDivElement>(null)
    const { clearSelectedTab } = useAppContext()

    const [, dropRef] = useMyDrop({
        accept: ['tab', 'grouped', 'ungrouped'],
        drop(item, monitor) {
            const itemType = monitor.getItemType() as ItemType
            const tabs = parseTabsFromItem(item, itemType)
            const tabIds = tabs?.filter(t => t.groupId !== value?.id)?.map(t => t.id)
            moveTabs2Group(tabIds, value?.id)
            clearSelectedTab()
        }
    })

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


    return (
        <div ref={ref}>
            <Card
                ref={dropRef}
                size="small"
                className={clzNames('tab-group-container', collapsed && !forceOpen && 'collapsed')}
                title={<Header value={value} />}
            >
                {tabs.map(tab => <TabItem key={`tab-${tab?.id}`} value={tab} />)}
            </Card>
        </div>
    )
}

const UngroupHeader = ({ tabs, onClick, onSearch }: {
    tabs: chrome.tabs.Tab[],
    onClick?: () => void,
    onSearch?: (query: string) => void,
}) => {
    const { windowId } = useAppContext()
    const { token } = theme.useToken()

    const [_, dragRef] = useMyDrag<UngroupDragData, string, { isDragging: boolean }>({ type: "ungrouped", item: { tabs } })

    const [searching, setSearching] = useState<boolean>(false)
    const searchRef = useRef<InputRef>(null)
    const openSearch = () => {
        setSearching(true)
        setTimeout(() => searchRef.current?.focus?.({ cursor: 'end' }))
    }
    const closeSearch = () => {
        setSearching(false)
        onSearch?.('')
    }
    const {
        run: onSearchWithThrottle
    } = useThrottleFn((val: string) => onSearch?.(val), { wait: 100 })

    const handleSearchChange = (val: string) => {
        if (val) {
            onSearchWithThrottle(val)
        } else {
            onSearch?.('')
        }
    }

    const handleHeaderClick = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = ev.target
        if (!(target instanceof HTMLDivElement)) return
        target.classList?.contains('tab-group-header') && onClick?.()
    }

    return (
        <div
            ref={dragRef}
            className="tab-group-header"
            onClick={handleHeaderClick}
        >
            <div className="tab-group-header-left">
                <Tag color="default">Ungrouped</Tag>
            </div>
            <Flex align="center">
                {searching ?
                    <Input
                        ref={searchRef}
                        size="small"
                        style={{ flex: 1 }}
                        allowClear
                        onChange={ev => handleSearchChange?.(ev.currentTarget?.value)}
                        prefix={<SearchOutlined />}
                        onKeyDown={ev => ev.key == 'Escape' && closeSearch()}
                        suffix={(
                            <CloseCircleFilled
                                onClick={closeSearch}
                                style={{ color: token.colorIcon }}
                            />
                        )}
                    />
                    : <Button
                        className="only-hover"
                        type="text"
                        size="small"
                        shape="circle"
                        icon={<SearchOutlined />}
                        onClick={openSearch}
                    />
                }
                <Button
                    type="text"
                    size="small"
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={() => createTab(windowId)}
                />
            </Flex>
        </div >
    )
}

type UngroupProps = {
    tabs: chrome.tabs.Tab[]
    forceOpen?: boolean
    onShowContextmenu?: (ev: MouseEvent) => void
}

export const Ungroup = (props: UngroupProps) => {
    const {
        tabs, forceOpen,
        onShowContextmenu,
    } = props
    const ref = useRef<HTMLDivElement>(null)
    const [query, setQuery] = useState<string>()
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

    const [, dropRef] = useMyDrop({
        accept: ['tab', 'grouped'],
        drop(item, monitor) {
            const type = monitor.getItemType() as ItemType
            const tabs = parseTabsFromItem(item, type)
            const tabIds = tabs
                ?.filter(t => t.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE)
                ?.map(t => t.id)
            ungroupTabs(tabIds)
            clearSelectedTab()
        },
    })

    const revertCollapsed = () => setCollapsed(!collapsed)

    return (
        <div ref={ref}>
            <Card
                ref={dropRef}
                size="small"
                className={clzNames('tab-group-container', collapsed && !forceOpen && 'collapsed')}
                title={<UngroupHeader
                    tabs={tabs}
                    onClick={revertCollapsed}
                    onSearch={setQuery}
                />}
            >
                {filterTabs(tabs, query).map(tab => <TabItem key={`ungrouped-${tab.id}`} value={tab} />)}
            </Card>
        </div>
    )
}