// main/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { createObjectCsvWriter } = require('csv-writer');

const FILE_PATH = path.join(__dirname, '..', 'output.csv');

const csvWriter = createObjectCsvWriter({
  path: FILE_PATH,
  header: [
    { id: 'raw', title: 'Raw' },
    { id: 'type', title: 'Type' }
  ],
  append: true
});

function startServer(port = 5000) {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*', // Allow all origins
      methods: ['GET', 'POST']
    }
  });

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
  res.send('Server is running');
  });

  // Handle POST request for barcode data
  app.post('/data', (req, res) => {
    const { raw, type } = req.body;

    // Log the incoming data
    console.log('Received POST data:', req.body);

    if (!raw || !type) return res.status(400).send('Missing raw or type');

    const rowData = { raw, type };

    // Write to CSV and emit the scan event via socket.io
    csvWriter.writeRecords([rowData])
      .then(() => {
        console.log('Emitting scan data:', rowData);
        io.emit('scan', rowData); // Emit data to connected clients
        res.json({ status: 'Success', received: rowData });
      })
      .catch((err) => {
        console.error('CSV error:', err.message);
        res.status(500).send('CSV write error');
      });
  });


  server.listen(port, () => {
    console.log(`Server + Socket.io running at http://0.0.0.0:${port}`);
  });
}

module.exports = { startServer };
