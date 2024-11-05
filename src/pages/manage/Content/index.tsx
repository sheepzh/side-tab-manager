import { theme } from 'antd'
import { useState } from 'react'
import './Content.css'
import Header from './Header'
import Tab from './Tab'
import Window from './Window'

const Content = () => {
    const [query, setQuery] = useState<string>()
    const { token } = theme.useToken()

    return (
        <div
            className="app-content"
            style={{ backgroundColor: token.colorSuccessBgHover }}
        >
            <Header onSearch={setQuery} />
            <Window.List />
            <Tab.Stack query={query} />
        </div>
    )
}

export default Content