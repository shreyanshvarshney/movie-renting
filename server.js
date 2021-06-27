const http = require("http");
const debug = require("debug")("app:server.js")
const app = require("./app");


const onListening = () => {
    debug("Listening on port: " + port);
};

const onError = (error) => {
    debug("Some error occured!")
};

const onUncaughtException = (error) => {
    debug("Got an Uncaught Exception!", error.message);
    process.exit(1);
};

const onUnhandledRejection = (error) => {
    debug("Got an Unhandled Promise Rejection!", error.message);
    process.exit(1);
};

const port = process.env.PORT || 3000;
app.set("port", port);

const server = http.createServer(app);
server.on("listening", onListening);
server.on("error", onError);
server.listen(port);
// app.listen(port, () => {
//     debug("Listening on port: " + port);
// });
process.on("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);
