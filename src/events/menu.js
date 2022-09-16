const redisPrefix = 'ghost_';

const registerMenuEvents = (socket, redisClient) => {
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
        });
    });
};

module.exports = { registerMenuEvents, };
