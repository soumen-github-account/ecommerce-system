package data.model.address

import com.google.gson.annotations.SerializedName

data class AddressListResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("count") val count: Int,
    @SerializedName("addresses") val addresses: List<AddressData> = emptyList()
)