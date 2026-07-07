package ui.product

import data.model.product.AllDetailsItem

data class DetailsCache(

    val features: List<AllDetailsItem> = emptyList(),

    val specifications: List<AllDetailsItem> = emptyList(),

    val description: List<AllDetailsItem> = emptyList(),

    val manufacturer: List<AllDetailsItem> = emptyList()

)