# weather-app-graphql (Node.js + Apollo Server + GraphQL)

# Prerequisites
Node.js: Make sure you have Node.js installed (version 14 or higher). You can download it from nodejs.org.
npm or Yarn: You should also have npm (comes with Node.js) or Yarn installed.
Git: is using version control.


# 1. Clone the repository to your IDE and install dependencies 

git clone `https://github.com/alexiacooze/weather-app-graphql`

cd weather-app-backend

npm install


# 2. Start the backend server

npm start

If the server is running properly it will return: 
`Apollo Server is running on http://localhost:4000/graphql`

By default, the GraphQL server will run on http://localhost:4000/graphql. You can test it by opening that URL in your browser or using GraphQL playground tools.

# 3. Testing

Basic logging and error handling can be found within the terminal after the server is running. Query testing can be tested by navigating to http://localhost:4000/graphql and using GraphQL playground tools.

(Optional) Running `npm test` will also start the server and run the basic jest tests

