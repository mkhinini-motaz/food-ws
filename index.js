const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const { Server } = require("socket.io");
const redis = require('redis');

const io = new Server({ /* options */ });

const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

io.on("connection", (socket) => {
    const redisClient = redis.createClient();
    redisClient.subscribe('message');

    redisClient.on("message", (channel, message) => {
        console.log("mew message in queue ", message, " for channel : ", channel);
        socket.emit(channel, message);
    });

    socket.on('disconnect', () => {
        redisClient.quit();
        console.log('Got disconnect ! : ');
    });

    console.log('new client ', socket.id);
});

io.listen(3000);
