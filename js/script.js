// --- Global Variables ---
// Stores all film data for management and use in calculator
let filmData = [];

// --- DOM Elements ---
const tabCalculatorBtn = document.getElementById('tab-calculator');
const tabFilmManagerBtn = document.getElementById('tab-film-management');
const tabExplanationBtn = document.getElementById('tab-explanation');
const tabSettingsBtn = document.getElementById("tab-settings");
const contentSettings = document.getElementById("content-settings");
const contentCalculator = document.getElementById('content-calculator');
const contentFilmManager = document.getElementById('content-film-management');
const contentExplanation = document.getElementById('content-explanation');

const calculatorTbody = document.querySelector('#movies-calculator tbody');
const filmManagerTbody = document.querySelector('#movies-manager tbody');

const locationSelect = document.getElementById('location-select');
const calculateBtn = document.getElementById('calculate');
const addFilmManagerBtn = document.getElementById('add-film-manager');
const outputWrapper = document.getElementById('output-wrapper'); // Main output wrapper
const outputTabsContainer = document.getElementById('output-tabs'); // Container for tabs
const outputTabButtonsDiv = outputTabsContainer.querySelector('.flex'); // Div for tab buttons
const outputTabContentContainer = document.getElementById('output-tab-content-container'); // Container for tab content
const singleOutputContainer = document.getElementById('single-output-container'); // Container for single result
const resultHeader = document.getElementById('result-header');

const importFileInput = document.getElementById('import-file-input');
const importFilmsButton = document.getElementById('import-films-button');
const exportFilmsButton = document.getElementById('export-films-button');
const filmManagementMessage = document.getElementById('film-management-message');

const minGapInput = document.getElementById('min-gap-input');
const defaultLocationSelect = document.getElementById('default-location-select');
const maxResultsInput = document.getElementById('max-results-input');
let minGapRequired = 8; // Global minimum gap required between intermissions
let defaultLocation = 'harderwijk';
let maxResultOptions = 3;

// Load saved value from localStorage
const savedGap = localStorage.getItem('minGapRequired');
if (savedGap !== null) {
    const parsedGap = parseInt(savedGap, 10);
    if (!isNaN(parsedGap)) {
        minGapRequired = parsedGap;
    }
}
if (minGapInput) {
    minGapInput.value = minGapRequired;
    minGapInput.addEventListener('change', () => {
        minGapRequired = parseInt(minGapInput.value, 10) || 0;
        localStorage.setItem('minGapRequired', minGapRequired);
    });
}
const savedDefaultLocation = localStorage.getItem('defaultLocation');
if (savedDefaultLocation) {
    defaultLocation = savedDefaultLocation;
}
const savedMaxResults = localStorage.getItem('maxResultOptions');
if (savedMaxResults !== null) {
    const parsedMax = parseInt(savedMaxResults, 10);
    if (!isNaN(parsedMax)) {
        maxResultOptions = parsedMax;
    }
}
if (defaultLocationSelect) {
    defaultLocationSelect.value = defaultLocation;
    defaultLocationSelect.addEventListener('change', () => {
        defaultLocation = defaultLocationSelect.value;
        localStorage.setItem('defaultLocation', defaultLocation);
        locationSelect.value = defaultLocation;
        updateCalculatorRows();
    });
}
if (maxResultsInput) {
    maxResultsInput.value = maxResultOptions;
    maxResultsInput.addEventListener('change', () => {
        const parsed = parseInt(maxResultsInput.value, 10);
        maxResultOptions = isNaN(parsed) ? 3 : Math.max(1, parsed);
        localStorage.setItem('maxResultOptions', maxResultOptions);
    });
}

// --- Event Listeners ---
tabCalculatorBtn.addEventListener('click', () => showTab('calculator'));
tabFilmManagerBtn.addEventListener('click', () => showTab('film-management'));
tabExplanationBtn.addEventListener('click', () => showTab('explanation'));
tabSettingsBtn.addEventListener("click", () => showTab("settings"));
locationSelect.addEventListener('change', updateCalculatorRows);
calculateBtn.addEventListener('click', calculate);
addFilmManagerBtn.addEventListener('click', () => addFilmManagementRow());
importFilmsButton.addEventListener('click', () => importFileInput.click()); // Trigger hidden file input
exportFilmsButton.addEventListener('click', exportFilms);


