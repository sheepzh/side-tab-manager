import { GlobalToken, theme } from "antd"
import { CSSProperties } from "react"

type Props = {
    title?: string
}

const outerStyle = (token: GlobalToken): CSSProperties => {
    const { fontSize, fontFamily, colorPrimary } = token
    return {
        height: 32,
        maxWidth: 250,
        textWrap: 'nowrap',
        background: colorPrimary,
        display: 'flex',
        padding: '0 10px',
        alignItems: 'center',
        borderRadius: 5,
        boxSizing: 'border-box',
        fontFamily, fontSize,
        color: token.colorTextLightSolid,
    }
}

const Tooltip = (props: Props) => {
    const { title } = props
    const { token } = theme.useToken()

    return (
        <div style={outerStyle(token)}>
            <p>
                {title}
            </p>
        </div>
    )
}

export default Tooltip