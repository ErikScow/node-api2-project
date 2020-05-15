require('dotenv').config()

const express = require('express')
const routes = require('./routes/routes')

const server = express()

server.use(express.json())
server.use('/api/posts', routes)

const port = process.env.PORT

server.listen(port, () => console.log(`API running on port ${port}`))