const redis = require('redis');
const axios = require('axios').default;
const { BASE_SHOP_API_URL } = require('../constants/index');

const redisPrefix = 'ghost_';

const registerShopEvents = (socket) => {
    const redisClient = redis.createClient();

    socket.on('login', ({ authToken }) => {
        axios.get(BASE_SHOP_API_URL + '/profile', { headers: { Authorization: 'Bearer ' + authToken } })
            .then(response => {
                const authShopUser = response.data.data;
                socket.data.authShopUser = authShopUser;
                const orderUpdateServerEvent = redisPrefix + 'shop_' + authShopUser.shop_id + '.order_update';
                const orderUpdateUserEvent = orderUpdateServerEvent + '.shopUser_' + authShopUser.id;
                // TODO: some shopUser roles must listen to all shop events
                socket.join(orderUpdateUserEvent);

                redisClient.subscribe(orderUpdateServerEvent);
                redisClient.on(orderUpdateServerEvent, (channel, payload) => {
                    if (payload.shopUserId === authShopUser.id) {
                        socket.to(orderUpdateUserEvent).emit('order_update', message);
                    }
                });

            });
    });

    socket.on('disconnect', () => {
        redisClient.quit();
        console.log('Got disconnect ! : ');
    });
};

module.exports = {
    registerShopEvents
};
