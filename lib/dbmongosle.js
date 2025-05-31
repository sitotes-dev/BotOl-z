const {
    MongoClient
} = require('mongodb');

const url = ('mongodb+srv://a:<db_password><db_cluster>/?retryWrites=true&w=majority&appName=<db_appName>')
    .replace('<db_cluster>', '@hjd-cluster.5o7h3.mongodb.net')
    .replace('<db_appName>', 'jsjsj-Cluster')
    .replace('<db_password>', 'hwhwh')
const client = new MongoClient(url);

// Database Name
const dbGame = 'DB_Game';

async function main() {
    await client.connect();
    const db = client.db(dbGame);
    const collection = db.collection('user');
    let scSiTotes = {}
    scSiTotes['_id'] = '6288989781626@s.whatsapp.net'
    const findResult = await collection.deleteOne(scSiTotes)
    console.log('Found documents =>', findResult);

}

//main().catch(console.error).finally(() => client.close());

const sitotesGameIsPlay = async (sender, gameid, type, celek) => {
    await client.connect();
    const db = client.db(dbGame);
    const user = db.collection('user');

    let scSiTotes = {}
    scSiTotes['_id'] = sender
    scSiTotes[sender] = {}
    scSiTotes[sender]['gameid'] = gameid
    scSiTotes[sender]['soaltype'] = type
    scSiTotes[sender]['jawaban'] = celek

    const insertResult = await user.insertMany([scSiTotes])
    return insertResult
}

const sitotesGameFindId = async (sender) => {
    await client.connect();
    const db = client.db(dbGame);
    const collection = db.collection('user');
    let scSiTotes = {}
    scSiTotes['_id'] = sender
    const findResult = await collection.find(scSiTotes).toArray()

    return await findResult[0]
}

const sitotesGameRemoveId = async (sender) => {
    await client.connect();
    const db = client.db(dbGame);
    const collection = db.collection('user');
    let scSiTotes = {}
    scSiTotes['_id'] = sender
    const deleteResult = await collection.deleteOne(scSiTotes)

    return await deleteResult
}


const botdata = 'BD_SiTotes'

async function setVersiCommited(ver) {
    await client.connect()
    const db = client.db(botdata)
    const info = db.collection('Info')
    const checkCommit = await info.updateOne({
        _id: 'versi'
    }, {
        $set: {
            versi: ver
        }
    })
    await client.close()
    return checkCommit
}

async function checkCommitUpdate() {
    await client.connect()
    const db = client.db(botdata)
    const info = db.collection('Info')
    const checkCommit = await info.find({
        _id: 'versi'
    }).toArray()
    await client.close()
    return checkCommit[0]
}






// const v = async () => console.log(await sitotesGameFindId('6288989781626@s.whatsapp.net'))
// v()
module.exports = {
    sitotesGameIsPlay,
    sitotesGameFindId,
    sitotesGameRemoveId,
    setVersiCommited,
    checkCommitUpdate,
    client
}