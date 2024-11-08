import { BorderOutlined, CheckSquareOutlined, MinusSquareOutlined } from "@ant-design/icons"
import { TabSelectState, useAppContext } from "@manage/context"
import SideButton from "./SideButton"

const icon = (state: TabSelectState) => {
    if (state === 'none') {
        return <BorderOutlined />
    } else if (state === 'full') {
        return <CheckSquareOutlined />
    } else {
        return <MinusSquareOutlined />
    }
}

const tooltip = (state: TabSelectState, selectedCount: number): string => {
    if (state === 'none') return 'No tab selected'
    if (state === 'full') return 'All tabs selected'
    return `${selectedCount} tabs selected`
}

const TabCheck = () => {
    const { selectedState, selectedTabIds, clearSelectedTab, selectAllTab } = useAppContext()
    const handleClick = () => {
        if (selectedState !== 'none') {
            clearSelectedTab('TabCheckClear')
        } else {
            selectAllTab()
        }
    }
    return (
        <SideButton
            tooltip={tooltip(selectedState, selectedTabIds?.length)}
            icon={icon(selectedState)}
            onClick={handleClick}
        />
    )
}

export default TabCheck