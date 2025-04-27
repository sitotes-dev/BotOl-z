const home = (path) => __base + path

const fs = require('fs')

global.firtsChat = true
global.autoread = true
global.anticall = true
global.allowGrub = true

global.botdata = "BD_BotOl"
global.botname = "SiTotes-Md"
// global.ownername = 'Bot᭄ SiTotes ×፝֟͜×  |  v' + fs.readFileSync(home('./versi'), 'utf-8').trim()+'-dev' 
global.ownername = 'there is nothing about me'
global.myweb = "https://instagram.com/si.totes"
global.email = "si.totes.ofc@gmail.com"
global.negara = "Indonesia"
global.timezone = 'Asia/Jakarta' //  timezone wib

global.pairingNumber = ""
global.ownnochat = ["6288989781626", "62889897816262"]
global.ownno = "6288989781626"
global.ownnoplus = "+6288989781626"

global.logo = fs.readFileSync("./src/.sitotes/media/image/sitotes.jpg")

global.packname = '© SiTotes-Md'
global.author = 'Slebeww'

global.sessionName = 'session'

global.sp = '⭔'

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(`Update'${__filename}'`)
    delete require.cache[file]
    require(file)
})