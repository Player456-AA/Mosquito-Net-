/* ----------------------------------------------------------
   Raj Marketing – Dealer Profile Logic
   File: js/profile.js
-----------------------------------------------------------*/

import Storage from './storage.js';
import { getBadgeLabel, calculateAverageRating } from './utils.js';

let dealer = null;

/* -----------------------------------------
   GET ID FROM URL
------------------------------------------*/
const urlParams = new URLSearchParams(window.location.search);
const dealerID = urlParams.get("id");

if (!dealerID) {
    alert("Dealer ID missing");
    location.href = "dealers.html";
}

/* -----------------------------------------
   LOAD DEALER DATA
------------------------------------------*/
async function init() {
    const all = await Storage.loadDealers();
    dealer = all.find(d => d.id === dealerID);

    if (!dealer) {
        alert("Dealer not found");
        location.href = "dealers.html";
    }

    renderProfile();
}
init();

/* -----------------------------------------
   RENDER PROFILE
------------------------------------------*/
function renderProfile() {

    document.getElementById("coverBanner").style.backgroundImage =
        `url('${dealer.coverPhoto}')`;

    document.getElementById("profilePhoto").src = dealer.profilePhoto;
    document.getElementById("businessName").innerHTML = dealer.businessName;
    document.getElementById("ownerName").innerHTML = `Owned by ${dealer.ownerName}`;
    document.getElementById("address").innerHTML =
        `${dealer.address}, ${dealer.city} - ${dealer.pincode}`;

    document.getElementById("badge").innerHTML = getBadgeLabel(dealer.badge);

    document.getElementById("callBtn").href = `tel:${dealer.phone}`;
    document.getElementById("waBtn").href =
        `https://wa.me/91${dealer.phone}?text=Hello%20I%20need%20details`;

    renderProducts();
    renderGallery();
    renderMap();
    renderReviews();
}

/* -----------------------------------------
   PRODUCTS
------------------------------------------*/
function renderProducts() {
    const list = dealer.products.map(p => `<li>${p}</li>`).join("");
    document.getElementById("productList").innerHTML = list;
}

/* -----------------------------------------
   GALLERY
------------------------------------------*/
function renderGallery() {
    const html = dealer.gallery.map(img =>
        `<img src="${img}">`
    ).join("");
    document.getElementById("galleryGrid").innerHTML = html;
}

/* -----------------------------------------
   MAP + DIRECTIONS
------------------------------------------*/
function renderMap() {
    const q = encodeURIComponent(dealer.address + " " + dealer.city);
    const mapURL = `https://www.google.com/maps?q=${q}&output=embed`;

    document.getElementById("mapFrame").src = mapURL;
    document.getElementById("mapBtn").onclick = () => {
        window.open(`https://www.google.com/maps?q=${q}`, "_blank");
    };
}

/* -----------------------------------------
   REVIEWS
------------------------------------------*/
function renderReviews() {
    const box = document.getElementById("reviews");

    if (!dealer.reviews || dealer.reviews.length === 0) {
        box.innerHTML = "<p>No reviews yet.</p>";
        return;
    }

    box.innerHTML = dealer.reviews.map(r => `
        <div class="review">
            <strong>${r.stars}★</strong>
            <p>${r.text}</p>
            <small>${new Date(r.date).toLocaleDateString()}</small>
        </div>
    `).join("");
}
/* ----------------------------------------------------------
   UPDATE: Review System Integration
-----------------------------------------------------------*/

import { initReviews, addReview } from "./reviews.js";

/* inside renderProfile() */
initReviews(dealer);

/* ADD REVIEW BUTTON */
document.getElementById("addReviewBtn").onclick = async () => {

    const stars = Number(document.getElementById("reviewStars").value);
    const text = document.getElementById("reviewText").value.trim();

    if (!text) return alert("Write a review");

    await addReview(dealer, stars, text);

    document.getElementById("reviewText").value = "";
};;

/* -----------------------------------------
   REPORT DEALER
------------------------------------------*/
document.getElementById("reportBtn").onclick = () => {
    const msg = document.getElementById("reportText").value.trim();
    if (!msg) return alert("Enter your report");

    alert("Thank you. Your report will be reviewed.");
    document.getElementById("reportText").value = "";
};
