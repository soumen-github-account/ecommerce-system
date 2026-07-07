package ui.product

import data.model.product.AllDetailsItem
import data.model.product.DescriptionItem
import data.model.product.FeatureItem
import data.model.product.Field
import data.model.product.ManufacturerItem
import data.model.product.ProductDetails
import data.model.product.SpecificationItem


object ProductDetailsMapper {

    fun getFeatures(
        product: ProductDetails
    ): List<AllDetailsItem> {

        val list = mutableListOf<AllDetailsItem>()

        product.highlights.forEach { text ->

            val split = text.split(" ", limit = 2)

            if (split.size == 2) {

                list.add(

                    FeatureItem(

                        split[0],

                        split[1]

                    )

                )

            }

        }

        return list

    }

    fun getSpecifications(
        product: ProductDetails
    ): List<AllDetailsItem> {

        val list = mutableListOf<AllDetailsItem>()

        product.specifications.forEach { spec ->

            list.add(

                SpecificationItem(

                    group = spec.group,

                    fields = spec.fields.map {

                        Field(

                            key = it.key,

                            value = it.value

                        )

                    }

                )

            )

        }

        return list

    }

    fun getDescription(
        product: ProductDetails
    ): List<AllDetailsItem> {

        return listOf(

            DescriptionItem(

                product.description

            )

        )

    }

    fun getManufacturer(
        product: ProductDetails
    ): List<AllDetailsItem> {

        val list = mutableListOf<AllDetailsItem>()

        list.add(

            ManufacturerItem(

                "Brand",

                product.brand

            )

        )

        list.add(

            ManufacturerItem(

                "Weight",

                "${product.shipping.weight} Kg"

            )

        )

        list.add(

            ManufacturerItem(

                "Package",

                product.shipping.packageType

            )

        )

        return list

    }

}