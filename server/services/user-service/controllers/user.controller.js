import { Address } from "../models/AddressModel.js"
import { Cart } from "../models/CartModel.js";
import { Wishlist } from "../models/WishlistModel.js"
import axios from "axios";

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


export const createWishList = async (req, res) => {
    
    try {

        const userId = req.user.id;
        const { productId, variantId, sellerId } = req.body;

        console.log(userId)

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

    const wishlist = await Wishlist.findOne({ user: userId }).lean();

    if (!wishlist || wishlist.items.length === 0) {
      return res.status(200).json({
        success: true,
        totalItems: 0,
        wishlist: [],
      });
    }

    // Product Service ke liye payload
    const items = wishlist.items.map((item) => ({
      productId: item.product,
      variantId: item.variant,
      sellerId: item.seller,
    }));

    // Product Service Call
    const response = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL}/products/wishlist-details`,
      {
        items,
      }
    );

    return res.status(200).json({
      success: true,
      totalItems: response.data.wishlist.length,
      wishlist: response.data.wishlist,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
};


export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, variant } = req.body;
    const userId = req.user.id;

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

    const cart = await Cart.find({
      user: userId,
    }).lean();

    if (!cart.length) {
      return res.json({
        success: true,
        count: 0,
        subTotal: 0,
        shippingCharges: 0,
        grandTotal: 0,
        cartItems: [],
      });
    }

    const payload = cart.map(item => ({
      cartId: item._id,
      productId: item.product,
      variantId: item.variant,
      quantity: item.quantity,
    }));

    const { data } = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL}/products/cart-products`,
      {
        items: payload,
      }
    );

    const formattedCart = data.cartItems;

    const subTotal = formattedCart.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const shippingCharges =
      formattedCart.length > 0
        ? (subTotal > 500 ? 0 : 0)
        : 0;

    const grandTotal = subTotal + shippingCharges;

    return res.json({
      success: true,
      count: formattedCart.length,
      subTotal,
      shippingCharges,
      grandTotal,
      cartItems: formattedCart,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body; // Cart _id

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

    const remainingItems = await Cart.find({
      user: userId,
    }).lean();

    const formattedCart = remainingItems.map((item) => ({
      _id: item._id,

      productId: item.product,
      variantId: item.variant,

      quantity: item.quantity,

      // Product Service integration ke baad fill hoga
      product: null,
      variant: null,

      price: 0,
      mrp: 0,
      image: "",
    }));

    return res.status(200).json({
      success: true,
      message: "Item removed successfully",

      count: formattedCart.length,

      subTotal: 0,
      shippingCharges: 0,
      grandTotal: 0,

      cartItems: formattedCart,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
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

      // TODO:
      // Product Service se stock check karna hai.
      // Abhi skip kar rahe hain.

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
    }).lean();

    const formattedCart = remainingItems.map((item) => ({
      _id: item._id,

      productId: item.product,
      variantId: item.variant,

      quantity: item.quantity,

      // Product Service integration ke baad fill honge
      product: null,
      variant: null,

      price: 0,
      mrp: 0,
      image: "",
    }));

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",

      count: formattedCart.length,

      subTotal: 0,
      shippingCharges: 0,
      grandTotal: 0,

      cartItems: formattedCart,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAddressById = async (req, res) => {
  try {

    const address = await Address.findOne({
      _id: req.params.addressId,
      user: req.user.id,
    }).lean();

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      address,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};