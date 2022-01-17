const {Client} = require('pg')
const client = new Client({
    user: 'jsCode',
    password: 'Studentje1',
    host: 'steamproject.acnic.nl',
    database: 'SteamProject'
})
await client.connect()
.then(() => console.log('Connected Sucessfully'))
.then(() => client.query(''))
.then(results => console.table)
.catch(e => console.error(e))
.finally(() => client.end)