// --- Initialization ---
// Add some default film data for demonstration
filmData.push({ name: 'Film A', options: [30, 45, 60] });
filmData.push({ name: 'Film B', options: [50, 65] });
filmData.push({ name: 'Film C', options: [40, 55, 70] });
filmData.push({ name: 'Film D', options: [35, 50] });
filmData.push({ name: 'Film E', options: [45, 60] });
filmData.push({ name: 'Film F', options: [55, 70] });


// Set initial tab to calculator
showTab('calculator');
// Populate film manager table and then calculator rows (after data is ready)
populateFilmManagementTable();
// Set initial location based on saved default
locationSelect.value = defaultLocation;
updateCalculatorRows();


// --- Tab Management Functions ---
/**
* Shows the selected tab and hides others.
* @param {string} tabName - The name of the tab to show ('calculator' or 'film-management').
*/
function showTab(tabName) {
    // Update active state for tab buttons
    tabCalculatorBtn.classList.toggle("active", tabName === "calculator");
    tabFilmManagerBtn.classList.toggle("active", tabName === "film-management");
    tabExplanationBtn.classList.toggle("active", tabName === "explanation");
    tabSettingsBtn.classList.toggle("active", tabName === "settings");

    // Show/hide content sections
    contentCalculator.classList.toggle("hidden", tabName !== "calculator");
    contentFilmManager.classList.toggle("hidden", tabName !== "film-management");
    contentSettings.classList.toggle("hidden", tabName !== "settings");
    contentExplanation.classList.toggle("hidden", tabName !== "explanation");

    if (tabName === "film-management") {
        populateFilmManagementTable();
        filmManagementMessage.textContent = "";
    } else if (tabName === "calculator") {
        updateCalculatorRows();
    } else if (tabName === "settings") {
        if (minGapInput) {
            minGapInput.value = minGapRequired;
        }
        if (defaultLocationSelect) {
            defaultLocationSelect.value = defaultLocation;
        }
        if (maxResultsInput) {
            maxResultsInput.value = maxResultOptions;
        }
    }
}

// --- Film Management Functions ---

/**
* Adds a new row to the film management table for adding/editing film details.
* @param {string} name - Default film name.
* @param {string} options - Default comma-separated options string.
*/
function addFilmManagementRow(name = '', options = '') {
const tr = document.createElement('tr');
tr.innerHTML = `
<td><input type="text" class="film-name-input" value="${name}" placeholder="Filmnaam" onchange="saveFilmData()"></td>
<td><input type="text" class="film-options-input" placeholder="b.v. 45,60" value="${options}" onchange="saveFilmData()"></td>
<td>
<button onclick="removeFilmManagementRow(this)" class="remove-button" aria-label="Verwijderen">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
  <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd"/>
</svg>
</button>
</td>
`;
filmManagerTbody.appendChild(tr);
filmManagementMessage.textContent = ''; // Clear message on add
}

/**
* Populates the film management table from the filmData array.
*/
function populateFilmManagementTable() {
filmManagerTbody.innerHTML = ''; // Clear existing rows
filmData.forEach((film) => {
addFilmManagementRow(film.name, film.options.join(','));
});
}

/**
* Saves the current state of the film management table to filmData.
* This function should be called on input change or row removal.
* It reconstructs the filmData array directly from the DOM to ensure accuracy.
*/
function saveFilmData() {
const rows = Array.from(filmManagerTbody.querySelectorAll('tr'));
filmData = rows.map(row => {
const nameInput = row.querySelector('.film-name-input');
const optionsInput = row.querySelector('.film-options-input');
return {
name: nameInput ? nameInput.value.trim() : '',
options: optionsInput ? optionsInput.value
.split(',')
.map(s => parseInt(s.trim(), 10))
.filter(n => !isNaN(n)) : []
};
}).filter(f => f.name && f.options.length > 0); // Only keep valid films with name and at least one option

// Re-populate dropdowns in calculator tab if needed (e.g., if on that tab)
if (!contentCalculator.classList.contains('hidden')) {
populateMovieDropdowns();
}
}

/**
* Removes a film management row and updates filmData.
* @param {HTMLElement} buttonElement - The remove button that was clicked.
*/
function removeFilmManagementRow(buttonElement) {
buttonElement.closest('tr').remove(); // Remove the row from DOM
saveFilmData(); // Re-save data to update filmData array correctly
filmManagementMessage.textContent = 'Film succesvol verwijderd.';
}

