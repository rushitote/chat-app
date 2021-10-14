import * as http from 'http'
import { Server, Socket } from 'socket.io'
import passport from 'passport'
import { sessionMiddleware } from '../server/index'
import postMessage from './postMessage'

export class SocketIO {
  public io: Server

  constructor(server: http.Server) {
    this.io = new Server(server)
    const wrap = middleware => (socket, next) =>
      middleware(socket.request, {}, next)

    this.io.use(wrap(sessionMiddleware))
    this.io.use(wrap(passport.initialize()))
    this.io.use(wrap(passport.session()))
    this.io.use((socket, next) => {
      const request: any = socket.request

      if (request.user) {
        next()
      } else {
        console.log('unauthorized: ' + socket.id)
        next(new Error('unauthorized'))
      }
    })
    this.connect()
  }

  public connect() {
    this.io.on('connection', (socket: Socket) => {
      // tslint:disable-next-line: no-console
      console.info(` connected : ${socket.id}`)
      this.handlers(socket)
    })
  }

  public handlers(socket: Socket) {
    socket.on('disconnect', () => {
      // tslint:disable-next-line: no-console
      console.info(`Socket disconnected : ${socket.id}`)
    })

    socket.on('joinRoom', msg => {
      const { roomId } = JSON.parse(msg)
      console.log('Socket:', socket.id, 'joined', roomId)
      socket.join(roomId)
    })

    socket.on('newMessage', msg => {
      const { roomId, content } = JSON.parse(msg)
      console.log('Socket:', socket.id, 'sent', content, 'in', roomId)
      const messageId = postMessage(socket.request, content, roomId)
      socket.broadcast.to(roomId).emit('newMessage', { messageId, roomId, content })
    })
  }
}
