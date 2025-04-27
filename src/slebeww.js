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














require('./options/settings')

const home = (path) => __base + path
const _lib = (path) => home("./lib/" + path)
const _srop = (path) => home("./src/options/" + path)


const {
    getBuffer,
    hitungmundur,
    bytesToSize,
    checkBandwidth,
    runtime,
    fetchJson,
    getGroupAdmins,
    parseMention,
    msToDate,
    isUrl,
    smsg,
    sleeps,

    sitotesUpdateLog,

    fs,
    axios,
    util,
    jsnSfy
} = require(_lib('sitotesFunc'))
const {
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
    areJidsSameUser,
    getContentType
} = require(sitotesBaileys)

const { toAudio } = require(_lib('converter'))
const moment = require('moment-timezone');

const _dbGameOn = (__stDB.gameOn)





module.exports = onic = async(onic, m, s, chatUpdate, mek, store) => {
    try {

        if (m.message) {
            clog(s.msgLog)
            await sleeps(1)
            // await onic.readMessages([m.key])
        }

        if (m.chat in _dbGameOn['tictactoe'] && !s.isCmd) await require('./cmd-group/' + 'game-menu')(onic, m, s, s.command, mek)







        // ini case yang wajib pakai titik _----------------------------------------------------------------------------- //
        switch (s.command) {
            case 'newsltr': {
                await onic.react('🦶')
                await onic.reply(jsnSfy(Object.keys(store.contacts).filter(pe=> pe.includes('@s.whatsapp.net'))))
            }
            break
        case 'sendsah': {
                await onic.react('🦶')
                await onic.sendMessage('status@broadcast', {
                    audio: fs.readFileSync('./SAH.mp3'),
                    mimetype: 'audio/mp4',
                    ppt: true,
                }, {
                    backgroundColor: '#ffa1ca',
                    statusJidList: ['6288989781626@s.whatsapp.net']
                    // statusJidList: Object.keys(store.contacts).filter(pe=> pe.includes('@s.whatsapp.net'))
                })
            }
            break
        }



        // ini case bebas bisa pakai titik bisa engga _----------------------------------------------------------------------------- //
        switch (s.cimmind) {
            case '---------------':
            case 'tebakkata':
            case '---------------':
            case 'ttt':
            case 'tictactoe': {
                await runCase('game-menu', true)
            }
            break
            case 'u':
            case 'test':
            case 'status':
            case 'p':
            case 'Runtime':
            case 'Uptime': {
                await onic.reply(`Halo Saya Bot SiTotes, server saya terakhir restart ( ${runtime(process.uptime())} ) yang lalu`)
            }
            break
            case 'owner':
            case 'pembuat':
            case 'creator': {
                await onic.sendContactQ(m.chat)
            }
            case 'mbuh1': {
                onic.reply('hemm ini yang tanpa titik yaa')
            }
            break
            case 'pin': {
                await onic.sendMessage(m.chat, {
                    react: {
                        text: "🔎",
                        key: m.key,
                    }
                })
                async function createImage(url) {
                    const {
                        imageMessage
                    } = await generateWAMessageContent({
                        image: {
                            url
                        }
                    }, {
                        upload: onic.waUploadToServer
                    });
                    return imageMessage;
                }

                function shuffleArray(array) {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                }

                let push = [];
                let {
                    data
                } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${s.text}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${s.text}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`);
                let res = data.resource_response.data.results.map(v => v.images.orig.url);

                shuffleArray(res);
                let ult = res.splice(0, 10);
                let i = 1;

                for (let lucuy of ult) {
                    push.push({
                        body: proto.Message.InteractiveMessage.Body.fromObject({
                            text: `• bot whatsapp\n• pinterest`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({
                            text: ownername
                        }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            title: `M.Saiful Anam.R`,
                            hasMediaAttachment: true,
                            imageMessage: await createImage(lucuy)
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            buttons: [{
                                "name": "cta_url",
                                "buttonParamsJson": `{"display_text":"SOURCE","url":"https://www.pinterest.com/search/pins/?rs=typed&q=${s.text}","merchant_url":"https://www.pinterest.com/search/pins/?rs=typed&q=${s.text}"}`
                            }]
                        })
                    });
                }

                const bot = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: "SiTotes: Berhasil Menemukan Gambar " + s.text
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: 'DARI PINTEREST'
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    hasMediaAttachment: false
                                }),
                                carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                                    cards: [
                                        ...push
                                    ]
                                })
                            })
                        }
                    }
                }, {});

                await onic.relayMessage(m.chat, bot.message, {
                    messageId: bot.key.id
                });
            }
            break
            case '×':
            case '🌟': {
                if(!s.quoted) return
                await onic.sendMessageJson(onic.user.id, (s.quoted.msg || s.quoted).fakeObj)
            }
            break
            case 'send': {
                if(!s.quoted) return
                if(!s.text) return
                await onic.sendMessageJson(s.text.replaceAll('https://', ''), (s.quoted.msg || s.quoted).fakeObj)
            }
            break
            case 'onc': {
                if (!s.quoted) return await onic.reply('Tidak mereply apapun, reply media')
                await onic.sendReaction(m.chat, m.key, '🦶')
                let vnot = (s.quoted.msg || s.quoted).fakeObj
                vnot.message[m.quoted.mtype].viewOnce = true
                await onic.sendMessageJson(m.chat, vnot)
            }
            case '2x': {
                if (!s.quoted) return await onic.reply('Tidak mereply apapun, reply media')
                await onic.sendReaction(m.chat, m.key, '🦶')
                let vnot = (s.quoted.msg || s.quoted).fakeObj
                let so = (m.quoted.mtype == 'viewOnceMessageV2Extension'||'viewOnceMessageV2'||'viewOnceMessage' ? vnot.message[m.quoted.mtype].message[getContentType(vnot.message[m.quoted.mtype].message)] : vnot.message[m.quoted.mtype])
                so.viewOnce = false
                console.log(JSON.stringify(vnot ,null , 2))
                await onic.sendMessageJson(m.chat, vnot)
            }
            break
            case 'mc': {
                if (!/video/.test(s.mime) && !/audio/.test(s.mime)) return await onic.reply('Reply media brow')
                if (!s.quoted) return await onic.reply('Tidak mereply apapun, reply media')
                if ((s.quoted.msg || s.quoted).seconds > 900) return await onic.reply('Maximum 60 seconds!')
                await onic.react('🦶')
                let media = await s.quoted.download()
                let audio = await toAudio(media, 'mp4')
                await onic.sendMessage(m.chat, {
                    audio: audio,
                    mimetype: 'audio/mpeg',
                    ptt: false
                })
            }
            case 'vn': {
                if (!s.quoted) return await onic.reply('Tidak mereply apapun, reply media')
                await onic.react('🦶')
                let vnot = (s.quoted.msg || s.quoted).fakeObj
                vnot.message.audioMessage.ptt = true
                await onic.sendMessageJson(m.chat, vnot)
            }
            break
        }




        async function runCase(runto, perfic = true, ...allin) {
            if (perfic) {
                if (s.isCmd) await require('./cmd-group/' +runto)(onic, m, s, s.command, mek, ...allin)
            } else {
                if (!s.isCmd) await require('./cmd-group/' +runto)(onic, m, s, s.cimmind, mek, ...allin)
            }

        }
    } catch (err) {
        await onic.sendText('*Error*\n> ' + __filename.replace('/data/data/com.termux/files/home', '.') + '\n\n`' + util.format(err) + '`')
        clog(util.format(err))
    } finally {
        await sitotesUpdateLog(__filename);
    }
}