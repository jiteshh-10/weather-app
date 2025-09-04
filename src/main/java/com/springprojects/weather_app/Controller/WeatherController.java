package com.springprojects.weather_app.Controller;
import com.springprojects.weather_app.service.WeatherService;
import com.springprojects.weather_app.model.WeatherResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow all origins for development
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/weather")
    public ResponseEntity<WeatherResponse> getWeather(@RequestParam String city) {
        try {
            WeatherResponse weather = weatherService.getWeatherByCity(city);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}