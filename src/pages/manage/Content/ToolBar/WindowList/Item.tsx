import Icon from "@ant-design/icons"
import { moveGroup2Win, TagGroupExtend } from "@api/group"
import { moveTabs2Win } from "@api/tab"
import { focusWindow } from "@api/window"
import IconChrome from "@icon/icon-chrome.svg"
import IconEdge from "@icon/icon-edge.svg"
import WindowNormal from "@icon/window-normal.svg"
import { useAppContext } from "@manage/context"
import { IS_CHROME, IS_EDGE } from "@util/env"
import { useRequest } from "ahooks"
import { Button, message } from "antd"
import { ItemType, parseTabsFromItem, useMyDrop } from "../../Stack/useDnd"

type Props = {
    id?: number
    onTabDrop?: () => void
}

const ItemIcon = () => {
    if (IS_CHROME) return <Icon component={IconChrome} />
    if (IS_EDGE) return <Icon component={IconEdge} />
    return <Icon component={WindowNormal} />
}

const Item = (props: Props) => {
    const { id, onTabDrop } = props
    const { windowId } = useAppContext()

    const { refresh: handleClick } = useRequest(async () => {
        if (!id) return
        await focusWindow(id)
    }, {
        manual: true,
        onError: e => message.error?.(e?.message || 'Unknown ERROR'),
    })

    const [{ }, dropRef] = useMyDrop({
        accept: ['tab', 'grouped', 'ungrouped'],
        async drop(item, monitor) {
            const itemType = monitor.getItemType() as ItemType
            if (itemType === 'grouped') {
                // Move the whole group
                const group = item as TagGroupExtend
                await moveGroup2Win(group, id)
            } else {
                // Move tabs
                const tabs = parseTabsFromItem(item, itemType)?.sort((t1, t2) => (t1.index ?? 0) - (t2.index ?? 0))
                const tabIds = tabs?.map(t => t.id)
                await moveTabs2Win(tabIds, id)
            }
            onTabDrop?.()
        },
        collect: monitor => ({
            dropOver: monitor.isOver(),
        })
    })

    return (
        <Button
            ref={dropRef}
            type={id === windowId ? 'primary' : undefined}
            icon={<ItemIcon />}
            onClick={handleClick}
        />
    )
}

export default Item