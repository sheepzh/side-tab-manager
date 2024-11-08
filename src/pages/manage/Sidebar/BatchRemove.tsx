import Icon from "@ant-design/icons"
import { removeTab } from "@api/tab"
import Delete from "@icon/delete.svg"
import { useAppContext } from "@manage/context"
import { useMemo } from "react"
import SideButton from "./SideButton"
import { ItemType, useMyDrop } from "@manage/Content/Stack/useDnd"
import { Modal } from "antd"
import { TagGroupExtend } from "@api/group"

const BatchRemove = () => {
    const { selectedTabIds, selectedTabCount, clearSelectedTab } = useAppContext()
    const handleClick = async () => {
        await removeTab(selectedTabIds)
        clearSelectedTab('BatchRemoveClick')
    }

    const tooltip = useMemo(() => {
        if (!selectedTabCount) return 'Close Tabs'
        return `Close ${selectedTabCount} ${selectedTabCount > 1 ? 'Tabs' : 'Tab'}`
    }, [selectedTabCount])

    const [{ canDrop }, dropRef] = useMyDrop(() => ({
        accept: ['tab', 'grouped'],
        async drop(item, monitor) {
            const itemType = monitor.getItemType() as ItemType
            if (itemType === 'tab') {
                const tabs = item as chrome.tabs.Tab[]
                const tabLen = tabs?.length
                Modal.confirm({
                    type: 'error',
                    content: `${tabLen} ${tabLen > 1 ? 'tabs' : 'tab'} will be closed!`,
                    onOk: async () => {
                        const tabIds = tabs?.map(t => t.id).filter(i => typeof i === 'number')
                        await removeTab(tabIds)
                        clearSelectedTab('BatchRemoveDrop')
                    },
                })
            } else if (itemType === 'grouped') {
                const { tabs, title } = item as TagGroupExtend
                Modal.confirm({
                    type: 'warning',
                    content: `All the tabs under group[${title || 'Untitled'}] will be closed!`,
                    onOk: async () => {
                        const tabIds = tabs?.map(t => t.id).filter(i => typeof i === 'number')
                        await removeTab(tabIds)
                    },
                })
            }
        },
        collect: monitor => ({ canDrop: monitor.canDrop() }),
    }))

    return (
        <SideButton
            canDrop={canDrop}
            btnRef={dropRef}
            disabled={!canDrop && !selectedTabCount}
            tooltip={tooltip}
            icon={<Icon component={Delete} />}
            onClick={handleClick}
        />
    )
}

export default BatchRemove