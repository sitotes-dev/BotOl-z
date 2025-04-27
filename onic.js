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














// gobal function
global.__base = __dirname + '/';
global.__stDB = {}

// sitotes base module dan module baileys wajib
const {
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
    sitotesDbLoad,

    Boom,
    toBuffer,
    fs,
    jsnParse,
    jsnSfy
} = require('./lib/sitotesFunc')

const {
    default: makeWASocket,
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
    proto,
    useMultiFileAuthState,
    WAMessageContent,
    WAMessageKey,
    jidNormalizedUser
} = require(sitotesBaileys)

const store = sitotesGetStore(makeInMemoryStore)

// pemanis webserver port bisa diganti kalo faham
__nbl.webPort = 3000

// structure data base
const structureDbSitotes = async () => {
    await sitotesDbLoad(__stDB, 'gameOn', {
        tictactoe: {},
        tebakgambar: {},
        caklontong: {},
        family100: {},
        asahotak: {},
        tebakkata: {},
        tekateki: {},
        tebakkimia: {},
        tebakkabupaten: {},
        siapakahaku: {},
        susunkata: {},
        tebakbendera: {},
        tebaklirik: {},
        tebaktebakan: {},
    })
}



// sitotes bot di hidupkan memulai proses ----------------------------------------------------------------------------- //
async function sitotesBoot() {
    
    
    // membaca session
    const {
        state,
        saveCreds
    } = await sitotesGetSesi(useMultiFileAuthState)
    const {
        version,
        isLatest
    } = await fetchLatestBaileysVersion()

    // memproses session dan membuat penghubung whatsapp
    const onic = await sitotesMakeSock(makeWASocket, version, isLatest, getMessage, state, makeCacheableSignalKeyStore)

    // fitur whatsapp ParingCode bisa kamu hapus jika tidak suka
    // _--------__--------__--------__--------__--------__--------__--------__--------__--------_ //
    await sitotesParingCode(onic)
    // _--------__--------__--------__--------__--------__--------__--------__--------__--------_ //

    // konversi user jid jadi jid normal agar setabil soale bawa an nya banyak jadi perlu di stabilakan
    await sitotesStabilizingJid(onic, jidNormalizedUser)

    // membaca data base
    await structureDbSitotes()



    // even ketika sesuatu terjadi pada koneksi bot entah itu terhubung atau gagal terhubung
    onic.ev.on('connection.update', async (update) => {
        const {
            connection,
            lastDisconnect,
            qr
        } = update

        // jika kamu pakai qr akan menampilkan nya pada web
        if (!__nbl.usePairingCode && qr) {
            try {
                clog(__dbl(1), __nbl.qrBuffer? ' • QR baru saja di perbarui':'Buka ipPort diatas di browser untuk mendapatkan QR')
                __nbl.qrBuffer = await toBuffer(qr)
                sitotesWebPlugin()
            } catch (err) {
                cloger('Error updating QR:', err);
            }
        }



        // ini ivent jika koneksi bot mati
        if (connection === 'close') {
            __nbl.ttlerr++
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            cloger("{ '"+reason+"' }")
            if (reason === DisconnectReason.badSession) {
                sitotesWebPlugin(`File Sesi Buruk, Harap Hapus Sesi dan Pindai Lagi`)
            } else if (reason === DisconnectReason.connectionClosed) {
                sitotesWebPlugin("Koneksi ditutup, menghubungkan kembali....")
            } else if (reason === DisconnectReason.connectionLost) {
                sitotesWebPlugin("Koneksi Hilang dari Server, menyambungkan kembali...")
            } else if (reason === DisconnectReason.connectionReplaced) {
                sitotesWebPlugin("Koneksi Diganti, Sesi Baru Lain Dibuka, menghubungkan kembali...")
            } else if (reason === DisconnectReason.loggedOut) {
                sitotesWebPlugin(`Perangkat Keluar, Harap Pindai Lagi Dan Jalankan.`)
                onic.logout()
            } else if (reason === DisconnectReason.restartRequired) {
                sitotesWebPlugin("Restart Diperlukan, Restart...")
            } else if (reason === DisconnectReason.timedOut) {
                sitotesWebPlugin("Koneksi Habis, Menghubungkan...")
            } else onic.end(`Alasan Putus Tidak Diketahui: ${reason}|${connection}`)
            
            setTimeout(sitotesBoot, 10000)

            // ivent agar tidak loop terus menerus agar wa tidak di banned ketika gagal terhubung 3 kali server langsung crash
            if (__nbl.ttlerr > 3) {
                sitotesWebPlugin('Crash by → Connection Loop')
                throw new Error('Bot Crash → By sitotes anti loop')
            }
        }



        // ini ivent jika koneksi bot hidup
        if (update.connection == "open" || update.receivedPendingNotifications == "true") {
            await store?.chats.all()
            __nbl.qrBuffer = null;
            sitotesWebPlugin()
            clog(`${__dbl()}Menghubungkan Ke whatsapp =`, jsnParse(jsnSfy(onic.user, 2)), "\n")

            if (update.receivedPendingNotifications && !onic.authState.creds?.myAppStateKeyId) {
                onic.ev.flush()
            }
        }

        // ini ivent ketika bot hidup dan dapat  digunakan ivent ini akan berkerja
        if (update.receivedPendingNotifications) {

            clog('Terhubung = ', jsnParse(jsnSfy({
                account: onic.user.jid.replace('@s.whatsapp.net', ' • ') + onic.user.name,
                receivedPendingNotifications: true
            }, 2)), __dbl())
        }
    })



    // function agar session kamu auto ke update ini wajib kalo bisa jangan di hapus
    await sitotesBinCred(onic, store, saveCreds)

    setInterval(async () => {
        if (onic?.user) {
            try {
                if (onic.state?.connection === "open") await onic.sendPresenceUpdate('available')
            } catch(error) {
                if (error?.output?.statusCode === 428) setTimeout(sitotesBoot, 5000);
                cloger('error Updating Connection:', error)
            }
        }
    }, 5 * 60000)


    // untuk menjalankan file /src/onic-notif agar bot kamu dapat menerima notifikasi
    require('./src/onic-notif')(onic, store, state, saveCreds, version, isLatest)
    nocache('./src/onic-notif', async module => {

        rmvCListeners(onic, 'messages.upsert')
        rmvCListeners(onic, 'messages.update')
        rmvCListeners(onic, 'poll-recipient')
        rmvCListeners(onic, 'schedule-trigger')

        require(module)(onic, store, state, saveCreds, version, isLatest)
        clog(` "${module}" Telah diupdate!`)
    })





    // ini lanjutan ketika ada file dengan path yang di stel maka ketika file itu di edit maka server akan restart
    // _--------__--------__--------__--------__--------__--------__--------__--------__--------_ //
    require('./src/onic-func')(onic, store)
    nocache('./src/onic-func', module => {
        require(module)(onic, store)
        clog(` "${module}" Telah diupdate!`)
    })
    // _--------__--------__--------__--------__--------__--------__--------__--------__--------_ //





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
}








startServerWeb()
sitotesLoadBaileysStore(store)
sitotesBoot()
sitotesCacheCreds()
