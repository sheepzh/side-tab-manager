import { listAllWindows, onWindowCreated, onWindowFocusChanged, onWindowRemoved } from "@api/window"
import { useMount, useRequest } from "ahooks"
import Item from "./Item"
import WinAdd from "./WinAdd"
import { Flex } from "antd"

type Props = {
    onTabMoveBetweenWin?: () => void
}

const WindowList = (props: Props) => {
    const { onTabMoveBetweenWin } = props
    const {
        data: windows = [],
        refresh: refreshWindows,
    } = useRequest(listAllWindows)

    useMount(() => {
        onWindowCreated(refreshWindows)
        onWindowFocusChanged(refreshWindows)
        onWindowRemoved(refreshWindows)
    })

    return (
        <Flex
            gap={4}
            wrap="wrap"
            justify="space-between"
            flex={1}
        >
            {windows?.map(({ id }) => (
                <Item
                    key={`window-${id}`}
                    id={id}
                    onTabDrop={onTabMoveBetweenWin}
                />
            ))}
            <WinAdd
                onWindowCreate={refreshWindows}
                style={{ marginRight: 'auto' }}
            />
        </Flex>
    )
}

export default WindowList