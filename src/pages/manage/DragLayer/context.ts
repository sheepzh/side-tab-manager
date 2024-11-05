import { createContext, useContext, useState } from "react"

type DragLayer = {
    tooltip?: string
    setTooltip: (newTitle: string) => void
    clearTooltip: () => void
}

const DragLayerContext = createContext<Partial<DragLayer>>({})

export default DragLayerContext

export const useMyDragLayer = () => useContext(DragLayerContext) as DragLayer

export const createDragLayerContextValue = (): DragLayer => {
    const [tooltip, setTooltip] = useState<string>()

    const clearTooltip = () => setTooltip('')

    return {
        tooltip,
        setTooltip,
        clearTooltip,
    }
}