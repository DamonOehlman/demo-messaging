var socket = new WebSocket('{{ wsurl }}');

socket.onopen = function() {
    socket.send('#wdc12');
};

socket.onmessage = function(evt) {
    var tweet = JSON.parse(evt.data);
    
    // log what we received from the server
    demoshell.info(tweet.user + ': ' + tweet.text);
};