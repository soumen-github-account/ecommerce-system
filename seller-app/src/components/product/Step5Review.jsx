import React from "react";

export default function Step5Review({
  product,
  previous,
  onSubmit,
}) {
  console.log("Review Data:", product);
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="border-b pb-6 mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Review & Publish
        </h2>
        <p className="text-gray-500">
          Pehle check karein, phir duniya ko dikhayein.
        </p>
      </div>

      <div className="space-y-10">

        {/* ===================== */}
        {/* BASIC INFO */}
        {/* ===================== */}
        <section>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
            <span className="bg-blue-100 p-2 rounded-full mr-2">1</span>
            Basic Information
          </h3>

          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
            <div>
              <p className="text-xs text-gray-400 uppercase">
                Product Title
              </p>
              <p className="font-medium">
                {product?.title || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase">
                Brand / Category
              </p>
              <p className="font-medium">
                {product?.brand || "-"} / {product?.category || "-"}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-xs text-gray-400 uppercase">
                Description
              </p>
              <p className="text-sm text-gray-600 italic line-clamp-2">
                {product?.description || "No description provided."}
              </p>
            </div>
          </div>
        </section>

        {/* ===================== */}
        {/* SPECIFICATIONS */}
        {/* ===================== */}
        <section>
          <h3 className="text-lg font-semibold text-purple-600 mb-4 flex items-center">
            <span className="bg-purple-100 p-2 rounded-full mr-2">2</span>
            Specifications
          </h3>

          <div className="border rounded-lg overflow-hidden">
            {(product?.specification || []).length === 0 ? (
              <p className="p-4 text-gray-500">
                No specifications added
              </p>
            ) : (
              product.specification.map((spec, idx) => (
                <div
                  key={idx}
                  className="border-b last:border-b-0 p-4"
                >
                  <p className="font-bold text-gray-700 mb-2">
                    {spec?.group || "Untitled Group"}
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    {(spec?.fields || []).map((f, i) => (
                      <div key={i} className="text-sm">
                        <span className="text-gray-400">
                          {f?.key || "-"}:
                        </span>{" "}
                        <span className="font-medium">
                          {f?.value || "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ===================== */}
        {/* VARIANTS */}
        {/* ===================== */}
        <section>
          <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
            <span className="bg-green-100 p-2 rounded-full mr-2">3</span>
            Variants Matrix
          </h3>

          <div className="overflow-x-auto border rounded-lg">

            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-xs uppercase">
                    SKU / Attributes
                  </th>
                  <th className="p-3 text-xs uppercase">
                    Pricing
                  </th>
                  <th className="p-3 text-xs uppercase">
                    Stock
                  </th>
                  <th className="p-3 text-xs uppercase">
                    Images
                  </th>
                </tr>
              </thead>

              <tbody>
                {(product?.variants || []).map((v, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 text-sm">
                      <div className="font-bold">
                        {v?.sku || "N/A"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {v?.attributes?.color || "-"} |
                        {" "}
                        {v?.attributes?.size || "-"} |
                        {" "}
                        {v?.attributes?.material || "-"}
                      </div>
                    </td>

                    <td className="p-3 text-sm font-medium">
                      ₹{v?.sellingPrice || 0}{" "}
                      <span className="text-xs text-gray-400 line-through">
                        ₹{v?.mrp || 0}
                      </span>
                    </td>

                    <td className="p-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          (v?.stock || 0) > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {v?.stock || 0} in stock
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex -space-x-2">

                        {v?.images?.[0]?.url ? (
                          <img
                            src={v.images[0].url}
                            className="w-8 h-8 rounded border object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded" />
                        )}

                        <div className="w-8 h-8 bg-blue-500 text-white text-[10px] flex items-center justify-center rounded">
                          +{v?.images?.length || 0}
                        </div>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </section>

      </div>

      {/* FOOTER */}
      <div className="flex justify-between mt-12 pt-8 border-t">

        <button
          onClick={previous}
          className="text-gray-600 font-semibold px-8 py-3 border rounded-lg hover:bg-gray-50"
        >
          ← Edit Details
        </button>

        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold px-12 py-3 rounded-lg shadow"
        >
          🚀 Publish Product
        </button>

      </div>

    </div>
  );
}