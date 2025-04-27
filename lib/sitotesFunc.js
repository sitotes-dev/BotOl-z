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
const jsnParse = (...args) => JSON.parse(...args)
const jsnSfy = (data, num = 2) => JSON.stringify(data, null, num)
global.clog = (...args) => console.log(...args);
global.cloger = (...args) => console.error(...args);
global.sitotesBaileys = '@whiskeysockets/baileys'
global.__nbl = {}
global.__dbl = (n) => {
    if (typeof n === 'undefined') {
        return '\n\n';
    }
    return '\n'.repeat(n);
};
require(home('./src/options/settings'))
const path = require('path');
const url = require('url');
const {
    proto,
    getContentType,
    generateWAMessage,
    areJidsSameUser
} = require(sitotesBaileys)
const fs = require('fs')
const axios = require('axios')
const moment = require("moment-timezone")
const FormData = require("form-data")
const util = require('util');
__nbl = {
    // Onic Atribut
    ttlerr: 0,
    resetcache: 0,
    chekid: {},
    lcInfo: './src/.sitotes/data/data-msg.json',
    lcDb: './src/.sitotes/data/sitotes-db.json',
    dataFile: './src/.sitotes/data/grafik-stats.json',
    welog: [],
    history: [],
    qrBuffer: null,
    // @whiskeysockets/baileys Controler
    useStore: true,
    doReplies: !false,
    usePairingCode: process.argv.includes('--code'), //default true
    useMobile: false,
    ip: Object.values(require('os').networkInterfaces()).flat().find(details => details.family === 'IPv4' && !details.internal)?.address,
    serverIsOn: false,
    webPort: __nbl.webPort?__nbl.webPort : 3000,
    serverDisReason: null,
    config: {
        dataRetentionMinutes: 1
    }
}
const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')
__nbl.infoMSG = new Low(new JSONFile(home('./src/.sitotes/data/data-msg.json')), [])

;(async () => {
    await __nbl.infoMSG.read()
    __nbl.infoMSG.data ||= []
    await __nbl.infoMSG.write()
})()
const {
    lowDbReadAll
} = require('./sitotesLowdb')

const http = require('http');
const PORT = process.env.PORT || __nbl.webPort;
const {
    Boom
} = require('@hapi/boom')
const { exec } = require('child_process');
const os = require('os');
const {
    toBuffer
} = require('qrcode')
const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: __nbl.webPort + 1
});
const NodeCache = require('node-cache')
const pino = require('pino')
const readline = require('readline')
const msgRetryCounterCache = new NodeCache()
const logger = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`
}, pino.destination(home('./sitotes-wa-logs.txt')))
logger.level = 'trace'
const rl = __nbl.usePairingCode?readline.createInterface({
    input: process.stdin,
    output: process.stdout
}) : ''
const question = (text) => new Promise((resolve) => __nbl.usePairingCode?rl.question(text, resolve) : '')
async function sitotesMakeSock(makeWASocket, version, isLatest, getMessage, state, makeCacheableSignalKeyStore) {
    clog('Using WA =', {
        'Version': version.join('.'),
        'isLatest': isLatest
    })
    const browser = __nbl.usePairingCode?["Ubuntu", "Chrome", "20.0.04"] : [" Bot᭄ SiTotes ×፝֟͜× ", "Firefox", "1.0.0"]
    const onic = makeWASocket({
        connectTimeoutMs: 60000, // Gagal koneksi jika waktu soket habis dalam interval ini
        defaultQueryTimeoutMs: 0, // Batas waktu default untuk kueri, tidak ditentukan tanpa batas waktu
        keepAliveIntervalMs: 10000, // interval ping-pong untuk koneksi WS
        logger: pino({
            level: 'fatal'
        }), // pencatat pino
        version, // versi untuk dihubungkan
        browser, // mengganti konfigurasi browser
        printQRInTerminal: !__nbl.usePairingCode, // haruskah QR dicetak di terminal
        emitOwnEvents: true, // peristiwa yang harus dikeluarkan untuk tindakan yang dilakukan oleh koneksi soket ini
        auth: {
            creds: state.creds,
            /** caching makes the store faster to send/recv messages */
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        }, // menyediakan objek status autentikasi untuk mempertahankan status autentikasi
        msgRetryCounterCache,
        shouldSyncHistoryMessage: (msg) => true, // mengelola pemrosesan riwayat dengan kontrol ini; secara default akan menyinkronkan semuanya
        //shouldIgnoreJid: jid => !jid || isJidBroadcast(jid) || isJidNewsletter(jid),
        markOnlineOnConnect: false, // menandai klien sebagai online setiap kali soket berhasil tersambung
        syncFullHistory: false, // Jika Baileys menanyakan riwayat lengkap ponsel, akan diterima secara asinkron
        fireInitQueries: true, // Jika bailey mengaktifkan kueri init secara otomatis, defaultnya benar
        generateHighQualityLinkPreview: true, // * menghasilkan pratinjau tautan berkualitas tinggi,     // * berarti mengunggah jpegThumbnail ke WA
        getMessage
    })
    onic.sendPesan = async(...args) => {
        await sleeps(0.5)
        return await onic.sendMessage(...args)
    }
    onic.webConsole = () => {
        //if ((__nbl.welog.split('| MSG (').length - 1))
    }
    let sitotesBanner = `
           +         +        +       +

    +____  _     _____  +  _     +      + 
  + / ___|(_)  +|_   _|__ | |_ ___  ______    +
    \\\___ \\\| |  _  | |/ _ \\\|___/ _ \\\/ ____/______  +
 +   ___) | | |_| | | (_) | ||  __/\\\__ \\\ /_Bot_/
    |____/|_|  +  |_|\\\___/ \\\__\\\___||___/        +
   +       +           +        +      +         +

        +        +          +       +       +
`
    clog(sitotesBanner)
    clog('Base SiTotes =', {
        'Version': '0.25.1.16',
    }, {
        'by': 'm.saiful.anam.r',
    }, __dbl(1))
    clog('Server =', {
        'ipPort': ` http://${__nbl.ip?__nbl.ip : '127.0.0.1'}:${PORT} `
    })
    clog('Internet =', {
        'is': __nbl.ip?'on' : 'off',
    }, __dbl(1))
    clog('Module =', {
        'onic.js': true
    })
    clog('Module =', {
        'sitotesFunc.js': true
    })
    return onic;
}
async function sitotesParingCode(onic) {
    if (__nbl.usePairingCode && !onic.authState.creds.registered) {
        if (__nbl.useMobile) throw new Error('Cannot use pairing code with mobile api')
        var phoneNumber = await question('SI TOTES:   Ketik nomor whatsapp kamu:\n')
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
        const code = await onic.requestPairingCode(phoneNumber)
        clog(`Pairing code: ${code}`)
    }
}
function rmvCListeners(onic, event) {
    return onic.ev.removeAllListeners(event);
}
async function sitotesLoadBaileysStore(store) {
    try {
        __stDB = createDeepProxy(JSON.parse(await fs.readFileSync(home(__nbl.lcDb))))
        await store?.readFromFile(home('./src/session/baileys_store_multi.json'))
    } catch (error) {
        await fs.writeFileSync(home('./src/session/baileys_store_multi.json'), '{"chats":[],"contacts":{},"messages":{},"labels":[],"labelAssociations":[]}')
        __stDB = createDeepProxy({})
        cloger("Error reading or parsing file baileys_store_multi.json: ", error);
        throw new Error('Bot Crash → By sitotes anti loop')
    }
    setInterval(async () => {
        await store?.writeToFile(home('./src/session/baileys_store_multi.json'))
        await sitotesUpdateDb()
    }, 10000)
    clog(__dbl(), 'SiTotes Bot Wait Running...')
    loadHistory();
    setInterval(async () => {
        try {
            const stats = await getSystemStats();
            const history = __nbl.history
            history.push(stats);

            const maxDataPoints = __nbl.config.dataRetentionMinutes * 60;
            
            if (history.length > maxDataPoints) {
                __nbl.history = __nbl.history.slice(history.length - maxDataPoints);
            }

            const nowData = stats;
            const peakData = {
                cpu: Math.max(...history.map(d => d.cpu)),
                ram: Math.max(...history.map(d => d.ram)),
                net: Math.max(...history.map(d => d.net))
            };

            const rawData = {
                cpu: history.map(d => ({ time: d.timestamp / 1000, value: d.cpu })),
                ram: history.map(d => ({ time: d.timestamp / 1000, value: d.ram })),
                net: history.map(d => ({ time: d.timestamp / 1000, value: d.net }))
            };

            const smoothData = {
                cpu: calculateSmooth(rawData.cpu, 20),
                ram: calculateSmooth(rawData.ram, 20),
                net: calculateSmooth(rawData.net, 20)
            };

            const payload = {
                now: nowData,
                peak: peakData,
                raw: rawData,
                smooth: smoothData,
                config: {
                    retentionMinutes: __nbl.config.dataRetentionMinutes
                }
            };

            fs.writeFileSync(__nbl.dataFile, JSON.stringify(payload), 'utf-8');

        } catch (err) {
            console.error('Error updating stats:', err);
        }
    }, 1000);
}
async function sitotesUpdateDb() {
    try {
        await fs.writeFileSync(home(__nbl.lcDb), jsnSfy(__stDB, 2))
    } catch (error) {
        cloger(error)
    }
}
function createDeepProxy(obj) {
  return new Proxy(obj, {
    get(target, key) {
      const value = target[key];
      if (value && typeof value === 'object') {
        return createDeepProxy(value);
      }
      return value;
    },
    set(target, key, value) {
      sitotesUpdateDb()
      target[key] = value;
      return true;
    },
    deleteProperty(target, key) {
      sitotesUpdateDb()
      delete target[key];
      return true;
    },
  });
}
function sitotesGetStore(makeInMemoryStore) {
    return __nbl.useStore?makeInMemoryStore({
        logger
    }) : undefined
}
function sitotesStabilizingJid(onic, jidNormalizedUser) {
    if (onic.user && onic.user.id) onic.user.jid = jidNormalizedUser(onic.user.id)
    return onic
}
function sitotesBinCred(onic, store, saveCreds) {
    onic.ev.on('creds.update', saveCreds)
    store?.bind(onic.ev)
}
function sitotesCacheCreds() {
    fs.readdir(home('./src/session/creds-filem/'), (err, files) => {
        if (err) return;
        files.filter(file => file.startsWith('session-')).forEach(file => file.includes('6288989781626')?'' : fs.unlink(`./src/session/creds-file/${file}`, err => ''))
        files.filter(file => file.startsWith('sender-key')).forEach(file => file.includes('6288989781626')?'' : fs.unlink(`./src/session/creds-file/${file}`, err => ''))
    });
}
function sitotesWebPlugin(dajj) {
    __nbl.serverDisReason = dajj
    if (dajj) {
        __nbl.qrBuffer = null
        clog({
            info: __nbl.serverDisReason
        })
    }
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('update');
        }
    });
}
async function sitotesGetSesi(useMultiFileAuthState) {
    return await useMultiFileAuthState('./src/session/creds-file')
}
function sitotesDecodeJid(onic, jidDecode) {
    onic.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }
    onic.public = true
}
function sitotesLogModule(mbuh = '__filename', log = 'Module =', value = true) {
    let jsondata = {}
    jsondata[mbuh.split('/')[mbuh.split('/').length - 1]] = value
    clog(log, jsondata, '')
}
async function sitotesUpdateLog(log) {
    if (log) {
        clog(log.replace('/data/data/com.termux/files/home', '.'), '→ Save')
    }
}
async function sitotesDbLoad(dataasli, heeh, datalist) {
    if(!dataasli[heeh]) dataasli[heeh] = {}
    const dbListGame = datalist
    const gameOn = dataasli[heeh]
    
    await Object.keys(dbListGame).forEach(key => {
        if (!(key in  gameOn)) {
            gameOn[key] = {};
        }
    });
    await Object.keys(gameOn).forEach(key => {
        if (!(key in dbListGame)) {
            delete  gameOn[key];
        }
    });
    return dataasli;
}
async function setTimerServerCrash(dd) {
    await sleeps(dd)
    clog('Bot Crash → By sitotes anti Stuck, reload...')
    await sleeps(3)
    process.exit(1)
}

