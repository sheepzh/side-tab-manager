import Icon from "@ant-design/icons"
import { createNewGroup } from "@api/group"
import NewGroup from "@icon/new-group.svg"
import { useAppContext } from "@manage/context"
import { ItemType, useMyDrop } from "../Content/Stack/useDnd"
import SideButton from "./SideButton"

const GroupAdd = () => {
    const { windowId, getSelectedTabs, selectedState, clearSelectedTab, selectedTabCount } = useAppContext()

    const handleClick = async () => {
        const tabs = getSelectedTabs()
        await createNewGroup(windowId, tabs)
        clearSelectedTab()
    }

    const [{ canDrop }, dropRef] = useMyDrop(() => ({
        accept: 'tab',
        async drop(item, monitor) {
            const itemType = monitor.getItemType() as ItemType
            if (itemType !== 'tab') return
            const tabs = item as chrome.tabs.Tab[]
            await createNewGroup(windowId, tabs)
            clearSelectedTab()
        },
        collect: monitor => ({
            canDrop: monitor.canDrop(),
            dropOver: monitor.isOver(),
        }),
    }))

    return (
        <SideButton
            btnRef={dropRef}
            canDrop={canDrop}
            disabled={!canDrop && selectedState === 'none'}
            tooltip={`Add ${selectedTabCount} ${selectedTabCount > 1 ? 'Tabs' : 'Tab'} to New Group`}
            icon={<Icon component={NewGroup} />}
            onClick={handleClick}
        />
    )
}

export default GroupAdd