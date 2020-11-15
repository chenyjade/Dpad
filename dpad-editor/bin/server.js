const http = require('http');
const fs = require('fs');
const ws = require('ws');

const port = process.env.PORT || 8000;

/**
 * Map from documents  to a set of clients
 * @type {Map<string, Set<any>>}
 */
const documents = new Map();

const wss = new ws.Server({ noServer: true });

const server = http.createServer((request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/html',
  });
  response.end();
});

const onConnection = (conn) => {
  const joinedGroups = new Set();
  let closed = false;

  conn.on('message', (message) => {
    if (closed) return;
    try {
      message = JSON.parse(message);
    } catch (e) {
      console.log('Invalid JSON');
    }
    if (message.type && !closed) {
      switch (message.type) {
        case 'join':
          (message.docs || []).forEach((docName) => {
            if (!documents.has(docName)) {
              documents.set(docName, new Set());
            }
            const docGroup = documents.get(docName);
            docGroup.add(conn);
            joinedGroups.add(topicName);
          });
          break;
        case 'leave':
          (message.docs || []).forEach((docName) => {
            const docGroup = documents.get(docName);
            if (docGroup) {
              docGroup.delete(conn);
            }
          });
          break;
        case 'publish':
          if (message.topic) {
            const receivers = documents.get(message.topic);
            if (receivers) {
              receivers.forEach((receiver) => {
                receiver.send(JSON.stringify(message));
              });
            }
          }
          break;
      }
    }
  });

  conn.on('close', () => {
    joinedGroups.forEach((docName) => {
      const docGroup = documents.get(docName);
      if (docGroup) {
        docGroup.delete(conn);
        if (docGroup.size == 0) documents.delete(docName);
      }
    });
    closed = true;
    joinedGroups.clear();
  });
};

wss.on('connection', onConnection);

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(port);

console.log(`Signaling server running on localhost:${port}`);
