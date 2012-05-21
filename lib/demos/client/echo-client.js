var socket = new WebSocket('{{ wsurl }}');

socket.onopen = function() {
    socket.send('hi');
};

socket.onmessage = function(evt) {
    // log what we received from the server
    demoshell.info(evt.data);
    
    // close the socket
    socket.close();
};