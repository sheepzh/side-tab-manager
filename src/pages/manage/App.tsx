import { Flex } from 'antd'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './App.css'
import Content from './Content'
import AppContext, { createAppContextValue } from './context'
import DragLayer from './DragLayer'
import DragLayerContext, { createDragLayerContextValue } from './DragLayer/context'
import Sidebar from './Sidebar'

const App = ({ windowId }: { windowId: number }) => {
    const app = createAppContextValue({ windowId })
    const dragLayer = createDragLayerContextValue()

    return (
        <AppContext.Provider value={app}>
            <DndProvider backend={HTML5Backend}>
                <Flex style={{
                    height: '100vh',
                    width: '100vw',
                    overflow: 'hidden',
                }}>
                    <DragLayerContext.Provider value={dragLayer}>
                        <Content />
                        <Sidebar />
                        <DragLayer />
                    </DragLayerContext.Provider>
                </Flex>
            </DndProvider>
        </AppContext.Provider>
    )
}

export default App
