import { VerticalAlignMiddleOutlined } from "@ant-design/icons"
import { updateGroupCollapsed } from "@api/group"
import { useAppContext } from "@manage/context"
import { Button, Tooltip } from "antd"

const Collapse = () => {
    const { groups, setUngroupCollapsed } = useAppContext()
    const handleCollapse = async () => {
        setUngroupCollapsed(true)
        for await (const group of groups) {
            group.collapsed = false
            await updateGroupCollapsed(group.id, true)
        }
    }
    return (
        <Tooltip title="Collapse All" placement="bottom">
            <Button
                icon={<VerticalAlignMiddleOutlined />}
                onClick={handleCollapse}
            />
        </Tooltip>
    )
}
export default Collapse