/**
* Exports the current film data to a JSON file.
*/
function exportFilms() {
if (filmData.length === 0) {
filmManagementMessage.textContent = 'Geen films om te exporteren.';
return;
}
try {
const dataStr = JSON.stringify(filmData, null, 2);
const blob = new Blob([dataStr], { type: 'application/json' });
const url = URL.createObjectURL(blob);

const a = document.createElement('a');
a.href = url;
a.download = 'intermission_films.json';
document.body.appendChild(a); // Append to body is required for Firefox
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url); // Clean up
filmManagementMessage.textContent = 'Films succesvol geëxporteerd!';
} catch (error) {
filmManagementMessage.textContent = `Fout bij exporteren: ${error.message}`;
console.error('Error exporting films:', error);
}
}

/**
* Imports film data from a selected JSON file.
* @param {Event} event - The change event from the file input.
*/
function importFilms(event) {
const file = event.target.files[0];
if (!file) {
filmManagementMessage.textContent = 'Geen bestand geselecteerd.';
return;
}

const reader = new FileReader();
reader.onload = (e) => {
try {
const importedData = JSON.parse(e.target.result);
// Basic validation to ensure imported data structure is an array of objects
if (Array.isArray(importedData) && importedData.every(item => typeof item === 'object' && item.name && Array.isArray(item.options))) {
filmData = importedData;
populateFilmManagementTable(); // Refresh the film management table
populateMovieDropdowns(); // Refresh calculator dropdowns
filmManagementMessage.textContent = 'Films succesvol geïmporteerd!';
} else {
filmManagementMessage.textContent = 'Ongeldig JSON-formaat voor films. Zorg ervoor dat het een array van objecten is met "name" en "options" velden.';
}
} catch (error) {
filmManagementMessage.textContent = `Fout bij importeren: ${error.message}`;
console.error('Error importing films:', error);
}
};
reader.onerror = () => {
filmManagementMessage.textContent = 'Kon bestand niet lezen.';
console.error('File reader error:', reader.error);
};
reader.readAsText(file);
// Clear the input value to allow selecting the same file again if needed
event.target.value = '';
}

// --- Calculator Tab Functions ---

/**
* Updates the number of movie rows in the calculator based on location selection.
*/
function updateCalculatorRows() {
const location = locationSelect.value;
let rowCount = 0;
if (location === 'harderwijk') {
rowCount = 5;
} else if (location === 'lelystad') {
rowCount = 6;
}

// Clear current rows
calculatorTbody.innerHTML = '';

const hours = Array.from({ length: 12 }, (_, i) => String(10 + i).padStart(2, '0')); // 10 to 21
const minutes = ['00', '15', '30', '45'];

// Add new rows based on rowCount
for (let i = 0; i < rowCount; i++) {
const tr = document.createElement('tr');
tr.innerHTML = `
<td>
<select class="movie-select" onchange="onMovieSelectChange(this)">
<option value="">-- Kies film --</option>
<!-- Options will be populated by populateMovieDropdowns() -->
</select>
</td>
<td>
<div class="flex gap-1">
<select class="hour-select w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
${hours.map(h => `<option value="${h}">${h}</option>`).join('')}
</select>
<span class="p-2">:</span>
<select class="minute-select w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
${minutes.map(m => `<option value="${m}">${m}</option>`).join('')}
</select>
</div>
</td>
<td class="hidden sm:table-cell"><input type="text" class="options" placeholder="b.v. 45,60" readonly></td>
<td class="text-center">
<label class="relative inline-flex items-center cursor-pointer">
<input type="checkbox" class="busy-checkbox sr-only peer">
<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
<span class="ml-2 text-sm font-medium text-gray-700">Drukte</span>
</label>
</td>
`;
calculatorTbody.appendChild(tr);
}
populateMovieDropdowns(); // Populate dropdowns for new rows
outputTabButtonsDiv.innerHTML = "";
outputTabContentContainer.innerHTML = "";
    singleOutputContainer.innerHTML = "";
    outputTabsContainer.classList.add("hidden");
    singleOutputContainer.classList.add("hidden");
    resultHeader.classList.add('hidden');
}

