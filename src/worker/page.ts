const PAGE_HTML = 'manage.html'

async function initPage() {
    if (chrome?.sidePanel) {
        // Open in side
        console.log("Open in side")
        await chrome.sidePanel.setOptions({ path: PAGE_HTML })
        await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    } else {
        // Open in popup
        console.log("Open in popup")
        chrome.action.setPopup({ popup: PAGE_HTML })
    }
}

export default initPage