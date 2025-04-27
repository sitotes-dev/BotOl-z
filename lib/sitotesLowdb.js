const home = (path) => __base + path


const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')

async function lowDbPush(lowAp, data, limit = null, sisa = null) {
    await lowAp.read()
    lowAp.data.push(data)
    if (limit && lowAp.data.length > limit) {
        if (!sisa) {
            sisa = Math.floor(limit / 2)
        }

        lowAp.data = lowAp.data.slice(-sisa)
    }
    await lowAp.write()
}

async function lowDbRevoke(lowAp, id) {
    await lowAp.read()
    const oldLength = lowAp.data.length
    lowAp.data = lowAp.data.filter(msg => msg.id !== id)
    await lowAp.write()
    return lowAp.data.length < oldLength
}

async function lowDbReadAll(lowAp) {
    await lowAp.read()
    return lowAp.data
}

module.exports = {
    lowDbPush,
    lowDbRevoke,
    lowDbReadAll
}