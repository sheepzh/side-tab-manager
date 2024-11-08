import { GithubOutlined } from "@ant-design/icons"
import GroupAdd from "@manage/Sidebar/GroupAdd"
import { GITHUB_PAGE } from "@util/constant/page"
import { Divider, Flex, theme } from "antd"
import { CSSProperties } from "react"
import BatchRemove from "./BatchRemove"
import Logo from "./Logo"
import SideButton from "./SideButton"
import TabCheck from "./TabCheck"
import SimilarSelect from "./SimilarSelect"

const STYLE: CSSProperties = {
    width: 40,
    height: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    boxSizing: 'border-box',
}

const Sidebar = () => {
    const { token } = theme.useToken()
    return (
        <Flex
            vertical
            align="center"
            style={{
                ...STYLE,
                backgroundColor: token.colorBgContainer,
                borderLeft: `1px solid ${token.colorBorder}`,
                color: token.colorText,
            }}
        >
            <Flex vertical align="center" gap={5}>
                <Logo />
                <TabCheck />
            </Flex>
            <Divider style={{ margin: '10px 0' }} />
            <Flex
                vertical
                flex={1}
                justify="space-between"
                style={{ width: '100%', paddingRight: 1 }}
            >
                <Flex vertical align="center" gap={4}>
                    <GroupAdd />
                    <BatchRemove />
                    <SimilarSelect />
                </Flex>
                <Flex vertical align="center">
                    <SideButton
                        icon={<GithubOutlined />}
                        tooltip="View source code"
                        onClick={() => open(GITHUB_PAGE)}
                    />
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Sidebar