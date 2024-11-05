import { PlusOutlined } from "@ant-design/icons"
import { moveGroup2Win, TagGroupExtend } from "@api/group"
import { openSidePanel } from "@api/sidePanel"
import { listTabByWindowId, moveTabs2Win, removeTab } from "@api/tab"
import { createWindow } from "@api/window"
import { Button } from "antd"
import { ItemType, parseTabsFromItem, useMyDrop } from "../Tab/useDnd"

type Props = {
    onWindowCreate?: (window: chrome.windows.Window) => void
}

const AddButton = (props: Props) => {
    const { onWindowCreate } = props
    const handleCreate = async () => {
        const window = await createWindow()
        await openSidePanel(window.id)
        onWindowCreate?.(window)
    }

    const [{ canDrop }, dropRef] = useMyDrop({
        accept: ['tab', 'grouped', 'ungrouped'],
        async drop(item, monitor) {
            const itemType = monitor.getItemType() as ItemType
            const window = await createWindow()
            const newWinId = window?.id
            const initialTab = (await listTabByWindowId(newWinId))?.[0]
            if (itemType === 'grouped') {
                // Move the whole group
                const group = item as TagGroupExtend
                await moveGroup2Win(group, newWinId)
            } else {
                // Move tabs
                const tabs = parseTabsFromItem(item, itemType)?.sort((t1, t2) => (t1.index ?? 0) - (t2.index ?? 0))
                const tabIds = tabs?.map(t => t.id)
                await moveTabs2Win(tabIds, newWinId)
            }
            await removeTab(initialTab?.id)
            await openSidePanel(newWinId)
        },
        collect: monitor => ({
            canDrop: monitor.canDrop(),
            dropOver: monitor.isOver(),
        })
    })

    return (
        <Button
            ref={dropRef}
            className="window-add-button"
            icon={<PlusOutlined />}
            type={canDrop ? 'primary' : undefined}
            onClick={handleCreate}
        />
    )
}

export default AddButton