var socket = new WebSocket('ws://localhost:8001');

socket.onopen = function() {
    console.log('ready');
};