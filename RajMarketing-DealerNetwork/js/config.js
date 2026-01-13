/* ----------------------------------------------------------
   Raj Marketing – System Config
   File: js/config.js
-----------------------------------------------------------*/

/*
 Available storage modes:
 "local"      → LocalStorage only
 "json"       → Load from /data/dealers.json then cache to LocalStorage
 "firebase"   → Real-time cloud database
*/

const RM_CONFIG = {
    storageMode: "local",           // default working mode
    jsonFilePath: "/data/dealers.json",

    firebaseEnabled: false,         // set to true when Firebase is connected

    firebaseConfig: {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
    }
};

export default RM_CONFIG;
storageMode: "firebase",
firebaseEnabled: true,
firebaseConfig: {
   apiKey: "YOUR_KEY",
   authDomain: "xxxxx.firebaseapp.com",
   databaseURL: "...",
   projectId: "...",
   storageBucket: "...",
   messagingSenderId: "...",
   appId: "..."
}
