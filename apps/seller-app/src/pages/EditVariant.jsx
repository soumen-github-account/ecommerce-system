import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Image as ImageIcon,
  Package,
  DollarSign,
  Warehouse,
  Truck,
  Settings,
} from "lucide-react";

import {
  getMyProducts,
  updateProductVariant,
} from "../services/productEditApi";

// =====================================================
// HELPERS
// =====================================================

const toNumber = (value, fallback = 0) => {
  if (value === "" || value === null || value === undefined) {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
};

// const getImageUrl = (url) => {
//   if (!url || typeof url !== "string") {
//     return "";
//   }

//   const trimmed = url.trim();

//   // Markdown image:
//   // ![alt](https://example.com/image.jpg)
//   const markdownMatch = trimmed.match(/^!\[.*?\]\((.*?)\)$/);

//   if (markdownMatch) {
//     return markdownMatch[1];
//   }

//   // Markdown link:
//   // [image](https://example.com/image.jpg)
//   const linkMatch = trimmed.match(/^\[.*?\]\((.*?)\)$/);

//   if (linkMatch) {
//     return linkMatch[1];
//   }

//   return trimmed;
// };

// =====================================================
// NORMALIZE VARIANT
// =====================================================

const normalizeVariant = (data = {}) => ({
  _id: data._id || "",

  sku: data.sku || "",

  barcode: data.barcode || "",

  variantName: data.variantName || "",

  attributes: Array.isArray(data.attributes)
    ? data.attributes.map((item) => ({
        name: item?.name || "",
        value: item?.value || "",
      }))
    : [],

  specifications: Array.isArray(data.specifications)
    ? data.specifications.map((group) => ({
        group: group?.group || "",

        fields: Array.isArray(group?.fields)
          ? group.fields.map((field) => ({
              key: field?.key || "",
              value: field?.value || "",
            }))
          : [],
      }))
    : [],

  images: Array.isArray(data.images)
    ? data.images.map((image, index) => {
        const url = getImageUrl(image?.url);

        return {
          _id: image?._id || undefined,

          url,

          public_id: image?.public_id || "",

          alt: image?.alt || "",

          isPrimary: Boolean(image?.isPrimary),

          sortOrder: image?.sortOrder ?? index,

          file: null,

          preview: url,
        };
      })
    : [],

  pricing: {
    mrp: data.pricing?.mrp ?? 0,
    sellingPrice: data.pricing?.sellingPrice ?? 0,
    costPrice: data.pricing?.costPrice ?? 0,
    tax: data.pricing?.tax ?? 0,
    discount: data.pricing?.discount ?? 0,
  },

  inventory: {
    stock: data.inventory?.stock ?? 0,
    reserved: data.inventory?.reserved ?? 0,
    lowStockAlert: data.inventory?.lowStockAlert ?? 5,
  },

  shipping: {
    weight: data.shipping?.weight ?? 0,

    dimensions: {
      length: data.shipping?.dimensions?.length ?? 0,
      breadth: data.shipping?.dimensions?.breadth ?? 0,
      height: data.shipping?.dimensions?.height ?? 0,
    },

    packageType: data.shipping?.packageType || "box",

    volumetricWeight: data.shipping?.volumetricWeight ?? 0,
  },

  isDefault: Boolean(data.isDefault),

  status: data.status || "active",
});

// =====================================================
// MAIN COMPONENT
// =====================================================

function EditVariant() {
  const navigate = useNavigate();

  const { productId, variantId } = useParams();

  // =====================================================
  // STATE
  // =====================================================

  const [product, setProduct] = useState(null);

  const [variant, setVariant] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH PRODUCT / VARIANT
  // =====================================================

  const fetchVariant = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyProducts();

      if (!response?.success) {
        throw new Error(response?.message || "Failed to load products");
      }

      const products = Array.isArray(response.products)
        ? response.products
        : [];

      const foundProduct = products.find(
        (item) => String(item?._id) === String(productId),
      );

      if (!foundProduct) {
        throw new Error("Product not found");
      }

      const variants = Array.isArray(foundProduct.variants)
        ? foundProduct.variants
        : [];

      const foundVariant = variants.find(
        (item) => String(item?._id) === String(variantId),
      );

      if (!foundVariant) {
        throw new Error("Variant not found");
      }

      setProduct(foundProduct);

      setVariant(normalizeVariant(foundVariant));
    } catch (err) {
      console.error("FETCH VARIANT ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load variant",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EFFECT
  // =====================================================

  useEffect(() => {
    if (!productId || !variantId) {
      setError("Invalid product or variant ID");
      setLoading(false);
      return;
    }

    fetchVariant();
  }, [productId, variantId]);

  // =====================================================
  // CLEANUP OBJECT URLS
  // =====================================================

  useEffect(() => {
    return () => {
      if (!variant?.images) return;

      variant.images.forEach((image) => {
        if (image?.file && image?.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [variant]);

  // =====================================================
  // BASIC FIELD UPDATE
  // =====================================================

  const updateField = (field, value) => {
    setVariant((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  // =====================================================
  // NESTED FIELD UPDATE
  // =====================================================

  const updateNestedField = (section, field, value) => {
    setVariant((prev) => {
      if (!prev) return prev;

      return {
        ...prev,

        [section]: {
          ...(prev[section] || {}),
          [field]: value,
        },
      };
    });
  };

  // =====================================================
  // DIMENSION UPDATE
  // =====================================================

  const updateDimension = (field, value) => {
    setVariant((prev) => {
      if (!prev) return prev;

      return {
        ...prev,

        shipping: {
          ...prev.shipping,

          dimensions: {
            ...prev.shipping?.dimensions,
            [field]: value,
          },
        },
      };
    });
  };

  // =====================================================
  // ATTRIBUTE UPDATE
  // =====================================================

  const updateAttribute = (index, field, value) => {
    setVariant((prev) => {
      if (!prev) return prev;

      const attributes = [...(prev.attributes || [])];

      if (!attributes[index]) {
        attributes[index] = {
          name: "",
          value: "",
        };
      }

      attributes[index] = {
        ...attributes[index],
        [field]: value,
      };

      return {
        ...prev,
        attributes,
      };
    });
  };

  const addAttribute = () => {
    setVariant((prev) => ({
      ...prev,

      attributes: [
        ...(prev?.attributes || []),
        {
          name: "",
          value: "",
        },
      ],
    }));
  };

  const removeAttribute = (index) => {
    setVariant((prev) => ({
      ...prev,

      attributes: (prev?.attributes || []).filter((_, i) => i !== index),
    }));
  };

  // =====================================================
  // SPECIFICATION GROUP
  // =====================================================

  const updateSpecificationGroup = (groupIndex, field, value) => {
    setVariant((prev) => {
      if (!prev) return prev;

      const specifications = [...(prev.specifications || [])];

      if (!specifications[groupIndex]) {
        specifications[groupIndex] = {
          group: "",
          fields: [],
        };
      }

      specifications[groupIndex] = {
        ...specifications[groupIndex],
        [field]: value,
      };

      return {
        ...prev,
        specifications,
      };
    });
  };

  const addSpecificationGroup = () => {
    setVariant((prev) => ({
      ...prev,

      specifications: [
        ...(prev?.specifications || []),
        {
          group: "",
          fields: [],
        },
      ],
    }));
  };

  const removeSpecificationGroup = (groupIndex) => {
    setVariant((prev) => ({
      ...prev,

      specifications: (prev?.specifications || []).filter(
        (_, index) => index !== groupIndex,
      ),
    }));
  };

  // =====================================================
  // SPECIFICATION FIELD
  // =====================================================

  const updateSpecificationField = (groupIndex, fieldIndex, field, value) => {
    setVariant((prev) => {
      if (!prev) return prev;

      const specifications = [...(prev.specifications || [])];

      if (!specifications[groupIndex]) {
        return prev;
      }

      const fields = [...(specifications[groupIndex].fields || [])];

      if (!fields[fieldIndex]) {
        fields[fieldIndex] = {
          key: "",
          value: "",
        };
      }

      fields[fieldIndex] = {
        ...fields[fieldIndex],
        [field]: value,
      };

      specifications[groupIndex] = {
        ...specifications[groupIndex],
        fields,
      };

      return {
        ...prev,
        specifications,
      };
    });
  };

  const addSpecificationField = (groupIndex) => {
    setVariant((prev) => {
      if (!prev) return prev;

      const specifications = [...(prev.specifications || [])];

      if (!specifications[groupIndex]) {
        return prev;
      }

      specifications[groupIndex] = {
        ...specifications[groupIndex],

        fields: [
          ...(specifications[groupIndex].fields || []),
          {
            key: "",
            value: "",
          },
        ],
      };

      return {
        ...prev,
        specifications,
      };
    });
  };

  const removeSpecificationField = (groupIndex, fieldIndex) => {
    setVariant((prev) => {
      if (!prev) return prev;

      const specifications = [...(prev.specifications || [])];

      if (!specifications[groupIndex]) {
        return prev;
      }

      specifications[groupIndex] = {
        ...specifications[groupIndex],

        fields: (specifications[groupIndex].fields || []).filter(
          (_, index) => index !== fieldIndex,
        ),
      };

      return {
        ...prev,
        specifications,
      };
    });
  };

  // =====================================================
  // IMAGE UPDATE
  // =====================================================

  const updateImage = (index, field, value) => {
    setVariant((prev) => {
      if (!prev) return prev;

      const images = [...(prev.images || [])];

      if (!images[index]) {
        return prev;
      }

      images[index] = {
        ...images[index],
        [field]: value,
      };

      return {
        ...prev,
        images,
      };
    });
  };

  // =====================================================
  // IMAGE FILE
  // =====================================================

  const updateImageFile = (index, file) => {
    if (!file) return;

    // =====================================================
    // TYPE VALIDATION
    // =====================================================

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // =====================================================
    // SIZE VALIDATION
    // =====================================================

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");

    setVariant((prev) => {
      const images = [...prev.images];

      // revoke previous preview
      if (images[index]?.preview && images[index].preview.startsWith("blob:")) {
        URL.revokeObjectURL(images[index].preview);
      }

      images[index] = {
        ...images[index],

        file,

        preview: URL.createObjectURL(file),
      };

      return {
        ...prev,
        images,
      };
    });
  };

  // =====================================================
  // ADD IMAGE
  // =====================================================

  const addImage = () => {
    setVariant((prev) => {
      if (!prev) return prev;

      const images = prev.images || [];

      return {
        ...prev,

        images: [
          ...images,

          {
            _id: undefined,

            url: "",

            public_id: "",

            alt: "",

            isPrimary: images.length === 0,

            sortOrder: images.length,

            file: null,

            preview: "",
          },
        ],
      };
    });
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeImage = (index) => {
    setVariant((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // =====================================================
  // PRIMARY IMAGE
  // =====================================================

  const makePrimaryImage = (index) => {
    setVariant((prev) => {
      if (!prev) return prev;

      return {
        ...prev,

        images: (prev.images || []).map((image, imageIndex) => ({
          ...image,
          isPrimary: imageIndex === index,
        })),
      };
    });
  };

  // =====================================================
  // VALIDATE
  // =====================================================

  const validateVariant = () => {
    if (!variant) {
      return "Variant data is missing";
    }

    if (!variant.variantName?.trim()) {
      return "Variant name is required";
    }

    const mrp = toNumber(variant.pricing?.mrp);

    const sellingPrice = toNumber(variant.pricing?.sellingPrice);

    if (mrp < 0) {
      return "MRP cannot be negative";
    }

    if (sellingPrice < 0) {
      return "Selling price cannot be negative";
    }

    if (sellingPrice > mrp && mrp > 0) {
      return "Selling price cannot be greater than MRP";
    }

    if (toNumber(variant.inventory?.stock) < 0) {
      return "Stock cannot be negative";
    }

    if (toNumber(variant.inventory?.reserved) < 0) {
      return "Reserved stock cannot be negative";
    }

    return null;
  };

  // =====================================================
  // BUILD PAYLOAD
  // =====================================================

  const buildPayload = () => {
    return {
      barcode: variant.barcode?.trim() || "",

      variantName: variant.variantName?.trim() || "",

      attributes: (variant.attributes || [])
        .map((attribute) => ({
          name: attribute.name?.trim() || "",
          value: attribute.value?.trim() || "",
        }))
        .filter((attribute) => attribute.name || attribute.value),

      specifications: (variant.specifications || [])
        .map((group) => ({
          group: group.group?.trim() || "",

          fields: (group.fields || [])
            .map((field) => ({
              key: field.key?.trim() || "",
              value: field.value?.trim() || "",
            }))
            .filter((field) => field.key || field.value),
        }))
        .filter((group) => group.group || group.fields.length > 0),

      /*
       * IMPORTANT
       *
       * Files are NOT sent here.
       *
       * `file` and `preview` are frontend-only values.
       *
       * If your backend supports image upload,
       * use FormData in productEditApi.js.
       */
      images: (variant.images || []).map((image, index) => ({
        ...(image._id
          ? {
              _id: image._id,
            }
          : {}),

        url: getImageUrl(image.url),

        public_id: image.public_id || "",

        alt: image.alt?.trim() || "",

        isPrimary: Boolean(image.isPrimary),

        sortOrder: image.sortOrder ?? index,
      })),

      pricing: {
        mrp: toNumber(variant.pricing?.mrp),

        sellingPrice: toNumber(variant.pricing?.sellingPrice),

        costPrice: toNumber(variant.pricing?.costPrice),

        tax: toNumber(variant.pricing?.tax),

        discount: toNumber(variant.pricing?.discount),
      },

      inventory: {
        stock: toNumber(variant.inventory?.stock),

        reserved: toNumber(variant.inventory?.reserved),

        lowStockAlert: toNumber(variant.inventory?.lowStockAlert, 5),
      },

      shipping: {
        weight: toNumber(variant.shipping?.weight),

        dimensions: {
          length: toNumber(variant.shipping?.dimensions?.length),

          breadth: toNumber(variant.shipping?.dimensions?.breadth),

          height: toNumber(variant.shipping?.dimensions?.height),
        },

        packageType: variant.shipping?.packageType || "box",

        volumetricWeight: toNumber(variant.shipping?.volumetricWeight),
      },

      isDefault: Boolean(variant.isDefault),

      status: variant.status || "active",
    };
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateVariant();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("productId", productId);
      // =====================================================
      // IMAGES METADATA
      // =====================================================

      const imageMetadata = variant.images.map((image, index) => ({
        url: image.url || "",
        public_id: image.public_id || "",
        alt: image.alt || "",
        isPrimary: Boolean(image.isPrimary),
        sortOrder: index,
      }));

      // =====================================================
      // VARIANT DATA
      // =====================================================

      const variantData = {
        barcode: variant.barcode?.trim() || "",

        variantName: variant.variantName.trim(),

        attributes: variant.attributes.map((attribute) => ({
          name: attribute.name?.trim() || "",
          value: attribute.value?.trim() || "",
        })),

        specifications: variant.specifications.map((group) => ({
          group: group.group?.trim() || "",

          fields: group.fields.map((field) => ({
            key: field.key?.trim() || "",
            value: field.value?.trim() || "",
          })),
        })),

        // IMPORTANT
        images: imageMetadata,

        pricing: {
          mrp: Number(variant.pricing.mrp || 0),

          sellingPrice: Number(variant.pricing.sellingPrice || 0),

          costPrice: Number(variant.pricing.costPrice || 0),

          tax: Number(variant.pricing.tax || 0),

          discount: Number(variant.pricing.discount || 0),
        },

        inventory: {
          stock: Number(variant.inventory.stock || 0),

          reserved: Number(variant.inventory.reserved || 0),

          lowStockAlert: Number(variant.inventory.lowStockAlert || 5),
        },

        shipping: {
          weight: Number(variant.shipping.weight || 0),

          dimensions: {
            length: Number(variant.shipping.dimensions.length || 0),

            breadth: Number(variant.shipping.dimensions.breadth || 0),

            height: Number(variant.shipping.dimensions.height || 0),
          },

          packageType: variant.shipping.packageType || "box",

          volumetricWeight: Number(variant.shipping.volumetricWeight || 0),
        },

        isDefault: Boolean(variant.isDefault),

        status: variant.status || "active",
      };

      formData.append("variantData", JSON.stringify(variantData));

      // =====================================================
      // NEW IMAGE FILES
      // =====================================================

      variant.images.forEach((image, index) => {
        if (image.file) {
          formData.append(`image_${index}`, image.file);
        }
      });

      // =====================================================
      // API CALL
      // =====================================================

      const response = await updateProductVariant(
        productId,
        variantId,
        formData,
      );

      // =====================================================
      // RESPONSE
      // =====================================================

      if (!response?.success) {
        throw new Error(response?.message || "Failed to update variant");
      }

      setSuccess("Variant updated successfully!");

      // =====================================================
      // REDIRECT
      // =====================================================

      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (err) {
      console.error("UPDATE VARIANT ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update variant",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading variant...
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !variant) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-red-600">
              Unable to load variant
            </h2>

            <p className="text-gray-500 mt-2">{error}</p>

            <button
              type="button"
              onClick={fetchVariant}
              className="mt-5 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!variant) {
    return null;
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mt-1 w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  {product?.title || "Product"}
                </p>

                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Variant
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Update variant information, pricing and inventory
                </p>
              </div>
            </div>

            <button
              type="submit"
              form="variant-edit-form"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          FORM
      ================================================= */}

      <form
        id="variant-edit-form"
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto px-6 py-8"
      >
        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <Section
            icon={<Package className="w-5 h-5" />}
            title="Basic Information"
            description="Basic information about this product variant"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <InputField
                label="Variant Name"
                value={variant.variantName}
                onChange={(e) => updateField("variantName", e.target.value)}
                placeholder="Example: Blue / M"
                required
              />

              <InputField
                label="SKU"
                value={variant.sku}
                disabled
                help="SKU cannot be changed"
              />

              <InputField
                label="Barcode"
                value={variant.barcode}
                onChange={(e) => updateField("barcode", e.target.value)}
                placeholder="Enter barcode"
              />

              <SelectField
                label="Status"
                value={variant.status}
                onChange={(e) => updateField("status", e.target.value)}
                options={[
                  {
                    value: "active",
                    label: "Active",
                  },
                  {
                    value: "inactive",
                    label: "Inactive",
                  },
                  {
                    value: "out_of_stock",
                    label: "Out of Stock",
                  },
                  {
                    value: "blocked",
                    label: "Blocked",
                  },
                ]}
              />
            </div>

            <div className="mt-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={variant.isDefault}
                  onChange={(e) => updateField("isDefault", e.target.checked)}
                  className="w-4 h-4 rounded"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Make this the default variant
                  </p>

                  <p className="text-xs text-gray-500">
                    This variant will be selected by default
                  </p>
                </div>
              </label>
            </div>
          </Section>

          {/* =================================================
              ATTRIBUTES
          ================================================= */}

          <Section
            icon={<Settings className="w-5 h-5" />}
            title="Attributes"
            description="Color, size and other variant attributes"
            action={<AddButton onClick={addAttribute} text="Add Attribute" />}
          >
            <div className="space-y-3">
              {variant.attributes.map((attribute, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end bg-gray-50 p-4 rounded-xl"
                >
                  <InputField
                    label="Attribute Name"
                    value={attribute.name}
                    onChange={(e) =>
                      updateAttribute(index, "name", e.target.value)
                    }
                    placeholder="Color"
                  />

                  <InputField
                    label="Value"
                    value={attribute.value}
                    onChange={(e) =>
                      updateAttribute(index, "value", e.target.value)
                    }
                    placeholder="Blue"
                  />

                  <button
                    type="button"
                    onClick={() => removeAttribute(index)}
                    className="w-10 h-10 mb-[1px] rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {variant.attributes.length === 0 && (
                <EmptyMessage text="No attributes added" />
              )}
            </div>
          </Section>

          {/* =================================================
              PRICING
          ================================================= */}

          <Section
            icon={<DollarSign className="w-5 h-5" />}
            title="Pricing"
            description="Manage variant pricing"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              <NumberField
                label="MRP"
                value={variant.pricing.mrp}
                onChange={(e) =>
                  updateNestedField("pricing", "mrp", e.target.value)
                }
              />

              <NumberField
                label="Selling Price"
                value={variant.pricing.sellingPrice}
                onChange={(e) =>
                  updateNestedField("pricing", "sellingPrice", e.target.value)
                }
              />

              <NumberField
                label="Cost Price"
                value={variant.pricing.costPrice}
                onChange={(e) =>
                  updateNestedField("pricing", "costPrice", e.target.value)
                }
              />

              <NumberField
                label="Tax (%)"
                value={variant.pricing.tax}
                onChange={(e) =>
                  updateNestedField("pricing", "tax", e.target.value)
                }
              />

              <NumberField
                label="Discount (%)"
                value={variant.pricing.discount}
                onChange={(e) =>
                  updateNestedField("pricing", "discount", e.target.value)
                }
              />
            </div>
          </Section>

          {/* =================================================
              INVENTORY
          ================================================= */}

          <Section
            icon={<Warehouse className="w-5 h-5" />}
            title="Inventory"
            description="Manage stock information"
          >
            <div className="grid md:grid-cols-3 gap-5">
              <NumberField
                label="Stock"
                value={variant.inventory.stock}
                onChange={(e) =>
                  updateNestedField("inventory", "stock", e.target.value)
                }
              />

              <NumberField
                label="Reserved"
                value={variant.inventory.reserved}
                onChange={(e) =>
                  updateNestedField("inventory", "reserved", e.target.value)
                }
              />

              <NumberField
                label="Low Stock Alert"
                value={variant.inventory.lowStockAlert}
                onChange={(e) =>
                  updateNestedField(
                    "inventory",
                    "lowStockAlert",
                    e.target.value,
                  )
                }
              />
            </div>
          </Section>

          {/* =================================================
              SHIPPING
          ================================================= */}

          <Section
            icon={<Truck className="w-5 h-5" />}
            title="Shipping"
            description="Package weight and dimensions"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              <NumberField
                label="Weight (kg)"
                value={variant.shipping.weight}
                onChange={(e) =>
                  updateNestedField("shipping", "weight", e.target.value)
                }
              />

              <NumberField
                label="Length (cm)"
                value={variant.shipping.dimensions.length}
                onChange={(e) => updateDimension("length", e.target.value)}
              />

              <NumberField
                label="Breadth (cm)"
                value={variant.shipping.dimensions.breadth}
                onChange={(e) => updateDimension("breadth", e.target.value)}
              />

              <NumberField
                label="Height (cm)"
                value={variant.shipping.dimensions.height}
                onChange={(e) => updateDimension("height", e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-5">
              <SelectField
                label="Package Type"
                value={variant.shipping.packageType}
                onChange={(e) =>
                  updateNestedField("shipping", "packageType", e.target.value)
                }
                options={[
                  {
                    value: "box",
                    label: "Box",
                  },
                  {
                    value: "packet",
                    label: "Packet",
                  },
                  {
                    value: "tube",
                    label: "Tube",
                  },
                  {
                    value: "envelope",
                    label: "Envelope",
                  },
                ]}
              />

              <NumberField
                label="Volumetric Weight"
                value={variant.shipping.volumetricWeight}
                onChange={(e) =>
                  updateNestedField(
                    "shipping",
                    "volumetricWeight",
                    e.target.value,
                  )
                }
              />
            </div>
          </Section>

          {/* =================================================
              IMAGES
          ================================================= */}

          <Section
            icon={<ImageIcon className="w-5 h-5" />}
            title="Images"
            description="Manage variant images"
            action={<AddButton onClick={addImage} text="Add Image" />}
          >
            <div className="space-y-4">
              {variant.images.map((image, index) => (
                <div
                  key={image._id || `image-${index}`}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* IMAGE PREVIEW */}

                    <div className="w-32 h-32 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                      {image.preview || image.url ? (
                        <img
                          src={image.preview || getImageUrl(image.url)}
                          alt={image.alt || `Product image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <ImageIcon className="w-8 h-8 mb-1" />
                          <span className="text-xs">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* IMAGE CONTROLS */}

                    <div className="flex-1">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {image.url || image.file
                            ? "Replace Image"
                            : "Upload Image"}
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            updateImageFile(index, e.target.files?.[0])
                          }
                          className="block w-full text-sm text-gray-600
                            file:mr-4
                            file:py-2.5
                            file:px-4
                            file:rounded-lg
                            file:border-0
                            file:bg-gray-100
                            file:text-gray-700
                            file:font-medium
                            hover:file:bg-gray-200
                            cursor-pointer"
                        />

                        <p className="text-xs text-gray-400 mt-2">
                          JPG, JPEG, PNG or WEBP · Max 5MB
                        </p>
                      </div>

                      {/* FILE NAME */}

                      {image.file && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                          <ImageIcon className="w-4 h-4" />

                          <span className="truncate max-w-[300px]">
                            {image.file.name}
                          </span>
                        </div>
                      )}

                      {/* ALT TEXT */}

                      <div className="mt-4">
                        <InputField
                          label="Alt Text"
                          value={image.alt}
                          onChange={(e) =>
                            updateImage(index, "alt", e.target.value)
                          }
                          placeholder="Product image description"
                        />
                      </div>

                      {/* IMAGE OPTIONS */}

                      <div className="flex flex-wrap items-center gap-5 mt-5">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="primaryImage"
                            checked={image.isPrimary}
                            onChange={() => makePrimaryImage(index)}
                          />

                          <span>Primary Image</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="ml-auto flex items-center gap-2 text-sm text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {variant.images.length === 0 && (
                <EmptyMessage text="No images added" />
              )}
            </div>
          </Section>

          {/* =================================================
              SPECIFICATIONS
          ================================================= */}

          <Section
            icon={<Settings className="w-5 h-5" />}
            title="Specifications"
            description="Manage product specifications"
            action={
              <AddButton onClick={addSpecificationGroup} text="Add Group" />
            }
          >
            <div className="space-y-5">
              {variant.specifications.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* GROUP HEADER */}

                  <div className="p-4 bg-gray-50 border-b flex items-end gap-3">
                    <div className="flex-1">
                      <InputField
                        label="Group Name"
                        value={group.group}
                        onChange={(e) =>
                          updateSpecificationGroup(
                            groupIndex,
                            "group",
                            e.target.value,
                          )
                        }
                        placeholder="General"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSpecificationGroup(groupIndex)}
                      className="w-10 h-10 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* FIELDS */}

                  <div className="p-4 space-y-3">
                    {group.fields.map((field, fieldIndex) => (
                      <div
                        key={fieldIndex}
                        className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end"
                      >
                        <InputField
                          label="Key"
                          value={field.key}
                          onChange={(e) =>
                            updateSpecificationField(
                              groupIndex,
                              fieldIndex,
                              "key",
                              e.target.value,
                            )
                          }
                          placeholder="Brand"
                        />

                        <InputField
                          label="Value"
                          value={field.value}
                          onChange={(e) =>
                            updateSpecificationField(
                              groupIndex,
                              fieldIndex,
                              "value",
                              e.target.value,
                            )
                          }
                          placeholder="TECHNOSPORT"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeSpecificationField(groupIndex, fieldIndex)
                          }
                          className="w-10 h-10 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addSpecificationField(groupIndex)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
                    >
                      <Plus className="w-4 h-4" />
                      Add Specification
                    </button>
                  </div>
                </div>
              ))}

              {variant.specifications.length === 0 && (
                <EmptyMessage text="No specifications added" />
              )}
            </div>
          </Section>

          {/* =================================================
              BOTTOM SAVE
          ================================================= */}

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={saving}
              className="px-6 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Variant
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditVariant;

// =====================================================
// SECTION
// =====================================================

function Section({ icon, title, description, action, children }) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
            {icon}
          </div>

          <div>
            <h2 className="font-bold text-gray-900">{title}</h2>

            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>

        {action}
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}

// =====================================================
// INPUT
// =====================================================

function InputField({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  help,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}

        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type="text"
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-4 focus:ring-gray-100 disabled:bg-gray-100 disabled:text-gray-500"
      />

      {help && <p className="text-xs text-gray-400 mt-1.5">{help}</p>}
    </div>
  );
}

// =====================================================
// NUMBER INPUT
// =====================================================

function NumberField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <input
        type="number"
        min="0"
        step="any"
        value={value ?? 0}
        onChange={onChange}
        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-100"
      />
    </div>
  );
}

// =====================================================
// SELECT
// =====================================================

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <select
        value={value ?? ""}
        onChange={onChange}
        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// =====================================================
// ADD BUTTON
// =====================================================

function AddButton({ onClick, text }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium"
    >
      <Plus className="w-4 h-4" />

      {text}
    </button>
  );
}

// =====================================================
// EMPTY MESSAGE
// =====================================================

function EmptyMessage({ text }) {
  return (
    <div className="py-8 text-center border border-dashed border-gray-200 rounded-xl">
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}

function getImageUrl(url) {
  if (!url) return "";

  if (typeof url === "string" && url.startsWith("![")) {
    const match = url.match(/^!\[.*?\]\((.*?)\)$/);

    return match?.[1] || "";
  }

  return url;
}
