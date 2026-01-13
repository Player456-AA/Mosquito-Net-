/* ----------------------------------------------------------
   Raj Marketing – Dealer Directory Logic
   File: js/dealers.js
-----------------------------------------------------------*/

import Storage from './storage.js';
import UI from './ui.js';
import { calculateAverageRating } from './utils.js';

let dealers = [];
let userCoords = null;

/* -----------------------------------------
   GEOLOCATION (For Nearest Sorting)
------------------------------------------*/
function getLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(pos => {
        userCoords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        };
        applyFilters();
    });
}
getLocation();

/* Haversine distance formula */
function distance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lat2) return 99999;

    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI/180;
    const dLon = (lon2 - lon1) * Math.PI/180;

    const a =
        Math.sin(dLat/2) ** 2 +
        Math.cos(lat1*Math.PI/180) *
        Math.cos(lat2*Math.PI/180) *
        Math.sin(dLon/2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/* -----------------------------------------
   LOAD ALL DEALERS
------------------------------------------*/
async function init() {
    dealers = await Storage.loadDealers();

    fillFilterOptions();
    applyFilters();
}
init();

/* -----------------------------------------
   FILL CITY + PRODUCT FILTERS
------------------------------------------*/
function fillFilterOptions() {
    const citySet = new Set();
    const productSet = new Set();

    dealers.forEach(d => {
        if (d.city) citySet.add(d.city);
        if (d.products) d.products.forEach(p => productSet.add(p));
    });

    const citySel = document.getElementById("filterCity");
    const prodSel = document.getElementById("filterProduct");

    citySet.forEach(c => citySel.innerHTML += `<option>${c}</option>`);
    productSet.forEach(p => prodSel.innerHTML += `<option>${p}</option>`);
}

/* -----------------------------------------
   APPLY SEARCH + FILTERS + SORT
------------------------------------------*/
window.applyFilters = function() {

    let result = [...dealers];

    const q = document.getElementById("searchText").value.toLowerCase();
    const city = document.getElementById("filterCity").value;
    const product = document.getElementById("filterProduct").value;
    const badge = document.getElementById("filterBadge").value;
    const rating = document.getElementById("filterRating").value;
    const active = document.getElementById("filterActive").value;
    const sort = document.getElementById("sortBy").value;

    // Search
    if (q) {
        result = result.filter(d =>
            d.businessName.toLowerCase().includes(q) ||
            d.city.toLowerCase().includes(q) ||
            d.products.some(p => p.toLowerCase().includes(q))
        );
    }

    // Filters
    if (city) result = result.filter(d => d.city === city);
    if (product) result = result.filter(d => d.products.includes(product));
    if (badge) result = result.filter(d => d.badge === badge);
    if (rating) result = result.filter(d => d.rating >= Number(rating));
    if (active) result = result.filter(d => String(d.active) === active);

    // Sorting
    if (sort === "premium") {
        result.sort((a, b) => a.badge.localeCompare(b.badge));
    }

    else if (sort === "rating") {
        result.sort((a, b) => b.rating - a.rating);
    }

    else if (sort === "new") {
        result.sort((a, b) => b.createdAt - a.createdAt);
    }

    else if (sort === "nearest" && userCoords) {
        result.forEach(d => {
            d._dist = distance(userCoords.lat, userCoords.lng, d.lat, d.lng);
        });
        result.sort((a, b) => a._dist - b._dist);
    }

    render(result);
};

/* -----------------------------------------
   RENDER GRID
------------------------------------------*/
function render(list) {
    const html = list.map(d => UI.renderDealerCard(d)).join("");
    UI.insertHTML("#dealerGrid", html);
      }
