package data.model.order

data class MyOrdersResponse(
    val success: Boolean,
    val count: Int,
    val orders: List<Order>
)

data class OrderDetailsResponse(
    val success: Boolean,
    val order: Order
)

data class Order(

    val _id: String,

    val orderNumber: String,

    val status: String,

    val createdAt: String,

    val pricing: Pricing,

    val payment: Payment,

    val shippingAddress: ShippingAddress,

    val shipment: Shipment?,

    val items: List<OrderItem>

)

data class OrderItem(

    val seller: String?,

    val product: Product?,

    val variant: Variant?,

    val sku: String?,

    val quantity: Int,

    val pricing: ItemPricing,

    val snapshot: Snapshot,

    val status: String

)

data class Product(

    val _id: String?,

    val title: String?,

    // ProductSchema me String hai
    val brand: String?,

    // populate hone par Object aayega
    val category: Category?,

    val subCategory: Category?,

    val subCategoryLevel2: Category?

)

data class Category(

    val _id: String?,

    val name: String?

)

data class Variant(

    val _id: String?,

    val variantName: String?,

    val sku: String?,

    val attributes: List<Attribute>?,

    val images: List<Image>?,

    val pricing: VariantPricing?,

    val inventory: Inventory?

)

data class Attribute(

    val name: String?,

    val value: String?

)

data class Image(

    val url: String?,

    val public_id: String?,

    val alt: String?,

    val isPrimary: Boolean?,

    val sortOrder: Int?

)

data class VariantPricing(

    val mrp: Double?,

    val sellingPrice: Double?,

    val costPrice: Double?,

    val tax: Double?,

    val discount: Double?

)

data class Inventory(

    val stock: Int?,

    val reserved: Int?,

    val lowStockAlert: Int?

)

data class Snapshot(

    val title: String,

    val variantName: String?,

    val image: String?,

    val attributes: List<Attribute>?

)

data class ItemPricing(

    val mrp: Double,

    val sellingPrice: Double,

    val costPrice: Double?,

    val tax: Double?,

    val discount: Double?,

    val total: Double

)

data class Pricing(

    val subtotal: Double,

    val discount: Double,

    val shippingCharge: Double,

    val tax: Double,

    val totalAmount: Double,

    val platformFee: Double? = 0.0

)

data class Payment(

    val method: String,

    val status: String,

    val transactionId: String?,

    val paymentProvider: String?

)

data class ShippingAddress(

    val fullName: String,

    val phone: String,

    val addressLine1: String,

    val addressLine2: String?,

    val landmark: String?,

    val city: String,

    val state: String,

    val country: String,

    val pincode: String

) {

    val fullAddress: String
        get() = listOf(
            addressLine1,
            addressLine2,
            landmark,
            city,
            state,
            country,
            pincode
        ).filterNot {
            it.isNullOrBlank()
        }.joinToString(", ")

}

data class Shipment(

    val courier: String?,

    val trackingId: String?,

    val trackingUrl: String?

)