
🎬 CineGold Premiere
CineGold Premiere is a professional movie discovery platform designed with a high-end "Midnight Gold" aesthetic. It provides users with a premium "theater experience" right in their browser, featuring secure access, advanced search capabilities, and deep metadata integration.

Live Demo - https://cinegold-archive.github.io/Cinegold/

✨ Features
Ticket Entrance (Secure Login): A dedicated entry portal for authorized users, ensuring a secure and curated experience.

Midnight Gold UI: A custom-designed interface focusing on luxury aesthetics, high contrast, and smooth transitions.

Dynamic Search & Discovery: Powered by the OMDb API, allowing users to search through a massive database of films with real-time metadata.

Multi-Criteria Filtering: Refine searches based on genre, year, and rating for a precise discovery experience.

Load More Pagination: A seamless pagination system that allows users to explore more titles without losing their place or refreshing the page.

Deep Metadata: Displays comprehensive information including cast, plot summaries, IMDb ratings, and high-resolution posters.

🛠️ Tech Stack
Frontend: HTML5, CSS3 (Custom Midnight Gold Theme), JavaScript (ES6+)

API: OMDb API for movie data and imagery.

Data Management: JSON-based user authentication and state management.

Deployment: GitHub Pages.

📂 Project Structure
Plaintext
├── index.html      # Main landing page and Theater UI
├── style.css       # Midnight Gold aesthetic and responsive layouts
├── script.js       # API integration, search logic, and pagination
├── users.json      # Mock authentication data for Ticket Entrance
├── SECURITY.md     # Security protocols and project safety
└── README.md       # Project documentation
🚀 Getting Started
Prerequisites
To run this project locally, you will need an API key from OMDb. You can get one for free at omdbapi.com.

Installation
Clone the repository:

Bash
git clone https://github.com/CineGold-Archive/Cinegold.git
Configure API Key:
Open script.js and replace the placeholder with your OMDb API key:

JavaScript
const API_KEY = 'your_api_key_here';
Launch:
Open index.html in your browser.

🧠 Problem Solving & Design Choices
Efficiency: Implemented asynchronous data fetching to ensure the UI remains responsive while retrieving high-resolution movie posters.

UX Design: Developed the "Ticket Entrance" to mimic a real cinema experience, adding a layer of immersion before the user reaches the content.

Optimization: Used a "Load More" strategy instead of traditional numbered pagination to reduce API calls and improve the mobile browsing experience.

🛡️ Security
This project includes a SECURITY.md file outlining the measures taken to handle user data and API safety. Access is managed via the users.json configuration.
