// export const orders = [
//   {
//     _id: "1",
//     orderNumber: "CB1783786121244924",
//     status: "CONFIRMED",
//     createdAt: "2026-07-11T16:08:41.255Z",
//     updatedAt: "2026-07-11T16:09:06.186Z",

//     payment: {
//       method: "UPI",
//       status: "SUCCESS",
//       transactionId: "pay_TCFwZxuZfjwSpW",
//       paymentProvider: "RAZORPAY",
//     },

//     pricing: {
//       subtotal: 999,
//       discount: 100,
//       shippingCharge: 40,
//       tax: 60,
//       totalAmount: 999,
//     },

//     shippingAddress: {
//       fullName: "Soumen Das",
//       phone: "7584818990",
//       addressLine1: "Sector V",
//       addressLine2: "Salt Lake",
//       landmark: "College More",
//       city: "Kolkata",
//       state: "West Bengal",
//       country: "India",
//       pincode: "700091",
//     },

//     user: {
//       _id: "u1",
//       fullName: "Soumen Das",
//       email: "soumen@gmail.com",
//       phone: "7584818990",
//     },

//     items: [
//       {
//         _id: "i1",

//         product: {
//           _id: "p1",
//           title: "TECHNOSPORT Men Solid Round Neck Polyester Blue T-Shirt",
//           brand: "TECHNOSPORT",
//           slug: "technosport-blue-tshirt",
//         },

//         variant: {
//           _id: "v1",
//           sku: "TEC-BLUE-XL",
//           variantName: "Blue / XL",
//           images: [
//             {
//               url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
//             },
//           ],
//         },

//         sku: "TEC-BLUE-XL",

//         quantity: 2,

//         pricing: {
//           mrp: 1199,
//           sellingPrice: 999,
//           costPrice: 700,
//           discount: 200,
//           tax: 60,
//           total: 999,
//         },

//         snapshot: {
//           title: "TECHNOSPORT Men Solid Round Neck Polyester Blue T-Shirt",
//           variantName: "Blue / XL",
//           image:
//             "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
//           attributes: [
//             { name: "Color", value: "Blue" },
//             { name: "Size", value: "XL" },
//           ],
//         },

//         status: "PLACED",
//       },
//     ],
//   },

//   {
//     _id: "2",
//     orderNumber: "CB1783786121244925",
//     status: "SHIPPED",
//     createdAt: "2026-07-12T09:10:00.000Z",
//     updatedAt: "2026-07-12T11:20:00.000Z",

//     payment: {
//       method: "CARD",
//       status: "SUCCESS",
//       transactionId: "pay_GHY7823432",
//       paymentProvider: "RAZORPAY",
//     },

//     pricing: {
//       subtotal: 4599,
//       discount: 500,
//       shippingCharge: 0,
//       tax: 120,
//       totalAmount: 4219,
//     },

//     shippingAddress: {
//       fullName: "Rahul Sharma",
//       phone: "9876543210",
//       addressLine1: "MG Road",
//       addressLine2: "Near Metro Station",
//       landmark: "City Mall",
//       city: "Bengaluru",
//       state: "Karnataka",
//       country: "India",
//       pincode: "560001",
//     },

//     user: {
//       _id: "u2",
//       fullName: "Rahul Sharma",
//       email: "rahul@gmail.com",
//       phone: "9876543210",
//     },

//     items: [
//       {
//         _id: "i2",

//         product: {
//           _id: "p2",
//           title: "boAt Rockerz 450 Bluetooth Headphones",
//           brand: "boAt",
//           slug: "boat-rockerz-450",
//         },

//         variant: {
//           _id: "v2",
//           sku: "BOAT-450-BLK",
//           variantName: "Black",
//           images: [
//             {
//               url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
//             },
//           ],
//         },

//         sku: "BOAT-450-BLK",

//         quantity: 1,

//         pricing: {
//           mrp: 4999,
//           sellingPrice: 4219,
//           costPrice: 3500,
//           discount: 780,
//           tax: 120,
//           total: 4219,
//         },

//         snapshot: {
//           title: "boAt Rockerz 450 Bluetooth Headphones",
//           variantName: "Black",
//           image:
//             "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
//           attributes: [
//             { name: "Color", value: "Black" },
//           ],
//         },

//         status: "SHIPPED",
//       },
//     ],
//   },

//   {
//     _id: "3",
//     orderNumber: "CB1783786121244926",
//     status: "DELIVERED",
//     createdAt: "2026-07-09T13:00:00.000Z",
//     updatedAt: "2026-07-10T16:40:00.000Z",

//     payment: {
//       method: "COD",
//       status: "SUCCESS",
//       transactionId: "COD-983242",
//       paymentProvider: "COD",
//     },

//     pricing: {
//       subtotal: 1799,
//       discount: 100,
//       shippingCharge: 50,
//       tax: 80,
//       totalAmount: 1829,
//     },

//     shippingAddress: {
//       fullName: "Priya Singh",
//       phone: "9123456789",
//       addressLine1: "Rajendra Nagar",
//       addressLine2: "Near SBI Bank",
//       landmark: "Bus Stand",
//       city: "Patna",
//       state: "Bihar",
//       country: "India",
//       pincode: "800016",
//     },

//     user: {
//       _id: "u3",
//       fullName: "Priya Singh",
//       email: "priya@gmail.com",
//       phone: "9123456789",
//     },

//     items: [
//       {
//         _id: "i3",

//         product: {
//           _id: "p3",
//           title: "Nike Revolution 7 Running Shoes",
//           brand: "Nike",
//           slug: "nike-revolution-7",
//         },

//         variant: {
//           _id: "v3",
//           sku: "NIKE-WHITE-8",
//           variantName: "White / UK 8",
//           images: [
//             {
//               url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
//             },
//           ],
//         },

//         sku: "NIKE-WHITE-8",

//         quantity: 1,

//         pricing: {
//           mrp: 2499,
//           sellingPrice: 1829,
//           costPrice: 1500,
//           discount: 670,
//           tax: 80,
//           total: 1829,
//         },

//         snapshot: {
//           title: "Nike Revolution 7 Running Shoes",
//           variantName: "White / UK 8",
//           image:
//             "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
//           attributes: [
//             { name: "Color", value: "White" },
//             { name: "Size", value: "UK 8" },
//           ],
//         },

//         status: "DELIVERED",
//       },
//     ],
//   },
// ];

const orders = [
  {
    id: "CB17837861",
    customer: "Soumen Das",
    product: "TECHNOSPORT Blue XL",
    sku: "TEC-MEN-XL-01",
    image: "https://via.placeholder.com/60",
    qty: 2,
    amount: 899,
    payment: "Paid",
    shipment: "Label Generated",
  },
  {
    id: "CB17837862",
    customer: "Rahul Sharma",
    product: "Puma Running Shoes",
    sku: "PUMA-RUN-42",
    image: "https://via.placeholder.com/60",
    qty: 1,
    amount: 1499,
    payment: "Paid",
    shipment: "Ready To Ship",
  },
  {
    id: "CB17837863",
    customer: "Aman Singh",
    product: "Campus Sneakers",
    sku: "CAM-987",
    image: "https://via.placeholder.com/60",
    qty: 3,
    amount: 2299,
    payment: "COD",
    shipment: "Pending",
  },
  {
    id: "CB17837864",
    customer: "Priya Roy",
    product: "Levi's T-Shirt",
    sku: "LEV-445",
    image: "https://via.placeholder.com/60",
    qty: 1,
    amount: 699,
    payment: "Paid",
    shipment: "Packed",
  },
];

export default orders;