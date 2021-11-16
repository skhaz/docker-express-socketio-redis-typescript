import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { createClient } from 'redis'

const app = express()

const server = http.createServer(app)

const io = new Server(server)

const redis = createClient({ url: process.env.REDIS_DSN })

io.on('connection', async (socket) => {
  io.emit('counter', await redis.incr('counter'))
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

server.listen(3000, async () => {
  await redis.connect()
})

process.on('SIGINT', async () => {
  await redis.disconnect()
  process.exit()
})
