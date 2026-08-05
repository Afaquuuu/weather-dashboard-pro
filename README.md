# Live Weather Dashboard

A lightweight, responsive weather dashboard that fetches and displays real-time weather data for cities worldwide. Built as part of the Front-End Web Development Week 2 Task.

## Features

- **Real-time Weather Data**: Provides current temperature, condition, humidity, and wind speed.
- **Dynamic Icons**: Shows relevant icons for current weather conditions, including day/night support.
- **Error Handling**: Gracefully handles invalid city names and network errors with a user-friendly message.
- **Responsive Design**: Beautiful glassmorphism UI that looks great on both desktop and mobile devices.

## Tech Stack

- HTML5
- Vanilla CSS3 (Custom properties, Flexbox, CSS Grid)
- Vanilla JavaScript (ES6+ async/await)
- [Open-Meteo API](https://open-meteo.com) (No API key required)
- [Phosphor Icons](https://phosphoricons.com) for scalable, beautiful icons.

## How to Run Locally

Since this project uses plain HTML/CSS/JS without external bundlers, running it is extremely simple.

1. Clone this repository.
2. Open the `index.html` file in your preferred web browser.

*Alternatively, use a local server like Live Server (VS Code extension) or Python's `http.server` for a better development experience.*

## Important Note Regarding API Keys

This project utilizes the **Open-Meteo API**, which is a free, open-source weather API that **does not require an API key**. It was chosen to provide a frictionless experience without the risk of accidentally exposing raw API keys in public repositories. 

If this project were to use OpenWeatherMap, the API key would be stored in an environment variable (`.env` file) and never committed to version control.

## Screenshots

*(Add screenshots here showing a successful search and an error state prior to submitting the assignment)*

## Author
Built for the Front-End Web Development Week 2 Task.
