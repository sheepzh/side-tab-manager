import { Flex } from "antd"
import Expand from "./Expand"
import WindowList from "./WindowList"
import Collapse from "./Collapse"

const ToolBar = () => {
    return (
        <Flex
            gap={2}
            style={{
                padding: "5px 0",
                paddingInlineEnd: 8,
            }}
        >
            <WindowList />
            <Flex gap={4}>
                <Expand />
                <Collapse />
            </Flex>
        </Flex>
    )
}

export default ToolBar