
// export const generateUpiLink = async ({amount, sessionId}) => {
//     const merchantUpiId = process.env.UPI_ID?.replace(/['"]/g, '').trim();
//     const merchantName = "City Basket";

//     const parsedAmount = Number(amount).toFixed(2);

//     const upiLink =
//         `upi://pay?pa=${encodeURIComponent(merchantUpiId)}` +
//         `&pn=${encodeURIComponent(
//             merchantName
//         )}` +
//         `&am=${parsedAmount}` +
//         `&cu=INR` +
//         `&tr=${encodeURIComponent(sessionId)}`;

//     return {
//         upiLink
//     };
// };

export const generateUpiLink = async ({ amount, sessionId }) => {
    // 1. .env se value uthayein aur extra spaces saaf karein
    const merchantUpiId = process.env.UPI_ID?.trim();
    const merchantName = "City Basket";

    // 2. Amount ko string mein convert karke fix karein
    const formattedAmount = parseFloat(amount).toFixed(2);

    // 3. encodeURIComponent ka sahi istemal
    const params = new URLSearchParams({
        pa: merchantUpiId,
        pn: merchantName,
        am: formattedAmount,
        cu: "INR",
        tr: sessionId,
        tn: "Payment for Order" // Transaction note add karna acha rehta hai
    });

    const upiLink = `upi://pay?${params.toString()}`;
    console.log("Generated Link:", upiLink);

    return { upiLink };

};