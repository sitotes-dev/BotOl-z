// ---------------------------------------------------------------------------------------- //


// Base sitotes 2025


// base kali ini kodingan nya lebih simpel jadi enak di otak atik ya gays yak
// dan tentun nya stabil itu yang di utamakan 
// kalo kurang setabil ya wajar buat e ae cuma seminggu yakan


// kalo ada bug atau sering error gitu hubungi owner ku sitotes
// WA : +62 889 8978 1626     ||     IG : @si.totes / IG : @m.saiful.anam.r



// sitotes bahasa id version            : 0.25.1.30


// ---------------------------------------------------------------------------------------- //














//━━━[ Bahasa sehari hari ]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
exports.contoh = (prefix, command, style, style2 = "query") => {
    return `Contoh penggunaan: \n${prefix + command} ${style2}\n\n${prefix + command} ${style}`
}

exports.wait = () => {
    return `⏳ Mohon tunggu sebentar`
}

exports.ok = () => {
    return `✅ Done.`
}

exports.sending = (text) => {
    if (text) {
        return 'Sedang Mengirim → ✈️' + `\n${text}`
    } else {
        return 'Sedang Mengirim → ✈️'
    }
}

exports.doneErr = (text) => {
    if (text) {
        return `Convert Berhasil. Tetapi bot Gagal Mengirim ${text} ke anda. Coba ulang`
    } else {
        return `Convert Berhasil. Tetapi bot Gagal Mengirim File ke anda. Coba ulang`
    }
}

exports.waitt = () => {
    return '⏳'
}
exports.sendingg = () => {
    return '✈️'
}
exports.okk = () => {
    return `✅`
}


//━━━[ Kusus Grub ]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
exports.bukanadmin = () => {
    return 'Tolong Jadikan Admin grub untuk menggunakan fitur ini😉'
}

exports.adminOnly = () => {
    return 'Fitur ini khusus admin saja😉'
}

exports.targetkick = () => {
    return `Kirim nomer/tag/reply target yang ingin di kick !`
}

exports.nokickpemilik = () => {
    return `Kamu tidak dapat mengeluarkan SiTotes dan Pembuat grub`
}


exports.useradd = () => {
    return `Kirim nomer yang ingin di tambahkan !`
}


exports.userpromot = () => {
    return `Kirim nomer yang ingin di naikkan jabatannya / di jadikan admin !`
}

exports.userdemot = () => {
    return `Kirim nomer yang ingin di turunkan jabatannya / di jadikan member atau bukan admin !`
}