const http = require("http");
const ws = require("ws");

const port = process.env.PORT || 8000;

const pingTimeout = 30000;

/**
 * Map from documents  to a set of clients
 * @type {Map<string, Set<any>>}
 */
const allDocGroups = new Map();

const webSocketServer = new ws.Server({ noServer: true });

const server = http.createServer((request, response) => {
  response.writeHead(200, {
    "Content-Type": "text/html",
  });
  response.end();
});

const send = (conn, message) => {
  if (conn.readyState !== ws.CONNECTING && conn.readyState !== ws.OPEN) {
    conn.close();
  }
  try {
    conn.send(JSON.stringify(message));
  } catch (e) {
    conn.close();
  }
};

const onConnection = (conn) => {
  const joinedGroups = new Set();
  let isAlive = true;
  let pongReceived = true;

  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      conn.close();
      clearInterval(pingInterval);
    } else {
      pongReceived = false;
      try {
        conn.ping();
      } catch (e) {
        conn.close();
      }
    }
  }, pingTimeout);

  conn.on("pong", () => {
    pongReceived = true;
  });

  conn.on("message", (message) => {
    if (!isAlive) return;
    try {
      message = JSON.parse(message);
    } catch (e) {
      console.log("Invalid JSON");
    }
    if (message.type && isAlive) {
      switch (message.type) {
        case "subscribe":
          if (message.docs) {
            // the number of users connecting to the documents
            // TODO: multiple documents
            let usersCount = 0;
            message.docs.forEach((docName) => {
              if (!allDocGroups.has(docName)) {
                allDocGroups.set(docName, new Set());
              }
              const docGroup = allDocGroups.get(docName);
              docGroup.add(conn);
              joinedGroups.add(topicName);
              usersCount += docGroup.size;
            });
            message.numUsers = usersCount;
          }
          break;
        case "unsubscribe":
          if (message.docs) {
            message.docs.forEach((docName) => {
              const docGroup = allDocGroups.get(docName);
              if (docGroup) {
                docGroup.delete(conn);
              }
            });
          }
          break;
        case "publish":
          if (message.topic) {
            const receivers = allDocGroups.get(message.topic);
            if (receivers) {
              receivers.forEach((receiver) => {
                send(receiver, message);
              });
            }
          }
          break;
        case "ping":
          send(conn, { type: "pong" });
          break;
      }
    }
  });

  conn.on("close", () => {
    joinedGroups.forEach((docName) => {
      const docGroup = allDocGroups.get(docName);
      if (docGroup) {
        docGroup.delete(conn);
        if (docGroup.size == 0) allDocGroups.delete(docName);
      }
    });
    isAlive = false;
    joinedGroups.clear();
  });
};

webSocketServer.on("connection", onConnection);

server.on("upgrade", (request, socket, head) => {
  webSocketServer.handleUpgrade(request, socket, head, (ws) => {
    webSocketServer.emit("connection", ws, request);
  });
  // send back the number of users connecting to the document
  socket.end(`${request.numUsers} users are connecting to the document`);
});

server.listen(port);

console.log(`Signaling server running on localhost:${port}`);
