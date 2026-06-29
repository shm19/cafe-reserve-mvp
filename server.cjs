// Production entry for json-server on Render (or any Node host).
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("src/mocks/db.json");
const middlewares = jsonServer.defaults(); // includes CORS (allows cross-origin from Netlify)

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 4000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Cafe Reserve API listening on ${PORT}`);
});
