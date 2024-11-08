import { Button, ButtonProps, Tooltip } from "antd"
import { LegacyRef } from "react"

type Props = Omit<ButtonProps, 'shape' | 'icon'>
    & Required<Pick<ButtonProps, 'icon'>>
    & {
        btnRef?: LegacyRef<HTMLButtonElement>
        canDrop?: boolean
        tooltip?: string
    }

export const COMMON_BTN_PROP: ButtonProps = {
    shape: 'circle',
    type: 'text',
    style: { padding: 10 },
}

const SideButton = (props: Props) => {
    const { tooltip, style, canDrop, btnRef, ...buttonProps } = props

    const btnRender = () => (
        <Button
            ref={btnRef}
            shape="circle"
            size="small"
            type={canDrop ? 'primary' : 'text'}
            style={{ padding: 10, ...style }}
            {...buttonProps}
        />
    )

    if (canDrop) {
        return btnRender()
    }

    return (
        <Tooltip
            autoAdjustOverflow={false}
            title={tooltip}
            placement='left'
            mouseEnterDelay={.3}
        >
            {btnRender()}
        </Tooltip>
    )
}

export default SideButton