/**
* Populates all movie dropdowns in the calculator table with films from filmData.
*/
function populateMovieDropdowns() {
const movieSelects = calculatorTbody.querySelectorAll('.movie-select');
movieSelects.forEach(selectElement => {
const selectedValue = selectElement.value; // Remember the currently selected value

selectElement.innerHTML = '<option value="">-- Kies film --</option>'; // Clear existing options
filmData.forEach(film => {
const option = document.createElement('option');
option.value = film.name;
option.textContent = film.name;
selectElement.appendChild(option);
});
// Restore selected value if it still exists
if (selectedValue && Array.from(selectElement.options).some(opt => opt.value === selectedValue)) {
selectElement.value = selectedValue;
onMovieSelectChange(selectElement); // Trigger change to update options field
}
});
}

/**
* Handles change event on movie selection dropdowns.
* Populates the 'options' input field with the selected film's intermission options.
* @param {HTMLSelectElement} selectElement - The select element that triggered the change.
*/
function onMovieSelectChange(selectElement) {
const selectedFilmName = selectElement.value;
const optionsInput = selectElement.closest('tr').querySelector('.options');
const selectedFilm = filmData.find(f => f.name === selectedFilmName);

if (selectedFilm) {
optionsInput.value = selectedFilm.options.join(',');
} else {
optionsInput.value = '';
}
}

/**
* Parses the movie data from the calculator table rows.
* @returns {Array<Object>} An array of movie objects.
*/
function parseMovies() {
const rows = Array.from(calculatorTbody.querySelectorAll('tr'));
return rows.map(row => {
const nameSelect = row.querySelector('.movie-select');
const hourSelect = row.querySelector('.hour-select');
const minuteSelect = row.querySelector('.minute-select');
const optionsInput = row.querySelector('.options'); // Now read-only
const busyCheckbox = row.querySelector('.busy-checkbox'); // Get busy checkbox

const startTime = (hourSelect && minuteSelect) ? `${hourSelect.value}:${minuteSelect.value}` : '';

return {
name: nameSelect ? nameSelect.value || 'Onbekende Film' : 'Onbekende Film',
start: startTime,
options: optionsInput ? optionsInput.value
.split(',')
.map(s => parseInt(s.trim(), 10))
.filter(n => !isNaN(n)) : [],
isBusy: busyCheckbox ? busyCheckbox.checked : false // Add isBusy property
};
}).filter(m => m.start && m.options.length); // Only include valid entries
}

/**
* Converts a time string (HH:MM) to minutes.
* @param {string} t - The time string.
* @returns {number} The time in minutes.
*/
function timeToMinutes(t) {
const [h, m] = t.split(':').map(Number);
return h * 60 + m;
}

/**
* Converts minutes to a time string (HH:MM).
* @param {number} min - The time in minutes.
* @returns {string} The time string.
*/
function minutesToTime(min) {
const h = String(Math.floor(min / 60)).padStart(2, '0');
const m = String(min % 60).padStart(2, '0');
return `${h}:${m}`;
}

/**
* Generates the HTML content for a single result option.
* @param {Object} solution - The solution object containing combo, range, minGap, etc.
* @returns {string} The HTML string for the result.
*/
function generateResultHtml(solution) {
const htmlParts = [];
const sortedCombo = [...solution.combo].sort((a, b) => a.absolute - b.absolute);

sortedCombo.forEach((intermission, i) => {
    htmlParts.push(`
<div class="bg-highlight p-3 rounded-md border border-gray-300">
<p class="font-semibold text-black">${intermission.movie}: ${intermission.offset} min (${minutesToTime(intermission.absolute)})</p>
${i < sortedCombo.length - 1 ?
`<p class="text-black text-sm pl-4">  &rarr; ${sortedCombo[i+1].absolute - intermission.absolute} min pauze tot de volgende</p>` : ''
}
</div>
`);
});

    htmlParts.push(`
<div class="bg-background p-4 rounded-lg font-semibold text-black">
<p>Totaal verschil tussen eerste en laatste pauzemoment: ${solution.range} min</p>
${solution.minGap !== Infinity && solution.minGap !== 0 && sortedCombo.length > 1 ?
`<p>Minimale kloof tussen pauzes: ${solution.minGap} min</p>` : ''
}
</div>
`);
return htmlParts.join('');
}

