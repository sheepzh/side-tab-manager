import { useAppContext } from "@manage/context"
import { useMemo } from "react"
import { filterGroups, filterTabs } from "./common"
import { Group, Ungroup } from "./Group"
import { useGroupMenu } from "./useGroupMenu"
import "./Stack.css"

type Props = {
    query?: string
}

const Stack = (props: Props) => {
    const { query } = props
    const { groups, ungroupedTabs } = useAppContext()

    const filteredGroups = useMemo(() => filterGroups(groups, query), [query, groups])
    const filteredUngroupedTabs = useMemo(() => filterTabs(ungroupedTabs, query), [query, ungroupedTabs])

    const { el, showContextMenu } = useGroupMenu()

    return (
        <div className="tab-stack">
            <div className="tab-stack-inner">
                {filteredGroups?.map(g => <Group
                    key={`group-${g.id}-${g.title}`}
                    value={g}
                    forceOpen={!!query}
                    onShowContextmenu={ev => showContextMenu?.(ev, g)}
                />)}
                {!!filteredUngroupedTabs?.length && <Ungroup
                    tabs={filteredUngroupedTabs}
                    forceOpen={!!query}
                    onShowContextmenu={ev => showContextMenu?.(ev)}
                />}
            </div>
            {el}
        </div>
    )
}

export default Stack