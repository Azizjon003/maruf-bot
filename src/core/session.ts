// const store = Redis({
//   url: "redis://127.0.0.1:6379",
// });
// const sessionStorage = ;
// const { session: memorySession } = require("telegraf");
// const session = memorySession({});

// // const session = new RedisSession({
// //   store: {
// //     host: "127.0.0.1",

// //     port: 6379,
// //   },
// // });
// export default session;

const PostgresSession = require("telegraf-postgres-session");
// const session = memorySession({});

const session = new PostgresSession({
  connectionString: process.env.DATABASE_URL,
  // Local Docker Postgres has no SSL; set DB_SSL=true for managed databases.
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

export default session;
