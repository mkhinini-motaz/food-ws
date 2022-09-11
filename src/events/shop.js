const axios = require('axios').default;
const { BASE_SHOP_API_URL } = require('../constants/index');
const redisPrefix = 'ghost_';

const registerShopEvents = (socket, redisClient) => {
    socket.on('login', async ({ authToken }) => {
        const response = await axios.get(BASE_SHOP_API_URL + '/profile', { headers: { Authorization: 'Bearer ' + authToken } });
        const authShopUser = response.data.data;
        socket.data.authShopUser = authShopUser;

        const orderUpdateServerEvent = redisPrefix + 'shop_' + authShopUser.shop_id + '.order_update';
        const orderUpdateUserEvent = orderUpdateServerEvent + '.shopUser_' + authShopUser.id;
        // TODO: some shopUser roles must listen to all shop events
        socket.join(orderUpdateUserEvent);

        redisClient.subscribe(orderUpdateServerEvent);
        redisClient.on('message', (channel, payload) => {
            console.log('on message  :  ', orderUpdateServerEvent + '   :   ', {channel, payload, condition: payload.shopTransporterId === authShopUser.id})
            socket.emit('order_update', payload);
            /*
            if (payload.shopTransporterId === authShopUser.id) {
            }
             */
        });
    });
};

module.exports = { registerShopEvents, };
