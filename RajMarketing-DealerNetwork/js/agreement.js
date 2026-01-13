/* ----------------------------------------------------------
   Raj Marketing – Agreement + Signature Logic
   File: js/agreement.js
-----------------------------------------------------------*/

import Storage from "./storage.js";
import { generateCertificate } from "./pdf.js";

let currentDealer = null;

/* Retrieve logged dealer */
export async function initAgreement() {
    const dealerID = localStorage.getItem("rm_logged_dealer");
    const all = await Storage.loadDealers();
    currentDealer = all.find(d => d.id === dealerID);

    initSignaturePad();

    document.getElementById("signAgreementBtn").onclick = saveAgreement;
    document.getElementById("downloadCertBtn").onclick = () =>
        generateCertificate(currentDealer);
}

/* -----------------------------------------
   SIGNATURE PAD
------------------------------------------*/
let canvas, ctx, drawing = false;

function initSignaturePad() {
    canvas = document.getElementById("signaturePad");
    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseleave", end);

    document.getElementById("clearSignatureBtn").onclick = clearSignature;
}

function start(e) { drawing = true; draw(e); }
function end() { drawing = false; ctx.beginPath(); }

function draw(e) {
    if (!drawing) return;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function clearSignature() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* -----------------------------------------
   SAVE AGREEMENT
------------------------------------------*/
async function saveAgreement() {

    // Signature data
    const signatureData = canvas.toDataURL();

    // IP address fetch (external API)
    let ip = "Unknown";
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ip = data.ip;
    } catch (err) {}

    currentDealer.signatureData = signatureData;
    currentDealer.agreementTimestamp = Date.now();
    currentDealer.ip = ip;

    // Save
    const all = await Storage.loadDealers();
    const index = all.findIndex(d => d.id === currentDealer.id);
    all[index] = currentDealer;
    await Storage.saveDealers(all);

    document.getElementById("certificateBox").style.display = "block";
    alert("Agreement signed successfully!");
      }
