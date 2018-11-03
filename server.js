const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('uuid');

const PORT = 3001;

const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });


function updateUserCount() {
  const userCount = {
   type: "userCount",
   userCount: wss.clients.size,
  }
  wss.clients.forEach(function each(client) {
   client.send(JSON.stringify(userCount))
 })
}

wss.on('connection', (ws) => {
  console.log(`${uuid()}: Client connected `);
  updateUserCount();
  
  ws.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    const username = messageData.user;
    const message = messageData.message;
    const type = messageData.type;

    var data = {
      id: uuid(),
      type: type,
      username: username,
      content : message,
    }

    switch(data.type){
      case "incomingNotification":
        data.type = "postNotification";
      break;
      case "incomingChat":
        data.type = "postChat";
      break;
    }
    wss.clients.forEach(function each(client) {
        client.send(JSON.stringify(data))
    })
  }

  ws.on('close', () => {
    updateUserCount()
    console.log('Client disconnected');
  })
});