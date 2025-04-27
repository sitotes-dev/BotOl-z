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









require('../options/settings')

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

const _dbGameOn = (__stDB.gameOn)




module.exports = onic = async(onic, m, s, command, mek) => {
    try {

        switch (command) {
            case 'ttt':
            case 'tictactoe': {
                if (!m.isGroup) return await onic.reply('Fitur ini hanya berfungsi di dalam grub 😉')
                if (!s.text) return await onic.reply('Tag Lawan Anda! ')
                if (m.chat in _dbGameOn['tictactoe']) return await onic.reply('Sedang Ada Permainan Di Grub Ini, Harap Tunggu')
                if (m.message.extendedTextMessage === undefined || m.message.extendedTextMessage === null) return await onic.reply('Tag target Lawan!')

                const ment = m.message.extendedTextMessage.contextInfo.mentionedJid

                _dbGameOn['tictactoe'][m.chat] = [{
                    tctoeSyntac: ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
                    player1: m.sender,
                    player2: ment[0],
                    id: m.chat,
                    angka: ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
                    gilir: ment[0]
                }]
                    
                await onic.reply(`*🎳 Memulai Game Tictactoe 🎲*\n\n[@${m.sender.split('@')[0]}] Menantang @${ment[0].split('@')[0]} untuk menjadi lawan Game🔥\nKetik Y/N untuk menerima atau menolak permainan\n\nKet : Ketik /resetgame , Untuk Mereset Permainan Yg Ada Di Grup!`, {
                    mentionedJid: [m.sender, ment[0]]
                })
            }
            break
            case 'tebakkata': {
                // if (!m.isGroup) return onic.reply(mess.only.group)
                // let timeout = 60000
                // let id = m.chat
                // if (id in Mikasa.tebakkata) return replycann("Masih Ada Sesi Yang Belum Diselesaikan!")
                // let src = await (await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkata.json')).json()
                // let json = src[Math.floor(Math.random() * src.length)]
                // let caption = `Silahkan Jawab Pertanyaan Berikut\n\nSoal : ${json.soal}\nWaktu : 60s\nHadiah : 10.000 money`
                // _dbGameOn['tictactoe'][m.chat]
                // Mikasa.tebakkata[id] = [
                //     await replycann(`${caption}`),
                //     json,
                //     setTimeout(() => {
                //         if (Mikasa.tebakkata[id])
                //             console.log("Jawaban: " + json.jawaban)
                //         replycann(`Waktu Habis\nJawaban:  ${json.jawaban}\n\nIngin bermain? Ketik tebakkata`)
                //         delete Mikasa.tebakkata[id]
                //     }, 60000)
                // ]
            }
            break;


            default: {
                await ticTactoeModule(_dbGameOn['tictactoe'])
            }
        }










        async function ticTactoeModule(datatiktaktu) {
            if (!m.chat in datatiktaktu) return
            if (!datatiktaktu[m.chat][0]) return
            if (!m.isGroup) return

            const dtaTicTac = datatiktaktu[m.chat][0]
            const isPlayer1 = dtaTicTac.player1.includes(m.sender)
            const isPlayer2 = dtaTicTac.player2.includes(m.sender)
            
            if (isPlayer2) {
                if (s.budy.toLowerCase().startsWith('y')) {
                    const angka = dtaTicTac.angka
                    await onic.reply(`*🎳 Game Tictactoe 🎲*\nPlayer1 @${dtaTicTac.player1.split('@')[0]}=❎\nPlayer2 @${dtaTicTac.player2.split('@')[0]}=🅾️\n\nGiliran = @${dtaTicTac.player1.split('@')[0]}=❎\n\n   ${angka[1]}${angka[2]}${angka[3]}\n   ${angka[4]}${angka[5]}${angka[6]}\n   ${angka[7]}${angka[8]}${angka[9]}`, {
                        mentionedJid: [dtaTicTac.player1, dtaTicTac.player2]
                    })

                    await sleeps(10 * 60000)
                    if (datatiktaktu[m.chat]) {
                        await onic.reply(`Data tictactoe Cleaning..`)
                        return delete datatiktaktu[m.chat]
                    }

                } else if (s.budy.toLowerCase().startsWith('n')) {
                    delete datatiktaktu[m.chat]

                    await onic.reply(`Yahh @${dtaTicTac.player2.split('@')[0]} Menolak:(`, {
                        mentionedJid: [dtaTicTac.player1, dtaTicTac.player2]
                    })
                }
            }

            if (isPlayer1) {
                const nuber = parseInt(s.budy)
                const xs = '❎'

                if (isNaN(nuber)) return
                if (nuber < 1 || nuber > 9) return onic.reply('Masukan Angka Dengan Benar')
                if (!dtaTicTac.tctoeSyntac.includes(dtaTicTac.angka[nuber])) return onic.reply('Udah Di Isi, Isi Yang Lain Gan')
                if (dtaTicTac.gilir.includes(m.sender)) return onic.reply('Tunggu Giliran Gan')

                dtaTicTac.angka[nuber] = xs
                dtaTicTac.gilir = dtaTicTac.player1

                const angka = dtaTicTac.angka
                const ttt = `${angka[1]}${angka[2]}${angka[3]}\n${angka[4]}${angka[5]}${angka[6]}\n${angka[7]}${angka[8]}${angka[9]}`
                const ucapmenang = async() => {
                    await onic.reply(`*🎳Result Game Tictactoe 🎲*\n\n*Yeyyy Permainan Di Menangkan Oleh* @${dtaTicTac.player1.split('@')[0]}\n\n*Ingin bermain lagi? ${s.prefix}tictactoe*`, {
                        mentionedJid: [dtaTicTac.player1]
                    })
                    return delete datatiktaktu[m.chat]
                }

                if (angka[1] == xs && angka[2] == xs && angka[3] == xs) return ucapmenang()
                if (angka[1] == xs && angka[4] == xs && angka[7] == xs) return ucapmenang()
                if (angka[1] == xs && angka[5] == xs && angka[9] == xs) return ucapmenang()
                if (angka[2] == xs && angka[5] == xs && angka[8] == xs) return ucapmenang()
                if (angka[4] == xs && angka[5] == xs && angka[6] == xs) return ucapmenang()
                if (angka[7] == xs && angka[8] == xs && angka[9] == xs) return ucapmenang()
                if (angka[3] == xs && angka[5] == xs && angka[7] == xs) return ucapmenang()
                if (angka[3] == xs && angka[6] == xs && angka[9] == xs) return ucapmenang()

                if (!ttt.includes('1️⃣') && !ttt.includes('2️⃣') && !ttt.includes('3️⃣') && !ttt.includes('4️⃣') && !ttt.includes('5️⃣') && !ttt.includes('6️⃣') && !ttt.includes('7️⃣') && !ttt.includes('8️⃣') && !ttt.includes('9️⃣')) {
                    await onic.reply(`*🎳 Result Game Tictactoe 🎲*\n\n*_Permainan Seri ??👌_*`)
                    return delete datatiktaktu[m.chat]
                }

                await onic.reply(`*🎳 Game Tictactoe 🎲*\n\nPlayer2 @${dtaTicTac.player2.split('@')[0]}=🅾️\nPlayer1 @${dtaTicTac.player1.split('@')[0]}=❎\n\nGiliran = @${dtaTicTac.player2.split('@')[0]}=🅾️\n\n${ttt}`, {
                    mentionedJid: [dtaTicTac.player1, dtaTicTac.player2]
                })
            }

            if (isPlayer2) {
                const nuber = parseInt(s.budy)
                const xs = '🅾️'

                if (isNaN(nuber)) return
                if (nuber < 1 || nuber > 9) return onic.reply('Masukan Angka Dengan Benar')
                if (!dtaTicTac.tctoeSyntac.includes(dtaTicTac.angka[nuber])) return onic.reply('Udah Di Isi, Isi Yang Lain Gan')
                if (dtaTicTac.gilir.includes(m.sender)) return onic.reply('Tunggu Giliran Gan')

                dtaTicTac.angka[nuber] = xs
                dtaTicTac.gilir = dtaTicTac.player2

                const angka = dtaTicTac.angka
                const ttt = `${angka[1]}${angka[2]}${angka[3]}\n${angka[4]}${angka[5]}${angka[6]}\n${angka[7]}${angka[8]}${angka[9]}`

                const ucapmenang = async() => {
                    await onic.reply(`*🎳 Result Game Tictactoe 🎲*\n\n*Yeyyy Permainan Di Menangkan Oleh* @${dtaTicTac.player2.split('@')[0]}\n\n*Ingin bermain lagi? ${s.prefix}tictactoe*`, {
                        mentionedJid: [dtaTicTac.player2]
                    })
                    return delete datatiktaktu[m.chat]
                }

                if (angka[1] == xs && angka[2] == xs && angka[3] == xs) return ucapmenang()
                if (angka[1] == xs && angka[4] == xs && angka[7] == xs) return ucapmenang()
                if (angka[1] == xs && angka[5] == xs && angka[9] == xs) return ucapmenang()
                if (angka[2] == xs && angka[5] == xs && angka[8] == xs) return ucapmenang()
                if (angka[4] == xs && angka[5] == xs && angka[6] == xs) return ucapmenang()
                if (angka[7] == xs && angka[8] == xs && angka[9] == xs) return ucapmenang()
                if (angka[3] == xs && angka[5] == xs && angka[7] == xs) return ucapmenang()
                if (angka[3] == xs && angka[6] == xs && angka[9] == xs) return ucapmenang()

                if (!ttt.includes('1️⃣') && !ttt.includes('2️⃣') && !ttt.includes('3️⃣') && !ttt.includes('4️⃣') && !ttt.includes('5️⃣') && !ttt.includes('6️⃣') && !ttt.includes('7️⃣') && !ttt.includes('8️⃣') && !ttt.includes('9️⃣')) {
                    await onic.reply(`*??Result Game Tictactoe 🎲*\n\n*_Permainan Seri🗿👌*`)
                    return delete datatiktaktu[m.chat]
                }

                await onic.reply(`*🎳 Game Tictactoe 🎲*\n\nPlayer1 @${dtaTicTac.player1.split('@')[0]}=❎\nPlayer2 @${dtaTicTac.player2.split('@')[0]}=🅾️\n\nGiliran = @${dtaTicTac.player1.split('@')[0]}=❎\n${ttt}`, {
                    mentionedJid: [dtaTicTac.player1, dtaTicTac.player2]
                })
            }
        }



    } catch (err) {
        await onic.sendText('*Error*\n> ' + __filename.replace('/data/data/com.termux/files/home', '.') + '\n\n`' + util.format(err) + '`')
        clog(util.format(err))
    } finally {
        await sitotesUpdateLog(__filename);
    }
}