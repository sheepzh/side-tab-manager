import Icon from "@ant-design/icons"
import { createNewGroup } from "@api/group"
import NewGroup from "@icon/new-group.svg"
import { useAppContext } from "@manage/context"
import { useMemo } from "react"
import { ItemType, useMyDrop } from "../Content/Stack/useDnd"
import SideButton from "./SideButton"

const GroupAdd = () => {
    const { windowId, getSelectedTabs, clearSelectedTab, selectedTabCount } = useAppContext()

    const tooltip = useMemo(() => {
        if (!selectedTabCount) return 'Add Tabs to New Group'
        return `Add ${selectedTabCount} ${selectedTabCount > 1 ? 'Tabs' : 'Tab'} to New Group`
    }, [selectedTabCount])

    const handleClick = async () => {
        const tabs = getSelectedTabs()
        await createNewGroup(windowId, tabs)
        clearSelectedTab('ClickGroupAdd')
    }

    const [{ canDrop }, dropRef] = useMyDrop(() => ({
        accept: 'tab',
        async drop(item, monitor) {
            const itemType = monitor.getItemType() as ItemType
            if (itemType !== 'tab') return
            const tabs = item as chrome.tabs.Tab[]
            await createNewGroup(windowId, tabs)
            clearSelectedTab('DropGroupAdd')
        },
        collect: monitor => ({ canDrop: monitor.canDrop() }),
    }))

    return (
        <SideButton
            btnRef={dropRef}
            canDrop={canDrop}
            disabled={!canDrop && !selectedTabCount}
            tooltip={tooltip}
            icon={<Icon component={NewGroup} />}
            onClick={handleClick}
        />
    )
}

export default GroupAdd