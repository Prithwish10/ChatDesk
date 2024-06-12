import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth Service API",
      version: "1.0.0",
      description: "API documentation for the Auth Service",
    },
    servers: [
      {
        url: "http://auth-srv:3000",
        description: "Auth Service",
      },
    ],
  },
  apis: ["../routes/*.ts"],
};
console.log("INSIDE SWAGGER>TS")

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
