/* ----------------------------------------------------------
   Raj Marketing – Storage Engine
   File: js/storage.js
-----------------------------------------------------------*/

import RM_CONFIG from './config.js';

let dealerCache = []; // universal internal cache

/* ------------------------------------------
   LOCAL STORAGE ENGINE
-------------------------------------------*/
const LocalEngine = {

    load() {
        const saved = localStorage.getItem("rm_dealers");
        if (!saved) return [];
        try {
            return JSON.parse(saved);
        } catch (e) {
            return [];
        }
    },

    save(data) {
        localStorage.setItem("rm_dealers", JSON.stringify(data));
    }
};

/* ------------------------------------------
   JSON FILE ENGINE
-------------------------------------------*/
const JSONEngine = {

    async load() {
        try {
            const response = await fetch(RM_CONFIG.jsonFilePath);
            const data = await response.json();

            // Save into LocalStorage
            LocalEngine.save(data);

            return data;
        } catch (err) {
            console.error("JSON Load Error:", err);
            return LocalEngine.load();
        }
    }
};

/* ------------------------------------------
   FIREBASE ENGINE
-------------------------------------------*/
const FirebaseEngine = {

    app: null,
    db: null,

    async init() {
        if (!RM_CONFIG.firebaseEnabled) return;

        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
        const { getDatabase, ref, onValue, set } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");

        this.app = initializeApp(RM_CONFIG.firebaseConfig);
        this.db = getDatabase(this.app);
    },

    async load() {
        await this.init();

        const { ref, onValue } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");

        return new Promise(resolve => {
            onValue(ref(this.db, "dealers"), snapshot => {
                const data = snapshot.val() || [];
                resolve(Object.values(data));
            });
        });
    },

    async save(data) {
        await this.init();

        const { ref, set } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");

        await set(ref(this.db, "dealers"), data);
    }
};

/* ------------------------------------------
   PUBLIC API
-------------------------------------------*/
const Storage = {

    async loadDealers() {

        if (dealerCache.length > 0) return dealerCache;

        let data = [];

        if (RM_CONFIG.storageMode === "local") {
            data = LocalEngine.load();
        }

        else if (RM_CONFIG.storageMode === "json") {
            data = await JSONEngine.load();
        }

        else if (RM_CONFIG.storageMode === "firebase") {
            data = await FirebaseEngine.load();
        }

        dealerCache = data;
        return data;
    },

    async saveDealers(data) {

        dealerCache = data;

        if (RM_CONFIG.storageMode === "local" || RM_CONFIG.storageMode === "json") {
            LocalEngine.save(data);
        }

        if (RM_CONFIG.storageMode === "firebase") {
            await FirebaseEngine.save(data);
        }
    }
};

export default Storage;
