import { Package } from "lucide-react";

const ProductPreview = ({ product }) => {
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url;

  return (
    <div className="p-6">

      {/* ================= TOP SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">

        {/* IMAGE */}
        <div>
          <div className="w-full h-[320px] border border-[#e5e7eb] rounded-lg flex items-center justify-center bg-white overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <Package
                size={50}
                className="text-[#98a2b3]"
              />
            )}
          </div>

          {/* IMAGE THUMBNAILS */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {product.images.map((image, index) => (
                <div
                  key={image.public_id || index}
                  className={`w-[58px] h-[58px] rounded-md border ${
                    image.isPrimary
                      ? "border-[#315bea]"
                      : "border-[#e5e7eb]"
                  } flex-shrink-0 overflow-hidden`}
                >
                  <img
                    src={image.url}
                    alt={image.alt || product.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}
        <div>

          <p className="text-[11px] text-[#667085] uppercase tracking-wide">
            {product.brand}
          </p>

          <h1 className="mt-2 text-[20px] font-semibold text-[#171c2b] leading-7">
            {product.title}
          </h1>

          <p className="mt-3 text-[13px] text-[#667085] leading-6">
            {product.shortDescription}
          </p>

          {/* CATEGORY */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-2.5 py-1 rounded-md bg-[#f1f5ff] text-[#315bea] text-[11px]">
              {product.category?.name}
            </span>

            {product.subCategory?.name && (
              <span className="px-2.5 py-1 rounded-md bg-[#f7f8fa] text-[#475467] text-[11px]">
                {product.subCategory.name}
              </span>
            )}

            {product.subCategoryLevel2?.name && (
              <span className="px-2.5 py-1 rounded-md bg-[#f7f8fa] text-[#475467] text-[11px]">
                {product.subCategoryLevel2.name}
              </span>
            )}
          </div>

          {/* PRICE */}
          <div className="mt-6 p-4 rounded-lg bg-[#f8f9fb] border border-[#e5e7eb]">
            <p className="text-[11px] text-[#667085]">
              Current Price
            </p>

            <div className="flex items-center gap-3 mt-1">
              <span className="text-[22px] font-semibold text-[#171c2b]">
                ₹{product.pricing?.sellingPrice}
              </span>

              <span className="text-[13px] text-[#98a2b3] line-through">
                ₹{product.pricing?.mrp}
              </span>

              <span className="text-[12px] font-medium text-[#079455]">
                {product.pricing?.discount}% OFF
              </span>
            </div>
          </div>

          {/* INVENTORY */}
          <div className="grid grid-cols-3 gap-3 mt-4">

            <InfoBox
              label="Stock"
              value={product.inventory?.stock}
            />

            <InfoBox
              label="Reserved"
              value={product.inventory?.reserved}
            />

            <InfoBox
              label="Low Stock Alert"
              value={product.inventory?.lowStockAlert}
            />

          </div>
        </div>
      </div>

      {/* ================= HIGHLIGHTS ================= */}
      <Section title="Highlights">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {product.highlights?.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-[12px] text-[#475467]"
            >
              <span className="mt-[6px] w-[5px] h-[5px] rounded-full bg-[#315bea]" />
              {item}
            </div>
          ))}
        </div>

      </Section>

      {/* ================= SPECIFICATIONS ================= */}
      <Section title="Specifications">

        <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
          {product.specifications?.map((group, index) => (
            <div key={index}>

              <div className="px-4 py-3 bg-[#f8f9fb] border-b border-[#e5e7eb]">
                <p className="text-[12px] font-semibold text-[#344054]">
                  {group.group}
                </p>
              </div>

              {group.fields?.map((field, fieldIndex) => (
                <div
                  key={fieldIndex}
                  className="grid grid-cols-[180px_1fr] px-4 py-2.5 border-b border-[#f0f1f3] last:border-b-0"
                >
                  <span className="text-[11px] text-[#667085]">
                    {field.key}
                  </span>

                  <span className="text-[12px] text-[#344054]">
                    {field.value}
                  </span>
                </div>
              ))}

            </div>
          ))}
        </div>

      </Section>

      {/* ================= VARIANTS ================= */}
      <Section title={`Variants (${product.variants?.length || 0})`}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {product.variants?.map((variant) => {

            const variantImage =
              variant.images?.find(
                (img) => img.isPrimary
              )?.url ||
              variant.images?.[0]?.url;

            return (
              <div
                key={variant.variantId}
                className="border border-[#e5e7eb] rounded-lg p-4"
              >

                <div className="flex gap-4">

                  <div className="w-[72px] h-[72px] border border-[#e5e7eb] rounded-md overflow-hidden flex-shrink-0">
                    {variantImage && (
                      <img
                        src={variantImage}
                        alt={variant.variantName}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>

                  <div className="min-w-0">

                    <p className="text-[13px] font-semibold text-[#171c2b]">
                      {variant.variantName}
                    </p>

                    <p className="mt-1 text-[11px] text-[#667085]">
                      Variant ID: {variant.variantId}
                    </p>

                    <div className="flex items-center gap-3 mt-2">

                      <span className="text-[13px] font-semibold">
                        ₹{variant.price?.sellingPrice}
                      </span>

                      <span className="text-[11px] text-[#98a2b3] line-through">
                        ₹{variant.price?.mrp}
                      </span>

                      <span className="text-[11px] text-[#079455]">
                        {variant.price?.discount}% OFF
                      </span>

                    </div>

                    <p className="mt-1 text-[11px] text-[#475467]">
                      Stock: {variant.stock}
                    </p>

                  </div>
                </div>

                {/* ATTRIBUTES */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {variant.attributes?.map((attr, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#f7f8fa] border border-[#e5e7eb] rounded text-[10px] text-[#475467]"
                    >
                      {attr.name}: {attr.value}
                    </span>
                  ))}
                </div>

              </div>
            );
          })}

        </div>

      </Section>

      {/* ================= DESCRIPTION ================= */}
      <Section title="Description">

        <p className="text-[12px] text-[#475467] leading-6 whitespace-pre-line">
          {product.description}
        </p>

      </Section>

      {/* ================= SHIPPING ================= */}
      <Section title="Shipping">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          <InfoBox
            label="Weight"
            value={`${product.shipping?.weight || 0} kg`}
          />

          <InfoBox
            label="Length"
            value={`${product.shipping?.dimensions?.length || 0} cm`}
          />

          <InfoBox
            label="Breadth"
            value={`${product.shipping?.dimensions?.breadth || 0} cm`}
          />

          <InfoBox
            label="Height"
            value={`${product.shipping?.dimensions?.height || 0} cm`}
          />

        </div>

      </Section>

    </div>
  );
};

const InfoBox = ({ label, value }) => {
  return (
    <div className="border border-[#e5e7eb] rounded-lg px-3 py-3">
      <p className="text-[10px] text-[#667085]">
        {label}
      </p>

      <p className="mt-1 text-[13px] font-semibold text-[#171c2b]">
        {value ?? "-"}
      </p>
    </div>
  );
};


const Section = ({ title, children }) => {
  return (
    <div className="mt-7 pt-6 border-t border-[#e5e7eb]">

      <h3 className="text-[14px] font-semibold text-[#171c2b] mb-4">
        {title}
      </h3>

      {children}

    </div>
  );
};

export default ProductPreview;