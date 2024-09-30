const corsOptions = {
    origin: ["http://78.142.47.247:7002"],
//   origin: ["http://localhost:7002"],

  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = {
  corsOptions,
};
