/* ----------------------------------------------------------
   Raj Marketing – Data Templates
   File: js/data.js
-----------------------------------------------------------*/

export const DealerTemplate = {
    id: "",
    businessName: "",
    ownerName: "",
    phone: "",
    city: "",
    pincode: "",
    address: "",
    badge: "blue",  // gold / green / blue
    products: [],
    coverPhoto: "",
    profilePhoto: "",
    gallery: [],
    rating: 0,
    reviews: [],
    active: true,
    createdAt: Date.now()
};

export const DefaultDealers = [
    {
        id: "RM1001",
        businessName: "Sri Windows & Nets",
        ownerName: "Manjunath",
        phone: "9876543210",
        city: "Mysore",
        pincode: "570001",
        address: "Near Double Road, Mysore",
        badge: "gold",
        products: ["Windows Nets", "Door Nets", "Installation Service"],
        coverPhoto: "/images/dealers/dealer1/cover.jpg",
        profilePhoto: "/images/dealers/dealer1/profile.jpg",
        gallery: [],
        rating: 4.8,
        reviews: [],
        active: true,
        createdAt: Date.now()
    },
    {
        id: "RM1002",
        businessName: "Kiran Home Nets",
        ownerName: "Kiran Kumar",
        phone: "9876501234",
        city: "Bangalore",
        pincode: "560001",
        address: "MG Road, Bangalore",
        badge: "green",
        products: ["Windows Nets", "Sliding Nets"],
        coverPhoto: "/images/dealers/dealer2/cover.jpg",
        profilePhoto: "/images/dealers/dealer2/profile.jpg",
        gallery: [],
        rating: 4.3,
        reviews: [],
        active: true,
        createdAt: Date.now()
    }
];
