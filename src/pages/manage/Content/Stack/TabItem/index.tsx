import { focusTab } from "@api/tab"
import { useAppContext } from "@manage/context"
import { clzNames } from "@util/style"
import { Button, Checkbox, Flex, Popover } from "antd"
import { useMemo, useState } from "react"
import TabIcon from "./TabIcon"
import { useMyDrag } from "../useDnd"
import { CloseOutlined } from "@ant-design/icons"

const PopoverContent = ({ value }: { value: chrome.tabs.Tab }) => {
    const { title, url, id } = value

    return (
        <div>
            <p>{title}</p>
        </div>
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

    const handleFocusTab = () => {
        if (!id) return
        focusTab(id)
    }

    const handleCheckChange = () => {
        if (!id) return
        checked ? unselectTab(id) : selectTab(id)
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
                    onChange={ev => {
                        handleCheckChange()
                        ev.stopPropagation()
                    }}
                />
                <Popover
                    content={<div></div>}
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
                        onClick={() => handleFocusTab()}
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
                        />
                    </Flex>
                </Popover>
            </Flex>
        </Flex>
    )
}

export default Item