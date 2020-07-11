const express = require('express')

const postRouter = require('./routers/post-router')

const server = express()

server.use(express.json())

//server.use('/api/posts', postRouter)

server.listen(5000, () => {
    console.log(`API listening on port 5000`)
})
