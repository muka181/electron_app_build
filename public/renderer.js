const socket = io('http://127.0.0.1:5000'); // Update IP address as needed

// Log when the client connects to the server
socket.on('connect', () => {
  console.log('Connected to Socket.IO server:', socket.id);
});

// Listen for the 'scan' event and update the UI with the received scan data
socket.on('scan', (data) => {
  console.log('console scan data:', data); 
  console.log('Received scan data:', data); // Log the received data for debugging
  
  if (data && data.raw && data.type) { // Ensure the data is valid before using it
    const list = document.getElementById('scanned-list');
    const item = document.createElement('li');
    item.textContent = `${data.raw} (${data.type})`;
    list.appendChild(item);

    console.log('UI updated with scan data');
  } else {
    console.error('Received invalid scan data:', data);
  }
});

// Log any errors from the socket connection
socket.on('error', (error) => {
  console.error('Socket.io error:', error);
});

// Log when the client disconnects
socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server');
});
