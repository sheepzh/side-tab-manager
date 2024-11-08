import Icon from "@ant-design/icons"
import type { IconComponentProps } from "@ant-design/icons/lib/components/Icon"
import { removeGroup, TagGroupExtend, ungroup, updateGroupColor, updateGroupTitle } from "@api/group"
import { createTab, createTabOfGroup } from "@api/tab"
import ColorSelected from "@icon/color-selected.svg"
import Delete from "@icon/delete.svg"
import MoveGroup from "@icon/move-group.svg"
import NewTab from "@icon/new-tab.svg"
import Ungroup from "@icon/ungroup.svg"
import { useAppContext } from "@manage/context"
import { clzNames } from "@util/style"
import { useMount } from "ahooks"
import { Divider, Flex, Input, Menu, Modal, theme } from "antd"
import { MenuItemType } from "antd/es/menu/interface"
import { GlobalToken } from "antd/lib"
import React, { CSSProperties, useMemo, useRef, useState } from "react"
import { cvtColor } from "./color"

export type GroupHandler = (target?: TagGroupExtend) => void

const computeStyle = (position: [number, number] | undefined, width: number, token: GlobalToken): CSSProperties => {
    const [x = 0, y = 0] = position || []
    const left = Math.min(document.body.getBoundingClientRect().width - width - 10, x)
    const { colorBgElevated, borderRadiusLG, colorText, zIndexPopupBase, boxShadowSecondary } = token || {}
    return {
        width,
        left,
        top: y + 5,
        backgroundColor: colorBgElevated,
        borderRadius: borderRadiusLG,
        zIndex: zIndexPopupBase + 50,
        color: colorText,
        boxShadow: boxShadowSecondary,
    }
}

type ColorSelectProps = {
    value?: chrome.tabGroups.ColorEnum
    onChange?: (val: chrome.tabGroups.ColorEnum) => void
}

const ALL_COLORS: chrome.tabGroups.ColorEnum[] = [
    'grey', 'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan', 'orange'
]

const ColorSelect = (props: ColorSelectProps) => {
    const { value, onChange } = props

    return (
        <div className="color-select">
            {ALL_COLORS.map(color => (
                <div
                    key={`color-item-${color}`}
                    className="color-select-item"
                    style={{ backgroundColor: cvtColor(color) }}
                    onClick={() => onChange?.(color)}
                >
                    {color === value && <Icon component={ColorSelected} />}
                </div>
            ))}
        </div>
    )
}

const MenuItemLabel = (props: { title: string, component: IconComponentProps['component'] }) => {
    const { title, component } = props
    return (
        <Flex>
            <Icon component={component} />
            <span style={{ marginInlineStart: 5 }}>{title}</span>
        </Flex>
    )
}

const ITEM_STYLE: CSSProperties = {
    paddingInline: 8,
    height: 32,
}

export const useGroupMenu = (): {
    el: React.JSX.Element,
    showContextMenu: (ev: MouseEvent, value?: TagGroupExtend) => void,
} => {
    const { windowId, ungroupedTabs } = useAppContext()
    const [position, setPosition] = useState<[number, number]>()
    const [width, setWidth] = useState<number>(0)
    const [value, setValue] = useState<TagGroupExtend>()
    const [visible, setVisible] = useState<boolean>(false)
    const locked = useRef(false)
    const { token } = theme.useToken()

    const ref = useRef<HTMLDivElement>(null)

    const handleClick = (ev: MouseEvent) => {
        if (locked.current) return
        const clickInMenu = ref.current?.contains?.(ev.target as Node)
        !clickInMenu && closeContextMenu()
    }

    useMount(() => {
        window.addEventListener("click", handleClick)
        return () => window.removeEventListener('click', handleClick)
    })

    const showContextMenu = (ev: MouseEvent, value?: TagGroupExtend) => {
        setPosition([ev?.pageX, ev?.pageY])
        setValue(value)
        setWidth(value ? 230 : 170)
        setVisible(true)
    }

    const closeContextMenu = () => setVisible(false)

    const handleTitleInput = (title: string) => {
        const groupId = value?.id
        if (!groupId) return
        setValue({ ...value || {}, title })
        setTimeout(() => updateGroupTitle(groupId, title))
    }

    const handleNewTab = () => {
        value ? createTabOfGroup(value) : createTab(windowId)
        closeContextMenu()
    }

    const handleUngroup = () => {
        ungroup(value?.id)
        closeContextMenu()
    }

    const handleDeleteGroup = () => {
        const groupId = value?.id
        if (!groupId) return
        setTimeout(() => locked.current = true)
        Modal.confirm({
            title: "Delete the group",
            content: "All the tabs under this group will be closed!",
            onOk: () => {
                removeGroup(groupId)
                closeContextMenu()
            },
            onCancel: () => locked.current = false,
            onClose: () => locked.current = false,
        })
    }

    const handleColorChange = (color: chrome.tabGroups.ColorEnum) => {
        if (!value) return
        updateGroupColor(value.id, color)
        value.color = color
    }

    const canMove2NewWin = useMemo(() => !!ungroupedTabs?.length, [ungroupedTabs])

    const items = useMemo(() => {
        const res: MenuItemType[] = [{
            key: "new-tab",
            label: <MenuItemLabel title="New Tab in Group" component={NewTab} />,
            onClick: handleNewTab,
            style: ITEM_STYLE,
        }, {
            key: "ungroup",
            label: <MenuItemLabel title="Ungroup" component={Ungroup} />,
            onClick: handleUngroup,
            style: ITEM_STYLE,
        }, {
            key: "delete-group",
            label: <MenuItemLabel title="Delete Group" component={Delete} />,
            onClick: handleDeleteGroup,
            style: ITEM_STYLE,
            danger: true,
        }]
        canMove2NewWin && res.splice(1, 0, {
            key: 'move-to-new-win',
            label: <MenuItemLabel title="Move Group to New Window" component={MoveGroup} />,
            onClick: handleDeleteGroup,
            style: ITEM_STYLE,
        })
        return res
    }, [canMove2NewWin])

    return {
        el: (
            <div
                className={clzNames("tab-group-context-container", visible && "visible")}
                style={computeStyle(position, width, token)}
                ref={ref}
            >
                {value ? <>
                    <Input
                        value={value?.title}
                        onInput={ev => handleTitleInput(ev.currentTarget.value)}
                        onKeyDown={ev => ev.code === 'Enter' && closeContextMenu()}
                    />
                    <Divider />
                    <ColorSelect value={value?.color} onChange={handleColorChange} />
                    <Divider />
                    <Menu
                        selectable={false}
                        items={items}
                    />
                </> : <>
                    <Menu
                        selectable={false}
                        items={[{
                            key: "new-tab",
                            label: <MenuItemLabel title="New Tab" component={NewTab} />,
                            onClick: handleNewTab,
                            style: ITEM_STYLE,
                        }]}
                    />
                </>}
            </div>
        ),
        showContextMenu,
    }
}