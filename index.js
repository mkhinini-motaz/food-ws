require('dotenv').config();
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const { Server } = require("socket.io");
const redis = require('redis');

const { registerShopEvents } = require("./src/events/shop");
const { registerMenuEvents } = require("./src/events/menu");

const io = new Server({ /* options */ });

const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

io.on("connection", (socket) => {
    const redisClient = redis.createClient();
    registerShopEvents(socket, redisClient);
    registerMenuEvents(socket, redisClient);

    socket.on('disconnect', () => {
        redisClient.quit();
        console.log('Shop got disconnect ! : ');
    });
    console.log('new client ', socket.id);
});

io.listen(3000);
