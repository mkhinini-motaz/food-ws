const axios = require('axios').default;
const { BASE_SHOP_API_URL } = require('../constants/index');
const redisPrefix = 'ghost_';

const registerShopEvents = (socket, redisClient) => {
    socket.on('shop-user-login', async ({ authToken }) => {
        const response = await axios.get(BASE_SHOP_API_URL + '/profile', { headers: { Authorization: 'Bearer ' + authToken } });

        const authShopUser = response.data.data;
        socket.data.authShopUser = authShopUser;

console.log('shop-user-connect : auth user : ', authShopUser)
        const orderUpdateEvent = redisPrefix + 'shop_' + authShopUser.shop_id + '.order_update';
        redisClient.subscribe(orderUpdateEvent);
        redisClient.on('message', (channel, payload) => {
            if (channel === orderUpdateEvent) {
                socket.emit('order_update', payload);
            }
console.log('order update on msg', {orderUpdateEvent, channel, payload})
        });

    });
};

module.exports = { registerShopEvents, };
