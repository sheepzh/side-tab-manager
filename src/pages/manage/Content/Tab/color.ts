export const cvtColor = (color: chrome.tabGroups.ColorEnum): string => {
    if (color === 'grey') {
        return '#DBDCE0'
    } else if (color === 'blue') {
        return '#8AB4F9'
    } else if (color === 'yellow') {
        return '#FDD664'
    } else if (color === 'red') {
        return '#F38B82'
    } else if (color === 'green') {
        return '#80CA95'
    } else if (color === 'pink') {
        return '#FF8BCC'
    } else if (color === 'purple') {
        return '#C58AFA'
    } else if (color === 'cyan') {
        return '#78D9ED'
    } else if (color === 'orange') {
        return '#FCAD70'
    }
    return '#000'
}

export const cvtTagColor = (color: chrome.tabGroups.ColorEnum): string => {
    if (color === 'grey') {
        return '#5F6369'
    } else if (color === 'blue') {
        return '#1974E8'
    } else if (color === 'yellow') {
        return '#F9AB03'
    } else if (color === 'red') {
        return '#DA3025'
    } else if (color === 'green') {
        return '#198139'
    } else if (color === 'pink') {
        return '#D01984'
    } else if (color === 'purple') {
        return '#A143F5'
    } else if (color === 'cyan') {
        return '#027B84'
    } else if (color === 'orange') {
        return '#FA913E'
    }
    return '#000'
}