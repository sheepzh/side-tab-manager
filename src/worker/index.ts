import initPage from "./page"

function main() {
    // 1. init page
    initPage()
}

main()

chrome.runtime.onStartup.addListener(main)