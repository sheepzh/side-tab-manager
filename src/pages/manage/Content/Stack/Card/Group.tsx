import { FolderOutlined, PlusOutlined, UpOutlined } from "@ant-design/icons"
import { TagGroupExtend, updateGroupCollapsed } from "@api/group"
import { createTabOfGroup, moveTabs2Group } from "@api/tab"
import { useAppContext } from "@manage/context"
import { useMount } from "ahooks"
import { Button, Flex, theme } from "antd"
import Card from "antd/es/card/Card"
import { useRef, useState } from "react"
import TabItem from "../TabItem"
import { ItemType, parseTabsFromItem, useMyDrag, useMyDrop } from "../useDnd"
import { GROUP_BODY_STYLE, GROUP_HEADER_STYLE, GROUP_HEADER_INNER_STYLE } from "./common"
import GroupTag from "./GroupTag"

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
            onClick={handleCollapsedChange}
        >
            <div>
                <GroupTag title={title} color={color} />
            </div>
            <Flex align="center">
                <Button
                    type="text"
                    size="small"
                    shape="circle"
                    icon={<PlusOutlined />}
                    style={{ display: !over ? 'none' : undefined }}
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
            </Flex>
        </Flex>
    )
}

type Props = {
    value: TagGroupExtend
    forceOpen?: boolean
    onShowContextmenu?: (ev: MouseEvent) => void
}

const Group = (props: Props) => {
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
            const thisGroupId = value?.id
            const allFromThisGroup = !tabs?.find(t => t.groupId !== thisGroupId)
            if (allFromThisGroup) return

            const tabIds = tabs?.filter(t => t.groupId !== value?.id)?.map(t => t.id)
            moveTabs2Group(tabIds, thisGroupId)
            clearSelectedTab('MoveToGroup')
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
                title={<Header value={value} />}
                ref={dropRef}
                size="small"
                styles={{
                    header: {
                        ...GROUP_HEADER_STYLE,
                        borderRadius: collapsed ? 8 : undefined,
                    },
                    body: {
                        ...GROUP_BODY_STYLE,
                        display: collapsed && !forceOpen ? 'none' : undefined,
                    }
                }}
            >
                {tabs.map(tab => <TabItem key={`tab-${tab?.id}`} value={tab} />)}
            </Card>
        </div>
    )
}

export default Group