
import { Address } from "../models/AddressModel.js";
import { Order } from "../models/OrderModel.js";
import { Product } from "../models/ProductModel.js";
import { Cart } from "../models/CartModel.js";
import { Wishlist } from "../models/WishlistModel.js"
import { Seller } from "../models/SellerModel.js";
import { ProductVariant } from "../models/ProductVariant.js";


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

        const userId = req.user.id;
        const { productId, variantId, sellerId } = req.body;

        if (!productId || !variantId || !sellerId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields."
            });
        }

        let wishlist = await Wishlist.findOne({
            user: userId
        });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: userId,
                items: []
            });
        }

        const alreadyExists = wishlist.items.find(
            item => item.variant.toString() === variantId
        );

        if (alreadyExists) {

            return res.status(200).json({
                success: true,
                message: "Already in wishlist."
            });

        }

        wishlist.items.push({
            product: productId,
            variant: variantId,
            seller: sellerId
        });

        await wishlist.save();

        return res.status(201).json({

            success: true,
            message: "Added to wishlist."

        });

    } catch (error) {

        return res.status(500).json({
            success:false,
            message:error.message
        });

    }

}

// export const createWishList = async (req, res) => {

//     try {

//         const userId = req.user.id;

//         const { productId, variantId, sellerId } = req.body;
//         console.log(productId, variantId, sellerId)

//         if (!productId || !variantId || !sellerId) {

//             return res.status(400).json({
//                 success: false,
//                 message: "Missing required fields."
//             });

//         }

//         let wishlist = await Wishlist.findOne({
//             user: userId
//         });

//         if (!wishlist) {

//             wishlist = await Wishlist.create({

//                 user: userId,

//                 items: []

//             });

//         }

//         const alreadyExists = wishlist.items.find(item =>
//           item.variant.toString() === variantId
//         );

//         if (alreadyExists) {
//           return res.status(400).json({
//               success:false,
//               message:"Product already exists in wishlist."
//           });
//         }
        

//         wishlist.items.push({

//             product: productId,

//             variant: variantId,

//             seller: sellerId

//         });
//         console.log(JSON.stringify(wishlist, null, 2));

//         await wishlist.save();

//         return res.status(201).json({

//             success: true,

//             message: "Wishlist updated successfully.",

//             wishlist

//         });

//     }

//     catch (error) {
//       console.log(error);
//       console.log(error.message);
//       console.log(error.errors);

//       return res.status(500).json({
//           success: false,
//           message: error.message
//       });
//     }

// }

