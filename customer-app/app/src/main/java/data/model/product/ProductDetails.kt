package data.model.product

import com.google.gson.annotations.SerializedName
import data.model.category.Category
import data.model.category.SubCategory
import data.model.category.SubCategoryLevel2

data class ProductDetails(

    @SerializedName("_id")
    val id: String,

    val productId: String,

    val title: String,

    val brand: String,

    val description: String,

    val shortDescription: String,

    val category: Category,

    val subCategory: SubCategory,

    val subCategoryLevel2: SubCategoryLevel2,

    val highlights: List<String>,

    val specifications: List<Specification>,

    val images: List<ProductImage>,

    val pricing: Pricing,

    val inventory: Inventory,

    val shipping: Shipping,

    val availableAttributes: Map<String, List<AvailableAttribute>>,

    val variants: List<ProductVariant>
)


data class ProductImage(
    val url:String,
    val public_id:String?,
    val alt:String?,
    val isPrimary:Boolean?,
    val sortOrder:Int?
)

data class Specification(
    val group: String,
    val fields: List<SpecificationField>
)

data class SpecificationField(
    val key: String,
    val value: String
)

data class Shipping(
    val weight: Double,
    val dimensions: Dimensions,
    val packageType: String,
    val volumetricWeight: Double
)

data class Dimensions(
    val length: Double,
    val breadth: Double,
    val height: Double
)

data class ProductVariant(

    val variantId: String,

    val variantName: String,

    val attributes: List<Attribute>,

    val images: List<ProductImage>,

    val price: VariantPrice,

    val stock: Int
)

data class VariantPrice(

    val mrp: Double,

    val sellingPrice: Double,

    val discount: Double
)

data class AvailableAttribute(

    val variantId: String,

    val value: String,

    val image: String,

    val price: Double,

    val stock: Int
)
