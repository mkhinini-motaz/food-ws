const redis = require('redis');

const redisPrefix = 'ghost_';

const registerMenuEvents = (socket) => {
    const redisClient = redis.createClient();

    socket.on('shop-user-connect', ({ shopId }) => {
        console.log('shop-user-connect : shopId : ', shopId)
        const orderUpdateEvent    = redisPrefix + 'shop_' + shopId + '.order_update';
        redisClient.subscribe(orderUpdateEvent);
        redisClient.on('message', (channel, payload) => {
            if (channel === orderUpdateEvent) {
                socket.emit('order_update', payload);
            }
console.log('order update on msg', {orderUpdateEvent, channel, payload})
        });

    });

    socket.on('menu-connect', ({ shopId }) => {
        const menuUpdateEvent     = redisPrefix + 'shop_' + shopId + '.menu_update';
        const menuLangUpdateEvent = redisPrefix + 'shop_' + shopId + '.menu_lang_update';

        socket.join(menuUpdateEvent);
        redisClient.subscribe(menuUpdateEvent);
        redisClient.subscribe(menuLangUpdateEvent);
        redisClient.on('message', (channel, payload) => {
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
