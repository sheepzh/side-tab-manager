import { useAppContext } from "@manage/context"
import { CSSProperties, useMemo } from "react"
import { filterGroups, filterTabs } from "./common"
import { Group, Ungroup } from "./Group"
import { useGroupMenu } from "./useGroupMenu"
import "./Stack.css"
import { Flex } from "antd"

type Props = {
    query?: string
}

const OUTER_STYLE: CSSProperties = {
    flex: 1,
    marginTop: 5,
    height: 0
}

const INNER_STYLE: CSSProperties = {
    height: '100%',
    overflowY: 'overlay' as CSSProperties['overflowY'],
    overlay: 'auto',
    scrollbarGutter: 'stable',
}

const Stack = (props: Props) => {
    const { query } = props
    const { groups, ungroupedTabs } = useAppContext()

    const filteredGroups = useMemo(() => filterGroups(groups, query), [query, groups])
    const filteredUngroupedTabs = useMemo(() => filterTabs(ungroupedTabs, query), [query, ungroupedTabs])

    const { el, showContextMenu } = useGroupMenu()

    return (
        <div style={OUTER_STYLE}>
            <Flex vertical gap={8} style={INNER_STYLE}>
                {filteredGroups?.map(g => <Group
                    key={`group-${g.id}-${g.title}`}
                    value={g}
                    forceOpen={!!query}
                    onShowContextmenu={ev => showContextMenu?.(ev, g)}
                />)}
                <Ungroup
                    tabs={filteredUngroupedTabs}
                    forceOpen={!!query}
                    onShowContextmenu={ev => showContextMenu?.(ev)}
                />
            </Flex>
            {el}
        </div>
    )
}

export default Stack