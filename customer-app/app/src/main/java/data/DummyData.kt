//package data.dummy
//
//import data.model.category.Category
//import data.model.category.SubCategory
//import data.model.category.SubCategoryLevel2
//import data.model.product.Product
//
//object DummyData {
//
//
//    val subCategoryLevel2 = listOf(
//
//        SubCategoryLevel2(
//            id = "mens_tshirts",
//            name = "Men T-Shirts",
//            img = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "mens_jeans",
//            name = "Men Jeans",
//            img = "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "women_dresses",
//            name = "Women Dresses",
//            img = "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "women_tops",
//            name = "Women Tops",
//            img = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80"
//        ),
//
//        // ================= MOBILES =================
//
//        SubCategoryLevel2(
//            id = "android_phones",
//            name = "Android Phones",
//            img = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "iphone_devices",
//            name = "iPhones",
//            img = "https://images.unsplash.com/photo-1510557880182-3f8a0d0d0d0f?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "mobile_cases",
//            name = "Mobile Cases",
//            img = "https://images.unsplash.com/photo-1601593346740-925612772716?w=400&q=80"
//        ),
//
//        // ================= BEAUTY =================
//
//        SubCategoryLevel2(
//            id = "face_wash",
//            name = "Face Wash",
//            img = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "lipsticks",
//            name = "Lipsticks",
//            img = "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "hair_oil",
//            name = "Hair Oil",
//            img = "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400&q=80"
//        ),
//
//        // ================= ELECTRONICS =================
//
//        SubCategoryLevel2(
//            id = "laptops",
//            name = "Laptops",
//            img = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "headphones",
//            name = "Headphones",
//            img = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "smart_watch",
//            name = "Smart Watch",
//            img = "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400&q=80"
//        ),
//
//        // ================= HOME DECOR =================
//
//        SubCategoryLevel2(
//            id = "wall_paintings",
//            name = "Wall Paintings",
//            img = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "lamps",
//            name = "Decor Lamps",
//            img = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "curtains",
//            name = "Curtains",
//            img = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80"
//        ),
//
//        // ================= APPLIANCES =================
//
//        SubCategoryLevel2(
//            id = "refrigerators",
//            name = "Refrigerators",
//            img = "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "washing_machine",
//            name = "Washing Machine",
//            img = "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "microwave",
//            name = "Microwave Oven",
//            img = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80"
//        ),
//
//        // ================= TOYS =================
//
//        SubCategoryLevel2(
//            id = "remote_cars",
//            name = "Remote Cars",
//            img = "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "soft_toys",
//            name = "Soft Toys",
//            img = "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "building_blocks",
//            name = "Building Blocks",
//            img = "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80"
//        ),
//
//        // ================= HEALTH =================
//
//        SubCategoryLevel2(
//            id = "protein_powder",
//            name = "Protein Powder",
//            img = "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "vitamins",
//            name = "Vitamins",
//            img = "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "health_drinks",
//            name = "Health Drinks",
//            img = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80"
//        ),
//
//        // ================= SPORTS =================
//
//        SubCategoryLevel2(
//            id = "cricket_bats",
//            name = "Cricket Bats",
//            img = "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "footballs",
//            name = "Footballs",
//            img = "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "gym_equipment",
//            name = "Gym Equipment",
//            img = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80"
//        ),
//
//        // ================= BOOKS =================
//
//        SubCategoryLevel2(
//            id = "novels",
//            name = "Novels",
//            img = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "education_books",
//            name = "Education Books",
//            img = "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "comics",
//            name = "Comics",
//            img = "https://images.unsplash.com/photo-1603162525937-97d4d0d6a7be?w=400&q=80"
//        ),
//
//        // ================= FURNITURE =================
//
//        SubCategoryLevel2(
//            id = "sofas",
//            name = "Sofas",
//            img = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "beds",
//            name = "Beds",
//            img = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80"
//        ),
//
//        SubCategoryLevel2(
//            id = "office_chairs",
//            name = "Office Chairs",
//            img = "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&q=80"
//        )
//    )
//
//    val subCategories = listOf(
//
//        SubCategory(
//            id = "fashion_men",
//            name = "Men Fashion",
//            img = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80",
//            subCategoryLevel2Ids = listOf(
//                "mens_tshirts",
//                "mens_jeans"
//            )
//        ),
//
//        SubCategory(
//            id = "fashion_women",
//            name = "Women Fashion",
//            img = "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80",
//            subCategoryLevel2Ids = listOf(
//                "women_dresses",
//                "women_tops"
//            )
//        ),
//
//        SubCategory(
//            id = "mobile_devices",
//            name = "Mobile Devices",
//            img = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
//            subCategoryLevel2Ids = listOf(
//                "android_phones",
//                "iphone_devices"
//            )
//        ),
//
//        SubCategory(
//            id = "mobile_accessories",
//            name = "Mobile Accessories",
//            img = "https://images.unsplash.com/photo-1601593346740-925612772716?w=400&q=80",
//            subCategoryLevel2Ids = listOf(
//                "mobile_cases"
//            )
//        ),
//
//        SubCategory(
//            id = "beauty_products",
//            name = "Beauty Products",
//            img = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
//            subCategoryLevel2Ids = listOf(
//                "face_wash",
//                "lipsticks",
//                "hair_oil"
//            )
//        ),
//
//        SubCategory(
//            id = "electronics_devices",
//            name = "Electronics Devices",
//            img = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
//            subCategoryLevel2Ids = listOf(
//                "laptops",
//                "headphones",
//                "smart_watch"
//            )
//        ),
//
//        SubCategory(
//            id = "home_decor_items",
//            name = "Home Decor",
//            img = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80",
//            subCategoryLevel2Ids = listOf(
//                "wall_paintings",
//                "lamps",
//                "curtains"
//            )
//        ),
//
//        SubCategory(
//            id = "home_appliances",
//            name = "Home Appliances",
//            img = "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=80",
//            subCategoryLevel2Ids = listOf(
//                "refrigerators",
//                "washing_machine",
//                "microwave"
//            )
//        ),
//
//        SubCategory(
//            id = "toys_games",
//            name = "Toys & Games",
//            img = "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80",
//            subCategoryLevel2Ids = listOf(
//                "remote_cars",
//                "soft_toys",
//                "building_blocks"
//            )
//        ),
//
//        SubCategory(
//            id = "health_products",
//            name = "Health Products",
//            img = "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=400&q=80",
//            subCategoryLevel2Ids = listOf(
//                "protein_powder",
//                "vitamins",
//                "health_drinks"
//            )
//        ),
//
//        SubCategory(
//            id = "sports_items",
//            name = "Sports Items",
//            img = "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=400&q=80",
//            subCategoryLevel2Ids = listOf(
//                "cricket_bats",
//                "footballs",
//                "gym_equipment"
//            )
//        ),
//
//        SubCategory(
//            id = "books_collection",
//            name = "Books Collection",
//            img = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
//            subCategoryLevel2Ids = listOf(
//                "novels",
//                "education_books",
//                "comics"
//            )
//        ),
//
//        SubCategory(
//            id = "furniture_items",
//            name = "Furniture",
//            img = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80",
//            subCategoryLevel2Ids = listOf(
//                "sofas",
//                "beds",
//                "office_chairs"
//            )
//        )
//    )
//
//    val categories = listOf(
//
//        Category(
//            id = "id_fashion",
//            name = "Fashion",
//            img = "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80",
//            subCategoryIds = listOf(
//                "fashion_men",
//                "fashion_women"
//            )
//        ),
//
//        Category(
//            id = "id_mobiles",
//            name = "Mobiles",
//            img = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
//            subCategoryIds = listOf(
//                "mobile_devices",
//                "mobile_accessories"
//            )
//        ),
//
//        Category(
//            id = "id_beauty",
//            name = "Beauty",
//            img = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
//             subCategoryIds = listOf(
//                "beauty_products"
//            )
//        ),
//
//        Category(
//            id = "id_electronics",
//            name = "Electronics",
//            img = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
//            subCategoryIds = listOf(
//                "electronics_devices"
//            )
//        ),
//
//        Category(
//            id = "id_homeDecore",
//            name = "Home Decor",
//            img = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80",
//            subCategoryIds = listOf(
//                "home_decor_items"
//            )
//        ),
//
//        Category(
//            id = "id_appliances",
//            name = "Appliances",
//            img = "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=80",
//            subCategoryIds = listOf(
//                "home_appliances"
//            )
//        ),
//
//        Category(
//            id = "id_toys",
//            name = "Toys",
//            img = "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80",
//            subCategoryIds = listOf(
//                "toys_games"
//            )
//        ),
//
//        Category(
//            id = "id_health",
//            name = "Health",
//            img = "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=400&q=80",
//            subCategoryIds = listOf(
//                "health_products"
//            )
//        ),
//
//        Category(
//            id = "id_sports",
//            name = "Sports",
//            img = "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=400&q=80",
//            subCategoryIds = listOf(
//                "sports_items"
//            )
//        ),
//
//        Category(
//            id = "id_books",
//            name = "Books",
//            img = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
//            subCategoryIds = listOf(
//                "books_collection"
//            )
//        ),
//
//        Category(
//            id = "id_furniture",
//            name = "Furniture",
//            img = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80",
//            subCategoryIds = listOf(
//                "furniture_items"
//            )
//        )
//    )
//
//    val products = listOf(
//
//        // ================= FASHION =================
//
//        Product(
//            id = "01",
//            name = "Levi's Men Printed T-Shirt",
//            images = listOf(
//                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
//            ),
//            categoryId = "id_fashion",
//            subCategoryId = "fashion_men",
//            subCategoryLevel2Id = "mens_tshirts",
//            unit = "size",
//            type = listOf("M", "L", "XL"),
//            stock = 25,
//            price = listOf(799),
//            discount = 20,
//            description = "Premium cotton printed t-shirt for men.",
//            details = listOf("Brand", "Color"),
//            detailsType = listOf("Levi's", "Black"),
//            publish = true
//        ),
//
//        Product(
//            id = "02",
//            name = "Roadster Slim Fit Jeans",
//            images = listOf(
//                "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80"
//            ),
//            categoryId = "id_fashion",
//            subCategoryId = "fashion_men",
//            subCategoryLevel2Id = "mens_jeans",
//            unit = "size",
//            type = listOf("30", "32", "34"),
//            stock = 18,
//            price = listOf(1499),
//            discount = 35,
//            description = "Slim fit blue jeans for casual wear.",
//            details = listOf("Brand", "Fit"),
//            detailsType = listOf("Roadster", "Slim Fit"),
//            publish = true
//        ),
//
//        Product(
//            id = "03",
//            name = "Women Floral Dress",
//            images = listOf(
//                "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80"
//            ),
//            categoryId = "id_fashion",
//            subCategoryId = "fashion_women",
//            subCategoryLevel2Id = "women_dresses",
//            unit = "size",
//            type = listOf("S", "M", "L"),
//            stock = 14,
//            price = listOf(1799),
//            discount = 25,
//            description = "Beautiful floral dress for women.",
//            details = listOf("Brand", "Fabric"),
//            detailsType = listOf("Zara", "Cotton"),
//            publish = true
//        ),
//
//        // ================= MOBILES =================
//
//        Product(
//            id = "04",
//            name = "Samsung Galaxy Smartphone",
//            images = listOf(
//                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"
//            ),
//            categoryId = "id_mobiles",
//            subCategoryId = "mobile_devices",
//            subCategoryLevel2Id = "android_phones",
//            unit = "piece",
//            type = listOf("128GB", "256GB"),
//            stock = 10,
//            price = listOf(18999, 22999),
//            discount = 12,
//            description = "Fast Android smartphone with AMOLED display.",
//            details = listOf("Brand", "RAM"),
//            detailsType = listOf("Samsung", "8GB"),
//            publish = true
//        ),
//
//        Product(
//            id = "05",
//            name = "Apple iPhone 15",
//            images = listOf(
//                "https://images.unsplash.com/photo-1510557880182-3f8a0d0d0d0f?w=800&q=80"
//            ),
//            categoryId = "id_mobiles",
//            subCategoryId = "mobile_devices",
//            subCategoryLevel2Id = "iphone_devices",
//            unit = "piece",
//            type = listOf("128GB", "256GB"),
//            stock = 6,
//            price = listOf(79999, 89999),
//            discount = 5,
//            description = "Premium Apple iPhone with powerful performance.",
//            details = listOf("Brand", "Processor"),
//            detailsType = listOf("Apple", "A17 Bionic"),
//            publish = true
//        ),
//
//        Product(
//            id = "06",
//            name = "Shockproof Mobile Cover",
//            images = listOf(
//                "https://images.unsplash.com/photo-1601593346740-925612772716?w=800&q=80"
//            ),
//            categoryId = "id_mobiles",
//            subCategoryId = "mobile_accessories",
//            subCategoryLevel2Id = "mobile_cases",
//            unit = "piece",
//            type = listOf("Black", "Blue"),
//            stock = 40,
//            price = listOf(399),
//            discount = 30,
//            description = "Durable shockproof mobile case.",
//            details = listOf("Material", "Protection"),
//            detailsType = listOf("Silicone", "Drop Protection"),
//            publish = true
//        ),
//
//        // ================= BEAUTY =================
//
//        Product(
//            id = "07",
//            name = "Himalaya Neem Face Wash",
//            images = listOf(
//                "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"
//            ),
//            categoryId = "id_beauty",
//            subCategoryId = "beauty_products",
//            subCategoryLevel2Id = "face_wash",
//            unit = "ml",
//            type = listOf("100ml", "200ml"),
//            stock = 35,
//            price = listOf(120, 220),
//            discount = 10,
//            description = "Neem face wash for clear skin.",
//            details = listOf("Brand", "Skin Type"),
//            detailsType = listOf("Himalaya", "All Skin"),
//            publish = true
//        ),
//
//        Product(
//            id = "08",
//            name = "Matte Red Lipstick",
//            images = listOf(
//                "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80"
//            ),
//            categoryId = "id_beauty",
//            subCategoryId = "beauty_products",
//            subCategoryLevel2Id = "lipsticks",
//            unit = "piece",
//            type = listOf("Red", "Pink"),
//            stock = 22,
//            price = listOf(499),
//            discount = 18,
//            description = "Long lasting matte lipstick.",
//            details = listOf("Brand", "Finish"),
//            detailsType = listOf("Lakme", "Matte"),
//            publish = true
//        ),
//
//        // ================= ELECTRONICS =================
//
//        Product(
//            id = "09",
//            name = "HP Gaming Laptop",
//            images = listOf(
//                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"
//            ),
//            categoryId = "id_electronics",
//            subCategoryId = "electronics_devices",
//            subCategoryLevel2Id = "laptops",
//            unit = "piece",
//            type = listOf("8GB/512GB", "16GB/1TB"),
//            stock = 7,
//            price = listOf(55999, 74999),
//            discount = 15,
//            description = "Powerful gaming laptop with RTX graphics.",
//            details = listOf("Brand", "Processor"),
//            detailsType = listOf("HP", "Intel i7"),
//            publish = true
//        ),
//
//        Product(
//            id = "10",
//            name = "Wireless Bluetooth Headphones",
//            images = listOf(
//                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
//            ),
//            categoryId = "id_electronics",
//            subCategoryId = "electronics_devices",
//            subCategoryLevel2Id = "headphones",
//            unit = "piece",
//            type = listOf("Black", "White"),
//            stock = 30,
//            price = listOf(2499),
//            discount = 20,
//            description = "Noise cancellation wireless headphones.",
//            details = listOf("Battery", "Connectivity"),
//            detailsType = listOf("20 Hours", "Bluetooth 5.0"),
//            publish = true
//        ),
//
//        // ================= HOME DECOR =================
//
//        Product(
//            id = "11",
//            name = "Modern Wall Painting",
//            images = listOf(
//                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80"
//            ),
//            categoryId = "id_homeDecore",
//            subCategoryId = "home_decor_items",
//            subCategoryLevel2Id = "wall_paintings",
//            unit = "piece",
//            type = listOf("Medium", "Large"),
//            stock = 12,
//            price = listOf(999, 1499),
//            discount = 22,
//            description = "Premium decorative wall painting.",
//            details = listOf("Frame", "Style"),
//            detailsType = listOf("Wooden", "Modern"),
//            publish = true
//        ),
//
//        // ================= APPLIANCES =================
//
//        Product(
//            id = "12",
//            name = "Samsung Double Door Refrigerator",
//            images = listOf(
//                "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80"
//            ),
//            categoryId = "id_appliances",
//            subCategoryId = "home_appliances",
//            subCategoryLevel2Id = "refrigerators",
//            unit = "piece",
//            type = listOf("256L", "320L"),
//            stock = 5,
//            price = listOf(24999, 31999),
//            discount = 10,
//            description = "Energy efficient double door refrigerator.",
//            details = listOf("Brand", "Rating"),
//            detailsType = listOf("Samsung", "5 Star"),
//            publish = true
//        ),
//
//        // ================= TOYS =================
//
//        Product(
//            id = "13",
//            name = "Remote Control Racing Car",
//            images = listOf(
//                "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80"
//            ),
//            categoryId = "id_toys",
//            subCategoryId = "toys_games",
//            subCategoryLevel2Id = "remote_cars",
//            unit = "piece",
//            type = listOf("Red", "Blue"),
//            stock = 20,
//            price = listOf(899),
//            discount = 15,
//            description = "High speed remote control racing car.",
//            details = listOf("Battery", "Range"),
//            detailsType = listOf("Rechargeable", "20 Meter"),
//            publish = true
//        ),
//
//        // ================= HEALTH =================
//
//        Product(
//            id = "14",
//            name = "Whey Protein Powder",
//            images = listOf(
//                "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=800&q=80"
//            ),
//            categoryId = "id_health",
//            subCategoryId = "health_products",
//            subCategoryLevel2Id = "protein_powder",
//            unit = "kg",
//            type = listOf("1kg", "2kg"),
//            stock = 15,
//            price = listOf(1999, 3499),
//            discount = 20,
//            description = "High quality whey protein for gym.",
//            details = listOf("Flavor", "Protein"),
//            detailsType = listOf("Chocolate", "24g"),
//            publish = true
//        ),
//
//        // ================= SPORTS =================
//
//        Product(
//            id = "15",
//            name = "Kashmir Willow Cricket Bat",
//            images = listOf(
//                "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&q=80"
//            ),
//            categoryId = "id_sports",
//            subCategoryId = "sports_items",
//            subCategoryLevel2Id = "cricket_bats",
//            unit = "piece",
//            type = listOf("Short Handle"),
//            stock = 11,
//            price = listOf(2499),
//            discount = 12,
//            description = "Strong cricket bat for leather ball matches.",
//            details = listOf("Material", "Weight"),
//            detailsType = listOf("Willow", "1.2kg"),
//            publish = true
//        ),
//
//        // ================= BOOKS =================
//
//        Product(
//            id = "16",
//            name = "Atomic Habits Book",
//            images = listOf(
//                "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80"
//            ),
//            categoryId = "id_books",
//            subCategoryId = "books_collection",
//            subCategoryLevel2Id = "novels",
//            unit = "piece",
//            type = listOf("Paperback", "Hardcover"),
//            stock = 40,
//            price = listOf(399, 699),
//            discount = 8,
//            description = "Best selling self improvement book.",
//            details = listOf("Author", "Language"),
//            detailsType = listOf("James Clear", "English"),
//            publish = true
//        ),
//
//        // ================= FURNITURE =================
//
//        Product(
//            id = "17",
//            name = "Luxury Wooden Sofa",
//            images = listOf(
//                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80"
//            ),
//            categoryId = "id_furniture",
//            subCategoryId = "furniture_items",
//            subCategoryLevel2Id = "sofas",
//            unit = "piece",
//            type = listOf("3 Seater", "5 Seater"),
//            stock = 4,
//            price = listOf(18999, 28999),
//            discount = 18,
//            description = "Comfortable premium wooden sofa set.",
//            details = listOf("Material", "Color"),
//            detailsType = listOf("Wood", "Brown"),
//            publish = true
//        )
//    )
//}