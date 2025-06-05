# PauzePlanner

Dit kleine webhulpmiddel berekent het beste pauzeschema voor filmvoorstellingen.

## Gebruik

1. Open `index.html` in een browser. Gebruik bij voorkeur een lokale HTTP-server:
   ```bash
   python3 -m http.server
   ```
   en ga vervolgens naar `http://localhost:8000`.
2. Kies een locatie om het juiste aantal zalen te laden.
3. Selecteer films en starttijden, markeer drukke films en klik op **Breedste Pauzes Berekenen**.
4. Beheer filmopties in het tabblad **Filmbeheer**. Je kunt films importeren of exporteren als JSON.

## Ontwikkeling

De app gebruikt Tailwind CDN en gewone JavaScript. Aangepaste stijlen staan in `styles.css` en het gedrag in `script.js`.

## Kleurenpalet

De interface gebruikt de volgende basiskleuren:

- **Achtergrond:** `#F9F7F1`
- **Highlight:** `#E5DDC4`
- **Primair (rood):** `#C31B20`
- **Accent (goud):** `#B58A1A`
- **Tekst:** `#000000`
