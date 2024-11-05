import { getCurrentWindow } from '@api/window'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

async function main() {
    const currentWindow = await getCurrentWindow()

    const rootEl = document.createElement('div')
    rootEl.id = 'root'
    document.body.append(rootEl)


    if (rootEl) {
        const root = ReactDOM.createRoot(rootEl)
        root.render(
            <React.StrictMode>
                <App windowId={currentWindow?.id} />
            </React.StrictMode>
        )
    }
}

main()