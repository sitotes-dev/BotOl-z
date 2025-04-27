// ---------------------------------------------------------------------------------------- //


// Base sitotes 2025


// base kali ini kodingan nya lebih simpel jadi enak di otak atik ya gays yak
// dan tentun nya stabil itu yang di utamakan 
// kalo kurang setabil ya wajar buat e ae cuma seminggu yakan


// kalo ada bug atau sering error gitu hubungi owner ku sitotes
// WA : +62 889 8978 1626     ||     IG : @si.totes / IG : @m.saiful.anam.r



// sitotes base version            : 0.25.1.16
// sitotes WS plug version         : 0.24.5.20
// whiskeysockets/baileys version  : 6.7.9



// ---------------------------------------------------------------------------------------- //














const home = (path) => __base + path
const _lib = (path) => home("./lib/" + path)
const _srop = (path) => home("./src/options/" + path)


const {
    AnyMessageContent,
    BinaryInfo,
    DisconnectReason,
    downloadAndProcessHistorySyncNotification,
    encodeWAM,
    delay,
    fetchLatestBaileysVersion,
    getAggregateVotesInPollMessage,
    makeCacheableSignalKeyStore,
    getHistoryMsg,
    isJidNewsletter,
    makeInMemoryStore,
    PHONENUMBER_MCC,
    jidDecode,
    proto,
    useMultiFileAuthState,
    WAMessageContent,
    WAMessageKey,
    jidNormalizedUser
} = require(sitotesBaileys)

const {
    getBuffer,
    fetchJson,
    sleeps,
    smsg,

    fs,
    jsnParse,
    jsnSfy,

    sitotesDecodeJid,
    sitotesLogModule,
    sitotesFacProsesing,
    sitotesWebPlugin
} = require(_lib('sitotesFunc'))
const {
    lowDbPush
} = require(_lib('sitotesLowdb'))





module.exports = onic = async (onic, store, state, saveCreds, version, isLatest) => {
    try {
        onic.ev.on('messages.upsert', async chatUpdate => {
            try {
                const {
                    default: PQueue
                } = await import('p-queue');
                const queue = new PQueue({
                    concurrency: 1
                });
                
                //clog(jsnSfy(chatUpdate))

                mek = chatUpdate.messages[0]
                if (!mek.message) return
                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
                if (!onic.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
                if (mek.key.id.startsWith('3EB0') && mek.fromMe && mek.key.id.length === 22) return
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
                m = smsg(onic, mek, store)
                if (m.id == __nbl.chekid[m.chat]) return clog('dobel detek')
                if (m.mtype == 'pollUpdateMessage') return
                __nbl.chekid[m.chat] = m.id

                if (mek.key && mek.key.remoteJid === 'status@broadcast') return
                s = await sitotesFacProsesing(onic, m, store)
                await queue.add(() => processMessage(onic, m, s, chatUpdate, mek, store));
            } catch (err) {
                clog(err)
            }
        })

        onic.ev.on('poll-recipient', async chatUpdate => {
            try {
                mek = chatUpdate.messages[0]
                if (!mek.message) return
                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
                if (!onic.public && !mek.key.fromMe && chatUpdate.type === 'notify')
                    if (chatUpdate.typePoll ? false : true) return
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16)
                    if (chatUpdate.typePoll ? false : true) return
                m = smsg(onic, mek, store)
                if (m.mtype == 'pollUpdateMessage') return


                await queue.add(() => processMessage(onic, m, s, chatUpdate, mek, store));
            } catch (err) {
                clog(err)
            }
        })

        onic.ev.on('messages.update', async chatUpdate => {
            try {
                for (const { key, update } of chatUpdate) {
                    if (update.pollUpdates && key.fromMe) {
                        const pollCreation = await getMessage(key)
                        if (pollCreation) {
                            let pollUpdate = getAggregateVotesInPollMessage({
                                message: pollCreation,
                                pollUpdates: update.pollUpdates,
                            })
                            var getPoll = (await pollUpdate.filter(v => v.voters.length !== 0)[0])?.name
                            if (getPoll == undefined) return

                            clog('#' + getPoll)
                            await onic.appenPollMessage('#' + getPoll, chatUpdate)
                        }
                    }
                }
            } catch (err) {
                clog(err)
            }
        })


        onic.ev.process(
            async (events) => {
                if (events['messages.upsert']) {
                    mek = events['messages.upsert'].messages[0]
                    if (!mek.message) return
                    mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
                    m = smsg(onic, mek, store)
                    if (m.mtype == 'pollUpdateMessage') return
                    if (m.mtype == 'reactionMessage') return

                    await lowDbPush(__nbl.infoMSG, jsnParse(jsnSfy(mek, 0)), 5000, 4000)
                    // sitotesWebPlugin()
                }

                if (events['presence.update']) await onic.sendPresenceUpdate('unavailable')

                if (events['labels.association']) {}

                if (events['labels.edit']) {}

                if (events.call) {}

                if (events['messaging-history.set']) {} // const { chats, contacts, messages, isLatest } = events['messaging-history.set']

                if (events['messages.update']) {}

                if (events['message-receipt.update']) {}

                if (events['messages.reaction']) {}

                if (events['chats.update']) {}

                if (events['contacts.update']) // clog(`contact ${contact.id} has a new profile pic: ${newUrl}`)
                                 
                if (events['chats.delete']) {}
            }
        )

        await sitotesDecodeJid(onic, jidDecode)


        nocache('./slebeww', module => clog(` "${module}" Telah diupdate!`))
        nocache(_lib('sitotesFunc'), async module => {
            pe = require(module)
            smsg = pe.smsg
        })


        // return kode di hentikan agar tidak terjadi looping
        // _--------__--------__--------__--------__--------__--------__--------__--------__--------_ //
        return onic
        // jika kamu menuruh kode di bawah sini nga akan berfungsi kalo function berfungsi tapi harus di panggil dulu
        // _--------__--------__--------__--------__--------__--------__--------__--------__--------_ //




        async function getMessage(key) {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id)
                return msg?.message || undefined
            }

            return proto.Message.fromObject({})
        }
        async function processMessage(...oni) {
            try {
                await require('./slebeww')(...oni);
            } catch (err) {
                clog(err);
            }
        }



        // function grub agar auto reload saat file yang di list di edit hirau kan ini jika dha ngerti
        async function nocache(module, cb = () => {}) {
            fs.watchFile(require.resolve(module), async () => {
                await uncache(require.resolve(module))
                cb(module)
            })
        }
        async function uncache(module = '.') {
            return new Promise((resolve, reject) => {
                try {
                    delete require.cache[require.resolve(module)]
                    resolve()
                } catch (e) {
                    reject(e)
                }
            })
        }
    } catch (err) {
        clog(err.stack)
    } finally {
        sitotesLogModule(__filename)
    }
}