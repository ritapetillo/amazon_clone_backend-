const express = require('express')
const server = express()
const {
    catchAll,
    unauthorized,
    forbidden,
    notFound,
} = require("./errorHandler")
const PORT = process.env.PORT || 3001

// Error section (Damn that's fast)

server.use(unauthorized)
server.use(forbidden)
server.use(notFound)
server.use(catchAll)

server.listen(PORT, () => console.log('server is running on', PORT))