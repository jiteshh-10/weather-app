package com.springprojects.weather_app.model;

public class WeatherResponse {
    private String name;
    private String country;
    private double temperature;
    private String description;
    private int humidity;
    private double windSpeed;
    private int visibility;
    private String icon;

    // Constructors
    public WeatherResponse() {}

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getHumidity() { return humidity; }
    public void setHumidity(int humidity) { this.humidity = humidity; }

    public double getWindSpeed() { return windSpeed; }
    public void setWindSpeed(double windSpeed) { this.windSpeed = windSpeed; }

    public int getVisibility() { return visibility; }
    public void setVisibility(int visibility) { this.visibility = visibility; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
