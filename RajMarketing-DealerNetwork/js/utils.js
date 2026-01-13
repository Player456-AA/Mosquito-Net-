/* ----------------------------------------------------------
   Raj Marketing – Utils / Helper Functions
   File: js/utils.js
-----------------------------------------------------------*/

export function getBadgeLabel(type) {
    switch (type) {
        case "gold": return `<span class="badge badge-gold">Gold Verified</span>`;
        case "green": return `<span class="badge badge-green">Green Verified</span>`;
        default: return `<span class="badge badge-blue">Blue Verified</span>`;
    }
}

export function formatPhone(phone) {
    return `+91 ${phone}`;
}

export function generateID() {
    return "RM" + Math.floor(1000 + Math.random() * 9000);
}

export function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return 0;

    let sum = 0;
    reviews.forEach(r => sum += r.stars);
    return (sum / reviews.length).toFixed(1);
}

export function starHTML(rating) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
        html += i <= rating ? "★" : "☆";
    }
    return `<span class="rating-stars">${html}</span>`;
}
