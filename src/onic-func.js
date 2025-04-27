// ---------------------------------------------------------------------------------------- //


// Base sitotes 2025


// base kali ini kodingan nya lebih simpel jadi enak di otak atik ya gays yak
// dan tentun nya stabil itu yang di utamakan 
// kalo kurang setabil ya wajar buat e ae cuma seminggu yakan


// kalo ada bug atau sering error gitu hubungi owner ku sitotes
// WA : +62 889 8978 1626     ||     IG : @si.totes / IG : @m.saiful.anam.r



// sitotes base version            : 0.25.1.16
// sitotes WS plug version         : 0.25.1.20
// whiskeysockets/baileys version  : 6.7.9



// ---------------------------------------------------------------------------------------- //














const home = (path) => __base + path
const _lib = (path) => home("./lib/" + path)

require('./options/settings')

const {
    AnyMessageContent,
    BinaryInfo,
    DisconnectReason,
    downloadAndProcessHistorySyncNotification,
    generateForwardMessageContent,
    jidDecode,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    downloadContentFromMessage,
    encodeWAM,
    generateMessageID,
    delay,
    fetchLatestBaileysVersion,
    getAggregateVotesInPollMessage,
    makeCacheableSignalKeyStore,
    getHistoryMsg,
    isJidNewsletter,
    makeInMemoryStore,
    PHONENUMBER_MCC,
    proto,
    useMultiFileAuthState,
    WAMessageContent,
    WAMessageKey,
    jidNormalizedUser
} = require(sitotesBaileys)

const util = require('util');
const moment = require('moment-timezone');
const {
    getBuffer,
    hitungmundur,
    bytesToSize,
    checkBandwidth,
    runtime,
    fetchJson,
    getGroupAdmins,
    msToDate,
    isUrl,
    tanggal,
    sleeps,
    jsnParse,
    jsnSfy,

    fs,
    axios,
    path,

    TelegraPh,

    sitotesLogModule
} = require(_lib('sitotesFunc'))
const {
    client
} = require(_lib('dbmongosle'))


const FileType = require('file-type')
const PhoneNumber = require('awesome-phonenumber')



const {
    toAudio,
    toPTT,
    toVideo
} = require(_lib('converter'))
const {
    imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid,
    writeExif
} = require(_lib('exif'))

