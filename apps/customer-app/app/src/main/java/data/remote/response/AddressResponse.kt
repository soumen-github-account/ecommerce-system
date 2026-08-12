package data.model.address

import com.google.gson.annotations.SerializedName

data class AddressResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("message") val message: String,
    @SerializedName("address") val address: AddressData?
)

data class AddressData(
    @SerializedName("_id") val id: String,
    @SerializedName("user") val userId: String,
    @SerializedName("fullName") val fullName: String,
    @SerializedName("phone") val phone: String,
    @SerializedName("pincode") val pincode: String,
    @SerializedName("state") val state: String,
    @SerializedName("city") val city: String,
    @SerializedName("addressLine1") val addressLine1: String,
    @SerializedName("addressLine2") val addressLine2: String?,
    @SerializedName("landmark") val landmark: String?,
    @SerializedName("addressType") val addressType: String,
    @SerializedName("isDefault") val isDefault: Boolean
)