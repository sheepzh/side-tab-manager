import { TagGroupExtend } from "@api/group"
import { Tag } from "antd"
import { cvtTagColor } from "../color"

const GroupTag = ({ title, color }: Pick<TagGroupExtend, 'color' | 'title'>) => {
    return (
        <Tag
            color={cvtTagColor(color)}
            style={{
                color: color === 'yellow' || color === 'orange' ? '#202124' : '#FFF',
                fontWeight: 400,
                marginRight: 0,
                borderRadius: 7
            }}
        >
            {title || <span>&ensp;</span>}
        </Tag>
    )
}

export default GroupTag