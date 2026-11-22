# food-ws: the GhostChef realtime server

food-ws is the small Socket.IO server of [GhostChef](https://github.com/mkhinini-motaz/ghostchef), a food-ordering platform I started in 2019. It pushes order and menu changes to the shop back office and to the customer menu pages. I wrote it by hand, before I used coding agents, between October 2021 and September 2022 (18 commits). A restaurant I co-founded took its orders through GhostChef from December 2021 to October 2023.

The other parts of the system:

- [Food](https://github.com/mkhinini-motaz/Food): the Laravel API that publishes the events
- [food-client](https://github.com/mkhinini-motaz/food-client): customer web app
- [food-shop](https://github.com/mkhinini-motaz/food-shop): shop back office
- [deliveryapp](https://github.com/mkhinini-motaz/deliveryapp): delivery (rider) app
- [ghostclient](https://github.com/mkhinini-motaz/ghostclient): customer phone app

## What it does

The Laravel API publishes events on Redis. This server subscribes to them and forwards them to browsers over WebSocket. All the code is in `src/events`.

- **Shop orders** (`src/events/shop.js`)
  - A shop user sends `shop-user-login` with an access token.
  - The server checks the token by calling the shop `/profile` endpoint of the API.
  - It then subscribes to that shop's `order_update` channel and emits `order_update` to the socket each time an order changes.
- **Menu** (`src/events/menu.js`)
  - A customer page sends `menu-connect` with a shop id.
  - The server subscribes to that shop's `menu_update` and `menu_lang_update` channels and emits the same events to the socket.
- Every socket gets its own Redis client, which is closed on disconnect.
- The Socket.IO Redis adapter is configured in `index.js`.
- `test.html` is a page for trying the connection by hand.

## Stack

- Node.js, JavaScript
- `socket.io` 4 and `@socket.io/redis-adapter` 7
- `redis` 3 client, `axios` 0.24, `dotenv` 16

## Layout

```
index.js            creates the Socket.IO server, the Redis adapter, and listens on port 3000
src/events/         shop.js (order updates), menu.js (menu updates)
src/constants/      API URLs read from the environment
test.html           manual test page
.env.example        the variables the server reads
```

## Running it

```
npm install
cp .env.example .env   # set the API URLs
node index.js          # listens on port 3000, needs Redis on localhost:6379
```

There is no `start` script and no tests (`npm test` only prints an error). The code is archived and not maintained, and it may need an older Node to run.

## Status

Archived. The restaurant closed in October 2023. Since September 2026 I am rebuilding GhostChef as a delivery platform with Claude Code; that code is private. The [case study](https://github.com/mkhinini-motaz/ghostchef) tells the full story.