/**
* Displays the results in tabs if multiple options, or a single result if perfect.
* @param {Array<Object>} solutions - An array of solution objects to display.
* @param {boolean} isPerfectSolutionFound - True if at least one perfect solution was found.
*/
function displayResults(solutions, isPerfectSolutionFound) {
    // Clear previous output
    outputTabButtonsDiv.innerHTML = '';
    outputTabContentContainer.innerHTML = '';
    singleOutputContainer.innerHTML = '';
    resultHeader.classList.remove('hidden');

if (isPerfectSolutionFound && solutions.length > 0) {
// Display single best perfect solution
outputTabsContainer.classList.add('hidden');
singleOutputContainer.classList.remove('hidden');
singleOutputContainer.innerHTML = generateResultHtml(solutions[0]);
} else if (solutions.length > 0) {
    // Display top solutions in tabs
outputTabsContainer.classList.remove('hidden');
singleOutputContainer.classList.add('hidden');

    const maxTabs = Math.min(solutions.length, maxResultOptions); // Display limited tabs

solutions.slice(0, maxTabs).forEach((solution, index) => {
// Create tab button
const button = document.createElement('button');
button.classList.add('result-tab-button');
button.dataset.tabId = `result-${index}`;
button.textContent = `Optie ${index + 1}`;
outputTabButtonsDiv.appendChild(button); // Append button before setting up its content

// Create tab content pane
const contentPane = document.createElement('div');
contentPane.id = `result-tab-pane-${index}`; // Ensure ID is set
contentPane.classList.add('result-tab-pane', 'min-h-[80px]', 'space-y-3');
contentPane.innerHTML = generateResultHtml(solution);
outputTabContentContainer.appendChild(contentPane); // Append content pane

button.addEventListener('click', () => {
// Remove active class from all buttons
outputTabButtonsDiv.querySelectorAll('.result-tab-button').forEach(btn => {
if (btn) btn.classList.remove('active'); // Defensive check
});
// Add active class to clicked button
if (button) button.classList.add('active'); // Defensive check

// Hide all tab content
outputTabContentContainer.querySelectorAll('.result-tab-pane').forEach(pane => {
if (pane) pane.classList.add('hidden'); // Defensive check
});
// Show active tab content by directly using contentPane
if (contentPane) contentPane.classList.remove('hidden'); // Defensive check
});

// Set first tab as active by default
if (index === 0) {
button.click(); // Simulate click to show first tab
} else {
contentPane.classList.add('hidden');
}
});
} else {
// No solutions found at all
    outputTabsContainer.classList.add('hidden');
    singleOutputContainer.classList.remove('hidden');
    singleOutputContainer.innerHTML = '<p class="text-gray-600">Geen combinatie gevonden die voldoet aan alle regels (inclusief "Drukte"-beperkingen).</p>';
    resultHeader.classList.remove('hidden');
}
}


