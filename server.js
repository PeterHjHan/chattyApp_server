// server.js
const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('uuid');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
   // Must change directory if not seen
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log(`${uuid()}: Client connected `);

  ws.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    const username = messageData.user;
    const message = messageData.message;

    var data = {
      id: uuid(),
      username: username,
      message : message
    }

    wss.clients.forEach(function each(client) {
      if (client !== ws) {
        client.send(JSON.stringify(data))
        console.log("THIS IS THE MESSAGE", JSON.stringify(data))
      }
    })

    // console.log(`User ${username} says ${message}`)
  }

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});