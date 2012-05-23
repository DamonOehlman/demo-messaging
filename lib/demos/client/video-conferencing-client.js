var sourcevid = document.getElementById('sourcevid'),
    mediaOptsToTry = [
        'video',
        { video: true }
    ],
    getUserMedia = navigator.webkitGetUserMedia; // TODO: implement other browser methods
    
function gotStream(stream) {
    sourcevid.src = (window.webkitURL || window.URL).createObjectURL(stream);
}

function startVideo(optIndex) {
    // default the media type index to 0
    var mediaOpts = mediaOptsToTry[optIndex || 0];
    
    function tryNext() {
        // was unable to use the specified media type, abort
        console.log('getUserMedia initialization failed for media type: ', mediaOpts);
        
        // trying the next type
        startVideo((optIndex || 0) + 1);
    }
    
    // if the media type is defined, then get the user media
    if (mediaOpts) {
        console.log('trying media opts: ', mediaOpts);
        
        try {
            getUserMedia.call(navigator, mediaOpts, gotStream, tryNext);
        }
        catch (e) {
            // handle exceptions
            console.log('hit a problem with getting user media: ', e);
            startVideo((optIndex || 0) + 1);
        }
    }
    else {
        console.log('run out of things to try :/');
    }
}

function stopVideo() {
  var sourcevid = document.getElementById('sourcevid');
  sourcevid.src = "";
}

// attempt to start the video
startVideo();