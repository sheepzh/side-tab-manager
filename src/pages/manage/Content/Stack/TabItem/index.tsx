import { CloseOutlined } from "@ant-design/icons"
import { focusTab, removeTab } from "@api/tab"
import { useAppContext } from "@manage/context"
import { clzNames } from "@util/style"
import { Button, Checkbox, Flex, Popover, theme } from "antd"
import { useEffect, useMemo, useState } from "react"
import { useMyDrag } from "../useDnd"
import TabIcon from "./TabIcon"
import { parseOrigin } from "@util/tab"

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

    const [{ isDragging }, dragRef] = useMyDrag<chrome.tabs.Tab[], string, { isDragging: boolean }>({
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
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        })
    })

    const [popoverOpen, setPopoverOpen] = useState(false)

    useEffect(() => { isDragging && setPopoverOpen(false) }, [isDragging])

    return (
        <Flex
            className={clzNames('tab-item-container', checked && 'checked')}
            style={{
                width: '100%',
                height: 32,
                padding: '0 4px',
                boxSizing: 'border-box',
            }}
        >
            <Flex flex={1} gap={5}>
                <Checkbox
                    checked={checked}
                    onChange={ev => handleCheckChange(ev.nativeEvent)}
                />
                <Popover
                    content={<PopoverContent value={value} />}
                    open={popoverOpen}
                    onOpenChange={val => setPopoverOpen(val)}
                    destroyTooltipOnHide={true}
                    mouseEnterDelay={1}
                >
                    <Flex
                        ref={dragRef}
                        className={clzNames("tab-item-title", active && 'active')}
                        flex={1}
                        gap={5}
                        align="center"
                        style={{ borderRadius: 5, padding: '0 4px' }}
                        onClick={ev => handleFocusTab(ev.nativeEvent)}
                    >
                        <TabIcon iconUrl={favIconUrl} url={url} />
                        <span className="label">{title}</span>
                        <Button
                            className="only-hover"
                            type="text"
                            shape="circle"
                            size="small"
                            icon={<CloseOutlined />}
                            style={{ cursor: 'pointer', opacity: 0 }}
                            onClick={ev => handleRemove(ev.nativeEvent)}
                        />
                    </Flex>
                </Popover>
            </Flex>
        </Flex>
    )
}

export default Item