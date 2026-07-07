
import { Address } from "../models/AddressModel.js";
import { Order } from "../models/OrderModel.js";
import { Product } from "../models/ProductModel.js";
import { Cart } from "../models/CartModel.js";
import { Wishlist } from "../models/WishlistModel.js"


export const getUser = async(req, res) => {
    try {
        const user  = req.user

        res.json({
            success: true,
            user: user
        })

    } catch (error) {
        res.json({
            success: false,
            message: "something went wrong"
        })
    }
}

export const createWishList = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id; 

        // 1. Validation: Check kiya ki productId bheja bhi hai ya nahi
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        // 2. Duplicate Check
        const alreadyExist = await Wishlist.findOne({
            user: userId,
            product: productId,
        });

        // 🔥 3. TOGGLE MECHANISM (AGAR PEHLE SE HAI TOH REMOVE KARDO)
        if (alreadyExist) {
            await Wishlist.findOneAndDelete({
                user: userId,
                product: productId,
            });

            return res.status(200).json({
                success: true,
                isWishlisted: false, // Android ko batane ke liye ki ab remove ho gaya hai
                message: "Removed from wishlist successfully",
            });
        }

        // 4. AGAR NAHI HAI TOH CREATE KARDO
        let wishlist = await Wishlist.create({
            user: userId,
            product: productId,
        });

        // 5. Android UI ke liye data populate kiya
        wishlist = await wishlist.populate({
            path: "product",
            populate: [
                { path: "category", select: "name" },
                { path: "subCategory", select: "name" },
                { path: "subCategoryLevel2", select: "name" }
            ]
        });

        // 6. Perfect Response for Addition
        return res.status(201).json({
            success: true,
            isWishlisted: true, // Android ko batane ke liye ki ab add ho gaya hai
            message: "Added to wishlist successfully",
            wishlist,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// export const getWishlistProduct = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         // FIXED: Pure nested components ko populate kiya taaki Android crash na ho
//         const wishlist = await Wishlist.find({
//             user: userId,
//         }).populate({
//             path: "product",
//             populate: [
//                 {
//                     path: "category",
//                     select: "name",
//                 },
//                 {
//                     path: "subCategory",
//                     select: "name",
//                 },
//                 {
//                     path: "subCategoryLevel2", // 🔥 FIXED: Yeh missing tha! Iske bina crash ho jata
//                     select: "name",
//                 },
//             ],
//         });

//         res.status(200).json({
//             success: true,
//             count: wishlist.length,
//             wishlist,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

export const getWishlistProduct = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.find({
      user: userId,
    }).populate({
      path: "product", // ProductVariant
      populate: [
        {
          path: "product", // Main Product
          populate: [
            {
              path: "category",
              select: "name",
            },
            {
              path: "subCategory",
              select: "name",
            },
            {
              path: "subCategoryLevel2",
              select: "name",
            },
            {
              path: "brand",
              select: "name logo",
            },
            {
              path: "seller",
              select: "storeName",
            },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, varient } = req.body;
    const userId = req.user.id;

    const existingCart = await Cart.findOne({
      user: userId,
      product: productId,
      varient: varient
    });

    if (existingCart) {
      existingCart.quantity += quantity || 1;
      await existingCart.save();

      return res.json({
        success: true,
        message: "Cart updated",
        cart: existingCart,
      });
    }

    const cart = await Cart.create({
      user: userId,
      product: productId,
      quantity: quantity || 1,
      varient
    });

    res.status(201).json({
      success: true,
      message: "Added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. User ke saare cart items nikalna aur product data populate karna
    // const cartItems = await Cart.find({
    //   user: userId,
    // }).populate({
    //   path: "product",
    //   populate: [
    //     {
    //       path: "category",
    //       select: "name",
    //     },
    //     {
    //       path: "subCategory",
    //       select: "name",
    //     },
    //     {
    //       path: "subCategoryLevel2", // FIXED: Jo pehle crash ho raha tha, ab fully populated hai
    //       select: "name",
    //     },
    //   ],
    // });
    const cartItems = await Cart.find({
      user: userId,
    })
    .populate({
      path: "product",
      populate: [
        {
          path: "category",
          select: "name",
        },
        {
          path: "subCategory",
          select: "name",
        },
        {
          path: "subCategoryLevel2",
          select: "name",
        },
      ],
    })
    .populate({
      path: "variant",
    });

    // 2. Subtotal Calculate karna (Sirf products ka total price)
    const subTotal = cartItems.reduce((sum, item) => {
      const price =
          item.variant?.pricing?.sellingPrice || 0;
      return sum + price * item.quantity;
    }, 0);

    // 3. Business Logic: Shipping Charges calculation
    let shippingCharges = 0;
    if (cartItems.length > 0) {
      // Agar subtotal 500 se kam hai toh 50rs shipping, varna free (0)
      shippingCharges = subTotal > 500 ? 0 : 0;
    }

    // 4. Grand Total Calculate karna
    const grandTotal = subTotal + shippingCharges;

    // 5. Clean & Structured Response bhejenge jo Android directly parse kar sake
    cartItems.map(item => ({

      _id: item._id,

      quantity: item.quantity,

      product: item.product,

      variant: item.variant,

      price: item.variant?.pricing?.sellingPrice,

      mrp: item.variant?.pricing?.mrp,

      image: item.variant?.images?.find(i => i.isPrimary)?.url
          || item.variant?.images?.[0]?.url

    }))
    res.json({
      success: true,
      count: cartItems.length,
      subTotal: subTotal,
      shippingCharges: shippingCharges,
      grandTotal: grandTotal,
      cartItems: formattedCart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body; // Jo product remove karna hai uski ID

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Database se user ka cart item dhoond kar delete karna
    const deletedItem = await Cart.findOneAndDelete({
      user: userId,
      product: productId,
    });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Item delete hone ke baad, bache hue cart items ka naya total calculate karenge
    // FIXED: Delete karne ke baad bache hue items ko bhi full populate karna padega
    const remainingItems = await Cart.find({ user: userId }).populate({
      path: "product",
      populate: [
        {
          path: "category",
          select: "name",
        },
        {
          path: "subCategory",
          select: "name",
        },
        {
          path: "subCategoryLevel2", // Yeh line missing thi, isliye crash ho raha tha!
          select: "name",
        },
      ],
    });
    const subTotal = remainingItems.reduce((sum, item) => {
      const price = item.product?.price?.[0] || 0;
      return sum + price * item.quantity;
    }, 0);

    // Naya shipping rules apply karenge
    let shippingCharges = 0;
    if (remainingItems.length > 0) {
      shippingCharges = subTotal > 500 ? 0 : 50;
    }

    const grandTotal = subTotal + shippingCharges;

    // Response me updated price aur items bhejenge taaki Android UI refresh ho sake
    res.json({
      success: true,
      message: "Item removed from cart successfully",
      count: remainingItems.length,
      subTotal: subTotal,
      shippingCharges: shippingCharges,
      grandTotal: grandTotal,
      cartItems: remainingItems,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, action } = req.body;

    if (!productId || !action) {
      return res.status(400).json({ success: false, message: "Product ID and Action are required" });
    }

    const cartItem = await Cart.findOne({ user: userId, product: productId });
    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    if (action === "increment") {
      const product = await Product.findById(productId);
      if (product && cartItem.quantity >= product.stock) {
        return res.status(400).json({ success: false, message: "Out of stock! More items cannot be added." });
      }
      cartItem.quantity += 1;
      await cartItem.save(); // Sirf increment me save karenge
    } else if (action === "decrement") {
      cartItem.quantity -= 1;
      
      if (cartItem.quantity <= 0) {
        // Agar 0 ho gaya toh direct delete
        await Cart.findOneAndDelete({ user: userId, product: productId });
      } else {
        // Agar 0 nahi hua toh updated quantity save karenge
        await cartItem.save();
      }
    } else {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    // 🔥 COMMON CODE: Jo dono cases ke liye bache hue items fetch aur calculate karega
    const remainingItems = await Cart.find({ user: userId }).populate({
      path: "product",
      populate: [
        { path: "category", select: "name" },
        { path: "subCategory", select: "name" },
        { path: "subCategoryLevel2", select: "name" }
      ]
    });

    const subTotal = remainingItems.reduce((sum, item) => {
      const price = item.product?.price?.[0] || 0;
      return sum + price * item.quantity;
    }, 0);

    let shippingCharges = 0;
    if (remainingItems.length > 0) {
      shippingCharges = subTotal > 500 ? 0 : 50;
    }

    const grandTotal = subTotal + shippingCharges;

    // Single standardized response
    res.json({
      success: true,
      message: "Cart updated successfully",
      count: remainingItems.length,
      subTotal: subTotal,
      shippingCharges: shippingCharges,
      grandTotal: grandTotal,
      cartItems: remainingItems
    });

  } catch (error) {
    console.error("Backend Error Stack:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      fullName,
      phone,
      pincode,
      state,
      city,
      addressLine1,
      addressLine2,
      landmark,
      addressType,
      isDefault,
    } = req.body;

    if (isDefault) {
      await Address.updateMany(
        { user: userId },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      user: userId,
      fullName,
      phone,
      pincode,
      state,
      city,
      addressLine1,
      addressLine2,
      landmark,
      addressType,
      isDefault,
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({
      user: userId,
    }).sort({ isDefault: -1 });

    res.json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    if (req.body.isDefault) {
      await Address.updateMany(
        { user: userId },
        { isDefault: false }
      );
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: addressId,
        user: userId,
      },
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    await Address.findByIdAndDelete(addressId);

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    await Address.updateMany(
      { user: userId },
      { isDefault: false }
    );

    await Address.findByIdAndUpdate(addressId, {
      isDefault: true,
    });

    res.json({
      success: true,
      message: "Default address updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkout = async (req, res) => {
  try {

    const userId = req.user.id;

    const {
      addressId,
      paymentMethod
    } = req.body;

    const cartItems = await Cart.find({
      user: userId
    }).populate("product");

    if (!cartItems.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    const orderItems = [];

    let totalAmount = 0;

    for (const item of cartItems) {

      const product = item.product;

      const price = product.price[0];

      totalAmount += price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price
      });
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      address: addressId,
      totalAmount,
      paymentMethod,
      paymentStatus:
        paymentMethod === "COD"
          ? "PENDING"
          : "PENDING"
    });

    res.json({
      success: true,
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// export const getMyOrders = async (
//   req,
//   res
// ) => {
//   try {

//     const orders =
//       await Order.find({
//         user: req.user.id
//       })
//       .populate("address")
//       .populate("items.product");

//     res.json({
//       success: true,
//       orders
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

export const getMyOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      user: req.user.id,
    })
      .populate({
        path: "items.product",
        select:
          "title brand category subCategory subCategoryLevel2",
        populate: [
          {
            path: "brand",
            select: "name logo",
          },
          {
            path: "category",
            select: "name",
          },
          {
            path: "subCategory",
            select: "name",
          },
          {
            path: "subCategoryLevel2",
            select: "name",
          },
        ],
      })
      .populate({
        path: "items.variant",
        select:
          "variantName sku images attributes pricing inventory",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("address")
        .populate("items.product");

    res.json({
        success: true,
        order
    });
};


