/* ----------------------------------------------------------
   Raj Marketing – Review System Logic
   File: js/reviews.js
-----------------------------------------------------------*/

import Storage from "./storage.js";
import { calculateAverageRating } from "./utils.js";

let dealer = null;
let reviewContainer = null;

/* INIT */
export async function initReviews(dealerObj) {
    dealer = dealerObj;
    reviewContainer = document.getElementById("reviews");

    renderSummary();
    renderList();
}

/* -----------------------------------------
   SUMMARY (average + distribution)
------------------------------------------*/
function renderSummary() {

    const avg = calculateAverageRating(dealer.reviews);
    document.getElementById("avgRatingBig").innerHTML = avg;

    const bars = calculateDistribution();
    document.getElementById("ratingBars").innerHTML = bars;
}

/* Calculate distribution */
function calculateDistribution() {
    const dist = {1:0,2:0,3:0,4:0,5:0};

    dealer.reviews.forEach(r => dist[r.stars]++);

    const total = dealer.reviews.length || 1;

    return Object.keys(dist).reverse().map(star => {
        const percent = (dist[star] / total) * 100;
        return `
        <div class="rating-bar">
            <span>${star}★</span>
            <div class="rating-track">
                <div class="rating-fill" style="width:${percent}%"></div>
            </div>
        </div>`;
    }).join("");
}

/* -----------------------------------------
   REVIEW LIST
------------------------------------------*/
function renderList() {
    const sort = document.getElementById("reviewSort").value;

    let list = [...dealer.reviews];

    if (sort === "newest") list.sort((a,b) => b.date - a.date);
    if (sort === "highest") list.sort((a,b) => b.stars - a.stars);
    if (sort === "lowest") list.sort((a,b) => a.stars - b.stars);

    reviewContainer.innerHTML = list.map(r => `
        <div class="review-box">
            <strong>${r.stars}★</strong>
            <p>${r.text}</p>
            <small>${new Date(r.date).toLocaleString()}</small>

            <button class="report-btn" onclick="reportReview(${r.date})">
                Report Abuse
            </button>
        </div>
    `).join("");
}

/* -----------------------------------------
   REPORT REVIEW (simple flow)
------------------------------------------*/
window.reportReview = function(id) {
    alert("Report submitted. Our team will review this review.");
};

/* -----------------------------------------
   ADD REVIEW
------------------------------------------*/
export async function addReview(dealer, stars, text) {

    dealer.reviews.push({ stars, text, date: Date.now() });
    dealer.rating = calculateAverageRating(dealer.reviews);

    const all = await Storage.loadDealers();
    const index = all.findIndex(d => d.id === dealer.id);
    all[index] = dealer;
    await Storage.saveDealers(all);

    renderSummary();
    renderList();
}
