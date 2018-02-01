'use strict';

class SocketService {
  constructor(deps) {
    const {
      WebSocket
    } = deps;
    this.socket = WebSocket;
    this.handlers = [];
    this.clients = new Set();
  }

  startServer({port}) {
    this.socketInstance = new this.socket.Server({port: port});
    console.log('Started socket server on port', port);
    this._handleClientConnections();
    this._checkLivenessOfClients();
  }

  _handleClientConnections() {
    this.socketInstance.on('connection', (client) => {
      this._registerClient(client);
    });
  }

  _registerClient(client) {
    client.isAlive = true;
    client.on('pong', this._heartbeat);
    client.on('message', (message) => {
      this._handleMessage(client, message);
    });
    client.on('close', () => {
      this.clients.delete(client);
    });
    console.log('New client!');
    this.clients.add(client);
  }

  _heartbeat() {
    this.isAlive = true;
  }

  _checkLivenessOfClients() {
    setTimeout(() => {
      this.socketInstance.clients.forEach((client) => {
        if (client.isAlive === false) {
          console.log(client, 'has disconnected');
          client.terminate();
          this.clients.delete(client);
        } else {
          client.isAlive = false;
          client.ping(() => {});
        }
      });
      this._checkLivenessOfClients();
    }, 2000);
  }

  _handleMessage(client, message) {
    message = JSON.parse(message);
    const handler = this.handlers.find(hand => hand.event === message.event);
    if (handler) {
      return handler.handler(client, message.payload);
    } else {
      console.log('Unhandled event received: %s', message);
    }
  }

  registerHandler({event, handler}) {
    const handlerObject = {event, handler};
    const handlerIndex = this.handlers.findIndex(hand => hand.event === event);
    if (handlerIndex < 0) {
      this.handlers.push(handlerObject);
    } else {
      this.handlers[handlerIndex].handler = handler;
    }
  }

  sendToClient(client, event, payload) {
    if (!this.socketInstance.clients.has(client)) {
      throw 'Client not connected';
    }
    client.send(JSON.stringify({event: event, payload: payload}));
  }

  broadcastMessage(event, payload) {
    this.socketInstance.clients.forEach((client) => {
      if (client.readyState === this.socket.OPEN) {
        client.send(JSON.stringify({event: event, payload: payload}));
      }
    });
  }
}

module.exports = SocketService;