module.exports = onic = async (onic, store) => {
    try {
        const fetch = await import('node-fetch');


        onic.serializeM = (m) => smsg(onic, m, store)

        onic.jsonFineFormated = async (json) => {
            return await jsnSfy(json, 2)
                .replace(/(\n\s{4,})/g, ' ')
                .replace(/\[\{/g, '[\n  {')
                .replace(/},\n\s+\{/g, '},\n  {')
                .replace(/\}\]/g, '}\n]')
                .replaceAll('\n  }', ' }')
                .replace('[\n ', '[')
                .replace(' }\n]', ' } ]')
        }

        onic.getUrlTotalSize = async (url) => {
            let vv
            await fetch(url, {
                method: 'HEAD'
            }).then((result) => {
                let v = result.headers.get("content-length")

                vv = onic.caculedSize(v)
            })
            return await vv
        }

        onic.mdbConnect = async () => {
            await client.connect();
        }

        onic.mdbConnectDb = async (colectname) => {
            await client.connect();
            const db = await client.db(botdata);
            return await db.collection(colectname);
        }

        onic.mdbClosed = async () => {
            return await client.close();
        }

        onic.caculedSize = (bytes) => {
            if (!+bytes) return '0 Bytes'

            const k = 1024
            const dm = 2 < 0 ? 0 : 2
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            const i = Math.floor(Math.log(bytes) / Math.log(k))

            return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
        }

        onic.videoToWebp = async (path) => {
            const vv = await videoToWebp(path)
            return vv
        }

        onic.isJson = (str) => {
            try {
                jsnParse(str);
                return true;
            } catch (error) {
                return false;
            }
        }

        onic.sendMessageJson = async (jid, message, forceForward = false, options = {}) => {
            let vtype
            if (options.readViewOnce) {
                message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
                vtype = Object.keys(message.message.viewOnceMessage.message)[0]
                delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
                delete message.message.viewOnceMessage.message[vtype].viewOnce
                message.message = {
                    ...message.message.viewOnceMessage.message
                }
            }

            let mtype = Object.keys(message.message)[0]
            let content = await generateForwardMessageContent(message, forceForward)
            let ctype = Object.keys(content)[0]
            let context = {}
            if (mtype != "conversation") context = message.message[mtype].contextInfo
            content[ctype].contextInfo = {
                ...context,
                ...content[ctype].contextInfo
            }
            const waMessage = await generateWAMessageFromContent(jid, content, options ? {
                ...content[ctype],
                ...options,
                ...(options.contextInfo ? {
                    contextInfo: {
                        ...content[ctype].contextInfo,
                        ...options.contextInfo
                    }
                } : {})
            } : {})
            if (forceForward) {} else {
                try {
                    const listtype = Object.keys(waMessage.message)
                    const type = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(listtype[0]) && listtype[0]) || (listtype.length >= 3 && listtype[1] !== 'messageContextInfo' && listtype[1]) || listtype[listtype.length - 1] || Object.keys(waMessage.message)[0]
                    var mtiype = waMessage.message[type].message ? waMessage.message[type].message : waMessage.message[type]

                    if (mtiype.contextInfo ? true : false) {
                        // mtiype.contextInfo['expiration'] = 86400
                        if (mtiype.contextInfo['forwardingScore'] ? true : false) {
                            delete mtiype.contextInfo['forwardingScore']
                            delete mtiype.contextInfo['isForwarded']
                        }
                    } else {
                        mtiype['contextInfo'] = {}
                        // mtiype.contextInfo['expiration'] = 86400
                    }
                } catch {}
            }

            return await onic.relayMessage(jid, waMessage.message, {
                messageId: waMessage.key.id
            })
        }

        onic.axiosUrlToBuffer = (url) => {
            let retryCount = 0;
            const maxRetries = 3;
            const retryDelay = 3000;

            function fetch() {
                return axios.get(url, {
                        responseType: 'arraybuffer'
                    })
                    .then(function(response) {
                        const buffer = Buffer.from(response.data, 'binary');
                        return buffer;
                    })
                    .catch(function(error) {
                        console.error(error);
                        if (retryCount < maxRetries) {
                            retryCount++;
                            console.log(`Mencoba lagi (${retryCount}/${maxRetries}) setelah ${retryDelay}ms...`);
                            return new Promise(resolve => setTimeout(resolve, retryDelay)).then(fetch);
                        } else {
                            throw error;
                        }
                    });
            }
            return fetch();
        }

        onic.axiosUrlToJson = (url) => {
            let retryCount = 0;
            const maxRetries = 3;
            const retryDelay = 3000;

            function fetch() {
                return axios({
                        method: 'GET',
                        url: url,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
                        }
                    })
                    .then(function(response) {
                        return response.data;
                    })
                    .catch(function(error) {
                        console.error(error);
                        if (retryCount < maxRetries) {
                            retryCount++;
                            console.log(`Mencoba lagi (${retryCount}/${maxRetries}) setelah ${retryDelay}ms...`);
                            return new Promise(resolve => setTimeout(resolve, retryDelay)).then(fetch);
                        } else {
                            throw error;
                        }
                    });
            }
            return fetch();
        }

        onic.getUrlTotalSize = async (url) => {
            let vv
            await fetch(url, {
                method: 'HEAD'
            }).then((result) => {
                let v = result.headers.get("content-length")

                vv = onic.caculedSize(v)
            })
            return await vv
        }

        onic.smemeTools = async (format) => {
            if (!format) return
            let outpot
            outpot = await format.replaceAll('_', '__');
            outpot = await outpot.replaceAll('-', '--');
            outpot = await outpot.replaceAll('\n', '~n');
            outpot = await outpot.replaceAll('?', '~q');
            outpot = await outpot.replaceAll('&', '~a');
            outpot = await outpot.replaceAll('%', '~p');
            outpot = await outpot.replaceAll('#', '~h');
            outpot = await outpot.replaceAll('/', '~s');
            outpot = await outpot.replaceAll(String.fromCharCode(92), '~b');
            outpot = await outpot.replaceAll('<', '~l');
            outpot = await outpot.replaceAll('>', '~g');
            outpot = await outpot.replaceAll('"', "''");
            outpot = await outpot.replaceAll(' ', '_');

            return outpot
        }

        onic.getName = (jid, withoutContact = false) => {
            id = onic.decodeJid(jid)
            withoutContact = onic.withoutContact || withoutContact
            let v
            if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
                v = store.contacts[id] || {}
                if (!(v.name || v.subject)) v = onic.groupMetadata(id) || {}
                resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
            })
            else v = id === '0@s.whatsapp.net' ? {
                    id,
                    name: 'WhatsApp'
                } : id === onic.decodeJid(onic.user.id) ?
                onic.user :
                (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
        }

        onic.sendContact = async (jid, kon, name, vcardc, quoted = '', opts = {}) => {
            let list = []
            for (let i = 0; i < kon.length; i++) {
                let nama = (name[i] == '') ? await onic.getName(kon[i] + '@s.whatsapp.net') : name[i]
                list.push({
                    displayName: nama,
                    vcard: `BEGIN:VCARD
VERSION:3.0
N:${nama}
FN:${nama}
item1.TEL;waid=${kon[i]}:${kon[i]}
item1.X-ABLabel:Ponsel
${vcardc[i]}
END:VCARD`
                })
            }
            onic.sendPesan(jid, {
                contacts: {
                    displayName: `${list.length} Kontak`,
                    contacts: list
                },
                ...opts
            }, {
                quoted
            })
        }

        onic.downloadMediaMessage = async (message) => {
            let mime = (message.msg || message).mimetype || ''
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
            const stream = await downloadContentFromMessage(message, messageType)
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }

            return buffer
        }

        onic.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {

            let quoted = message.msg ? message.msg : message

            let mime = (message.msg || message).mimetype || ''
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
            const stream = await downloadContentFromMessage(quoted, messageType)
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }
            let type = await FileType.fromBuffer(buffer)
            trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
            // save to file
            await fs.writeFileSync(trueFileName, buffer)
            return trueFileName
        }

        onic.sendTextWithMentions = async (jid, text, quoted, options = {}) => onic.sendPesan(jid, {
            text: text,
            mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
            ...options
        }, {
            quoted
        })

        onic.getFile = async (PATH, returnAsFilename) => {
            let res, filename
            const data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
            if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
            const type = await FileType.fromBuffer(data) || {
                mime: 'application/octet-stream',
                ext: '.bin'
            }
            if (data && returnAsFilename && !filename)(filename = path.join(__dirname, './image/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
            return {
                res,
                filename,
                ...type,
                data,
                deleteFile() {
                    return filename && fs.promises.unlink(filename)
                }
            }
        }

        onic.sendReaction = async (jid, key, text) => {
            return await onic.sendPesan(jid, {
                react: {
                    text: text,
                    key: key
                }
            })
        }

        onic.sendPoll = async (jid, name = '', values = [], selectableCount = 1, options = {}) => {
            return await onic.sendPesan(jid, {
                poll: {
                    name,
                    values,
                    selectableCount
                },
                options
            })
        }

        onic.sendImageUrl = async (jid, path, caption = '', quoted = '', options) => {
            return await onic.sendPesan(jid, {
                image: {
                    url: path
                },
                caption: caption,
                ...options
            }, {
                quoted
            })
        }

        onic.sendVideoUrl = async (jid, path, gif = false, caption = '', quoted = '', options) => {
            return await onic.sendPesan(jid, {
                video: {
                    url: path
                },
                caption: caption,
                gifPlayback: gif,
                ...options
            }, {
                quoted
            })
        }

        onic.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
            let type = await onic.getFile(path, true)
            let {
                res,
                data: file,
                filename: pathFile
            } = type
            if (res && res.status !== 200 || file.length <= 65536) {
                try {
                    throw {
                        json: jsnParse(file.toString())
                    }
                } catch (e) {
                    if (e.json) throw e.json
                }
            }
            let opt = {
                filename
            }
            if (quoted) opt.quoted = quoted
            if (!type) options.asDocument = true
            let mtype = '',
                mimetype = type.mime,
                convert
            if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
            else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
            else if (/video/.test(type.mime)) mtype = 'video'
            else if (/audio/.test(type.mime))(
                convert = await (ptt ? toPTT : toAudio)(file, type.ext),
                file = convert.data,
                pathFile = convert.filename,
                mtype = 'audio',
                mimetype = 'audio/ogg; codecs=opus'
            )
            else mtype = 'document'
            if (options.asDocument) mtype = 'document'

            delete options.asSticker
            delete options.asLocation
            delete options.asVideo
            delete options.asDocument
            delete options.asImage

            let message = {
                ...options,
                caption,
                ptt,
                [mtype]: {
                    url: pathFile
                },
                mimetype
            }
            let m
            try {
                m = await onic.sendPesan(jid, message, {
                    ...opt,
                    ...options
                })
            } catch (e) {
                //console.error(e)
                m = null
            } finally {
                if (!m) m = await onic.sendPesan(jid, {
                    ...message,
                    [mtype]: file
                }, {
                    ...opt,
                    ...options
                })
                file = null
                return m
            }
        }

        onic.sendMedia = async (jid, path, filename, quoted = '', options = {}) => {
            let {
                ext,
                mime,
                data
            } = await onic.getFile(path)
            messageType = mime.split("/")[0]
            pase = messageType.replace('application', 'document') || messageType
            return await onic.sendPesan(jid, {
                [`${pase}`]: data,
                mimetype: mime,
                fileName: filename + ext ? filename + ext : getRandom(ext),
                ...options
            }, {
                quoted
            })
        }

        onic.sendMediaAsSticker = async (jid, path, quoted, options = {}) => {
            let {
                ext,
                mime,
                data
            } = await onic.getFile(path)
            let media = {}
            let buffer
            media.data = data
            media.mimetype = mime
            if (options && (options.packname || options.author)) {
                buffer = await writeExif(media, options)
            } else {
                buffer = /image/.test(mime) ? await imageToWebp(data) : /video/.test(mime) ? await videoToWebp(data) : ""
            }
            await onic.sendPesan(jid, {
                sticker: {
                    url: buffer
                },
                ...options
            }, {
                quoted
            })
            return buffer
        }

        onic.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
            let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await onic.axiosUrlToBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
            let buffer
            if (options && (options.packname || options.author)) {
                buffer = await writeExifImg(buff, options)
            } else {
                buffer = await imageToWebp(buff)
            }
            await onic.sendReaction(quoted.chat, quoted.key, '✈️')
            await onic.sendPesan(jid, {
                sticker: {
                    url: buffer
                },
                ...options
            }, {
                quoted
            })
            await onic.sendReaction(quoted.chat, quoted.key, '✅')
            return buffer
        }

        onic.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
            let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await onic.axiosUrlToBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
            let buffer
            if (options && (options.packname || options.author)) {
                buffer = await writeExifVid(buff, options)
            } else {
                buffer = await videoToWebp(buff)
            }
            await onic.sendReaction(quoted.chat, quoted.key, '✈️')
            await onic.sendPesan(jid, {
                sticker: {
                    url: buffer
                },
                ...options
            }, {
                quoted
            })
            await onic.sendReaction(quoted.chat, quoted.key, '✅')
            return buffer
        }

        onic.sendWebpAsSticker = async (jid, path, quoted, options = {}) => {
            let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await onic.axiosUrlToBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)

            let buffer
            if (options && (options.packname || options.author)) {
                buffer = await writeExifWebp(buff, options)

                await onic.sendReaction(quoted.chat, quoted.key, '✈️')
                await onic.sendPesan(jid, {
                    sticker: {
                        url: buffer
                    },
                    ...options
                }, {
                    quoted
                })
                await onic.sendReaction(quoted.chat, quoted.key, '✅')
                return buffer
            } else {
                await onic.sendReaction(quoted.chat, quoted.key, '✈️')
                await onic.sendPesan(jid, {
                    sticker: buff,
                    ...options
                }, {
                    quoted
                })
                await onic.sendReaction(quoted.chat, quoted.key, '✅')
                return buff
            }
        }

        onic.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
            let buttonMessage = {
                text,
                footer,
                buttons,
                headerType: 2,
                ...options
            }
            onic.sendPesan(jid, buttonMessage, {
                quoted,
                ...options
            })
        }

        onic.send1ButMes = (jid, text = '', footer = '', butId = '', dispText = '', quoted, ments) => {
            let but = [{
                buttonId: butId,
                buttonText: {
                    displayText: dispText
                },
                type: 1
            }]
            let butMes = {
                text: text,
                buttons: but,
                footer: footer,
                mentions: ments ? ments : []
            }
            onic.sendPesan(jid, butMes, {
                quoted: quoted
            })
        }

        onic.sendButImage = async (jid, link, but = [], text = '', footer = '', ments = [], quoted) => {
            let dlimage;
            try {
                dlimage = await getBuffer(link)
            } catch {
                dlimage = await getBuffer('https://telegra.ph/file/ca0234ea67c9a8b8af9a1.jpg')
            }
            const buttonMessage = {
                image: dlimage,
                caption: text,
                footer: footer,
                buttons: but,
                headerType: 'IMAGE',
                mentions: ments
            }

            onic.sendPesan(jid, buttonMessage, quoted)
        }

        onic.sendFakeLink = (jid, text, salam, footer_text, pp_bot, myweb, pushname, quoted, options) => {
            onic.sendPesan(jid, {
                text: text,
                contextInfo: {
                    "externalAdReply": {
                        "title": `${salam} ${pushname}`,
                        "body": footer_text,
                        "previewType": "PHOTO",
                        "thumbnailUrl": ``,
                        "thumbnail": pp_bot,
                        "sourceUrl": myweb
                    },
                    ...options
                },
            }, {
                quoted
            })
        }



        async function getMessage(key) {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id)
                return msg?.message || undefined
            }

            return proto.Message.fromObject({})
        }


    } catch (err) {
        console.log(err.stack)
    } finally {
        // console.log(__filename.replace('/data/data/com.termux/files/home', '.'), '→ Save');
        sitotesLogModule(__filename)
    }
}