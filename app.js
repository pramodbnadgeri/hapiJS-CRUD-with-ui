const Hapi = require("@hapi/hapi");

const server = new Hapi.Server({ host: "localhost", port: 3000 });

// server.connection({
//   host: "localhost",
//   port: 3000,
// });

server.start((error) => {
  if (error) {
    throw error;
  }
  console.log("listening at " + server.info.uri);
});
