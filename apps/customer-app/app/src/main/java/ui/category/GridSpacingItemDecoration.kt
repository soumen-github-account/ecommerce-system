package ui.category
import android.graphics.Rect
import android.view.View
import androidx.recyclerview.widget.RecyclerView

class GridSpacingItemDecoration(
    private val spanCount: Int,     // Kitne columns hain (Jaise right side ke liye 3)
    private val spacing: Int,       // Kitna space chahiye Pixels me
    private val includeEdge: Boolean // Screen ke extreme corners par bhi gap chahiye ya nahi
) : RecyclerView.ItemDecoration() {

    override fun getItemOffsets(
        outRect: Rect,
        view: View,
        parent: RecyclerView,
        state: RecyclerView.State
    ) {
        // Item ki current position pata karo list me
        val position = parent.getChildAdapterPosition(view)

        // Agar position valid nahi hai toh kuch mat karo
        if (position == RecyclerView.NO_POSITION) return

        // Column index nikalte hain (0 se lekar spanCount - 1 tak)
        val column = position % spanCount

        if (includeEdge) {
            // Left aur Right margins setting corners ke sath barabar distribute karne ke liye
            outRect.left = spacing - column * spacing / spanCount
            outRect.right = (column + 1) * spacing / spanCount

            // Agar item pehli row (top row) me hai, toh top par bhi spacing do
            if (position < spanCount) {
                outRect.top = spacing
            }
            // Har item ke niche spacing do
            outRect.bottom = spacing

        } else {
            // Agar edges include nahi karni hain (sirf items ke aapas ke beech me gap chahiye)
            outRect.left = column * spacing / spanCount
            outRect.right = spacing - (column + 1) * spacing / spanCount

            // Top row ko chhodkar baki sabhi rows ke upar spacing do
            if (position >= spanCount) {
                outRect.top = spacing
            }
        }
    }
}