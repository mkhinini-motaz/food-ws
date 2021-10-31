const redis = require('redis');
const redisPrefix = 'ghost_';

export const registerShopEvents = (socket) => {
    const redisClient = redis.createClient();

    redisClient.subscribe('message');
    redisClient.on(redisPrefix + "message", (channel, message) => {
        console.log("mew message in queue ", message, " for channel : ", channel);
        socket.emit(channel, message);
    });

    socket.on('disconnect', () => {
        redisClient.quit();
        console.log('Got disconnect ! : ');
    });
};
