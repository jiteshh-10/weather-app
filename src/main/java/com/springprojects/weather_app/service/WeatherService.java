package com.springprojects.weather_app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.springprojects.weather_app.model.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    @Value("${openweather.api.key}")
    private String apiKey;

    private final String API_URL = "https://api.openweathermap.org/data/2.5/weather";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public WeatherResponse getWeatherByCity(String city) throws Exception {
        String url = String.format("%s?q=%s&appid=%s&units=metric", API_URL, city, apiKey);

        String response = restTemplate.getForObject(url, String.class);
        JsonNode jsonNode = objectMapper.readTree(response);

        WeatherResponse weatherResponse = new WeatherResponse();
        weatherResponse.setName(jsonNode.get("name").asText());
        weatherResponse.setCountry(jsonNode.get("sys").get("country").asText());
        weatherResponse.setTemperature(jsonNode.get("main").get("temp").asDouble());
        weatherResponse.setDescription(jsonNode.get("weather").get(0).get("description").asText());
        weatherResponse.setHumidity(jsonNode.get("main").get("humidity").asInt());
        weatherResponse.setWindSpeed(jsonNode.get("wind").get("speed").asDouble());
        weatherResponse.setVisibility(jsonNode.get("visibility").asInt() / 1000); // Convert to km
        weatherResponse.setIcon(jsonNode.get("weather").get(0).get("icon").asText());

        return weatherResponse;
    }
}