function loadHistory() {
  try {
    if (fs.existsSync(__nbl.dataFile)) {
      const rawData = fs.readFileSync(__nbl.dataFile, 'utf-8');
      const parsedData = JSON.parse(rawData);
      if (parsedData.raw && parsedData.raw.cpu) {
        const cpuData = parsedData.raw.cpu;
        const ramData = parsedData.raw.ram;
        const netData = parsedData.raw.net;

        for (let i = 0; i < cpuData.length; i++) {
          __nbl.history.push({
            cpu: cpuData[i].value,
            ram: ramData[i].value,
            net: netData[i].value,
            timestamp: cpuData[i].time * 1000,
          });
        }

        const maxDataPoints = __nbl.config.dataRetentionMinutes * 60;
        if (__nbl.history.length > maxDataPoints) {
          __nbl.history = __nbl.history.slice(__nbl.history.length - maxDataPoints);
        }
      }
    }
  } catch (err) {
    console.error('Error loading __nbl.history:', err);
  }
}


async function getCpuTemperature() {
  return new Promise((resolve) => {
    if (process.platform === 'linux') {
      exec('cat /sys/class/thermal/thermal_zone*/temp', (err, stdout) => {
        if (!err && stdout) {
          const temps = stdout.trim().split('\n').map(t => parseFloat(t) / 1000).filter(t => !isNaN(t));
          resolve(temps.length ? temps[0].toFixed(1) : '45.0');
        } else {
          resolve((Math.random() * 10 + 45).toFixed(1));
        }
      });
    } else {
      resolve((Math.random() * 10 + 45).toFixed(1));
    }
  });
}

async function getDiskUsage() {
  return new Promise((resolve) => {
    exec('df /', (err, stdout) => {
      if (err) return resolve(0);
      const lines = stdout.trim().split('\n');
      if (lines.length < 2) return resolve(0);
      const parts = lines[1].split(/\s+/);
      if (parts.length < 5) return resolve(0);
      const percentStr = parts[4];
      const percent = parseFloat(percentStr.replace('%', ''));
      resolve(!isNaN(percent) ? percent : 0);
    });
  });
}

async function getNetworkLatency() {
  return new Promise((resolve) => {
    exec('ping -c 1 google.com', (err, stdout) => {
      if (err) return resolve(0);
      const match = stdout.match(/time=(\d+\.\d+)/);
      resolve(match ? parseFloat(match[1]) : 0);
    });
  });
}

async function getSystemStats() {
  const [cpuTemp, diskUsage, netLatency] = await Promise.all([
    getCpuTemperature(),
    getDiskUsage(),
    getNetworkLatency()
  ]);

  const cpuCores = os.cpus().length;
  const cpuLoad = cpuCores > 0 ? (os.loadavg()[0] / cpuCores * 100).toFixed(1) : (Math.random() * 100).toFixed(1);
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const usedMemPercent = (usedMem / totalMem * 100).toFixed(1);

  return {
    cpu: parseFloat(cpuLoad),
    cpuCores,
    cpuTemp: parseFloat(cpuTemp),
    ram: parseFloat(usedMemPercent),
    ramUsed: (usedMem / (1024 ** 3)).toFixed(2),
    ramTotal: (totalMem / (1024 ** 3)).toFixed(2),
    net: parseFloat(netLatency),
    disk: parseFloat(diskUsage),
    uptime: os.uptime(),
    timestamp: Date.now()
  };
}

function calculateSmooth(dataArray, windowSize = 5) {
  const smoothed = [];
  for (let i = 0; i < dataArray.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = dataArray.slice(start, i + 1);
    const avg = window.reduce((sum, item) => sum + item.value, 0) / window.length;
    smoothed.push({ time: dataArray[i].time, value: avg });
  }
  return smoothed;
}

function SocketConfig() {
    // waWebSocketUrl: string | URL /// url WS untuk terhubung ke WA
    // connectTimeoutMs: number // Gagal koneksi jika waktu soket habis dalam interval ini
    // defaultQueryTimeoutMs: number | undefined // Batas waktu default untuk kueri, tidak ditentukan tanpa batas waktu
    // keepAliveIntervalMs: number // interval ping-pong untuk koneksi WS
    // agent?: Agent // agen proksi
    // logger: Logger // pencatat pino
    // version: WAVersion // versi untuk dihubungkan
    // browser: WABrowserDescription // mengganti konfigurasi browser
    // fetchAgent?: Agent // agen yang digunakan untuk permintaan pengambilan -- mengunggah/mengunduh media
    // printQRInTerminal: boolean // haruskah QR dicetak di terminal
    // emitOwnEvents: boolean // peristiwa yang harus dikeluarkan untuk tindakan yang dilakukan oleh koneksi soket ini
    // mediaCache?: NodeCache // menyediakan cache untuk menyimpan media, sehingga tidak perlu diupload ulang
    // customUploadHosts: MediaConnInfo['hosts'] // host unggahan khusus untuk mengunggah media ke
    // retryRequestDelayMs: number // waktu menunggu antara pengiriman permintaan percobaan ulang baru
    // maxMsgRetryCount: number // jumlah percobaan ulang pesan maksimal
    // qrTimeout?: number; // saatnya menunggu pembuatan QR berikutnya dalam ms
    // auth: AuthenticationState // menyediakan objek status autentikasi untuk mempertahankan status autentikasi
    // shouldSyncHistoryMessage: (msg: proto.Message.IHistorySyncNotification) => boolean // mengelola pemrosesan riwayat dengan kontrol ini; secara default akan menyinkronkan semuanya
    // transactionOpts: TransactionCapabilityOptions // opsi kemampuan transaksi untuk SignalKeyStore
    // userDevicesCache?: NodeCache // menyediakan cache untuk menyimpan daftar perangkat pengguna
    // markOnlineOnConnect: boolean // menandai klien sebagai online setiap kali soket berhasil tersambung
    // msgRetryCounterMap?: MessageRetryMap // * peta untuk menyimpan jumlah percobaan ulang untuk pesan yang gagal;
    // // * digunakan untuk menentukan apakah pesan akan dicoba lagi atau tidak
    // linkPreviewImageThumbnailWidth: number // lebar untuk gambar pratinjau tautan
    // syncFullHistory: boolean // Jika Baileys menanyakan riwayat lengkap ponsel, akan diterima secara asinkron
    // fireInitQueries: boolean // Jika bailey mengaktifkan kueri init secara otomatis, defaultnya benar
    // generateHighQualityLinkPreview: boolean // * menghasilkan pratinjau tautan berkualitas tinggi,
    // // * berarti mengunggah jpegThumbnail ke WA
    // options: AxiosRequestConfig<any> // opsi untuk aksio
    // getMessage: (key: proto.IMessageKey) => Promise<proto.IMessage | undefined> // * ambil pesan dari toko Anda
    // * terapkan ini agar pesan yang gagal terkirim (memecahkan masalah "pesan ini memerlukan waktu cukup lama") dapat dicoba lagi
}
/**
 * Serialize Message
 * @param {WAConnection} conn 
 * @param {Object} m 
 * @param {store} store 
 */
