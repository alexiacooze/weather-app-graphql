import { makeExecutableSchema } from "@graphql-tools/schema";
import { gql, ApolloError } from "apollo-server";
import axios from "axios";
import logger from "./logger";

// Type for weather data structure
interface WeatherData {
  time: string;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
}

// Type for the API response
interface WeatherApiResponse {
  current_weather: WeatherData;
}

const typeDefs = gql`
  type Weather {
    time: String
    temperature: Float
    windSpeed: Float
    windDirection: Int
    isDay: Int
    weatherCode: Int
  }

  type Query {
    getWeather(lat: Float!, lon: Float!): Weather
  }
`;

const resolvers = {
  Query: {
    getWeather: async (_: any, { lat, lon }: { lat: number; lon: number }) => {
      try {
        const response = await axios.get<WeatherApiResponse>(
          `https://api.open-meteo.com/v1/forecast`,
          {
            params: {
              latitude: lat,
              longitude: lon,
              current_weather: true,
            },
          }
        );

        if (!response.data || !response.data.current_weather) {
          logger.error("Invalid response from weather API", response.data);
          throw new ApolloError("No current weather data found", "NO_WEATHER_DATA");
        }

        const {
          time,
          temperature,
          windspeed,
          winddirection,
          is_day,
          weathercode,
        } = response.data.current_weather;

        return {
          time: time || "N/A",
          temperature: temperature || 0,
          windSpeed: windspeed || 0,
          windDirection: winddirection || 0,
          isDay: is_day !== undefined ? is_day : -1,
          weatherCode: weathercode || 0,
        };
      } catch (error: any) {
           if (error.response) {
          logger.error(
            `Error: Received ${error.response.status} from the weather API: ${error.response.data}`
          );
          throw new ApolloError("Failed to fetch weather data", error.response.status.toString());
        } else if (error.request) {
          logger.error("Error: No response received from the weather API", error.request);
          throw new ApolloError("Failed to fetch weather data: No response from the server", "NO_RESPONSE");
        } else {
          logger.error("Error: Request setup failed", error.message);
          throw new ApolloError("Failed to fetch weather data: Request error", "REQUEST_ERROR");
        }
      }
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
