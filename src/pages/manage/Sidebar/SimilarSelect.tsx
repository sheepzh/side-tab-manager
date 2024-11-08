import Icon from "@ant-design/icons"
import Similar from "@icon/similar.svg"
import { useAppContext } from "@manage/context"
import { parseOrigin } from "@util/tab"
import SideButton from "./SideButton"

const SimilarSelect = () => {
    const { groups, ungroupedTabs, setSelectedTabIds } = useAppContext()
    function handle(): void {
        const tabs = [
            ...groups?.flatMap?.(g => g.tabs) || [],
            ...ungroupedTabs || [],
        ]
        const active = tabs?.find(t => t.active)
        if (!active) return
        const origin = parseOrigin(active.url)
        if (!origin) return
        const newSelectedTabIds = tabs
            ?.filter?.(tab => parseOrigin(tab?.url) === origin)
            ?.map(t => t.id)
            .filter(id => typeof id === 'number')
        if (!newSelectedTabIds?.length) return
        setSelectedTabIds(newSelectedTabIds)
    }

    return (
        <SideButton
            icon={<Icon component={Similar} />}
            tooltip="Select Same Origin"
            onClick={handle}
        />
    )
}

export default SimilarSelect