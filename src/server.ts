import express, { Express } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { json } from "body-parser"; 
import cors from "cors"; 
import schema from "./schema";
import logger from "./logger"; 
import { Server } from "http"; 

// Initialize Express 
const app: Express = express();

// CORS configuration to allow requests from your frontend
const corsOptions = {
  origin: "http://localhost:3001", 
  credentials: true, 
};

app.use(cors(corsOptions));

// Initialize ApolloServer with schema and enhanced error handling
const server: ApolloServer = new ApolloServer({
  schema,
  formatError: (error) => {
    // Log the error details
    logger.error(`GraphQL Error: ${error.message}`, {
      error: error.extensions,
      path: error.path,
    });

    if (error.extensions && error.extensions.code === "INTERNAL_SERVER_ERROR") {
      return new Error("An unexpected error occurred. Please try again later.");
    }

    return error; 
  },
});

// Start the ApolloServer and Express server
(async () => {
  await server.start();

  app.use("/graphql", json(), expressMiddleware(server));


  const httpServer: Server = app.listen({ port: 4000 }, () => {
    console.log("Apollo Server is running on http://localhost:4000/graphql");
  });
})();


export { app, server };