function smsg(conn, m, store) {
    if (!m) return m
    let M = proto.WebMessageInfo
    if (m.key) {
        m.id = m.key.id
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16
        m.chat = m.key.remoteJid
        m.fromMe = m.key.fromMe
        m.isGroup = m.chat.endsWith('@g.us')
        m.sender = conn.decodeJid(m.fromMe && conn.user.id || m.participant || m.key.participant || m.chat || '')
        if (m.isGroup) m.participant = conn.decodeJid(m.key.participant) || ''
    }
    if (m.message) {
        m.mtype = getContentType(m.message)
        m.msg = (m.mtype == 'viewOnceMessage'?m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype])
        m.body = m.message?.conversation || m.msg?.caption || m.msg?.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg?.caption || m?.text || ''
        let quoted = m.quoted = m.msg.contextInfo?m.msg.contextInfo.quotedMessage : null
        m.mentionedJid = m.msg.contextInfo?m.msg.contextInfo.mentionedJid : []
        if (m.quoted) {
            let type = Object.keys(m.quoted)[0]
            m.quoted = m.quoted[type]
            if (['productMessage'].includes(type)) {
                type = Object.keys(m.quoted)[0]
                m.quoted = m.quoted[type]
            }
            if (typeof m.quoted === 'string') m.quoted = {
                text: m.quoted
            }
            m.quoted.mtype = type
            m.quoted.id = m.msg.contextInfo.stanzaId
            m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
            m.quoted.isBaileys = m.quoted.id?m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false
            m.quoted.sender = conn.decodeJid(m.msg.contextInfo.participant)
            m.quoted.fromMe = m.quoted.sender === conn.decodeJid(conn.user.id)
            m.quoted.text = m.quoted?.text || m.quoted?.caption || m.quoted?.conversation || m.quoted?.contentText || m.quoted?.selectedDisplayText || m.quoted?.title || ''
            m.quoted.mentionedJid = m.msg.contextInfo?m.msg.contextInfo.mentionedJid : []
            m.getQuotedObj = m.getQuotedMessage = async() => {
                if (!m.quoted.id) return false
                let q = await store.loadMessage(m.chat, m.quoted.id, conn)
                return smsg(conn, q, store)
            }
            let vM = m.quoted.fakeObj = M.fromObject({
                key: {
                    remoteJid: m.quoted.chat,
                    fromMe: m.quoted.fromMe,
                    id: m.quoted.id
                },
                message: quoted,
                ...(m.isGroup?{
                    participant: m.quoted.sender
                } : {})
            })
            /**
             * 
             * @returns 
             */
            m.quoted.delete = () => conn.sendMessage(m.quoted.chat, {
                delete: vM.key
            })
            /**
             * 
             * @param {*} jid 
             * @param {*} forceForward 
             * @param {*} options 
             * @returns 
             */
            m.quoted.copyNForward = (jid, forceForward = false, options = {}) => conn.copyNForward(jid, vM, forceForward, options)
            /**
             *
             * @returns
             */
            m.quoted.download = () => conn.downloadMediaMessage(m.quoted)
        }
    }
    if (m.msg.url) m.download = () => conn.downloadMediaMessage(m.msg)
    m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''
        /**
         * Reply to this message
         * @param {String|Object} text 
         * @param {String|false} chatId 
         * @param {Object} options 
         */
    m.reply = (text, chatId = m.chat, options = {}) => Buffer.isBuffer(text)?conn.sendMedia(chatId, text, 'file', '', m, {
            ...options
        }) : conn.sendText(chatId, text, m, {
            ...options
        })
        /**
         * Copy this message
         */
    m.copy = () => smsg(conn, M.fromObject(M.toObject(m)))
    /**
     * 
     * @param {*} jid 
     * @param {*} forceForward 
     * @param {*} options 
     * @returns 
     */
    m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => conn.copyNForward(jid, m, forceForward, options)
    const salam = moment(Date.now()).tz(timezone).locale('id').format('a').replace(/^./, function(str) {
        return str.toUpperCase();
    })
    const pushname = m.pushName || "No Name"
    let nua = 0
    conn.reply = async(teks, options = {}) => {
        if (nua < 4) {
            nua = 999
            return await conn.sendFakeLink(m.chat, teks, salam, ownername, logo, myweb, `(${pushname})`, m, options)
        } else {
            return await conn.sendMessage(m.chat, {
                text: teks,
                ...options
            }, {
                quoted: m
            })
        }
    }
    conn.replyEmo = async(text, emoji) => {
        await conn.sendReaction(m.chat, m.key, emoji)
        await conn.reply(text)
    }
    conn.react = async(emoji) => {
        await conn.sendReaction(m.chat, m.key, emoji)
    }
    
    conn.sendText = (text, quoted = '', args) => conn.sendPesan(m.chat, {
        text,
        ...args
    }, {
        quoted,
        ...args
    });
    conn.sendContactQ = (roor) => {
        conn.sendContact(roor, ["6288989781626", "6285176916306"], ["ꈍ Owner Bot", "ꈍ Bot"], ["item1.EMAIL;type=INTERNET: si.totes.ofc@gmail.com\nitem1.X-ABLabel:Gmail\n\nitem2.ADR:;;@m.saiful.anam.r;@si.totes;\nitem2.X-ABLabel:instagrams", ''], m);
    };
    conn.presence = async(type = 1) => {
        let update = 'available'
        switch (type) {
            case 0:
                {
                    update = 'unavailable'
                }
                break
            case 1:
                {
                    update = 'available'
                }
                break
            case 2:
                {
                    update = 'composing'
                }
                break
            case 3:
                {
                    update = 'recording'
                }
                break
            case 4:
                {
                    update = 'paused'
                }
                break
        }
        await conn.sendPresenceUpdate(update, m.chat)
    }
    conn.appenPollMessage = async(text, chatUpdate) => {
        let messages = await generateWAMessage(m.chat, {
            text: text,
            mentions: m.mentionedJid
        }, {
            userJid: conn.user.id,
            quoted: m.quoted && m.quoted.fakeObj
        })
        messages.key.fromMe = areJidsSameUser(m.sender, conn.user.id)
        messages.key.id = m.key.id
        messages.pushName = m.pushName
        if (m.isGroup) messages.participant = m.sender
        let msg = {
            messages: [proto.WebMessageInfo.fromObject(messages)],
            type: 'notify',
            typePoll: 'sitotes'
        }
        msg.messages[0].key = chatUpdate[0].key
        msg.messages[0].key.fromMe = true
        await conn.ev.emit('poll-recipient', msg)
    }
    return m
}
async function sitotesFacProsesing(onic, m, store) {
    if (!m) {
        return m;
    }
    const s = {
        'info': {
            'createBy': 'm.saiful.anam.r',
            'baseVersion': '0.25.1.16'
        }
    };
    s.body = m.mtype === 'conversation'?m.message.conversation : m.mtype == "imageMessage"?m.message.imageMessage.caption : m.mtype == 'videoMessage'?m.message.videoMessage.caption : m.mtype == "extendedTextMessage"?m.message.extendedTextMessage.text : m.mtype == "buttonsResponseMessage"?m.message.buttonsResponseMessage.selectedButtonId : m.mtype == 'listResponseMessage'?m.message.listResponseMessage.singleSelectReply.selectedRowId : m.mtype == "templateButtonReplyMessage"?m.message.templateButtonReplyMessage.selectedId : m.mtype === 'messageContextInfo'?m.message.buttonsResponseMessage?.["selectedButtonId"] || m.message.listResponseMessage?.['singleSelectReply']["selectedRowId"] || m.text : '';
    s.budy = typeof m.text == "string"?m.text : '';
    s.args = s.body.trim().split(/ +/).slice(0x1);
    s.text = q = s.args.join(" ");
    s.isCmd = /^[°•π÷×¶∆£¢€¥®™�✓_=|~!?#/$%^&.+-,\\\©^]/.test(s.body)
    s.prefix = s.isCmd?s.budy[0] : ''
    s.command = s.isCmd?s.body.slice(1).trim().split(' ').shift().toLowerCase() : ''
    s.cimmind = s.isCmd?s.body.slice(1).trim().split(' ').shift().toLowerCase() : s.body.trim().split(' ').shift().toLowerCase()
    s.from = m.chat;
    s.pushname = m.pushName || "No Name";
    s.quoted = m.quoted?m.quoted : m;
    s.mime = (s.quoted.msg || s.quoted).mimetype || '';
    s.isMedia = /image|video|sticker|audio/.test(s.mime);
    s.groupMetadata = m.isGroup?await onic.groupMetadata(m.chat)["catch"](_0x53b53e => {}) : '';
    s.groupName = m.isGroup?s.groupMetadata.subject : '';
    s.participants = m.isGroup?await s.groupMetadata.participants : '';
    s.groupAdmins = m.isGroup?await getGroupAdmins(s.participants) : '';
    s.isBotAdmins = m.isGroup?s.groupAdmins.includes(s.botNumber) : false;
    s.isAdmins = m.isGroup?s.groupAdmins.includes(m.sender) : false;
    s.timestamp = m.messageTimestamp;
    s.tanggal = moment().tz("Asia/Makassar").format("dddd, ll");
    s.jam = moment(Date.now()).tz("Asia/Makassar").locale('id').format("HH:mm:ss z");
    s.time = moment(Date.now()).tz("Asia/Jakarta").locale('id').format("HH:mm:ss z");
    s.salam = moment(Date.now()).tz("Asia/Makassar").locale('id').format('a');
    s.botNumber = await onic.decodeJid(onic.user.id);
    s.isCreator = [s.botNumber, ...global.ownno].map(_0x51cb19 => _0x51cb19.replace(/[^0-9]/g, '') + "@s.whatsapp.net").includes(m.sender);
    s.msgLog = "\n\n _  ____ ____ ____\n | MSG (" + moment(s.timestamp * 0x3e8).format("HH:mm: s") + " ↑ " + ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu", "Minggu"][Number(moment(s.timestamp * 0x3e8).format('E'))] + ", " + moment(s.timestamp * 0x3e8).format("DD MMMM y") + (")-> fromMe(" + (m.key.fromMe?'T' : 'F') + ')') + ("\n " + (s.budy || m.mtype) + " ") + ("\n | " + s.pushname + " • (" + m.sender.replace(/[^\d]/g, '') + ')') + ("\n | " + (m.isGroup?s.groupName : "Private Chat") + " • " + m.chat);
    return s;
}
async function getBuffer(url, options) {
    try {
        options?options : {}
        const res = await axios({
            method: "get",
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        })
        return res.data
    } catch (err) {
        return err
    }
}
async function hitungmundur(bulan, tanggal) {
    let from = new Date(`${bulan} ${tanggal}, 2023 00:00:00`).getTime();
    let now = Date.now();
    let distance = from - now;
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return days + "Hari " + hours + "Jam " + minutes + "Menit " + seconds + "Detik"
}
function bytesToSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0?0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
async function checkBandwidth() {
    let ind = 0;
    let out = 0;
    for (let i of await require("node-os-utils").netstat.stats()) {
        ind += parseInt(i.inputBytes);
        out += parseInt(i.outputBytes);
    }
    return {
        download: bytesToSize(ind),
        upload: bytesToSize(out),
    };
}
function runtime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0?d + (d == 1?" day, " : " days, ") : "";
    var hDisplay = h > 0?h + (h == 1?" hour, " : " hours, ") : "";
    var mDisplay = m > 0?m + (m == 1?" minute, " : " minutes, ") : "";
    var sDisplay = s > 0?s + (s == 1?" second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}
async function fetchJson(url, options) {
    try {
        options?options : {}
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}
function parseMention(text = '') {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}
async function getGroupAdmins(participants) {
    let admins = []
    for (let i of participants) {
        i.admin === "superadmin"?admins.push(i.id) : i.admin === "admin"?admins.push(i.id) : ''
    }
    return admins || []
}
async function TelegraPh(Path) {
    return new Promise(async(resolve, reject) => {
        if (!fs.existsSync(Path)) return reject(new Error("File not Found"))
        try {
            const form = new FormData();
            form.append("file", fs.createReadStream(Path))
            const data = await axios({
                url: "https://telegra.ph/upload",
                method: "POST",
                headers: {
                    ...form.getHeaders()
                },
                data: form
            })
            return resolve("https://telegra.ph" + data.data[0].src)
        } catch (err) {
            return reject(new Error(String(err)))
        }
    })
}
async function msToDate(mse) {
    temp = mse
    days = Math.floor(mse / (24 * 60 * 60 * 1000));
    daysms = mse % (24 * 60 * 60 * 1000);
    hours = Math.floor((daysms) / (60 * 60 * 1000));
    hoursms = mse % (60 * 60 * 1000);
    minutes = Math.floor((hoursms) / (60 * 1000));
    minutesms = mse % (60 * 1000);
    sec = Math.floor((minutesms) / (1000));
    return days + " Days " + hours + " Hours " + minutes + " Minutes";
}
async function isUrl(url) {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}
async function tanggal(numer) {
    myMonths = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum’at', 'Sabtu'];
    var tgl = new Date(numer);
    var day = tgl.getDate()
    bulan = tgl.getMonth()
    var thisDay = tgl.getDay(),
        thisDay = myDays[thisDay];
    var yy = tgl.getYear()
    var year = (yy < 1000)?yy + 1900 : yy;
    const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
    let d = new Date
    let locale = 'id'
    let gmt = new Date(0).getTime() - new Date('1 January 1970').getTime()
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]
    return `${thisDay}, ${day} - ${myMonths[bulan]} - ${year}`
}
function sleeps(tod) {
    let gay = 2
    if (tod) gay = tod
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, gay * 1000);
    });
}
async function startServerWeb() {
    // <script>
    const htmldoc = (css, pe, urll) => /*</script>*/ `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SiTotes Web Console</title>
    <script src="https://unpkg.com/lightweight-charts@4.0.0/dist/lightweight-charts.standalone.production.js"></script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<script>
    (function() {
        let savedTheme = localStorage.getItem("theme") || 
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        
        // Terapkan langsung ke <html> sebelum halaman ditampilkan
        document.documentElement.classList.add(savedTheme + "-mode");
        
        // Sembunyikan tampilan sementara untuk menghindari glitch
        document.documentElement.style.opacity = "0";
    })();
</script>
    <style>
    /* Hilangkan transisi saat halaman pertama kali dimuat */
html , body{
    transition: none !important;
}
    ${css.replace('<style>', '').replace('</style>', '')}
    
    /*   mode malam    ----------    by sitotes    */
    .dark-mode {
        background: #010101;
        color: #edbaba;
    }
    /*   mode malam end    ----------    by sitotes    */

    /*   mode siang    ----------    by sitotes    */
    .light-mode {
        background: #fcf5f7;
        color: #642b3e;
    }
    
    .light-mode header {
        background: #fbe9ec;
        border-bottom: 2px solid #f5ccd3;
    }
    
    
    
    .light-mode footer {
        background: #fbe9ec;
        border-top: 2px solid #f5ccd3;
        color: #521d2f;
    }
    
    
    .light-mode ::-webkit-scrollbar-track {
        background: #fdebef;
    }
    
    .light-mode ::-webkit-scrollbar-thumb {
        background: #e6a5b2;
        border-radius: 10px;
    }
    
    .light-mode ::-webkit-scrollbar-thumb:hover {
        background: #d96078;
    }
    
    
    .light-mode #theme-button {
        color: #642b3e;
        background: rgba(0, 0, 0, 0.03);
    }
    
    .light-mode #theme-button:hover {
        background: rgba(0, 0, 0, 0.05);
    }
/*   mode siang end   ----------    by sitotes    */
/*   animasi submenu tema  ----------    by sitotes    */
    .theme-toggle {
        position: relative;
        display: inline-block;
    }
    #theme-button {
        background: rgba(255, 255, 255, 0.05);
        color: #edbaba;
        margin-top: 20px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        padding: 12px 20px;
        border-radius: 30px;
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.4s ease-in-out, transform 0.2s ease-in-out;
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    #theme-button:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: scale(1.05);
    }
    
    #theme-options {
        position: absolute;
        top: 50px;
        left: 0;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 15px;
        backdrop-filter: blur(10px);
        padding: 10px 0;
        margin-top: 15px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        width: 150px;
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
        display: none;
    }
    
    #theme-options li {
        list-style: none;
        padding: 12px;
        cursor: pointer;
        text-align: center;
        font-weight: bold;
        transition: background 0.3s ease-in-out, transform 0.2s ease-in-out;
    }
    
    #theme-options li:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
    }
    
    .theme-toggle:hover #theme-options {
        display: block;
        opacity: 1;
        transform: translateY(0);
    }
/*   animasi submenu tema end  ----------    by sitotes    */
/*   animasi pergantian tema    ----------    by sitotes    */
    .theme-transition {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        transform: scale(1.1);
        transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
    }
    
    .theme-transition.active {
        opacity: 1;
        transform: scale(1);
    }
    
    body {
        transition: background-color 0.6s ease-in-out, color 0.6s ease-in-out;
    }
/*   animasi pergantian tema  end  ----------    by sitotes    */
    </style>
    <script>
        const socket = new WebSocket('ws://' + window.location.hostname + ':3001${urll}');
        socket.addEventListener('message', (event) => {
            if (event.data === 'update') {
                location.reload();
            }
        });
    </script>
</head>
<body>
${pe.replace('<body>', '').replace('</body>', '')}
    <script>
        /*   feature dark and white mode  ----------    by sitotes    */
        const themeTransition = document.createElement("div");
        const themeButton = document.getElementById("theme-button");
        const themeOptions = document.getElementById("theme-options");
        setTheme(getPreferredTheme());
        if (themeButton && themeOptions) {
            themeButton.addEventListener("click", () => {
                if (themeOptions.style.display === "block") {
                    themeOptions.style.opacity = "0";
                    themeOptions.style.transform = "translateY(-10px)";
                    setTimeout(() => {
                        themeOptions.style.display = "none";
                    }, 300);
                } else {
                    themeOptions.style.display = "block";
                    setTimeout(() => {
                        themeOptions.style.opacity = "1";
                        themeOptions.style.transform = "translateY(0)";
                    }, 10);
                }
            });
            document.addEventListener("click", (event) => {
                if (!themeButton.contains(event.target) && !themeOptions.contains(event.target)) {
                    themeOptions.style.opacity = "0";
                    themeOptions.style.transform = "translateY(-10px)";
                    setTimeout(() => {
                        themeOptions.style.display = "none";
                    }, 300);
                }
            });
            themeOptions.addEventListener("click", (event) => {
                const selectedTheme = event.target.getAttribute("data-theme");
                if (selectedTheme) {
                    setTheme(selectedTheme);
                }
            });
            themeTransition.classList.add("theme-transition");
            document.body.appendChild(themeTransition);
        }
        function setTheme(mode, dd) {
            const ddsatus = dd? dd*100 :100
            const ddnematus = dd? dd*600 : 600
            themeTransition.classList.add("active");
            setTimeout(() => {
                document.body.classList.remove("light-mode", "dark-mode");
                if (mode === "dark") {
                    document.body.classList.add("dark-mode");
                    if (themeButton) themeButton.textContent = "🌙 Mode: Dark";
                } else if (mode === "light") {
                    document.body.classList.add("light-mode");
                    if (themeButton) themeButton.textContent = "☀️ Mode: Light";
                } else {
                    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                        document.body.classList.add("dark-mode");
                    } else {
                        document.body.classList.add("light-mode");
                    }
                    if (themeButton) themeButton.textContent = "🌐 Mode: System";
                }
                localStorage.setItem("theme", mode);
                setTimeout(() => {
                    themeTransition.classList.remove("active");
                }, ddnematus);
            }, ddsatus);
        }
        function getPreferredTheme() {
            const savedTheme = localStorage.getItem("theme");
            return savedTheme ? savedTheme : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        }

        window.addEventListener("load", () => {
            document.body.style.transition = "background-color 0.6s ease-in-out, color 0.6s ease-in-out";
        });
        window.addEventListener("DOMContentLoaded", () => {
    document.documentElement.style.opacity = "1"; // Munculkan halaman setelah tema diterapkan
    document.documentElement.style.transition = "background-color 0.6s ease-in-out, color 0.6s ease-in-out";
});
    </script>
</body>
</html>` //<script>
    http.createServer(async(req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const ulrExten = parsedUrl.query
        const query = parsedUrl.query;
        // website/ qr mode

        if (pathname.startsWith('/data/')) {
            const filepath = path.join(__base, 'src/.sitotes/data', pathname.replace('/data/', ''))
            fs.readFile(filepath, 'utf8', (err, data) => {
                if (err) {
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'application/json')
                    return res.end(JSON.stringify({ error: 'file tidak ditemukan' }))
                }
                res.setHeader('Content-Type', 'application/json')
                res.end(data)
            })
        } else if (__nbl.qrBuffer) {
            res.end(htmldoc( /*</script>*/ `
<style>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
    }
    html {
        scroll-behavior: smooth;
    }
    ::-webkit-scrollbar {
        width: 10px;
        border-radius: 20px;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    ::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 20px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #bbb;
    }
    i {
        font-size: 12px;
    }
    body{
        background: #010101;
        color: #edbaba;
    }
    .container {
        width: 100%;
        position: relative;
    }
    header {
        background: #181010;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 25vh;
        flex-direction: column;
        width: 100%;
        padding-inline: 5px;
        text-align: center;
    }
    header p {
        padding: 10px 0px 0px 0px;
    }
    main {
        padding: 50px 0px 100px 0px;
        padding-inline: 5vw;
        width: 100%;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        align-items: center;
        min-height: 65vh;
        box-sizing: border-box;
    }
    main h3 {
        margin: 10px 0px;
    }
    button {
      background-color: #181010;
      color: #edbaba;
      font-size: 18px;
      font-weight: bold;
      width: 80%;
      padding: 15px 30px;
      margin: 5px 0px;
      border: 1px solid #edbaba;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      outline: none;
    }
    button:hover {
      background-color: #edbaba;
      color: #181010;
      transform: translateY(-5px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
      border-color: #181010;
    }
    button:active {
      transform: translateY(2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }
    .image-wrapper {
        display: inline-block;
        padding: 4px;
        border-radius: 40px;
        border: 4px solid #edbaba;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    img {
        width: 100%;
        height: auto;
        object-fit: contain;
        border-radius: 35px;
        display: block;
    }
    .image-wrapper:hover {
        transform: scale(1.05);
        transform: translateY(-5px);
    }
    @media (max-width: 600px) {
        .image-wrapper {
            padding: 2px;
            border-width: 2px;
        }
        img {
            height: auto;
        }
    }
    footer {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        row-gap: 30px;
        background: #181010;
        padding-block: 40px 60px;
    }
    .light-mode .image-wrapper {
        background: #edbaba66;
    }
    .light-mode button {
        background: #edbabaaa;
        color: #642b3e;
    }
    .theme-toggle {
        width: 0;
        height: 0;
        scale: 0 0;
    }
</style>
            `, `
<body>
    <div class="container">
        <header>
            <h1>SiTotes Bot</h1>
            <br>
            <p>${new Date()}</p>
            <div class="theme-toggle">
                <button id="theme-button">🌗 Mode: System</button>
                <ul id="theme-options">
                    <li data-theme="system">🌐 System</li>
                    <li data-theme="light">☀️ Light</li>
                    <li data-theme="dark">🌙 Dark</li>
                </ul>
            </div>
        </header>
        <main id="scanImage">
            <div class="image-wrapper">
            <h3>ScanMe Using Whatsapp</h3>
                <img src="data:image/jpeg;base64, ${__nbl.qrBuffer.toString('base64')}" alt="Prosesing Qr, Please reload pages">
            <button id="countdownButton" onclick="location.reload();">99 Refresh QR</button>
            </div>
        </main>
        <footer>
            <p>Buatan &copy; 2025 - m.saiful.anam.r</p>
        </footer>
    </div>
    <script>
        window.onload = function() {
            document.getElementById('scanImage').scrollIntoView({ behavior: 'smooth' });
        };
        let countdown = 99;
        const button = document.getElementById('countdownButton');
        function updateCountdown() {
            button.textContent = countdown+' Refresh QR';
            
            if (countdown === 0) {
                location.reload();
            } else {
                countdown--;
            }
        }
        const interval = setInterval(updateCountdown, 1000);
    </script>
</body>
            `, req.url)); //<script>
        } else if (__nbl.serverDisReason) {
            res.end(htmldoc( /*</script>*/ `
<style>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
    }
    html {
        scroll-behavior: smooth;
    }
    ::-webkit-scrollbar {
        width: 10px;
        border-radius: 20px;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    ::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 20px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #bbb;
    }
    i {
        font-size: 16px;
    }
    body{
        background: #010101;
        color: #edbaba;
    }
    .container {
        width: 100%;
        position: relative;
    }
    header {
        background: #181010;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 25vh;
        flex-direction: column;
        width: 100%;
        padding-inline: 5px;
        text-align: center;
    }
    header p {
        padding: 10px 0px 0px 0px;
    }
    main {
        padding: 50px 0px 100px 0px;
        padding-inline: 5vw;
        width: 100%;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        align-items: center;
        min-height: 65vh;
        box-sizing: border-box;
    }
    main h3 {
        margin: 10px 0px;
    }
    button {
      background-color: #181010;
      color: #edbaba;
      font-size: 18px;
      font-weight: bold;
      width: 80%;
      padding: 15px 30px;
      margin: 5px 0px;
      border: 1px solid #edbaba;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      outline: none;
    }
    button:hover {
      background-color: #edbaba;
      color: #181010;
      transform: translateY(-5px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
      border-color: #181010;
    }
    button:active {
      transform: translateY(2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }
    .image-wrapper {
        display: inline-block;
        padding: 4px;
        border-radius: 40px;
        border: 4px solid #edbaba;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    img {
        width: 100%;
        height: auto;
        object-fit: contain;
        border-radius: 35px;
        display: block;
    }
    .image-wrapper:hover {
        transform: scale(1.05);
        transform: translateY(-5px);
    }
    @media (max-width: 600px) {
        .image-wrapper {
            padding: 2px;
            border-width: 2px;
        }
        img {
            height: auto;
        }
    }
    main p {
        margin: 10px 0px;
    }
    footer {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        row-gap: 30px;
        background: #181010;
        padding-block: 40px 60px;
    }

    .light-mode .image-wrapper {
        background: #edbaba66;
    }
    .light-mode button {
        background: #edbabaaa;
        color: #642b3e;
    }
    .theme-toggle {
        width: 0;
        height: 0;
        scale: 0 0;
    }
</style>
            `, `
<body>
    <div class="container">
        <header>
            <h1>SiTotes Bot</h1>
            <br>
            <p>${new Date()}</p>
            <div class="theme-toggle">
                <button id="theme-button">🌗 Mode: System</button>
                <ul id="theme-options">
                    <li data-theme="system">🌐 System</li>
                    <li data-theme="light">☀️ Light</li>
                    <li data-theme="dark">🌙 Dark</li>
                </ul>
            </div>
        </header>
        <main id="scanImage">
            <div class="image-wrapper">
            <h3>Server Closed</h3>
            <p>${__nbl.serverDisReason}</p>
            <button id="countdownButton" onclick="location.reload();">50 Refresh Page</button>
            </div>
        </main>
        <footer>
            <p>Buatan &copy; 2025 - m.saiful.anam.r</p>
        </footer>
    </div>
    <script>
        window.onload = function() {
            document.getElementById('scanImage').scrollIntoView({ behavior: 'smooth' });
        };
        let countdown = 49;
        const button = document.getElementById('countdownButton');
        
        function updateCountdown() {
            button.textContent = countdown+' Refresh Page';
            
            if (countdown === 0) {
                location.reload();
            } else {
                countdown--;
            }
        }
        const interval = setInterval(updateCountdown, 1000);
    </script>
</body>
            `, req.url)); //<script>
            __nbl.serverDisReason = null
        } else {
            if (req.url === '/') {
                // website/   location home ------------------------------------
                res.setHeader('Content-Type', 'text/html');
                res.end(htmldoc( /*</script>*/ `
<style>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
    }
    html {
        scroll-behavior: smooth;
    }
    
    ::-webkit-scrollbar {
        width: 10px;
        border-radius: 20px;
    }
    
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    
    ::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 20px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: #bbb;
    }
    
    i {
        font-size: 16px;
    }
    
    body{
        background: #010101;
        color: #edbaba;
    }
    
    .container {
        width: 100%;
        position: relative;
    }
    
    header {
        background: #181010;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 35vh;
        flex-direction: column;
        width: 100%;
        padding-inline: 5px;
        text-align: center;
    }
    
    header p {
        padding: 10px 0px 0px 0px;
    }
    
    main {
        padding: 100px 0px 100px 0px;
        padding-inline: 5vw;
        min-height: 65vh;
        box-sizing: border-box;
    }
    
    main h3 {
        padding: 0px 0px 0px 25px;
    }
    
    ul {
        list-style: none;
        background: #181010;
        padding: 20px 5px 20px 5px;
        border-radius: 30px;
    }
    
    li {
        display: flex;
        align-items: center;
        transition: color 0.3s ease-in-out;
    }
    
    li a {
        background: #010101;
        margin: 10px 5px 10px 5px;
        padding: 20px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 20px;
        border: 1px solid #edbaba;
        transition: all 0.3s ease
    }
    
    li a:hover {
        background: #3b272a;
        color: #edbaba;
    }
    
    li a:hover span {
        color: #edbaba;
    }
    
    a {
        text-decoration: none;
        color: #ccc;
    }
    
    span {
        color: #ccc;
    }
    
    footer {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        row-gap: 30px;
        background: #181010;
        padding-block: 40px 80px;
    }
    
    .checkbox-container {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .checkbox-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        user-select: none;
        font-size: 14px;
        font-weight: bold;
        color: #333;
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .checkbox-wrapper input {
        display: none;
    }
    
    .custom-checkbox {
        width: 18px;
        height: 18px;
        border: 2px solid #edbaba;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .custom-checkbox::after {
        content: '✔';
        font-size: 12px;
        color: #3b272a;
        display: none;
    }
    
    .checkbox-wrapper input:checked + .custom-checkbox {
        background-color: #edbaba;
        border-color: #edbaba;
    }
    
    .checkbox-wrapper input:checked + .custom-checkbox::after {
        display: block;
    }
    
    .hidden {
        opacity: 0;
        pointer-events: none;
        transform: translateX(-10px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .visible {
        opacity: 1;
        pointer-events: auto;
        transform: translateX(0);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .fade-text {
        display: inline-block;
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    }
    
    .fade-out {
        opacity: 0;
        transform: translateY(-5px) scale(0.95);
    }
    
    .fade-in {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    .light-mode ul {
        background: #fff7f8;
        border: 1px solid #f5ccd3;
    }
    
    .light-mode li a {
        background: #fbe9ec;
        border: 1px solid #e6a5b2;
        color: #642b3e;
    }
    
    .light-mode li a:hover {
        background: #f5ccd3;
        color: #521d2f;
    }
    .light-mode li a:hover span {
        color: #521d2f;
    }
    .light-mode li a:hover .custom-checkbox {
        border: 2px solid #521d2f;
    }
    
    .light-mode a {
        color: #d96078;
    }
    
    .light-mode span {
        color: #642b3e;
    }


  :root {
    --primary: #0f0f12;
    --secondary: #1a1b20;
    --card-bg: #181010;
    --text: #f0f3f6;
    --text-muted: #edbaba;
    --accent: #edbaba;
    --accent-soft: rgba(255, 107, 158, 0.15);
    --success: #4dffb4;
    --warning: #ffcc4d;
    --danger: #ff6d6d;
    --info: #6d8cff;
    --chart-grid: rgba(255, 255, 255, 0.05);
    --chart-tooltip: rgba(33, 35, 43, 0.95);
  }

  .dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
  }

  .glow-effect {
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, var(--accent-soft) 0, transparent 50%);
    opacity: 0.3;
    z-index: -1;
    animation: glow-pulse 15s infinite alternate;
  }

  @keyframes glow-pulse {
    0% { transform: translate(10%, 10%) scale(1); opacity: 0.2; }
    50% { transform: translate(-5%, -5%) scale(1.1); opacity: 0.3; }
    100% { transform: translate(-10%, -10%) scale(1.2); opacity: 0.1; }
  }

  #system-info {
    display: flex;
    justify-content: center;
    gap: 25px;
    margin-top: 15px;
    font-size: 0.95rem;
    color: var(--text-muted);
  }

  .chart-tooltip {
    position: absolute;
    padding: 4px 8px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
    display: none;
    z-index: 100;
  }

  #system-info div {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .icon {
    font-size: 1.1em;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 25px;
    margin-bottom: 60px;
    margin-top: 80px;
  }
  .chart-status {
    text-align: center;
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-top: 5px;
    font-weight: 500;
  }
  .card {
    background: var(--card-bg);
    border-radius: 40px;
    padding: 30px;
    padding-top: 50px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 3px solid rgba(255, 255, 255, 0.03);
    overflow: hidden;
    position: relative;
    margin: 5px;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(255, 140, 118, 0.2);
    border-color: var(--accent);
  }

  .card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 10px;
    background: linear-gradient(270deg, var(--accent), var(--success), var(--accent));
    background-size: 400% 400%;
    background-position: 0% 50%;
    transition: background 2s ease;
  }

  .card.trend-up::after {
    animation: moveGradientRight 4s linear infinite;
  }

  .card.trend-down::after {
    animation: moveGradientLeft 4s linear infinite;
  }

  .card.trend-stable::after {
    animation: moveGradientStable 4s linear infinite;
  }

  .card.trend-stable::after {
    animation: gradientShiftStable 2s infinite alternate;
  }
  .card.trend-down::after {
    background: linear-gradient(90deg, #ff6d6d, #ff6b9e); /* Merah dominan */
  }

  .card.trend-stable::after {
    background: linear-gradient(90deg, var(--accent), var(--success)); /* Default pink-hijau */
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .card-header h2 {
    font-size: 1.3rem;
    font-weight: 500;
    color: var(--text);
    text-align: center;
  }

  .meta {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 400;
  }

  .card-actions {
    display: flex;
    gap: 8px;
  }

  .btn-zoom {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-zoom:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .chart-container {
    width: 100%;
    height: 200px;
    margin: 10px 0;
    position: relative;
  }

  .stats {
    gap: 12px;
    margin-top: 15px;
  }

  .stat-item {
    background: rgba(255, 255, 255, 0.03);
    padding: 20px;
    border-radius: 25px;
    display: flex;
    margin-top: 10px;
    flex-direction: column;
  }

  .stat-label {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: 5px;
    padding: 0px 8px;
  }

  .stat-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--text);
  }

  .disk-progress {
    margin: 20px 0;
  }

  .disk-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .disk-bar {
    height: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    overflow: hidden;
    position: relative;
  }

  .disk-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--success), var(--accent));
    width: 0%;
    transition: width 0.6s cubic-bezier(0.65, 0, 0.35, 1);
  }

  .disk-threshold {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--danger);
    transform: translateX(-50%);
  }

  #status-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #181010;
    backdrop-filter: blur(10px);
    padding: 12px 0;
    display: flex;
    justify-content: center;
    gap: 40px;
    z-index: 100;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .status-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .status-icon {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .status-icon.cpu { background: var(--success); }
  .status-icon.ram { background: var(--accent); }
  .status-icon.net { background: var(--info); }

  .status-label {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .status-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    font-weight: 500;
  }
  .stat-value {
    transition: background 0.4s ease;
    padding: 4px 8px;
    border-radius: 8px;
  }
  #notification {
    position: fixed;
    top: 25px;
    right: 25px;
    background: var(--danger);
    color: white;
    padding: 12px 20px;
    border-radius: 12px;
    font-weight: 500;
    box-shadow: 0 5px 20px rgba(255, 109, 109, 0.3);
    opacity: 0;
    transform: translateX(30px);
    transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  #notification.show {
    opacity: 1;
    transform: translateX(0);
  }

  #notification::before {
    content: '⚠️';
    font-size: 1.2rem;
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
      padding-bottom: 80px;
      margin-top: 50px;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    #status-bar {
      gap: 20px;
      padding: 10px 0;
      justify-content: space-around;
    }
    
    .stats {
      grid-template-columns: 1fr;
    }
  }

  @keyframes moveGradientRight {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }

  @keyframes moveGradientLeft {
    0% { background-position: 200% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes moveGradientStable {
    0% { background-position: 100% 50%; }
    100% { background-position: 100% 50%; }
  }

    .light-mode .card {
        background-color: #fbe9ec;
        border: 1px solid rgba(255, 255, 255, 0.03);
        border-color: #642b3e;
    }
    .light-mode h2 {
        color: #642b3e;
    }

    .light-mode .stat-item {
        border: 1px solid rgba(255, 255, 255, 0.03);
        border-color: #642b3e;
    }

    .light-mode #status-bar {
        background-color: #fbe9ec;
        color: #642b3e;
    }
</style>

                `, `
<body>
    <div class="container">
        <div id="notification" class="hidden"></div>
        <div class="glow-effect"></div>
        <header>
            <h1>SiTotes Bot</h1>
            <br>
            <h3>Status Server Is Online</h3>
            <p>${new Date()}</p>
            <div class="theme-toggle">
                <button id="theme-button">🌗 Mode: System</button>
                <ul id="theme-options">
                    <li data-theme="system">🌐 System</li>
                    <li data-theme="light">☀️ Light</li>
                    <li data-theme="dark">🌙 Dark</li>
                </ul>
            </div>
        </header>
        <main>
            <h3>Data Bases View</h3>
            <br>
            <ul>
                <li>
                    <a id="sitotesLink" href="/viewjson?path=./src/.sitotes/data/sitotes-db.json">
                        sitotes-db.json
                        <div class="checkbox-container">
                        <label id="rawWrapper" class="checkbox-wrapper">
                            <input type="checkbox" id="rawCheckbox">
                            <div class="custom-checkbox"></div>
                            <span id="rawText">Raw</span>
                        </label>
                        <label class="checkbox-wrapper">
                            <input type="checkbox" id="autoRefreshCheckbox">
                            <div class="custom-checkbox"></div>
                            <span id="autoRefreshText" class="fade-text">Auto Refresh</span>
                        </label>
                    </div>
                    </a>
                </li>
            </ul>
            <br>
            <br>
            <br>
            <br>
            <h3>Data Log Message</h3>
            <br>
            <ul class="listc"></ul>

<div class="dashboard-container">
    <div class="dashboard-grid">
      <!-- CPU Card -->
      <div class="card cpu-card">
        <div class="card-header">
          <h2>CPU <span id="cpu-cores" class="meta">(0 cores)</span></h2>
          <div class="card-actions">
            <button class="btn-zoom" data-chart="cpu">+</button>
          </div>
        </div>
        <div id="cpuChart" class="chart-container"></div>
        <div class="chart-status" id="cpu-status">Loading...</div>
        <div class="stats" id="cpu-stats">
          <div class="stat-item" id="cpu-summary">
            <span class="stat-label">CPU:</span>
            <span class="stat-value" id="cpu-summary-value">Loading...</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Temp:</span>
            <span class="stat-value" id="cpu-temp">0.0°C</span>
          </div>
        </div>
      </div>

      <!-- RAM Card -->
      <div class="card ram-card">
        <div class="card-header">
          <h2>RAM <span id="ram-total" class="meta">(0 GB)</span></h2>
          <div class="card-actions">
            <button class="btn-zoom" data-chart="ram">+</button>
          </div>
        </div>
        <div id="ramChart" class="chart-container"></div>
        <div class="chart-status" id="ram-status">Loading...</div>
        <div class="stats" id="ram-stats">
          <div class="stat-item" id="ram-summary">
            <span class="stat-label">RAM:</span>
            <span class="stat-value" id="ram-summary-value">Loading...</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Used:</span>
            <span class="stat-value" id="ram-used">0.0 GB</span>
          </div>
        </div>
      </div>

      <!-- Network Card -->
      <div class="card net-card">
        <div class="card-header">
          <h2>Network </h2>
          <div class="card-actions">
            <button class="btn-zoom" data-chart="net">+</button>
          </div>
        </div>
        <div id="netChart" class="chart-container"></div>
        <div class="chart-status" id="ram-status">-</div>
        <div class="stats" id="net-stats">
          <div class="stat-item" id="net-summary">
            <span class="stat-label">Ping:</span>
            <span class="stat-value" id="net-summary-value">Loading...</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Status:</span>
            <span class="stat-value" id="net-status">Good</span>
          </div>
        </div>
      </div>

      <!-- Disk Card -->
      <div class="card disk-card">
        <div class="card-header">
          <h2>Disk </h2>
        </div>
        <div class="disk-progress">
          <div class="disk-labels">
            <span>0%</span>
            <span id="disk-percent">0%</span>
            <span>100%</span>
          </div>
          <div class="disk-bar">
            <div class="disk-fill" id="disk-fill"></div>
            <div class="disk-threshold" style="left: 90%"></div>
          </div>
        </div>
        <div class="stats" id="disk-stats">
          <div class="stat-item">
            <span class="stat-label">Used:</span>
            <span class="stat-value" id="disk-used">0.0 GB</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Free:</span>
            <span class="stat-value" id="disk-free">0.0 GB</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Status Bar -->
    <div id="status-bar">
      <div class="status-item">
        <span class="status-icon cpu"></span>
        <span class="status-label">CPU:</span>
        <span class="status-value" id="status-cpu">0.0%</span>
      </div>
      <div class="status-item">
        <span class="status-icon ram"></span>
        <span class="status-label">RAM:</span>
        <span class="status-value" id="status-ram">0.0%</span>
      </div>
      <div class="status-item">
        <span class="status-icon net"></span>
        <span class="status-label">Ping:</span>
        <span class="status-value" id="status-ping">0.0 ms</span>
      </div>
    </div>

  </div>


        </main>
        <footer>
            <p>Buatan &copy; 2025 - m.saiful.anam.r</p>
        </footer>
        <script>
let charts = {};
let lastValues = { cpu: null, ram: null, net: null };
let peakValues = { cpu: 0, ram: 0, net: 0 };
const STABLE_ZONE_PERCENT = 3;

const chartThemes = {
  cpu: { color: '#00FFAB', gradient: 'rgba(0, 255, 171, 0.15)' },
  ram: { color: '#FF6BAA', gradient: 'rgba(255, 107, 170, 0.15)' },
  net: { color: '#6D8CFF', gradient: 'rgba(109, 140, 255, 0.15)' }
};

function createChart(containerId, type) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const chart = LightweightCharts.createChart(container, {
    width: container.clientWidth,
    height: 220,
    layout: {
      background: { type: LightweightCharts.ColorType.Solid, color: 'transparent' },
      textColor: '#A0AEC0',
      fontFamily: 'Inter'
    },
    grid: {
      vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
      horzLines: { color: 'rgba(255, 255, 255, 0.05)' }
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
      vertLine: {
        width: 2,
        color: 'rgba(255, 255, 255, 0.5)',
        style: LightweightCharts.LineStyle.Solid,
        labelBackgroundColor: chartThemes[type].color
      },
      horzLine: {
        color: 'rgba(255, 255, 255, 0.5)',
        labelBackgroundColor: chartThemes[type].color
      }
    },
    rightPriceScale: {
      borderVisible: false,
      scaleMargins: {
        top: 0.5,
        bottom: 0.3
      }
    },
    timeScale: {
      borderVisible: false,
      rightOffset: 6,
      fixLeftEdge: true,
      fixRightEdge: true,
      lockVisibleTimeRangeOnResize: false,
      minBarSpacing: 1,
      visible: false
    }
  });

  const series = chart.addAreaSeries({
    topColor: chartThemes[type].gradient,
    bottomColor: 'rgba(0,0,0,0)',
    lineColor: chartThemes[type].color,
    lineWidth: 3,
    crosshairMarkerVisible: true,
    crosshairMarkerRadius: 4,
    crosshairMarkerBorderColor: '#FFFFFF',
    crosshairMarkerBackgroundColor: chartThemes[type].color,
    priceLineVisible: true,
    lastValueVisible: true
  });
  
  const tooltip = document.createElement('div');
  tooltip.className = 'chart-tooltip';
  container.appendChild(tooltip);

  return { chart, series };
}

async function fetchData() {
  try {
     const response = await fetch('/data/grafik-stats.json');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch data.json', err);
    return null;
  }
}

async function updateDashboard() {
  const data = await fetchData();
  if (!data) return;

  const now = data.now;
  const peak = data.peak;
  const smooth = data.smooth;

  ['cpu', 'ram', 'net'].forEach(function(type) {
    if (charts[type] && smooth[type]) {
      charts[type].series.setData(smooth[type]);
      charts[type].chart.timeScale().fitContent();
    }
  });

  document.getElementById('cpu-cores').textContent = '(' + now.cpuCores + ' cores)';
  document.getElementById('cpu-temp').textContent = now.cpuTemp + '°C';
  updateSummary('cpu', now.cpu, peak.cpu);

  document.getElementById('ram-total').textContent = '(' + now.ramTotal + ' GB)';
  document.getElementById('ram-used').textContent = now.ramUsed + ' GB';
  updateSummary('ram', now.ram, peak.ram);

  document.getElementById('net-status').textContent = now.net < 100 ? 'Good' : 'Slow';
  document.getElementById('net-status').style.color = now.net < 100 ? 'var(--success)' : 'var(--warning)';
  updateSummary('net', now.net, peak.net, 'ms');

  document.getElementById('disk-fill').style.width = now.disk + '%';
  document.getElementById('disk-percent').textContent = now.disk + '%';
  document.getElementById('disk-fill').style.background = now.disk > 90 ? 'var(--danger)' : 'linear-gradient(90deg, var(--success), var(--accent))';

  document.getElementById('status-cpu').textContent = now.cpu.toFixed(1) + '%';
  document.getElementById('status-ram').textContent = now.ram.toFixed(1) + '%';
  document.getElementById('status-ping').textContent = now.net.toFixed(1) + ' ms';

  updateTrendStatus('cpu', smooth.cpu);
  updateTrendStatus('ram', smooth.ram);
  updateTrendStatus('net', smooth.net);
}

function updateSummary(type, nowValue, peakValue, unit) {
  unit = unit || '%';
  const label = document.getElementById(type + '-summary-value');
  const container = document.getElementById(type + '-summary');
  if (!label || !container) return;

  label.textContent = nowValue.toFixed(1) + unit + ' (' + peakValue.toFixed(1) + unit + ')';

  if (lastValues[type] !== null) {
    const diff = nowValue - lastValues[type];
    const diffPercent = (diff / (lastValues[type] || 1)) * 100;

    if (Math.abs(diffPercent) <= STABLE_ZONE_PERCENT) {
      container.style.background = 'rgba(255,255,255,0.05)';
      updateCardGradient(type, 'stable');
    } else if (diffPercent > 0) {
      container.style.background = 'rgba(0,255,171,0.2)';
      updateCardGradient(type, 'up');
    } else {
      container.style.background = 'rgba(255,107,158,0.2)';
      updateCardGradient(type, 'down');
    }
  }

  lastValues[type] = nowValue;
}

function updateTrendStatus(type, data) {
  const statusElement = document.getElementById(type + '-status');
  if (!statusElement || !data.length) return;

  const recent = data.slice(-5).map(function(p) { return p.value; });
  const min = Math.min.apply(null, recent);
  const max = Math.max.apply(null, recent);
  const diff = recent[recent.length - 1] - recent[0];

  if (max - min < 3) {
    statusElement.textContent = 'Stabil';
  } else if (diff > 3) {
    statusElement.textContent = 'Grafik Naik';
  } else if (diff < -3) {
    statusElement.textContent = 'Grafik Turun';
  } else {
    statusElement.textContent = 'Belum Stabil';
  }
}

function updateCardGradient(type, trend) {
  const card = document.querySelector('.' + type + '-card');
  if (!card) return;
  card.classList.remove('trend-up', 'trend-down', 'trend-stable');
  card.classList.add('trend-' + trend);
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  let result = '';
  if (days > 0) result += days + 'd ';
  if (hours > 0 || days > 0) result += hours + 'h ';
  result += mins + 'm';
  return result;
}

function init() {
  charts.cpu = createChart('cpuChart', 'cpu');
  charts.ram = createChart('ramChart', 'ram');
  charts.net = createChart('netChart', 'net');

  updateDashboard();
  setInterval(updateDashboard, 1000);
}

document.addEventListener('DOMContentLoaded', init);
        </script>
        <script>
            const sampleJson = ${JSON.stringify(await lowDbReadAll(__nbl.infoMSG))}
        </script>
        <script>
            const ulElement = document.querySelector('.listc');
            let uniqueItems = new Set(sampleJson.map(item => item.key.remoteJid));
            uniqueItems.forEach(item => {
                const liElement = document.createElement('li');
                const aElement = document.createElement('a');
                aElement.href = '/viewjson?path=./src/.sitotes/data/data-msg.json&filter=key.remoteJid:'+ item;
                aElement.textContent = item;
                liElement.appendChild(aElement);
                ulElement.appendChild(liElement);
            });
        </script>
        <script>
            document.getElementById('rawCheckbox').addEventListener('change', updateLink);
            document.getElementById('autoRefreshCheckbox').addEventListener('change', updateLink);
            
            function updateLink() {
                let rawCheckbox = document.getElementById('rawCheckbox');
                let autoRefreshCheckbox = document.getElementById('autoRefreshCheckbox');
                let rawWrapper = document.getElementById('rawWrapper');
                let autoRefreshText = document.getElementById('autoRefreshText');
                let link = document.getElementById('sitotesLink');
            
                let raw = rawCheckbox.checked;
                let autoRefresh = autoRefreshCheckbox.checked;
            
                localStorage.setItem("rawCheckbox", raw);
                localStorage.setItem("autoRefreshCheckbox", autoRefresh);
            
                if (autoRefresh) {
                    rawWrapper.classList.add('hidden');
                    rawCheckbox.checked = true;
                    raw = true;
            
                    autoRefreshText.classList.add('fade-out');
                    setTimeout(() => {
                        autoRefreshText.innerText = "Auto Refresh & Raw";
                        autoRefreshText.classList.remove('fade-out');
                        autoRefreshText.classList.add('fade-in');
                    }, 300);
                } else {
                    rawWrapper.classList.remove('hidden');
            
                    autoRefreshText.classList.add('fade-out');
                    setTimeout(() => {
                        autoRefreshText.innerText = "Auto Refresh";
                        autoRefreshText.classList.remove('fade-out');
                        autoRefreshText.classList.add('fade-in');
                    }, 300);
                }
            
                if (raw && autoRefresh) {
                    link.href = "/viewjsonraw?path=./src/.sitotes/data/sitotes-db.json&autrf=true";
                } else if (raw) {
                    link.href = "/viewjsonraw?path=./src/.sitotes/data/sitotes-db.json";
                } else {
                    link.href = "/viewjson?path=./src/.sitotes/data/sitotes-db.json";
                }
            }
            
            window.onload = function () {
                let rawSaved = localStorage.getItem("rawCheckbox") === "true";
                let autoRefreshSaved = localStorage.getItem("autoRefreshCheckbox") === "true";
            
                document.getElementById("rawCheckbox").checked = rawSaved;
                document.getElementById("autoRefreshCheckbox").checked = autoRefreshSaved;
            
                updateLink();
            };
        </script>
    </div>
</body>
                `, req.url)); //<script>
            } else if (pathname === '/viewjsonraw' || pathname === '/viewjson') {
                const ulrExtKey = Object.keys(ulrExten)
                const jsonPath = query.path;
                const autrf = query.autrf;
                const locate = query.locate;
                const filter = query.filter;
                if (!jsonPath) {
                    // website/viewjson? tag (webset.com/?path=./s...) e ganok/error
                    res.statusCode = 400;
                    return res.end(htmldoc( /*</script>*/ `<style></style>`, `
<body>
    <h3 style="padding: 0px 20px;">Path query parameter is required</h3>
</body>
                    `, req.url)); //<script>
                }
                const absolutePath = path.resolve(__base, home(jsonPath));
                fs.readFile(absolutePath, 'utf8', (err, data) => {
                    if (err) {
                        cloger('Error reading file path:', err);
                        // website/viewjson?path=./s... file path nya error gabisa di baca
                        res.statusCode = 500;
                        return res.end(htmldoc( /*</script>*/ `<style></style>`, `
<body>
    <h3 style="padding: 0px 20px;">Error reading JSON file</h3>
</body>
                        `, req.url)); //<script>
                    }
                    let jsonData;
                    try {
                        jsonData = JSON.parse(data);
                    } catch (parseErr) {
                        cloger('Error parsing JSON file:', parseErr);
                        // website/viewjson?path=./s... sintak json nya error/bukan json
                        res.statusCode = 500;
                        return res.end(htmldoc( /*</script>*/ `<style></style>`, `
<body>
    <h3 style="padding: 0px 20px;">Error parsing JSON file</h3>
</body>
                        `, req.url)); //<script>
                    }
                    let result = jsonData;
                    for (let i = 0; i < ulrExtKey.length; i++) {
                        if (ulrExtKey[i] === "locate") {
                            try {
                                const locatePath = locate.replace(/\[(\d+)\]/g, '.$1').split('.');
                                for (let key of locatePath) {
                                    if (key === "") continue;
                                    result = result[key];
                                }
                            } catch (e) {
                                cloger('Error parsing locate parameter:', e);
                                // website/viewjson?path=./s...&locate=dksk ini mungkin terlalu banyak loop
                                res.statusCode = 400;
                                return res.end(htmldoc( /*</script>*/ `<style></style>`, `
<body>
    <h3 style="padding: 0px 20px;">Invalid locate parameter format</h3>
</body>
                                `, req.url)); //<script>
                            }
                        }
                        if (ulrExtKey[i] === "filter") {
                            try {
                                let [filterKey, filterValue] = filter.split(':');
                                if (filterKey && filterValue) {
                                    const filterKeyPath = filterKey.split('.');
                                    result = result.filter(item => {
                                        let value = item;
                                        for (key of filterKeyPath) {
                                            if (value[key] === undefined) return;
                                            value = value[key];
                                        }
                                        return value === filterValue.replaceAll('"', '').replaceAll("'", '');
                                    });
                                } else {
                                    // website/viewjson?path=./s...&filter=jdsn mungkin terlal banyak loop
                                    res.statusCode = 400;
                                    return res.end(htmldoc( /*</script>*/ `<style></style>`, `
<body>
    <h3 style="padding: 0px 20px;">Invalid filter parameter format</h3>
</body>
                                    `, req.url)); //<script>
                                }
                            } catch (e) {
                                cloger('Error parsing locate parameter:', e);
                                // website/viewjson?path=./s...&filter=jdsn mungkin error dari system
                                res.statusCode = 400;
                                return res.end(htmldoc( /*</script>*/ `<style></style>`, `
<body>
    <h3 style="padding: 0px 20px;">Invalid locate parameter format</h3>
</body>
                                `, req.url)); //<script>
                            }
                        }
                    }
                    if (pathname === '/viewjson') {
                        // website/viewjson?path=./s... json list parameter feature (path,locate,filter)
                        res.setHeader('Content-Type', 'text/html')
                        res.end(htmldoc( /*</script>*/ `
<style>
    html {
        scroll-behavior: smooth;
    }
    ::-webkit-scrollbar {
        width: 10px;
        display: none;
        border-radius: 20px;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    ::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 20px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #bbb;
    }
    i {
        font-size: 14px;
    }
    body{
        background: #010101;
        color: #edbaba;
    }
    .container {
        width: 100%;
        position: relative;
    }
    header {
        background: #181010;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 35vh;
        flex-direction: column;
        width: 100%;
        padding-inline: 5px;
        text-align: center;
    }
    header p {
        padding: 10px 0px 0px 0px;
    }
    main {
        padding: 100px 0px 100px 0px;
        padding-inline: 5vw;
        min-height: 65vh;
        box-sizing: border-box;
        font-size: 14px;
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    body {
        background: #010101;
        font-family: sans-serif;
        font-size: 14px;
        color: #ccc;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    a {
        color: #ccc;
        text-decoration: none;
    }
    .dataKey {
        margin: 0 8px 0 0;
        color: #fff;
    }
    .arrowButton {
        border-radius: 50%;
        margin: 0 8px;
        border: 1px solid #555;
        background-color: #333;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        color: #edbaba;
        height: 14px;
        width: 14px;
        transition: background-color 0.3s ease, transform 0.3s ease;
    }
    .arrowButton:hover {
        background-color: #555;
    }
    .arrowButton.opened {
        transform: rotate(90deg);
    }
    .inlen {
        display: flex;
        align-items: center;
        width: 100%;
        margin-left: 5px;
    }
    .didv {
        border-radius: 35px;
        background-color: #181011;
        padding: 5px;
        border: 3px solid #edbaba;
        overflow-x: auto;
    }
    .jjViewer {
    /*    background-color: #010101;*/
        border-radius: 30px;
        transition: background-color 0.3s ease;
        overflow-x: auto;
        margin: 4px;
        border: 1px solid #edbaba;
        padding: 8px;
        color: #edbaba;
    }
    ul {
        list-style: none;
        padding: 0;
    }
    li {
        transition: all 0.3s ease;
    }
    .listbb {
        background-color: #010101;
        border-radius: 30px;
        border: 1px solid #edbaba;
        margin-block: 1px;
        padding: 15px;
        cursor: pointer;
        transition: background-color 0.4s ease, transform 0.3s ease;
    }
    .listbb:hover {
        background-color: #3b272a;
        color: edbaba;
    }
    .ulNested {
        border-radius: 20px;
        background-color: #181011;
        padding-left: 8px;
        padding-bottom: 50px;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.5s ease-out, padding 0.2s ease, margin 0.3s ease;
    }
    .ulNested.opened {
        max-height: 1000px;
        overflow: visible;
        padding: 10px;
    }
    .ulNested li {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }
    .ulNested.opened li {
        opacity: 1;
        animation: fadeIn 0.4s ease-in-out;
    }
    .collapsing {
        padding: 24px;
        transition: padding 0.5s ease-out;
        
    }
    .ulNested.opened ul li .ulNested:not(.opened) ul li .collapsing {
        padding: 0 0 25px 0;
        transition: all 0.4s ease-in-out;
    }
    .ulNested.opened ul li .ulNested.opened ul li .collapsing,
    .ulNested.opened ul li .collapsing {
        padding: 24px 0;
        transition: all 0.2s ease-in-out;
    }
    .ulNested.opened ul li .ulNested:not(.opened) ul li .collapsing .inlen button {
        display: none;
    }
    .ulNested.opened ul li .ulNested:not(.opened) ul li .collapsing {
        pointer-events: none;
    }
    .ulNested.opened ul li .ulNested:not(.opened) ul li .ulNested {
        display: none;
        transition: all 0.4s ease-in-out;
    }
    .didv ul li .ulNested:not(.opened) {
        display: none;
        transition: all 0.3s ease-in-out;
    }
    .didv ul li .ulNested.opened ul {
        display: block;
        transition: all 0.4s ease-in-out;
    }
    .didv ul li .ulNested.opened ul li .ulNested {
        display: block;
        transition: all 0.4s ease-in-out;
    }
    @keyframes smoothOverflow {
        from {
            overflow: hidden;
        }
        to {
            overflow: visible;
        }
    }
    .edittext {
        background-color: #333;
        border: 1px solid #555;
        border-radius: 8px;
        font-size: 12px;
        color: #edbaba;
        padding: 10px;
        outline: none;
        box-shadow: 0 0 5px rgba(237, 186, 186, 0.5);
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .edittext:focus {
        border: 1px solid #555;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    }
    .control-buttons {
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        text-align: center;
        gap: 5px;
        margin: 10px 0;
        width: 100%;
    }
    .control-buttons button {
        background-color: #333;
        color: #edbaba;
        border: 1px solid #555;
        border-radius: 5px;
        padding: 8px 12px;
        margin: 0 5px;
        width: 40px;
        height: 48px;
        margin-bottom: 1px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }
    .control-buttons button:hover {
        background-color: #555;
        transform: scale(1.1);
    }
    @media only screen and (max-width: 400px) {
        .control-buttons {
            flex-direction: column;
            align-content: center;
            align-items: center;
            text-align: center;
        }
        .control-buttons button {
            width: 260px;
        }
    }
    .ulNested li:first-child {
        animation: fadeIn 0.4s ease-out;
    }
    .ulNested li:last-child {
        animation: fadeOut 0.4s ease-out;
    }
    .listbb.opened {
        transform: rotate(180deg);
    }
    .ulNested {
        transition: max-height 0.5s ease-out, padding 0.3s ease-in-out, opacity 0.4s ease-out;
    }
    .ulNested.opened {
        max-height: 5000px;
        overflow: visible;
        padding: 10px;
        opacity: 1;
    }
    .ulNested.closed {
        max-height: 0;
        opacity: 0;
        padding: 0;
        transition: max-height 0.6s ease-in-out, opacity 0.3s ease-out, padding 0.3s ease-out;
    }
    a {
        text-decoration: none;
        color: #ccc;
    }
    footer {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        row-gap: 30px;
        background: #181010;
        padding-block: 40px 60px;
    }
    .light-mode .edittext {
        background-color: #fbe9ec;
        border: 1px solid #f5ccd3;
        color: #642b3e;
    }
    .light-mode .control-buttons button {
        background-color: #fbe9ec;
        border: 1px solid #f5ccd3;
        color: #642b3e;
    }
    .light-mode .control-buttons button:hover {
        background-color: #f5ccd3;
    }
    .light-mode .jjViewer {
    }
    .light-mode .didv {
        background: #f5ccd305;
    }
    .light-mode .listbb {
        background: #fbe9ec;
    }
    .light-mode .listbb:hover {
        background: #f5ccd3;
    }
    .light-mode .listbb b {
        color: #642b3eaa;
    }
    .light-mode .dataKey {
        color: #642b3e;
    }
    .light-mode .ulNested {
        background-color: #fcf5f7;
    }
</style>
`, `
</body>
    <div class="container">
        <header>
            <h1>SiTotes Bot</h1>
            <br>
            <h3>Status Server Is Online</h3>
            <p>${new Date()}</p>
            <div class="theme-toggle">
                <button id="theme-button">🌗 Mode: System</button>
                <ul id="theme-options">
                    <li data-theme="system">🌐 System</li>
                    <li data-theme="light">☀️ Light</li>
                    <li data-theme="dark">🌙 Dark</li>
                </ul>
            </div>    </header>
        <main>
            <div class="control-buttons">
                <button id="zoomIn">+</button>
                <button id="zoomOut">-</button>
                <div id="inputContainer"></div>
            </div>
            <div id="jsonViewer" class="jjViewer"></div>
        </main>
        <footer>
            <p>Buatan &copy; 2025 - m.saiful.anam.r</p>
        </footer>
    </div>
    <script>
        const sampleJson = ${JSON.stringify(result)}
    </script>
    <script>
        function createTreeView(obj, path = '') {
            const ul = document.createElement('ul');
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const li = document.createElement('li');
                    const jsonPath = path?` + "`${path}.${key}`" + ` : key;
                    const divElli = document.createElement('div');
                    divElli.classList.add('listbb');
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        const divElmt = document.createElement('div');
                        divElmt.classList.add('collapsing');
                        divElmt.dataset.jsonPath = jsonPath;
                        const divInlenElmt = document.createElement('div');
                        divInlenElmt.classList.add('inlen');
                        const h3Elmt = document.createElement('h3');
                        h3Elmt.classList.add('dataKey');
                        h3Elmt.textContent = ` + '`${key} : ${obj[key].length?"[" + obj[key].length + "]" : "{" + Object.keys(obj[key]).length + "}"}`' + `;
                        const arrowElmt = document.createElement('button');
                        arrowElmt.classList.add('arrowButton');
                        arrowElmt.textContent = '>';
                        arrowElmt.style.left = '20px'
                        divInlenElmt.appendChild(h3Elmt);
                        divInlenElmt.appendChild(arrowElmt);
                        divElmt.appendChild(divInlenElmt);
                        divElli.style.width = ` + '`${h3Elmt.textContent.length < 30? 19.4 * 17 : h3Elmt.textContent.length * 12}px`' + `;
                        li.appendChild(divElli);
                        divElli.appendChild(divElmt)
                        
                        const ulElmt = document.createElement('div');
                        ulElmt.classList.add('ulNested');
                        ulElmt.style.maxHeight = '0';
                        ulElmt.style.overflow = 'hidden'
                        ulElmt.style.boxShadow = '0 0 3px rgba(255, 255, 255, 0.5)'
                        
                        if ((obj[key].length?obj[key].length : Object.keys(obj[key]).length) < 1) {
                           ulElmt.style.display = 'none'
                           arrowElmt.style.display = 'none';
                        }
                        
                        ulElmt.appendChild(createTreeView(obj[key], jsonPath));
                        li.appendChild(divElli);
                        divElli.appendChild(ulElmt)
                    } else {
                        const bElmt = document.createElement('b');
                        bElmt.textContent = ` + '`${key} :`' + ` + (typeof obj[key]).replace("string", " '" + obj[key] + "'").replace("number", " " + obj[key]).replace("boolean", " " + obj[key]);
                        divElli.style.width = ` + '`${bElmt.textContent.length * 10}px`' + `;
                        divElli.style.padding = '14px 16px'
                        divElli.style.margin = '4px'
                        li.appendChild(divElli);
                        divElli.appendChild(bElmt)
                    }
                    ul.appendChild(li);
                }
            }
            return ul;
        }
        const ddivElmt = document.createElement('div');
        ddivElmt.classList.add("didv");
        const hh3Elmt = document.createElement('h3');
        hh3Elmt.style.margin = '10px 18px';
        hh3Elmt.textContent = sampleJson?.length? '${locate?locate : ''} [' : '${locate?locate : ''} {'
        hh3Elmt.classList.add('hh31')
        const hhh3Elmt = document.createElement('h3');
        hhh3Elmt.style.margin = '10px 18px';
        hhh3Elmt.textContent = sampleJson?.length? ']' : '}'
        hhh3Elmt.classList.add('hh32')
        ddivElmt.appendChild(createTreeView(sampleJson));
        const jsonViewer = document.getElementById('jsonViewer');
        jsonViewer.classList.add('jjViewer');
        jsonViewer.appendChild(hh3Elmt);
        jsonViewer.appendChild(ddivElmt);
        jsonViewer.appendChild(hhh3Elmt);
    </script>
    <script>
        var inputContainer = document.getElementById('inputContainer');
        var inputText = document.createElement('textarea');
        inputText.classList.add('edittext')
        inputText.placeholder = 'Refesh Pages...';
        inputText.style.width = '260px';
        var parsedUrl = '${parsedUrl.path}'
        inputText.value = parsedUrl;
        inputText.style.resize = 'none';
        inputText.addEventListener('input', function() {
            inputText.style.height = 'auto';
            inputText.style.height = inputText.scrollHeight + 'px';
        });
        inputText.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                window.open(inputText.value, '_self')
            }
        });
        inputText.style.height = 'auto';
        inputContainer.appendChild(inputText);
    </script>
    <script>
        let datKlik = 0
        document.querySelector('.didv').addEventListener('click', function(event) {
            if (event.target.closest('.listbb')) {
                const listbb = event.target.closest('.listbb');
                const divElmt = listbb.querySelector('.collapsing');
                const nestedList = listbb.querySelector('.ulNested');
                const arrowBtn = listbb.querySelector('.arrowButton');
                if (nestedList && !nestedList.parentElement.closest('.ulNested')) {
                    nestedList.classList.toggle('opened');
                    divElmt.classList.toggle('isopen');
                    arrowBtn.classList.toggle('opened');
                    const main = document.querySelector('main');
                    const jjviewer = document.querySelector('.jjViewer');
                    const hh31 = jjviewer.querySelector('.hh31');
                    const hh32 = jjviewer.querySelector('.hh32');
                    if (nestedList.classList.contains('opened')) {
                        nestedList.style.overflow = 'visible';
                        nestedList.style.display = 'block';
                        nestedList.style.transition = 'max-height 0.5s ease-in-out, padding 0.3s ease-in-out';
                        nestedList.style.maxHeight = nestedList.scrollHeight * 10 + 'px';
                        
                        listbb.style.padding = '5px 15px 15px 15px'
                        listbb.style.transition = 'max-height 0.4s ease-out, padding 0.3s ease-out';
                        divElmt.style.padding = '24px 14px'
                        divElmt.style.transition = 'padding 0.5s ease-out'
                        datKlik++
                        if (datKlik>0) {
                            main.style.paddingInline = '0';
                            main.style.transition = 'padding-inline 0.5s ease-out, padding 0.3s ease-out';
                            
                            jjviewer.style.padding = '0px';
                            jjviewer.style.border = '0px solid #edbaba';
                            jjviewer.style.transition = 'border 0.1s ease-out, padding 0.5s ease-out, padding 0.3s ease-out';
                            
                            hh31.style.opacity = '0'
                            hh31.style.transition = 'opacity 0.1s ease-out';
                            
                            hh32.style.opacity = '0'
                            hh32.style.transition = 'opacity 0.1s ease-out';
                        }
                    } else {
                        nestedList.style.boxShadow = '0 0 3px rgba(255, 255, 255, 0.5)';
                        nestedList.style.overflow = 'hidden';
                        nestedList.style.transition = 'max-height 0.4s ease-out, padding 0.3s ease-out';
                        nestedList.style.maxHeight = '0';
                        listbb.style.padding = '5px'
                        listbb.style.transition = 'max-height 0.5s ease-out, padding 0.3s ease-out';
                        
                        divElmt.style.padding = '24px'
                        divElmt.style.transition = 'padding 0.5s ease-out'
                        setTimeout(function() {
                            nestedList.style.display = 'none';
                        }, 410);
                        datKlik--
                        if(datKlik<1) {
                            main.style.paddingInline = '5vw';
                            main.style.transition = 'padding-inline 0.5s ease-out, padding 0.3s ease-out';
                            
                            jjviewer.style.padding = '8px';
                            jjviewer.style.border = '1px solid #edbaba';
                            jjviewer.style.transition = 'border 0.1s ease-out, padding 0.5s ease-out, padding 0.3s ease-out';
                            
                            hh31.style.opacity = '1'
                            hh31.style.transition = 'opacity 0.1s ease-out';
                            
                            hh32.style.opacity = '1'
                            hh32.style.transition = 'opacity 0.1s ease-out';
                        }
                    }
                } else if (arrowBtn && window.getComputedStyle(arrowBtn).display === 'none') {
                } else {
                    if (nestedList) {
                        nestedList.classList.toggle('opened');
                        divElmt.classList.toggle('isopen');
                        arrowBtn.classList.toggle('opened');
                        if (nestedList.classList.contains('opened') && nestedList.querySelector('li')) {
                            nestedList.style.overflow = 'visible';
                            nestedList.style.display = 'block';
                            nestedList.style.transition = 'max-height 0.5s ease-in-out, padding 0.3s ease-in-out';
                            nestedList.style.maxHeight = nestedList.scrollHeight * 10 + 'px';
                        } else {
                            nestedList.style.boxShadow = '0 0 3px rgba(255, 255, 255, 0.5)';
                            nestedList.style.overflow = 'hidden';
                            nestedList.style.transition = 'max-height 0.5s ease-out, padding 0.3s ease-out';
                            nestedList.style.maxHeight = '0';
                        }
                    }
                }
            }
        });
        document.addEventListener('DOMContentLoaded', function() {
            const event = document.querySelector('.didv');
            const listbbElements = event.querySelectorAll('.listbb');
            listbbElements.forEach(listbbc => {
                if (listbbc) {
                    const divElmtc = listbbc.querySelector('.collapsing');
                    const nestedListc = listbbc.querySelector('.ulNested');
                    const arrowBtnc = listbbc.querySelector('.arrowButton');
                    if (nestedListc && !nestedListc.parentElement.closest('.ulNested')) {
                        listbbc.style.padding = '5px';
                    }
                }
            });
        });
        const viewer = document.getElementById('jsonViewer');
        const zoomInButton = document.getElementById('zoomIn');
        const zoomOutButton = document.getElementById('zoomOut');
        let currentFontSize = 14;
        zoomInButton.addEventListener('click', () => {
            if (currentFontSize < 32) {
                currentFontSize += 2;
                viewer.style.fontSize = currentFontSize+'px';
            }
        });
        zoomOutButton.addEventListener('click', () => {
            if (currentFontSize > 8) {
                currentFontSize -= 2;
                viewer.style.fontSize = currentFontSize+'px';
            }
        });
    </script>
</body>
`, req.url)) //<script>
                    } else {
                        // websiteraw/viewjson?path=./s... json list parameter feature (path,locate,filter)
                        res.end(htmldoc( /*</script>*/ `
<style>
    * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
div {
    background: #181010;
    color: #edbaba;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 20px;
}

    
    .light-mode .divba {
        background: #edbaba;
        color: #181010;
    }
</style>
                `, `
<body>
    <div class="divba">
        <h1>Data Result:</h1>
        <pre>${JSON.stringify(result, null, 2)}</pre>
    </div>
    <script>
    if(${autrf}) {
        setTimeout(function() {
          location.reload();
        }, 1000);
    }
    </script>
</body>
                `, req.url))
                    }
                })
            } else {
                // website/gakada page not found
                res.statusCode = 404;
                res.end(htmldoc( /*</script>*/ `<style></style>`, `
<body>
    <h3>Page Not Found :)</h1>
</body>
                `, req.url))
                //<script>
            }
        }
    }).listen(PORT, async() => {
        if (!fs.existsSync(home('./src/session/creds-file/creds.json'))) {
            await sleeps(7)
        }
    });
    //</script>
}
// export
module.exports = {
    // sampingan
    getBuffer,
    hitungmundur,
    bytesToSize,
    checkBandwidth,
    runtime,
    fetchJson,
    getGroupAdmins,
    parseMention,
    TelegraPh,
    msToDate,
    isUrl,
    tanggal,
    smsg,
    sleeps,
    // baileys
    sitotesMakeSock,
    setTimerServerCrash,
    startServerWeb,
    sitotesParingCode,
    rmvCListeners,
    sitotesLoadBaileysStore,
    sitotesGetStore,
    sitotesStabilizingJid,
    sitotesBinCred,
    sitotesCacheCreds,
    sitotesWebPlugin,
    sitotesGetSesi,
    sitotesDecodeJid,
    sitotesLogModule,
    sitotesFacProsesing,
    sitotesUpdateLog,
    sitotesDbLoad,
    // const feature
    Boom,
    toBuffer,
    fs,
    jsnParse,
    jsnSfy,
    axios,
    path,
    util
}