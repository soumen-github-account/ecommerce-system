package data.remote.response

data class TrackingResponse(

    val success: Boolean,

    val tracking: List<TrackingItem>

)

data class TrackingItem(

    val status: String,

    val title: String,

    val description: String,

    val completed: Boolean,

    val date: String?

)