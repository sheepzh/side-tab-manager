export const parseOrigin = (urlStr: string | undefined): string | undefined => {
    if (!urlStr) return undefined
    try {
        const { protocol, origin, hostname } = new URL(urlStr)
        if (protocol?.startsWith('http')) {
            return hostname
        }
        return origin
    } catch (_) { }
    return undefined
}
