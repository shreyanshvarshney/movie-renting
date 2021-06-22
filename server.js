const http = require("http");
const debug = require("debug")("app:startup")
const app = require("./app");


const onListening = () => {
    debug("Listening on port: " + port);
};

const onError = (error) => {
    debug("Some error occured!")
};

const port = process.env.PORT || 3000;
app.set("port", port);

const server = http.createServer(app);
server.on("listening", onListening);
server.on("error", onError);
server.listen(port);