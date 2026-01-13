/* ----------------------------------------------------------
   Raj Marketing – Firebase Integration
   File: js/firebase.js
-----------------------------------------------------------*/

import RM_CONFIG from "./config.js";

let app = null;
let db = null;
let storage = null;
let auth = null;

/* -----------------------------------------
   INIT FIREBASE
------------------------------------------*/
export async function initFirebase() {
    if (!RM_CONFIG.firebaseEnabled) return;

    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
    const { getDatabase, ref, get, set, update, remove } =
        await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");
    const { getStorage } =
        await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js");
    const { getAuth, signInWithPhoneNumber, RecaptchaVerifier } =
        await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");

    app = initializeApp(RM_CONFIG.firebaseConfig);
    db = getDatabase(app);
    storage = getStorage(app);
    auth = getAuth(app);

    return { app, db, storage, auth };
}

/* -----------------------------------------
   LOAD DEALERS FROM CLOUD
------------------------------------------*/
export async function firebaseLoadDealers() {
    if (!RM_CONFIG.firebaseEnabled) return [];

    const { ref, get } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");

    const snap = await get(ref(db, "dealers"));
    if (!snap.exists()) return [];

    return Object.values(snap.val());
}

/* -----------------------------------------
   SAVE DEALERS TO CLOUD
------------------------------------------*/
export async function firebaseSaveDealers(list) {
    if (!RM_CONFIG.firebaseEnabled) return;

    const { ref, set } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");
    await set(ref(db, "dealers"), list);
}

/* -----------------------------------------
   ADD ONE DEALER
------------------------------------------*/
export async function firebaseAddDealer(dealerObj) {
    const { ref, set } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");
    await set(ref(db, "dealers/" + dealerObj.id), dealerObj);
}

/* -----------------------------------------
   UPDATE DEALER
------------------------------------------*/
export async function firebaseUpdateDealer(dealerObj) {
    const { ref, update } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");
    await update(ref(db, "dealers/" + dealerObj.id), dealerObj);
}

/* -----------------------------------------
   DELETE DEALER
------------------------------------------*/
export async function firebaseDeleteDealer(id) {
    const { ref, remove } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");
    await remove(ref(db, "dealers/" + id));
}

/* -----------------------------------------
   OTP LOGIN
------------------------------------------*/
export async function enableOTPLogin(phone) {
    const { RecaptchaVerifier, signInWithPhoneNumber } =
        await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");

    const recaptcha = new RecaptchaVerifier('otp-container', {}, auth);

    return signInWithPhoneNumber(auth, "+91" + phone, recaptcha);
}

export async function uploadFile(file, path) {
    const { ref, uploadBytes, getDownloadURL } =
        await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js");

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}
