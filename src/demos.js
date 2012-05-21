// req: eve, bootstrap[addin#dropdown, addin#button], codemirror[mode#javascript, theme#monokai]

var editor,
    socket,
    demos = {};

function init() {
    socket = demos.socket = new WebSocket('ws://localhost:8000');
    socket.onopen = ready;
    
    socket.onmessage = function(evt) {
        // parse the data
        var data = JSON.parse(evt.data);
        
        // console.log(data);

        // map to an eve event
        eve.apply(eve, [data.msg, socket].concat(data.args));
    };
    
    editor = demos.editor = CodeMirror(document.getElementById('editor'), {
      value: "function myScript(){return 100;}\n",
      mode:  "javascript",
      lineNumbers: true
    });
    
    $(document.body).click(function(evt) {
        if (evt.target && evt.target.href) {
            var action = $(evt.target).data('action');

            if (action) {
                eve(action);
            }
        }
    });
}

eve.on('demo', function() {
    socket.send('use:' + eve.nt().split('.').slice(1).join('/'));
});

eve.on('run', function() {
    // remove any demo code scripts
    $('#demoCode').remove();
    
    // add a new demo code script
    var demoCode = document.createElement('script');
    demoCode.id = 'demoCode';
    demoCode.innerHTML = editor.getValue();
    $('body').append(demoCode);
});

eve.on('code', function(code) {
    editor.setValue(code);
});

eve.on('demos', function(demos) {
    $('#demos').html(demos.reduce(function(previous, current, index) {
        return previous + '<li><a href="#" data-action="demo.' + current + '">' + current + '</a></li>';
    }, ''));
});

eve.on('*', function() {
    console.log(eve.nt(), arguments);
});

function ready() {
    socket.send('demos?');
}

$(init);