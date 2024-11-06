import Icon from "@ant-design/icons"
import ExtChrome from "@icon/ext-chrome.svg"
import ExtEdge from "@icon/ext-edge.svg"
import IconChrome from "@icon/icon-chrome.svg"
import IconEdge from "@icon/icon-edge.svg"
import { IS_CHROME, IS_EDGE } from "@util/env"
import { ReactElement } from "react"

type ItemIconProps = {
    url?: string
    iconUrl?: string
    children?: ReactElement
}

const computeIconFromUrl = (url?: string) => {
    url = url ?? ""
    if (/^chrome:\/\/extensions/.test(url) || /^chrome-extension:\/\//.test(url)) {
        // Chrome extension
        return ExtChrome
    } else if (/^edge:\/\/extensions/.test(url) || /^edge-extension:\/\//.test(url)) {
        // Edge extension
        return ExtEdge
    } else if (IS_CHROME) {
        return IconChrome
    } else if (IS_EDGE) {
        return IconEdge
    } else {
        return ExtChrome
    }
}

const TabIcon = (props: ItemIconProps) => {
    const { iconUrl, url, children } = props

    const size = 20

    if (iconUrl) {
        return <img width={size} height={size} src={iconUrl} />
    }

    if (children) {
        return <Icon style={{ fontSize: `${size}px` }} children={children} />
    }

    return <Icon
        component={computeIconFromUrl(url)}
        style={{ fontSize: `${size}px` }}
    />
}
export default TabIcon