export function clzNames(...names: (string | boolean | number | undefined)[]): string {
    return names?.filter(n => typeof n === 'string' && n).join(' ')
}