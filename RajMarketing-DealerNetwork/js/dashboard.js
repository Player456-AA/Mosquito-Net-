/* ----------------------------------------------------------
   Raj Marketing – Dealer Dashboard Logic
   File: js/dashboard.js
-----------------------------------------------------------*/

import Storage from './storage.js';
import { calculateAverageRating } from './utils.js';

let currentDealer = null;

/* -----------------------------------------
   LOGIN LOGIC
------------------------------------------*/
if (location.pathname.includes("login.html")) {

    document.getElementById("loginBtn").onclick = login;

    async function login() {
        const id = document.getElementById("loginID").value.trim();
        const pw = document.getElementById("loginPassword").value.trim();

        const all = await Storage.loadDealers();
        const found = all.find(d => d.id === id);

        if (!found) return showMsg("Invalid Dealer ID");
        if (pw !== "1234") return showMsg("Incorrect Password");

        localStorage.setItem("rm_logged_dealer", id);
        location.href = "dashboard.html";
    }

    function showMsg(msg) {
        document.getElementById("loginMsg").innerHTML = msg;
    }

    /* OTP LOGIN (SIMULATED) */
    document.getElementById("sendOtpBtn").onclick = () => {
        document.getElementById("otpField").style.display = "block";
        document.getElementById("otpLoginBtn").style.display = "block";
        alert("OTP sent: 1111");
    };

    document.getElementById("otpLoginBtn").onclick = async () => {
        const otp = document.getElementById("otpField").value.trim();
        if (otp !== "1111") return alert("Invalid OTP");

        const phone = document.getElementById("phoneOTP").value.trim();

        const all = await Storage.loadDealers();
        const found = all.find(d => d.phone === phone);

        if (!found) return alert("No dealer with this phone");

        localStorage.setItem("rm_logged_dealer", found.id);
        location.href = "dashboard.html";
    };
}

/* -----------------------------------------
   DASHBOARD LOGIC
------------------------------------------*/
if (location.pathname.includes("dashboard.html")) {
    initDashboard();
}

async function initDashboard() {
    const dealerID = localStorage.getItem("rm_logged_dealer");
    if (!dealerID) return location.href = "login.html";

    const all = await Storage.loadDealers();
    currentDealer = all.find(d => d.id === dealerID);

    document.getElementById("dealerNameSidebar").innerHTML = currentDealer.businessName;

    fillProfilePanel();
    fillPhotoPanel();
    fillProductPanel();
    fillReviewPanel();

    // Save Profile
    document.getElementById("saveProfileBtn").onclick = saveProfile;
    document.getElementById("savePhotosBtn").onclick = savePhotos;
    document.getElementById("saveProductsBtn").onclick = saveProducts;
}

function showPanel(id) {
    document.querySelectorAll(".panel-section").forEach(p => p.style.display = "none");
    document.getElementById(id).style.display = "block";
}

/* -----------------------------------------
   PROFILE PANEL
------------------------------------------*/
function fillProfilePanel() {
    document.getElementById("pBusinessName").value = currentDealer.businessName;
    document.getElementById("pOwnerName").value = currentDealer.ownerName;
    document.getElementById("pPhone").value = currentDealer.phone;
    document.getElementById("pAddress").value = currentDealer.address;
    document.getElementById("pCity").value = currentDealer.city;
    document.getElementById("pPincode").value = currentDealer.pincode;
}

async function saveProfile() {

    currentDealer.businessName = document.getElementById("pBusinessName").value;
    currentDealer.ownerName = document.getElementById("pOwnerName").value;
    currentDealer.phone = document.getElementById("pPhone").value;
    currentDealer.address = document.getElementById("pAddress").value;
    currentDealer.city = document.getElementById("pCity").value;
    currentDealer.pincode = document.getElementById("pPincode").value;

    // Save
    const all = await Storage.loadDealers();
    const index = all.findIndex(d => d.id === currentDealer.id);
    all[index] = currentDealer;
    await Storage.saveDealers(all);

    alert("Profile updated!");
}

/* -----------------------------------------
   PHOTOS PANEL
------------------------------------------*/
function fillPhotoPanel() {
    document.getElementById("photoProfile").value = currentDealer.profilePhoto;
    document.getElementById("photoCover").value = currentDealer.coverPhoto;
    document.getElementById("photoGallery").value =
        currentDealer.gallery.join("\n");
}

async function savePhotos() {
    currentDealer.profilePhoto = document.getElementById("photoProfile").value;
    currentDealer.coverPhoto = document.getElementById("photoCover").value;
    currentDealer.gallery =
        document.getElementById("photoGallery").value.split("\n");

    const all = await Storage.loadDealers();
    const index = all.findIndex(d => d.id === currentDealer.id);
    all[index] = currentDealer;
    await Storage.saveDealers(all);

    alert("Photos updated!");
}

/* -----------------------------------------
   PRODUCTS PANEL
------------------------------------------*/
function fillProductPanel() {
    document.getElementById("productText").value =
        currentDealer.products.join("\n");
}

async function saveProducts() {
    currentDealer.products =
        document.getElementById("productText").value.split("\n");

    const all = await Storage.loadDealers();
    const index = all.findIndex(d => d.id === currentDealer.id);
    all[index] = currentDealer;
    await Storage.saveDealers(all);

    alert("Products updated!");
}

/* -----------------------------------------
   REVIEWS PANEL
------------------------------------------*/
function fillReviewPanel() {
    const list = document.getElementById("reviewList");

    list.innerHTML = currentDealer.reviews.map(r => `
        <div class="review-box">
            <strong>${r.stars}★</strong>
            <p>${r.text}</p>
        </div>
    `).join("");

    document.getElementById("avgRating").innerHTML =
        "Average Rating: " + calculateAverageRating(currentDealer.reviews);
}

/* -----------------------------------------
   LOGOUT
------------------------------------------*/
window.logout = function() {
    localStorage.removeItem("rm_logged_dealer");
    location.href = "login.html";
};
