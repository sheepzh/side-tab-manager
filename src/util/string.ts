export function includesIgnoreCase(targetStr?: string, subStr?: string): boolean {
    if (subStr === null || subStr === undefined || targetStr === null || targetStr === undefined) {
        return false
    }
    if (subStr === '') {
        return true
    }

    return targetStr.toLocaleLowerCase().includes(subStr.toLocaleLowerCase())
}