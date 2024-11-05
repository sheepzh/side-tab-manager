import { listAllWindows, onWindowCreated, onWindowFocusChanged, onWindowRemoved } from "@api/window"
import { useMount, useRequest } from "ahooks"
import Item from "./Item"
import WinAdd from "./WinAdd"

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
        <div className="window-toolbar">
            <div className="window-list">
                {windows?.map(({ id }) => (
                    <Item
                        key={`window-${id}`}
                        id={id}
                        onTabDrop={onTabMoveBetweenWin}
                    />
                ))}
                <WinAdd onWindowCreate={refreshWindows} />
            </div>
        </div>
    )
}

export default WindowList