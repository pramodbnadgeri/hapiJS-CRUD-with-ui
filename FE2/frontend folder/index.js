const Hapi = require("@hapi/hapi");
// const Joi = require("joi");
const { Pool } = require("pg");
const aqlQuery = arangojs.aqlQuery;
var cors = require("cors");

// const connectionString = "postgressql://postgres:root@localhost:5432/nodeapp";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "nodeapp",
  password: "root",
  port: 5432,
});
pool.connect();
// const HapiPostgresConnection = require("hapi-postgres-connection");
// const cron = require("node-cron");

// cron.schedule("*/10 * * * * *", () => {
//   console.log("running a task every 10 seconds");
// });

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  function getData(req) {
    return new Promise((resolve, reject) => {
      pool.query("select * from users", (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  server.route({
    method: "GET",
    path: "/users",
    handler: async (request, h) => {
      const data = await getData(request, h);
      return data.rows;
    },
  });

  // server.route({
  //   method: "GET",
  //   path: "/",
  //   handler: async (request, h) => {
  //     const data = await getData();
  //     return data.rows;
  //   },
  // });

  function getDataByPhone(req) {
    return new Promise((resolve, reject) => {
      console.log(req.params.phone);
      pool.query(
        `select * from users where phone = '${req.params.phone}'`,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  }
  server.route({
    method: "GET",
    path: "/users/{phone}",
    handler: async (request, h) => {
      const data = await getDataByPhone(request, h);
      return data.rows;
    },
  });

  // server.route({
  //   method: "GET",
  //   path: "/account/{username}",
  //   handler: (request) => {
  //     var accountMock = {};
  //     if (request.params.username == "pramod") {
  //       accountMock = { firstname: "PRAMOD", lastname: "BN" };
  //     }
  //     return accountMock;
  //   },
  // });

  function saveData(req) {
    return new Promise((resolve, reject) => {
      console.log(req.payload);
      var cols = [req.payload.name, req.payload.phone, req.payload.address];
      pool.query(
        "insert into users(name,phone,address) values($1,$2,$3) returning*",
        cols,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  }

  server.route({
    method: "POST",
    path: "/log",
    handler: async function (request, h) {
      const data = await saveData(request, h);
      return data;
    },
  });

  function deleteDataByName(req) {
    return new Promise((resolve, reject) => {
      pool.query(
        `delete from users where name = '${req.params.nam}'`,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  }

  server.route({
    method: "DELETE",
    path: "/del/{nam}",
    handler: async function (request, h) {
      const data = await deleteDataByName(request, h);
      return data;
    },
  });

  function updateDataByName(req) {
    return new Promise((resolve, reject) => {
      pool.query(
        `update users set name = '${req.payload.name}',address = '${req.payload.address}',phone = '${req.payload.phone}' where name = '${req.params.nam}'`,
        (err, res) => {
          if (err) {
            console.log(res, "if res");
            reject(err);
          } else {
            console.log(res, "else res");
            resolve(res);
          }
        }
      );
    });
  }

  server.route({
    method: "PUT",
    path: "/update/{nam}",
    handler: async function (request, h) {
      const data = await updateDataByName(request, h);
      return data;
    },
  });

  //VALIDATING THE PARAMETERS
  // server.route({
  //   method: "GET",
  //   path: "/hello/{name}",
  //   handler: function (request, h) {
  //     return `hello ${request.params.name}`;
  //   },
  //   options: {
  //     validate: {
  //       params: Joi.object({
  //         name: Joi.string().min(3).max(10),
  //       }),
  //     },
  //   },
  // });

  // //VALIDATING POST METHOD
  // server.route({
  //   method: "POST",
  //   path: "/sign",
  //   handler: function (request, h) {
  //     pool.query(
  //       "insert into users (name,phone,address) values ($1,$2,$3)",
  //       (err, res) => {
  //         // console.log(err, res);
  //         // pool.end();
  //         if (err) {
  //           console.log("Error Saving : %s ", err);
  //         }
  //       }
  //     );
  //     return pool;
  //   },
  // });
  //   options: {
  //     validate: {
  //       payload: Joi.object({
  //         post: Joi.string().min(1).max(140),
  //         date: Joi.date().required(),
  //       }),
  //     },
  //   },
  // });

  // server.register({
  //   plugin: HapiPostgresConnection,
  // });

  // server.route({
  //   method: "POST",
  //   path: "/login",
  //   handler: async function (request, h) {
  //     const payload = request.payload;
  //     return `hello ${payload.name}`;
  //   },
  // });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

// process.on("unhandledRejection", (err) => {
//   console.log(err);
//   process.exit(1);
// });

init();
