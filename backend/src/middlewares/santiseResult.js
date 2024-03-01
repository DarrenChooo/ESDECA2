sanitise = (data) => {
    const reg1 = /<script>/
    const reg2 = /<\/script>/
    var sanitiseData = data.replace(reg1, '')
    sanitiseData = sanitiseData.replace(reg2, '')
    return (sanitiseData)
}

module.exports = sanitise