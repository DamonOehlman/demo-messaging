// req: eve, bootstrap[addin#dropdown, addin#button], codemirror[mode#javascript, theme#monokai]

var editorContainer,
    editor,
    socket,
    demoshell = {
        info: info,
        log: log
    };

function init() {
    socket = demoshell.socket = new WebSocket('ws://localhost:8000');
    socket.onopen = ready;
    
    socket.onmessage = function(evt) {
        // parse the data
        var data = JSON.parse(evt.data);
        
        // console.log(data);

        // map to an eve event
        eve.apply(eve, [data.msg, socket].concat(data.args));
    };
    
    editor = demoshell.editor = CodeMirror(editorContainer = document.getElementById('editor'), {
        value: '',
        mode:  'javascript',
        readOnly: true,
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

function bsAlert(html, opts) {
    var classes = ['label'];
    
    // ensure we have opts
    opts = opts || {};
    opts.type = opts.type || 'info';
    classes[classes.length] = 'label-' + opts.type;
    
    $('#log').prepend('<li><span class="' + classes.join(' ') + '">' + new Date().getTime() + '</span><div class="log-content">' + html + '</div></li>');
}

function info(html) {
    bsAlert(html, { type: 'info' });
}

function log(text) {
    console.log(text);
}

eve.on('demo', function() {
    var demoName = eve.nt().split('.').slice(1).join('/');
    
    $('a.brand').html('HTML5 Messaging Demos: ' + demoName);
    socket.send('use:' + demoName);
});

eve.on('edit', function() {
    var navitem = $('a[data-action="edit"]').parent();
    
    navitem.toggleClass('active');
    editor.setOption('readOnly', !navitem.hasClass('active'));
});

eve.on('clear.log', function() {
    $('#log').html('');
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
    
    if (demos.length > 0) {
        eve('demo.' + demos[0]);
    }
});

eve.on('*', function() {
    console.log(eve.nt(), arguments);
});

function ready() {
    socket.send('demos?');
}

$(init);