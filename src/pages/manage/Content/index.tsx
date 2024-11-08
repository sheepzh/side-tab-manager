import { theme } from 'antd'
import { useState } from 'react'
import './Content.css'
import Header from './Header'
import Stack from './Stack'
import ToolBar from './ToolBar'

const Content = () => {
    const [query, setQuery] = useState<string>()
    const { token } = theme.useToken()

    return (
        <div
            className="app-content"
            style={{ backgroundColor: token.colorSuccessBgHover }}
        >
            <Header onSearch={setQuery} />
            <ToolBar />
            <Stack query={query} />
        </div>
    )
}

export default Content