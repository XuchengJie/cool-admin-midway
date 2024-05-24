export const authMiddleware = (socket: any, next: any) => {
  if (isValid(socket.handshake.auth.token)) {
    next();
  } else {
    next(new Error('Authentication failed'));
  }
};

const isValid = (token: string): boolean => {
  return token == 'a3bzxrxmp4fi7vw5m19vxa458f1y4w28';
};
