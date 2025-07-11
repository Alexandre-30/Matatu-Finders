// --- Data for Random Generation ---
const matatuIdPrefixes = ["KDA", "KCC", "KBD", "KCA", "KBE", "KCE", "KBF", "KCH", "KDI", "KCJ", "KDK", "KCL", "KDM", "KCN", "KCP", "KCQ", "KCR", "KCS", "KCT", "KCU", "KCV", "KCW", "KCX", "KCY", "KCZ", "KDE", "KDF"];
const routeOrigins = ["CBD", "Westlands", "Upper Hill", "Kilimani", "Karen", "Thika Road"];
const routeDestinations = [
    "Rongai", "Donholm", "Kikuyu", "Buruburu", "Umoja", "Kawangware", "Huruma", "Embakasi",
    "Githurai 45", "Ngong Road", "Pipeline", "Dandora", "Dagoretti", "Eastleigh", "Juja",
    "Komarock", "Uthiru", "Kahawa West", "Ruaka", "Kabete", "Kiambu", "Kayole", "Mwiki",
    "Kasarani", "Syokimau", "Kitengela", "Ruiru", "Athi River"
];
const inactiveReasons = [
    "Currently in garage for service",
    "Off-route for driver break",
    "Waiting for repairs at depot",
    "Driver unavailable for shift",
    "Route currently suspended due to road works",
    "At the car wash, getting cleaned",
    "Minor engine trouble, at local garage",
    "Fueling up at Total Petrol Station",
    "Crew swapping shifts at terminus",
    "Waiting for passengers at designated parking",
    "Off-duty until evening rush hour",
    "Cleaning interior after a long trip",
    "Routine maintenance check at depot",
    "Broken down near bypass, awaiting tow",
    "Awaiting inspection by NTSA",
    "Stocking up on refreshments for passengers",
    "Stuck in unexpected traffic jam",
    "Waiting for conductor to arrive",
    "Flat tire, roadside assistance called"
];

// --- Helper function to get a random item from an array ---
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// --- Helper function to generate a random number plate suffix (e.g., 123A) ---
function generateRandomNumberPlateSuffix() {
    const num = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0'); // 001-999
    const char = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    return `${num}${char}`;
}

// --- Function to generate a single random matatu ---
function generateRandomMatatu() {
    const idPrefix = getRandomItem(matatuIdPrefixes);
    const idSuffix = generateRandomNumberPlateSuffix();
    const matatuId = `${idPrefix} ${idSuffix}`;

    const origin = getRandomItem(routeOrigins);
    let destination = getRandomItem(routeDestinations);
    // Ensure origin and destination are not the same
    while (destination === origin) {
        destination = getRandomItem(routeDestinations);
    }
    const route = `${origin} - ${destination}`;

    // Randomly determine status (e.g., 70% active, 30% inactive)
    const status = Math.random() < 0.7 ? "Active" : "Inactive";
    let currentLocation;

    if (status === "Active") {
        // For active matatus, locations should hint at being on the move
        const activeLocations = [
            `Currently on ${route} route`,
            `Approaching ${destination} terminus`,
            `Departing from ${origin} stage`,
            `Mid-route, heading towards ${destination}`,
            `Just left ${origin}, picking up passengers`
        ];
        currentLocation = getRandomItem(activeLocations);
    } else {
        currentLocation = getRandomItem(inactiveReasons);
    }

    return { id: matatuId, route, currentLocation, status };
}

// --- Generate a large set of random matatus ---
const NUM_MATATUS = 50; // You can change this number
const matatusData = Array.from({ length: NUM_MATATUS }, () => generateRandomMatatu());


// --- Rest of the existing Matatu Finder logic ---

// Get elements from the HTML
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results');

// Function to display matatus
function displayMatatus(matatusToDisplay) {
    resultsContainer.innerHTML = ''; // Clear previous results

    if (matatusToDisplay.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No matatus found matching your search. Try a different route or location!</p>';
        return;
    }

    matatusToDisplay.forEach(matatu => {
        const matatuCard = document.createElement('div');
        matatuCard.classList.add('matatu-card');

        // Determine status class for styling
        const statusClass = matatu.status === 'Active' ? 'active' : 'inactive';

        matatuCard.innerHTML = `
            <h3>${matatu.id}</h3>
            <p><strong>Route:</strong> ${matatu.route}</p>
            <p><strong>Current Location:</strong> ${matatu.currentLocation}</p>
            <p><strong>Status:</strong> <span class="status ${statusClass}">${matatu.status}</span></p>
        `;
        resultsContainer.appendChild(matatuCard);
    });
}

// Function to handle search
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === "") {
        // If search box is empty, show all matatus (active or inactive)
        displayMatatus(matatusData);
        if (matatusData.length === 0) {
            resultsContainer.innerHTML = '<p class="initial-message">No matatus to display currently.</p>';
        } else {
            resultsContainer.innerHTML = '<p class="initial-message">Showing all matatus. Use the search bar to filter!</p>' + resultsContainer.innerHTML;
        }
        return;
    }

    const filteredMatatus = matatusData.filter(matatu =>
        matatu.route.toLowerCase().includes(searchTerm) ||
        matatu.currentLocation.toLowerCase().includes(searchTerm) ||
        matatu.id.toLowerCase().includes(searchTerm) // Allow searching by ID as well
    );

    displayMatatus(filteredMatatus);
}

// Add event listeners
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

// Initial display when the page loads (e.g., show all matatus)
document.addEventListener('DOMContentLoaded', () => {
    displayMatatus(matatusData); // Show all matatus by default
    if (matatusData.length === 0) {
        resultsContainer.innerHTML = '<p class="initial-message">No matatus to display currently.</p>';
    } else {
        resultsContainer.innerHTML = '<p class="initial-message">Showing all matatus. Use the search bar to filter by route, location, or ID!</p>' + resultsContainer.innerHTML;
    }
});