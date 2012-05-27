# HTML5 Messaging Demos

This is a self-contained project that is designed provide you a platform for experimenting with primarily WebSockets (as demonstrated at [Web Directions Code 2012](code12melb.webdirections.org)), although it could also be for demoing other concepts with server and client component.  Once you hack through the code you'll probably get an idea how.

## Installing

The demo console is powered using [Node.js](http://nodejs.org/) so you will need to have this installed on your machine to play around with it.  Once you have this installed you should be able to clone this repo:

    git clone git://github.com/DamonOehlman/messaging-demos.git

And once cloned, you will be able to install the required node modules to make the console work, by simply running `npm install` in the project directory:

    cd messaging-demos
    npm install

## Running the Demo

Once installed you can run the demo by simply running:

    node server.js

Once the demo is running, simply open `index.html` from the file system and you should be away.

## Contributing / Tweaking Demos

This project is designed to provide you with a console for experimenting with websockets and creating a variety of demos around the technology.  The demos are shown in the interface under the demos drop down menu, and are sourced from the `lib/demos` folder.

When a demo is selected, the console looks for client files (`.js` and `.html` files that might exist in the `lib/demos/client` folder).  If these exists the contents of the files are transmitted to the client (via the websocket connection) and executed in conjunction with the server files.

### Echo Demo

This is a simple demo that demonstrates how to use a web socket connection to send and receive data from both the server and the client.  

### Twitter Streaming Demo

This was the hero demo of the talk and shows how a websocket connection and the [Twitter Streaming API](https://dev.twitter.com/docs/streaming-apis/streams/public) can be used to return tweets matching your search criteria can be returned to the browser incredibly quickly.

## Updating the Demo Console

To be completed.