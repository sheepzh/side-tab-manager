import initPage from "./page"

function main() {
    try {
        // 1. init page
        initPage()
    } catch (e) {
        console.error(e)
    }
}

main()