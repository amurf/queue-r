const server = require("./src/server");

server().then((app) => app.listen(3000));
