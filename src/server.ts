import express, { Express } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { json } from "body-parser"; // Use body-parser for Express body parsing
import cors from "cors"; // Import CORS middleware
import schema from "./schema"; // Import the GraphQL schema
import logger from "./logger"; // Import logger
import { Server } from "http"; // Typing for server

// Initialize Express app with correct type
const app: Express = express();

// CORS configuration to allow requests from your frontend
const corsOptions = {
  origin: "http://localhost:3001", // Allow requests from your frontend's origin
  credentials: true, // Allow credentials (e.g., cookies, authorization headers)
};

// Use CORS middleware with the specified options
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

    // Ensure only user-friendly error messages are exposed to the frontend
    if (error.extensions && error.extensions.code === "INTERNAL_SERVER_ERROR") {
      return new Error("An unexpected error occurred. Please try again later.");
    }

    return error; // Return the error as-is for other cases
  },
});

// Start the ApolloServer with proper await and async
(async () => {
  await server.start();

  app.use("/graphql", json(), expressMiddleware(server));

  // Start the Express server and define the type of the return
  const httpServer: Server = app.listen({ port: 4000 }, () => {
    console.log("Apollo Server is running on http://localhost:4000/graphql");
  });
})();

// Export the server in case of further integration (e.g., for testing)
export { app, server };
