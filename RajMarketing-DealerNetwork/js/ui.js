/* ----------------------------------------------------------
   Raj Marketing – UI Rendering
   File: js/ui.js
-----------------------------------------------------------*/

import { getBadgeLabel, starHTML } from './utils.js';

const UI = {

    renderDealerCard(dealer) {
        return `
        <div class="dealer-card" onclick="location.href='dealer.html?id=${dealer.id}'">
            <img class="cover" src="${dealer.coverPhoto}">
            <div class="content">
                <img class="profile" src="${dealer.profilePhoto}">
                <h3>${dealer.businessName}</h3>
                <p>${dealer.city}</p>
                ${getBadgeLabel(dealer.badge)}
                <p>${starHTML(Math.round(dealer.rating))} (${dealer.rating})</p>
            </div>
        </div>`;
    },

    insertHTML(element, html) {
        document.querySelector(element).innerHTML = html;
    }
};

export default UI;
