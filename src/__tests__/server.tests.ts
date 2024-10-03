import request from "supertest";
import { app } from "../server";

describe("GraphQL API", () => {
  it("fetches weather data successfully", async () => {
    const query = `
      query {
        getWeather(lat: 37.7749, lon: -122.4194) {
          time
          temperature
          windSpeed
          windDirection
          isDay
          weatherCode
        }
      }
    `;

    const response = await request(app).post("/graphql").send({ query });

    expect(response.statusCode).toBe(200); // Successful query
    expect(response.body.data.getWeather).toBeDefined(); // Weather data returned
    expect(response.body.errors).toBeUndefined(); // No errors
  });
});
