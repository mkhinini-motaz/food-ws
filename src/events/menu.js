const redis = require('redis');

const redisPrefix = 'ghost_';

const registerMenuEvents = (socket) => {
    const redisClient = redis.createClient();

    socket.on('menu-connect', ({ shopId }) => {
console.log('menu-connect : shopId : ', shopId)
        const menuUpdateEvent     = redisPrefix + 'shop_' + shopId + '.menu_update';
        const orderUpdateEvent    = redisPrefix + 'shop_' + shopId + '.order_update';
        const menuLangUpdateEvent = redisPrefix + 'shop_' + shopId + '.menu_lang_update';

        socket.join(menuUpdateEvent);
        redisClient.subscribe(menuUpdateEvent);
        redisClient.subscribe(orderUpdateEvent);
        redisClient.subscribe(menuLangUpdateEvent);
        redisClient.on('message', (channel, payload) => {
console.log('menu update on msg', {menuUpdateEvent, channel, payload})
            if (channel === menuUpdateEvent) {
                socket.emit('menu_update', payload);
            }
            if (channel === menuLangUpdateEvent) {
                socket.emit('menu_lang_update', payload);
            }
            if (channel === orderUpdateEvent) {
                socket.emit('order_update', payload);
            }
        });
    });

    socket.on('disconnect', () => {
        redisClient.quit();
        console.log('Got disconnect ! : ');
    });
};

module.exports = { registerMenuEvents, };