export const removeWishlist = async (req,res)=>{

    try{

        const userId=req.user.id;
        const {variantId}=req.body;

        const wishlist=await Wishlist.findOne({
            user:userId
        });

        if(!wishlist){

            return res.status(404).json({
                success:false,
                message:"Wishlist not found."
            });

        }

        wishlist.items=wishlist.items.filter(item=>
            item.variant.toString()!==variantId
        );

        await wishlist.save();

        return res.json({

            success:true,
            message:"Removed from wishlist."

        });

    }

    catch(error){

        return res.status(500).json({

            success:false,
            message:error.message

        });

    }

}

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("called")

    const wishlist = await Wishlist.findOne({ user: userId })
      .populate({
        path: "items.product",
        populate: [
          { path: "category" },
          { path: "subCategory" },
          { path: "subCategoryLevel2" },
        ],
      })
      .populate("items.variant")
      .populate("items.seller")
      .lean();

    if (!wishlist || wishlist.items.length === 0) {
      return res.status(200).json({
        success: true,
        totalItems: 0,
        wishlist: [],
      });
    }

    const wishlistProducts = wishlist.items
      .filter(
        (item) =>
          item.product &&
          item.variant &&
          item.seller
      )
      .map((item) => ({
        _id: item.variant._id,                 // Variant ID
        productId: item.product._id,           // Product ID
        variantId: item.variant._id,
        sellerId: item.seller._id,

        title: item.product.title,
        slug: item.product.slug,
        brand: item.product.brand,

        category: item.product.category?.name || "",
        subCategory: item.product.subCategory?.name || "",
        subCategoryLevel2:
          item.product.subCategoryLevel2?.name || "",

        variantName: item.variant.variantName,

        attributes: item.variant.attributes || [],

        image:
          item.variant.images?.length > 0
            ? item.variant.images[0].url
            : "",

        pricing: {
          mrp: item.variant.pricing?.mrp || 0,
          sellingPrice:
            item.variant.pricing?.sellingPrice || 0,
          costPrice:
            item.variant.pricing?.costPrice || 0,
          tax: item.variant.pricing?.tax || 0,
          discount:
            item.variant.pricing?.discount || 0,
        },

        inventory: {
          stock: item.variant.inventory?.stock || 0,
        },

        highlights: item.product.highlights || [],

        isWishlisted: true,
      }));

      console.log(wishlistProducts)

    return res.status(200).json({
      success: true,
      totalItems: wishlistProducts.length,
      wishlist: wishlistProducts,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const getWishlistProduct = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const wishlist = await Wishlist.find({
//       user: userId,
//     }).populate({
//       path: "product", // ProductVariant
//       populate: [
//         {
//           path: "product", // Main Product
//           populate: [
//             {
//               path: "category",
//               select: "name",
//             },
//             {
//               path: "subCategory",
//               select: "name",
//             },
//             {
//               path: "subCategoryLevel2",
//               select: "name",
//             },
//             {
//               path: "brand",
//               select: "name logo",
//             },
//             {
//               path: "seller",
//               select: "storeName",
//             },
//           ],
//         },
//       ],
//     });

//     res.status(200).json({
//       success: true,
//       count: wishlist.length,
//       wishlist,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, variant } = req.body;
    const userId = req.user.id;

    console.log(productId, quantity, variant)
    
    const existingCart = await Cart.findOne({
      user: userId,
      variant: variant
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
      variant
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
  

    const formattedCart = cartItems.map(item => ({

      _id: item._id,

      quantity: item.quantity,

      product: {
          ...item.product.toObject(),
          category: item.product.category?.name,
          subCategory: item.product.subCategory?.name,
          subCategoryLevel2: item.product.subCategoryLevel2?.name,
      },

      variant: item.variant,

      price: item.variant?.pricing?.sellingPrice,

      mrp: item.variant?.pricing?.mrp,

      image:
        item.variant?.images?.find(i => i.isPrimary)?.url
        || item.variant?.images?.[0]?.url

    }));
    console.log(
      JSON.stringify(formattedCart, null, 2)
    );
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
    const { productId } = req.body; // productId = Cart _id

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Cart ID is required",
      });
    }

    const deletedItem = await Cart.findOneAndDelete({
      _id: productId,
      user: userId,
    });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    const remainingItems = await Cart.find({ user: userId })
      .populate({
        path: "product",
        populate: [
          { path: "category", select: "name" },
          { path: "subCategory", select: "name" },
          { path: "subCategoryLevel2", select: "name" },
        ],
      })
      .populate("variant");

    const subTotal = remainingItems.reduce((sum, item) => {
      const price = item.variant?.pricing?.sellingPrice || 0;
      return sum + price * item.quantity;
    }, 0);

    const shippingCharges =
      remainingItems.length > 0
        ? (subTotal > 500 ? 0 : 0)
        : 0;

    const grandTotal = subTotal + shippingCharges;

    const formattedCart = remainingItems.map(item => ({
      _id: item._id,
      quantity: item.quantity,

      product: {
        ...item.product.toObject(),
        category: item.product.category?.name,
        subCategory: item.product.subCategory?.name,
        subCategoryLevel2: item.product.subCategoryLevel2?.name,
      },

      variant: item.variant,

      price: item.variant?.pricing?.sellingPrice || 0,
      mrp: item.variant?.pricing?.mrp || 0,

      image:
        item.variant?.images?.find(img => img.isPrimary)?.url ||
        item.variant?.images?.[0]?.url ||
        "",
    }));

    res.json({
      success: true,
      message: "Item removed successfully",
      count: formattedCart.length,
      subTotal,
      shippingCharges,
      grandTotal,
      cartItems: formattedCart,
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
    const { productId, action } = req.body; // productId = Cart _id

    if (!productId || !action) {
      return res.status(400).json({
        success: false,
        message: "Cart ID and action are required",
      });
    }

    const cartItem = await Cart.findOne({
      _id: productId,
      user: userId,
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (action === "increment") {

      const variant = await ProductVariant.findById(cartItem.variant);

      if (
        variant &&
        cartItem.quantity >= variant.inventory.stock
      ) {
        return res.status(400).json({
          success: false,
          message: "Out of stock",
        });
      }

      cartItem.quantity += 1;
      await cartItem.save();

    } else if (action === "decrement") {

      cartItem.quantity -= 1;

      if (cartItem.quantity <= 0) {

        await Cart.findByIdAndDelete(cartItem._id);

      } else {

        await cartItem.save();

      }

    } else {

      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });

    }

    const remainingItems = await Cart.find({
      user: userId,
    })
      .populate({
        path: "product",
        populate: [
          { path: "category", select: "name" },
          { path: "subCategory", select: "name" },
          { path: "subCategoryLevel2", select: "name" },
        ],
      })
      .populate("variant");

    const subTotal = remainingItems.reduce((sum, item) => {
      const price = item.variant?.pricing?.sellingPrice || 0;
      return sum + price * item.quantity;
    }, 0);

    const shippingCharges =
      remainingItems.length > 0
        ? (subTotal > 500 ? 0 : 0)
        : 0;

    const grandTotal = subTotal + shippingCharges;

    const formattedCart = remainingItems.map(item => ({
      _id: item._id,
      quantity: item.quantity,

      product: {
        ...item.product.toObject(),
        category: item.product.category?.name,
        subCategory: item.product.subCategory?.name,
        subCategoryLevel2: item.product.subCategoryLevel2?.name,
      },

      variant: item.variant,

      price: item.variant?.pricing?.sellingPrice || 0,
      mrp: item.variant?.pricing?.mrp || 0,

      image:
        item.variant?.images?.find(img => img.isPrimary)?.url ||
        item.variant?.images?.[0]?.url ||
        "",
    }));

    res.json({
      success: true,
      message: "Cart updated successfully",
      count: formattedCart.length,
      subTotal,
      shippingCharges,
      grandTotal,
      cartItems: formattedCart,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
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


