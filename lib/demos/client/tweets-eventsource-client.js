var socket = new EventSource('http://localhost:{{ port }}/');

socket.onopen = function() {
    console.log('opened');
};