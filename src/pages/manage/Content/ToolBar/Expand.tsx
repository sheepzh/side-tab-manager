import { ColumnHeightOutlined } from "@ant-design/icons"
import { updateGroupCollapsed } from "@api/group"
import { useAppContext } from "@manage/context"
import { Button, Tooltip } from "antd"

const Expand = () => {
    const { groups, setUngroupCollapsed } = useAppContext()
    const handleExpand = async () => {
        setUngroupCollapsed(false)
        for await (const group of groups) {
            group.collapsed = false
            await updateGroupCollapsed(group.id, false)
        }
    }
    return (
        <Tooltip title="Expand All" placement="bottom">
            <Button
                icon={<ColumnHeightOutlined />}
                onClick={handleExpand}
            />
        </Tooltip>
    )
}

export default Expand