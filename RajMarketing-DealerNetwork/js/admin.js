/* ----------------------------------------------------------
   Raj Marketing – Admin Panel Logic
   File: js/admin.js
-----------------------------------------------------------*/

import Storage from './storage.js';
import { generateID, calculateAverageRating } from './utils.js';

let adminLogged = false;
let dealers = [];

/* -----------------------------------------
   ADMIN LOGIN
------------------------------------------*/
document.getElementById("adminLoginBtn").onclick = () => {
    const u = document.getElementById("adminUser").value.trim();
    const p = document.getElementById("adminPass").value.trim();

    if (u === "admin" && p === "1234") {
        adminLogged = true;
        document.getElementById("adminLogin").style.display = "none";
        document.getElementById("adminDashboard").style.display = "block";
        loadData();
    } else {
        document.getElementById("adminLoginMsg").innerHTML = "Invalid login";
    }
};

window.logoutAdmin = () => {
    location.reload();
};

/* -----------------------------------------
   LOAD DATA
------------------------------------------*/
async function loadData() {
    dealers = await Storage.loadDealers();
    renderStats();
    renderDealersTable();
}

/* -----------------------------------------
   SHOW PANELS
------------------------------------------*/
window.showAdminPanel = function(id) {
    document.querySelectorAll(".admin-section").forEach(s => s.style.display = "none");
    document.getElementById(id).style.display = "block";

    document.querySelectorAll(".admin-sidebar ul li")
        .forEach(li => li.classList.remove("active"));

    event.target.classList.add("active");

    if (id === "dealersPanel") renderDealersTable();
    if (id === "bannerPanel") renderBanners();
};

/* -----------------------------------------
   ANALYTICS
------------------------------------------*/
function renderStats() {
    const premiumCount = dealers.filter(d => d.badge === "gold").length;
    const cityCount = new Set(dealers.map(d => d.city)).size;

    let ratings = dealers.map(d => d.rating || 0);
    let avgRating = ratings.reduce((a,b) => a+b, 0) / ratings.length;

    document.getElementById("statTotal").innerHTML = dealers.length;
    document.getElementById("statPremium").innerHTML = premiumCount;
    document.getElementById("statCity").innerHTML = cityCount;
    document.getElementById("statAvgRating").innerHTML = avgRating.toFixed(1);
}

/* -----------------------------------------
   DEALERS TABLE
------------------------------------------*/
function renderDealersTable() {
    const tbody = document.querySelector("#dealerTable tbody");
    tbody.innerHTML =
        dealers.map(d => `
            <tr>
                <td>${d.id}</td>
                <td>${d.businessName}</td>
                <td>${d.city}</td>
                <td>${d.badge}</td>
                <td>${d.active ? "Yes" : "No"}</td>
                <td>
                    <button onclick="editDealer('${d.id}')">Edit</button>
                    <button onclick="toggleActive('${d.id}')">
                        ${d.active ? "Deactivate" : "Activate"}
                    </button>
                    <button onclick="deleteDealer('${d.id}')">Delete</button>
                    <button onclick="viewReviews('${d.id}')">Reviews</button>
                </td>
            </tr>
        `).join("");
}


/* EDIT DEALER */
window.editDealer = function(id) {
    alert("Editing not fully implemented here for simplicity.");
};
if (RM_CONFIG.storageMode === "firebase") {
   await firebaseAddDealer(newDealer);
}
/* ACTIVATE / DEACTIVATE */
window.toggleActive = async function(id) {
    const index = dealers.findIndex(d => d.id === id);
    dealers[index].active = !dealers[index].active;

    await Storage.saveDealers(dealers);
    renderDealersTable();
};

/* DELETE */
window.deleteDealer = async function(id) {
    dealers = dealers.filter(d => d.id !== id);
    await Storage.saveDealers(dealers);
    renderDealersTable();
    renderStats();
};

/* -----------------------------------------
   ADD DEALER
------------------------------------------*/
document.getElementById("addDealerBtn").onclick = async () => {

    const newDealer = {
        id: generateID(),
        businessName: document.getElementById("newBusinessName").value,
        ownerName: document.getElementById("newOwnerName").value,
        phone: document.getElementById("newPhone").value,
        city: document.getElementById("newCity").value,
        pincode: document.getElementById("newPincode").value,
        address: document.getElementById("newAddress").value,
        badge: document.getElementById("newBadge").value,
        products: ["Windows Nets", "Door Nets"],
        coverPhoto: "",
        profilePhoto: "",
        gallery: [],
        rating: 0,
        reviews: [],
        active: true,
        createdAt: Date.now()
    };

    dealers.push(newDealer);
    await Storage.saveDealers(dealers);

    alert("Dealer Added Successfully");
    renderDealersTable();
    renderStats();
};
if (RM_CONFIG.storageMode === "firebase") {
   await firebaseAddDealer(newDealer);
}
/* -----------------------------------------
   BANNERS
------------------------------------------*/
let banners = [];

document.getElementById("addBannerBtn").onclick = () => {
    const url = document.getElementById("bannerURL").value;
    if (!url) return alert("Enter URL");

    banners.push(url);
    renderBanners();
};

function renderBanners() {
    const list = document.getElementById("bannerList");
    list.innerHTML = banners.map(b => `<li>${b}</li>`).join("");
}

/* -----------------------------------------
   EXPORT CSV
------------------------------------------*/
window.exportCSV = function() {
    const header = "ID,Business,City,Badge,Active\n";
    const rows = dealers.map(d => `${d.id},${d.businessName},${d.city},${d.badge},${d.active}`).join("\n");

    const blob = new Blob([header + rows], {type: "text/csv"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "dealers.csv";
    a.click();
};
window.viewReviews = function(id) {
    const dealer = dealers.find(d => d.id === id);

    let text = "Dealer Reviews:\n\n";

    dealer.reviews.forEach(r => {
        text += `${r.stars}★ - ${r.text}\n`;
    });

    alert(text || "No reviews");
};
