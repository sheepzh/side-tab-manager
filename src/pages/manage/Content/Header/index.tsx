import { FilterOutlined, SearchOutlined } from '@ant-design/icons'
import { useThrottleEffect } from 'ahooks'
import { Input } from 'antd'
import { useState } from 'react'
import "./Header.css"

type Props = {
    onSearch?: (val: string) => void
}

const Search = (props: Props) => {
    const { onSearch } = props
    const [value, setValue] = useState<string>('')
    useThrottleEffect(() => onSearch?.(value), [value], { wait: 100 })

    const handleClear = () => {
        setValue('')
        onSearch?.('')
    }

    return (
        <div className='header-container'>
            <Input
                allowClear
                value={value}
                onInput={ev => setValue(ev?.currentTarget?.value)}
                onClear={handleClear}
                onKeyDown={ev => ev.key === 'Escape' && handleClear()}
                prefix={(
                    <div style={{ paddingInlineEnd: 4 }}>
                        {value ? <FilterOutlined /> : <SearchOutlined />}
                    </div>
                )}
            />
        </div>
    )
}

export default Search