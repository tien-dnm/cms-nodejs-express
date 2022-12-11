export default {
  definition: {
    openapi: "3.0.0",
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    info: {
      title: "Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      contact: {
        name: "Tien Do",
        url: "http://tien-dnm.com",
        email: "tien.dongocminh@gmail.com",
      },
    },
    servers: [
      {
        url: `http://localhost:5035`,
        description: "dev",
      },
      {
        url: `http://api.tien-dnm.com`,
        description: "production",
      },
    ],
  },
  apis: ["./src/api/**/*.js"],
};
