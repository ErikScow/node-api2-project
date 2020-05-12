const express = require('express')
const routes = require('./routes/routes')

const server = express()

server.use(express.json())
server.use('/api/posts', routes)

server.listen(5000, () => console.log('API running on port 5000'))