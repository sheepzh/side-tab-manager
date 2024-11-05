import { focusTab } from "@api/tab"
import { useAppContext } from "@manage/context"
import { clzNames } from "@util/style"
import { Checkbox } from "antd"
import { useMemo } from "react"
import ItemIcon from "./ItemIcon"
import { useMyDrag } from "./useDnd"

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

    return (
        <div className={clzNames('tab-item-container', checked && 'checked')}>
            <input className="tab-id" defaultValue={id} hidden />
            <div className="tab-item-left">
                <Checkbox
                    checked={checked}
                    onChange={ev => {
                        handleCheckChange()
                        ev.stopPropagation()
                    }}
                />
                <div
                    ref={dragRef}
                    className={clzNames("tab-item-title", active && 'active')}
                    onClick={() => handleFocusTab()}
                >
                    <ItemIcon iconUrl={favIconUrl} url={url} />
                    <span className="label">{title}</span>
                </div>
            </div>
            <div className="tab-action">
            </div>
        </div>
    )
}

export default Item