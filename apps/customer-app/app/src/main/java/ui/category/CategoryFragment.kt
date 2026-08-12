package ui.category

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import com.ecommerce.citybasket.ui.category.LeftCategoryAdapter
import com.ecommerce.citybasket.ui.category.SubCategorySectionAdapter
import data.model.category.Category
import data.model.category.SubCategory
import data.remote.api.RetrofitClient
import kotlinx.coroutines.launch

class CategoryFragment : Fragment() {

    private lateinit var rvLeftCategory: RecyclerView
    private lateinit var rvCategoryItems: RecyclerView

    private lateinit var leftAdapter: LeftCategoryAdapter
    private lateinit var sectionAdapter: SubCategorySectionAdapter // 🔥 FIXED: Grid ke bajaye Section Adapter use hoga

    private var allCategoriesList = listOf<Category>()
    private var currentSubCategories = mutableListOf<SubCategory>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val view = inflater.inflate(R.layout.fragment_category, container, false)

        rvLeftCategory = view.findViewById(R.id.rvLeftCategory)
        rvCategoryItems = view.findViewById(R.id.rvCategoryItems)

        // 1. LEFT SIDE PANEL
        rvLeftCategory.layoutManager = LinearLayoutManager(requireContext())

        // 2. RIGHT SIDE VERTICAL PANEL (Iske andar automatic child grids banti hain)
        rvCategoryItems.layoutManager = LinearLayoutManager(requireContext())

        // 🔥 FIXED: Custom Section Adapter ko click callback ke sath map kiya
        sectionAdapter = SubCategorySectionAdapter(currentSubCategories) { selectedLevel2Item ->
            Toast.makeText(requireContext(), "Clicked Level 2: ${selectedLevel2Item.name}", Toast.LENGTH_SHORT).show()
        }
        rvCategoryItems.adapter = sectionAdapter

        // Original database fetch stream trigger
        loadOriginalServerCategories()

        return view
    }

    private fun loadOriginalServerCategories() {
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.categoryApi.getCategories()

                if (response.success) {
                    allCategoriesList = response.categories

                    leftAdapter = LeftCategoryAdapter(allCategoriesList) { categoryId ->
                        // 🔥 Left click par local state switch event execute hoga
                        switchRightPanelData(categoryId)
                    }
                    rvLeftCategory.adapter = leftAdapter

                    // Auto select first item on screen launch
                    if (allCategoriesList.isNotEmpty()) {
                        switchRightPanelData(allCategoriesList.first().id)
                    }
                }
            } catch (e: Exception) {
                Log.e("CATEGORY_FRAG_DEBUG", "Error: ${e.message}")
            }
        }
    }

    private fun switchRightPanelData(categoryId: String) {
        val selectedCategory = allCategoriesList.find { it.id == categoryId }

        val freshSubCategories = selectedCategory?.subCategoryIds ?: emptyList()

        currentSubCategories.clear()
        currentSubCategories.addAll(freshSubCategories)

        // 🔥 FIXED: Section adapter ko data notify karenge
        sectionAdapter.notifyDataSetChanged()
    }
}