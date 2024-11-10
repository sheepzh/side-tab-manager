import { Flex, theme } from 'antd'
import { useState } from 'react'
import Search from './Search'
import Stack from './Stack'
import ToolBar from './ToolBar'

const Content = () => {
    const [query, setQuery] = useState<string>()
    const { token } = theme.useToken()

    return (
        <Flex
            vertical
            flex={1}
            style={{
                padding: 10,
                paddingInlineEnd: 5,
                width: 0,
                userSelect: 'none',
                backgroundColor: token.colorSuccessBgHover,
            }}
        >
            <Search onSearch={setQuery} />
            <ToolBar />
            <Stack query={query} />
        </Flex>
    )
}

export default Content