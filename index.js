const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const { Server } = require("socket.io");

const io = new Server({ /* options */ });

const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

io.on("connection", (socket) => {
    console.log('new client ', socket);
});

io.listen(3000);
