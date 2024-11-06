import { GlobalToken, theme } from "antd"
import { CSSProperties } from "react"
import { useDragLayer, XYCoord } from "react-dnd"
import { ItemType } from "../Content/Stack/useDnd"
import Content from "./Content"
import { useMyDragLayer } from "./context"
import Tooltip from "./Tooltip"

const layerStyle = (token: GlobalToken): CSSProperties => {
    return {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: token.zIndexPopupBase + 50,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    }
}

const itemStyle = (offset: XYCoord | null): CSSProperties => {
    if (!offset) return { display: "none" }

    const { x, y } = offset

    const transform = `translate(${x}px, ${y}px)`

    return {
        transform,
        WebkitTransform: transform,
    }
}

const DragLayer = () => {
    const { token } = theme.useToken()

    const { tooltip } = useMyDragLayer()
    const { dragging, currentOffset, type, item } = useDragLayer(monitor => ({
        dragging: monitor.isDragging(),
        type: monitor.getItemType(),
        item: monitor.getItem(),
        currentOffset: monitor.getSourceClientOffset(),
    }))

    if (!dragging) {
        return null
    }

    return (
        <div style={layerStyle(token)}>
            <div style={itemStyle(currentOffset)}>
                {tooltip
                    ? <Tooltip title={tooltip} />
                    : <Content
                        type={type as ItemType}
                        value={item}
                        offset={currentOffset}
                    />
                }
            </div>
        </div>
    )
}

export default DragLayer