// req: keymaster, eve, bootstrap[addin#dropdown, addin#button], codemirror[mode#javascript, theme#monokai]

var $content,
    editorContainer,
    editor,
    socket,
    demoshell = {
        info: info,
        log: log
    };

function init() {
    socket = demoshell.socket = new WebSocket('ws://localhost:8000');
    socket.onopen = ready;
    
    socket.onmessage = mapMessageToEve;
    editor = demoshell.editor = CodeMirror(editorContainer = document.getElementById('editor'), {
        value: '',
        mode:  'javascript',
        readOnly: true,
        lineNumbers: true,
        keymap: {
            'esc': _reset,
            'ctrl+shift+.': _runDemo
        }
    });
    
    $(document.body).click(function(evt) {
        if (evt.target && evt.target.href) {
            var action = $(evt.target).data('action');

            if (action) {
                eve(action);
            }
        }
    });
    
    key('esc', _reset);
    key('ctrl+shift+.', _runDemo);
    key('ctrl+shift+,', _clearLog);
    
    // listen for message events
    window.onmessage = mapMessageToEve;
}

function mapMessageToEve(evt) {
    // parse the data
    var text = evt.data,
        lastChar = text.slice(-1);
        
    // if we have json data, then decode it
    if (lastChar === ']' || lastChar === '}') {
        var data = JSON.parse(text);

        // map to an eve event
        eve.apply(eve, [data.msg, socket].concat(data.args));
    }
    // otherwise, map the text to an event
    else {
        eve(text);
    }
}

function bsAlert(html, opts) {
    var classes = ['label'];
    
    // ensure we have opts
    opts = opts || {};
    opts.type = opts.type || 'info';
    classes[classes.length] = 'label-' + opts.type;
    
    eve('activate.log');
    $('#log').prepend('<li><span class="' + classes.join(' ') + '">' + new Date().getTime() + '</span><div class="log-content">' + html + '</div></li>');
}

function info(html) {
    bsAlert(html, { type: 'info' });
}

function log(text) {
    console.log(text);
}

eve.on('activate', function() {
    var eventName = eve.nt(),
        viewName = eventName.split('.')[1];
    
    $('*[data-view]').removeClass('active').each(function() {
        if ($(this).data('view') === viewName) {
            $(this).addClass('active');
        }
    });
    
    $('.demoview').removeClass('active').each(function() {
        if ($(this).find('a').data('action') === eventName) {
            $(this).addClass('active');
        }
    });
});

eve.on('demo', function() {
    var demoName = eve.nt().split('.').slice(1).join('/');
    
    // reset the contents of the content view
    $content = $content || ($content = $('*[data-view="content"]'));
    $content.html('');
    
    eve('activate.code');
    $('#demoname').html('<a href="#"><strong>' + demoName + '</strong></a>');
    socket.send('use:' + demoName);
    
    // focus this window
    window.focus();
});

eve.on('edit', function() {
    var navitem = $('a[data-action="edit"]').parent();
    
    navitem.toggleClass('active');
    editor.setOption('readOnly', !navitem.hasClass('active'));
});

eve.on('clear.log', _clearLog);
eve.on('run', _runDemo);

eve.on('content', function(content) {
    $content.html(content);
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
    // console.log(eve.nt(), arguments);
});

function ready() {
    socket.send('demos?');
}

function _clearLog() {
    $('#log').html('');
}

function _reset() {
    _clearLog();
    eve('activate.code');
}

function _runDemo() {
    // remove any demo code scripts
    $('#demoCode').remove();
    
    // if we have content for switch to that view
    if ($content.html()) {
        eve('activate.content');
    }

    // add a new demo code script
    var demoCode = document.createElement('script');
    demoCode.id = 'demoCode';
    demoCode.innerHTML = editor.getValue();
    $('body').append(demoCode);
}

$(init);