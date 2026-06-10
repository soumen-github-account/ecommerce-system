package data.remote.request

import com.google.gson.annotations.SerializedName

data class AddressRequest(
    @SerializedName("fullName") val fullName: String,
    @SerializedName("phone") val phone: String,
    @SerializedName("pincode") val pincode: String,
    @SerializedName("state") val state: String,
    @SerializedName("city") val city: String,
    @SerializedName("addressLine1") val addressLine1: String,
    @SerializedName("addressLine2") val addressLine2: String?,
    @SerializedName("landmark") val landmark: String?,
    @SerializedName("addressType") val addressType: String, // "Home", "Office" or "Other"
    @SerializedName("isDefault") val isDefault: Boolean
)