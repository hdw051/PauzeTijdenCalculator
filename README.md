# Intermission Calculator

This small web tool calculates the best break schedule for movie showings.

## Usage

1. Open `index.html` in a browser. Using a local HTTP server is recommended:
   ```bash
   python3 -m http.server
   ```
   then navigate to `http://localhost:8000`.
2. Choose a location to load the correct number of theaters.
3. Select films and start times, mark busy films and click **Breedste Pauzes Berekenen**.
4. Manage film options in the **Filmbeheer** tab. You can import or export films as JSON.

## Development

The app uses Tailwind CDN and plain JavaScript. Custom styles are in `styles.css` and behaviour in `script.js`.
