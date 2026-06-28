import slugify from "slugify";
import { Seller } from "../models/SellerModel.js";


export const generateSlug = async (storeName) => {

    let slug = slugify(storeName,{
        lower:true,
        strict:true
    });

    let exists = await Seller.findOne({
        "store.storeSlug":slug
    });

    if(!exists) return slug;

    let count = 1;

    while(exists){

        slug = `${slugify(storeName,{
            lower:true,
            strict:true
        })}-${count}`;

        exists = await Seller.findOne({
            "store.storeSlug":slug
        });

        count++;
    }

    return slug;

};