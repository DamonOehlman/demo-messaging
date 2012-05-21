var socket = new WebSocket('{{ wsurl }}');

socket.onopen = function() {
    socket.send('twitter');
};

socket.onmessage = function(evt) {
    var tweet = JSON.parse(evt.data);
    
    console.log(tweet);
    
    // log what we received from the server
    demoshell.info(tweet.text);
};