/**
* Calculates the widest possible intermissions for the entered movies,
 * prioritizing solutions where all gaps are at least the chosen minimum gap,
* then maximizing overall range, then maximizing the minimum gap
* between intermediate intermissions, and enforcing "Drukte" constraints.
*/
function calculate() {
const movies = parseMovies();
outputTabButtonsDiv.innerHTML = '';
outputTabContentContainer.innerHTML = '';
singleOutputContainer.innerHTML = '';
outputTabsContainer.classList.add("hidden");
singleOutputContainer.classList.add("hidden");


if (movies.length === 0) {
    singleOutputContainer.innerHTML = '<p class="text-gray-600">Voer geldige filmdata in.</p>';
    outputTabsContainer.classList.add('hidden');
    singleOutputContainer.classList.remove('hidden');
    resultHeader.classList.remove('hidden');
    return;
}

// Prepare option sets for each movie, converting start times and offsets to absolute minutes
const optionSets = movies.map(m => {
const startMin = timeToMinutes(m.start);
return m.options.map(off => ({
movie: m.name,
offset: off,
absolute: startMin + off,
isBusy: m.isBusy // Propagate the isBusy flag to each option
}));
}).filter(set => set.length > 0); // Filter out movies without valid options

if (optionSets.length === 0) {
    singleOutputContainer.innerHTML = '<p class="text-gray-600">Geen geldige pauze-opties gevonden voor de geselecteerde films.</p>';
    outputTabsContainer.classList.add('hidden');
    singleOutputContainer.classList.remove('hidden');
    resultHeader.classList.remove('hidden');
    return;
}

const allCandidateSolutions = []; // Stores all valid (by busy rule) combinations

/**
* Recursive function to search for all valid combinations of intermissions.
* @param {Array<Object>} combo - The current combination of intermissions being tested.
* @param {number} idx - The current movie index being processed.
*/
function search(combo, idx) {
// Base case: if all movies have been processed
if (idx === optionSets.length) {
const times = combo.map(c => c.absolute);
if (times.length === 0) return; // Skip if no times are available

const sortedCombo = [...combo].sort((a, b) => a.absolute - b.absolute); // Sort the combo to check gaps

// --- Hard "Drukte" constraint check (minimaal 8 minuten tussen busy films) ---
// If any film is marked as busy, and the gap to its neighbor is less than minGapRequired,
// this combination is invalid and discarded.
for (let i = 0; i < sortedCombo.length - 1; i++) {
const current = sortedCombo[i];
const next = sortedCombo[i + 1];
const gap = next.absolute - current.absolute;

if (gap < minGapRequired && (current.isBusy || next.isBusy)) {
return; // Discard this combination immediately if busy rule is violated
}
}

// --- Evaluate this combination for range, minGap, and global minGapRequired ---
const currentRange = sortedCombo[sortedCombo.length - 1].absolute - sortedCombo[0].absolute;
const currentMaxTime = sortedCombo[sortedCombo.length - 1].absolute;

let currentMinGap = Infinity;
let meetsAllMinGaps = true; // Flag for global 8-min rule check
if (sortedCombo.length > 1) {
for (let i = 0; i < sortedCombo.length - 1; i++) {
const gap = sortedCombo[i+1].absolute - sortedCombo[i].absolute;
if (gap < currentMinGap) {
currentMinGap = gap;
}
if (gap < minGapRequired) {
meetsAllMinGaps = false; // Fails global 8-min rule
}
}
} else {
currentMinGap = 0; // For single intermission, no gap
}

// Store this combination as a candidate solution
allCandidateSolutions.push({
combo: combo.slice(), // Store a copy
range: currentRange,
maxTime: currentMaxTime,
minGap: currentMinGap,
meetsAllMinGaps: meetsAllMinGaps // Record if it meets the global 8-min rule
});
return;
}

// Recursive step: iterate through options for the current movie
for (const opt of optionSets[idx]) {
combo.push(opt);
search(combo, idx + 1);
combo.pop();
}
}

// Start the search with an empty combination and the first movie index
search([], 0);

let bestPerfectSolution = null;
const fallbackSolutions = []; // For fallback options if no perfect solution is found

// 1. First, try to find the absolute best "perfect" solution (all gaps >= minGapRequired)
const perfectSolutions = allCandidateSolutions.filter(s => s.meetsAllMinGaps);

if (perfectSolutions.length > 0) {
// Sort perfect solutions: maximize range, then maximize minGap, then minimize maxTime
perfectSolutions.sort((a, b) => {
if (b.range !== a.range) return b.range - a.range;
if (b.minGap !== a.minGap) return b.minGap - a.minGap;
return a.maxTime - b.maxTime; // Minimize maxTime if range and minGap are equal
});
bestPerfectSolution = perfectSolutions[0];
}

// 2. If no perfect solution, or if we need fallback options, sort all candidates
if (!bestPerfectSolution) {
// Sort all candidate solutions (including those with smaller gaps)
allCandidateSolutions.sort((a, b) => {
// Primary sort: maximize range
if (b.range !== a.range) return b.range - a.range;
// Secondary sort: maximize minGap
if (b.minGap !== a.minGap) return b.minGap - a.minGap;
// Tertiary sort: minimize maxTime
return a.maxTime - b.maxTime;
});
// Take up to the configured number for fallback display
    fallbackSolutions.push(...allCandidateSolutions.slice(0, Math.min(allCandidateSolutions.length, maxResultOptions)));
}

// --- Display Results ---
if (bestPerfectSolution) {
displayResults([bestPerfectSolution], true); // Found a perfect solution
} else if (fallbackSolutions.length > 0) {
displayResults(fallbackSolutions, false); // No perfect solution, display best efforts
} else {
// No valid combinations found at all (even after busy check)
    singleOutputContainer.innerHTML = '<p class="text-gray-600">Geen combinatie gevonden die voldoet aan alle regels (inclusief "Drukte"-beperkingen).</p>';
    outputTabsContainer.classList.add('hidden');
    singleOutputContainer.classList.remove('hidden');
    resultHeader.classList.remove('hidden');
}
}

