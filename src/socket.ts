import { Server as HTTPServer } from 'http';
import socketIO, { Server as SocketServer, Socket } from 'socket.io';
import passportSocketIo from 'passport.socketio';
import { IConfig } from './config';
import passport from 'passport';
import { Store } from 'express-session';
import cookieParser from 'cookie-parser';
import { User } from './users';

const actives = new Set();
export let io: SocketServer;

export function initializeSockets(config: IConfig, httpServer: HTTPServer, sessionStore: Store): SocketServer {
  const { session_cookie_name, session_secret } = config;
  io = socketIO(httpServer);
  io.use(
    passportSocketIo.authorize({
      key: session_cookie_name,
      secret: session_secret,
      store: sessionStore,
      passport: passport,
      cookieParser: cookieParser as any,
    }),
  );
  io.on('connection', (socket) => connect(socket));
  return io;
}

async function connect(socket: Socket): Promise<void> {
  actives.add(socket);

  const _id: string = (socket.request.user as any)._id;
  const user = await User.findById(_id);
  if (!user) throw Error('User not found');
  user.socket = socket.id;
  user.status = 'available';
  await user.save();

  console.log('=========================================== HERE');
  console.log(socket.request.user);
  socket.on('pping', (data) => {
    console.log('=========================================== IN HERE');
    console.log(data);
  });
  socket.on('disconnect', () => disconnect(socket));

  socket.on('call-request', (data) => forward(socket, _id, 'call-request', data));
  socket.on('call-left', (data) => forward(socket, _id, 'call-left', data));
  socket.on('call-accepted', (data) => forward(socket, _id, 'call-accepted', data));
  socket.on('call-established', (data) => forward(socket, _id, 'call-established', data));
  socket.on('call-ice-candidate', (data) => forward(socket, _id, 'call-ice-candidate', data));

  io.emit('user-update', user.getSafeProfile());
}

async function disconnect(socket: Socket): Promise<void> {
  console.log('=========================================== THERE');
  actives.delete(socket);
  // TODO

  const user = await User.findById((socket.request.user as any)._id);
  if (!user) throw Error('User not found');
  delete user.socket;
  user.status = 'offline';
  await user.save();

  io.emit('user-update', user.getSafeProfile());
}

async function forward(socket: Socket, emitter: string, event: string, data: any): Promise<void> {
  console.log(`Event forwarded: ${event}`);
  const { offer, answer, ...info } = data;
  console.log(info);
  const targetUser = await User.findById(data.target);
  if (!targetUser) {
    console.log('User not found');
    return;
  }
  const target = targetUser?.socket;
  if (!target) {
    console.log('User not online');
    return;
  }
  socket.to(target).emit(event, { ...data, emitter });
}
