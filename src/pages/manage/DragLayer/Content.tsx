
import { TagGroupExtend } from "@api/group"
import GroupTag from "@manage/Content/Stack/Card/GroupTag"
import { GlobalToken, theme } from "antd"
import { CSSProperties } from "react"
import { XYCoord } from "react-dnd"
import TabIcon from "../Content/Stack/TabItem/TabIcon"
import { ItemType } from "../Content/Stack/useDnd"

export type UngroupDragData = {
    tabs: chrome.tabs.Tab[]
}

type Props = {
    type: ItemType
    value: unknown
    offset: XYCoord | null
}

const outerStyle = (token: GlobalToken): CSSProperties => {
    const { fontSize, fontFamily, colorInfoBgHover, boxShadow } = token
    return {
        display: 'flex', padding: '0 8px', alignItems: 'center', gap: 5, borderRadius: 5,
        maxWidth: 240, height: 32, boxSizing: 'border-box',
        background: colorInfoBgHover, boxShadow, fontSize, fontFamily,
    }
}

const EmojiIcon = ({ children }: { children: string }) => <p
    style={{ width: 20, paddingTop: 2, textAlign: 'center' }}
    children={children}
/>

const Content = ({ type, value }: Props) => {
    const { token } = theme.useToken()
    if (type === 'tab') {
        const tabs = value as chrome.tabs.Tab[]
        if (!tabs?.length) return null
        const { favIconUrl, url, title } = tabs[0]
        const isOnly = tabs.length === 1
        return (
            <div style={outerStyle(token)}>
                {isOnly
                    ? <TabIcon iconUrl={favIconUrl} url={url} />
                    : <EmojiIcon children="✅" />}
                <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {isOnly ? title : `Total ${tabs.length} selected tabs`}
                </p>
            </div>
        )
    } else if (type === 'grouped') {
        const { title, color, tabs } = value as TagGroupExtend || {}
        return (
            <div style={{ ...outerStyle(token), width: 'fit-content' }}>
                <GroupTag title={title} color={color} />
                <p>Total {tabs?.length ?? 0} tabs</p>
            </div>
        )
    } else if (type === 'ungrouped') {
        const { tabs } = value as UngroupDragData || {}
        return (
            <div style={{ ...outerStyle(token), width: 'fit-content' }}>
                <EmojiIcon children="✳️" />
                <p>Total {tabs?.length ?? 0} ungrouped tabs</p>
            </div>
        )
    } else {
        return null
    }
}


export default Content