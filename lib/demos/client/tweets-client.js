var socket = new WebSocket('{{ wsurl }}');

socket.onopen = function() {
    socket.send('wdc12');
};

socket.onmessage = function(evt) {
    var tweet = JSON.parse(evt.data),
        html = '<li><img src="' + tweet.avatar + '" />' + tweet.text + '</li>';
    
    $('#tweets').prepend(html);
};