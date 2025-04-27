const {
    spawn
} = require('child_process')
const path = require('path')

function runSlebeww() {
    let args = [path.join(__dirname, 'onic.js'), ...process.argv.slice(2)]
    console.log([process.argv[0], ...args].join('\n'))
    let plg = spawn(process.argv[0], args, {
            stdio: ['inherit', 'inherit', 'inherit', 'ipc']
        })
        .on('message', data => {
            if (data == 'reset') {
                console.log('Memulai Ulang Bot...')
                plg.kill()
                runSlebeww()
                delete plg
            }
        })
        .on('exit', code => {
            console.error('Keluar dengan kode:', code)
            if (code == '.' || code == 1) setTimeout(runSlebeww, 0)
        })
}
runSlebeww()