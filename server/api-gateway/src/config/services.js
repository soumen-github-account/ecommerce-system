const services = {
    auth:   process.env.AUTH_SERVICE, //"http://localhost:8000",
    user:   process.env.USER_SERVICE, // "https://ecommerce-system-user-service.onrender.com", // http://localhost:5002
    seller: process.env.SELLER_SERVICE, //"http://localhost:5003",
    product: process.env.PRODUCT_SERVICE, //"http://localhost:5004",
    inventory: "http://localhost:5005",
    order: process.env.ORDER_SERVICE, //"http://localhost:5006",
    payment: process.env.PAYMENT_SERVICE, //"http://localhost:5007",
    pickup: "http://localhost:5008",
    warehouse: "http://localhost:5009",
    hub: "http://localhost:5010",
    delivery: "http://localhost:5011",
    notification: "http://localhost:5012",
    analytics: "http://localhost:5013"
};

export default services;