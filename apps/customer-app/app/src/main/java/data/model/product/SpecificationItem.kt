package data.model.product

data class SpecificationItem(

    val group: String,

    val fields: List<Field>

) : AllDetailsItem()

data class Field(
    val key: String,
    val value: String
)