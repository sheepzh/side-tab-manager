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
import { useMount } from "ahooks"
import { Divider, Flex, Input, Menu, Modal, theme } from "antd"
import React, { CSSProperties, useMemo, useRef, useState } from "react"
import { cvtColor } from "./color"

export type GroupHandler = (target?: TagGroupExtend) => void

const computePositionStyle = (position: [number, number] | undefined, width: number): CSSProperties => {
    const [x = 0, y = 0] = position || []
    const left = Math.min(document.body.getBoundingClientRect().width - width - 10, x)
    return {
        width,
        left,
        top: y + 5,
    }
}

const DIVIDER_STYLE: CSSProperties = {
    margin: '6px 0',
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
    const { token } = theme.useToken()

    return (
        <Flex
            justify="space-between"
            style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: 6,
                cursor: 'pointer',
            }}
        >
            {ALL_COLORS.map(color => (
                <Flex
                    key={`color-item-${color}`}
                    justify="space-around"
                    align="center"
                    style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        color: token.colorWhite,
                        backgroundColor: cvtColor(color),
                    }}
                    onClick={() => onChange?.(color)}
                >
                    {/* make content not empty */}
                    {color === value ? <Icon component={ColorSelected} style={{ fontSize: 18 }} /> : <div />}
                </Flex>
            ))}
        </Flex>
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
    display: 'flex',
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

    return {
        el: (
            <div
                ref={ref}
                style={visible ?
                    {
                        backgroundColor: token.colorBgElevated,
                        borderRadius: token.borderRadiusLG,
                        zIndex: token.zIndexPopupBase + 50,
                        color: token.colorText,
                        boxShadow: token.boxShadowSecondary,
                        position: 'fixed',
                        backgroundClip: 'padding-box',
                        padding: 6,
                        display: 'block',
                        ...computePositionStyle(position, width),
                    } : { display: 'none' }
                }
            >
                {value ? <>
                    <Input
                        value={value?.title}
                        onInput={ev => handleTitleInput(ev.currentTarget.value)}
                        onKeyDown={ev => ev.code === 'Enter' && closeContextMenu()}
                    />
                    <Divider style={DIVIDER_STYLE} />
                    <ColorSelect value={value?.color} onChange={handleColorChange} />
                    <Divider style={DIVIDER_STYLE} />
                    <Menu
                        selectable={false}
                        items={[{
                            key: "new-tab",
                            label: <MenuItemLabel title="New Tab in Group" component={NewTab} />,
                            onClick: handleNewTab,
                            style: ITEM_STYLE,
                        }, canMove2NewWin ? {
                            key: 'move-to-new-win',
                            label: <MenuItemLabel title="Move Group to New Window" component={MoveGroup} />,
                            onClick: handleDeleteGroup,
                            style: ITEM_STYLE,
                        } : null, {
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
                        }]}
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