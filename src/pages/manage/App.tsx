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
                <div className="app">
                    <DragLayerContext.Provider value={dragLayer}>
                        <Content />
                        <Sidebar />
                        <DragLayer />
                    </DragLayerContext.Provider>
                </div>
            </DndProvider>
        </AppContext.Provider>
    )
}

export default App
