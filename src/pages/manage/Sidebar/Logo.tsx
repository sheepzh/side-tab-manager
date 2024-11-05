import { Flex } from "antd"

const Logo = () => {
    return (
        <Flex
            justify="center" align="center"
            style={{
                height: 32,
                // cursor: 'pointer',
            }}
            onClick={() => {
                // todo
                // Folder or expand all groups
            }}
        >
            <img src="./public/icon.png" />
        </Flex>
    )
}

export default Logo