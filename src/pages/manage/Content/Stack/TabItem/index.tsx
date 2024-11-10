import { CloseOutlined } from "@ant-design/icons"
import { focusTab, removeTab } from "@api/tab"
import { useAppContext } from "@manage/context"
import { parseOrigin } from "@util/tab"
import { Button, Checkbox, Flex, Popover, theme } from "antd"
import { useEffect, useMemo, useState } from "react"
import { useDragLayer } from "react-dnd"
import { useMyDrag } from "../useDnd"
import TabIcon from "./TabIcon"

const PopoverContent = ({ value }: { value: chrome.tabs.Tab }) => {
    const { title, url } = value
    const { token } = theme.useToken()
    const { fontSize, fontSizeHeading5, fontWeightStrong } = token

    const origin = parseOrigin(url)

    return (
        <Flex gap={2} vertical style={{ width: 220, userSelect: 'none' }}>
            <p style={{
                fontSize: fontSizeHeading5 - 2,
                fontWeight: fontWeightStrong,
                margin: 0,
            }}>{title}</p>
            <p style={{
                fontSize: fontSize - 2,
                margin: 0,
            }}>{origin}</p>
        </Flex>
    )
}

type Props = {
    value: chrome.tabs.Tab
}

const Item = (props: Props) => {
    const { value } = props
    const { id, title, favIconUrl, active, url } = value || {}
    const { selectedTabIds, getTabs, selectTab, unselectTab } = useAppContext()
    const checked = useMemo(() => selectedTabIds?.some?.(selected => selected === id), [selectedTabIds, id])

    const handleFocusTab = (ev: MouseEvent) => {
        if (!id) return
        focusTab(id)
        setPopoverOpen(false)
        ev.stopPropagation()
    }

    const handleCheckChange = (ev: MouseEvent) => {
        if (!id) return
        checked ? unselectTab(id) : selectTab(id)
        setPopoverOpen(false)
        ev.stopPropagation()
    }

    const handleRemove = (ev: MouseEvent) => {
        removeTab(id)
        ev.stopPropagation()
    }

    const [, dragRef] = useMyDrag<chrome.tabs.Tab[], string, { isDragging: boolean }>({
        item: () => {
            let thisId = value?.id
            if (!thisId) {
                return getTabs(selectedTabIds || [])
            } else if (selectedTabIds?.some(s => s === thisId)) {
                return getTabs(selectedTabIds)
            } else {
                return [value]
            }
        },
        type: "tab",
    })

    const [popoverOpen, setPopoverOpen] = useState(false)
    const { dragging } = useDragLayer(monitor => ({ dragging: monitor.isDragging() }))

    useEffect(() => { dragging && setPopoverOpen(false) }, [dragging])

    const { token } = theme.useToken()
    const [over, setOver] = useState(false)
    const [titleOver, setTitleOver] = useState(false)

    const titleBgColor = useMemo(() => {
        if (active) return token.colorPrimaryBgHover
        if (titleOver) return token.colorBgLayout
        return undefined
    }, [active, titleOver])

    return (
        <Flex
            style={{
                width: '100%',
                height: 32,
                padding: '0 4px',
                boxSizing: 'border-box',
                opacity: over ? 1 : undefined,
            }}
            onMouseEnter={() => setOver(true)}
            onMouseLeave={() => setOver(false)}
        >
            <Flex flex={1} gap={5}>
                <Checkbox
                    checked={checked}
                    onChange={ev => handleCheckChange(ev.nativeEvent)}
                />
                <Popover
                    content={<PopoverContent value={value} />}
                    open={!dragging && popoverOpen}
                    onOpenChange={setPopoverOpen}
                    destroyTooltipOnHide={true}
                    mouseEnterDelay={1}
                >
                    <Flex
                        ref={dragRef}
                        flex={1}
                        gap={5}
                        align="center"
                        style={{
                            cursor: 'pointer',
                            borderRadius: 5,
                            padding: '0 4px',
                            backgroundColor: titleBgColor,
                        }}
                        onMouseEnter={() => setTitleOver(true)}
                        onMouseLeave={() => setTitleOver(false)}
                        onClick={ev => handleFocusTab(ev.nativeEvent)}
                    >
                        <TabIcon iconUrl={favIconUrl} url={url} />
                        <span style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            flex: 1,
                            width: 0,
                        }}>{title}</span>
                        <Button
                            type="text"
                            shape="circle"
                            size="small"
                            icon={<CloseOutlined />}
                            style={{ cursor: 'pointer', display: over ? undefined : 'none' }}
                            onClick={ev => handleRemove(ev.nativeEvent)}
                        />
                    </Flex>
                </Popover>
            </Flex>
        </Flex>
    )
}

export default Item