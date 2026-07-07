import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import FormSelect from "../common/FormSelect";

import useSellers from "../../hooks/useSellers";

import {
  useCategories,
  useSubCategories,
  useLevel2Categories,
} from "../../hooks/useCategories";
import CreatableBrandSelect from "./CreatableBrandSelect";

export default function Step1BasicInfo({ next }) {
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const category = watch("category");
  const subCategory = watch("subCategory");
  useEffect(() => {
    setValue("subCategory", "");

    setValue("subCategoryLevel2", "");
  }, [category]);

  useEffect(() => {
    setValue("subCategoryLevel2", "");
  }, [subCategory]);

  const { data: categories = [] } = useCategories();
  const { data: subCategories = [] } = useSubCategories(category);
  const { data: level2 = [] } = useLevel2Categories(subCategory);
  const { data: sellers = [] } = useSellers();

  const brandOptions = [
    { value: "apple", label: "Apple" },
    { value: "samsung", label: "Samsung" },
    { value: "xiaomi", label: "Xiaomi" },
    // ... baaki options
  ];

  return (
    <div className="bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-8">Basic Information</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label>Product Title</label>

          <input
            {...register("title")}
            placeholder="Apple iPhone 16 Pro Max"
            className="w-full border rounded-lg p-3 mt-2"
          />

          <p className="text-sm text-red-500 mt-1">{errors.title?.message}</p>

          <p className="text-red-500 text-sm">{errors.title?.message}</p>
        </div>

        <div>
          <label>Slug</label>

          <input
            readOnly
            value={watch("slug")}
            className="w-full border rounded-lg p-3 mt-2 bg-gray-100 text-gray-500"
          />
        </div>
        <div className="md:col-span-2">
          <label>Short Description</label>

          <textarea
            rows={3}
            {...register("shortDescription")}
            placeholder="Write a short product summary..."
            className="w-full border rounded-lg p-3 mt-2"
          />

          <p className="text-red-500 text-sm">
            {errors.shortDescription?.message}
          </p>
        </div>

        <div>
          <label className="font-semibold">Brand</label>
          <CreatableBrandSelect
            name="brand"
            placeholder="Search or type new brand..."
            options={brandOptions}
          />
          <p className="text-sm text-red-500 mt-1">{errors.brand?.message}</p>
        </div>
        {/* <div>
          <label>Brand</label>

          <FormSelect
            name="brand"
            placeholder="Select Brand"
            options={[
              { value: "", label: "None" },
              { value: "apple", label: "Apple" },
              { value: "samsung", label: "Samsung" },
              { value: "xiaomi", label: "Xiaomi" },
              { value: "realme", label: "Realme" },
              { value: "oneplus", label: "OnePlus" },
              { value: "oppo", label: "OPPO" },
              { value: "vivo", label: "Vivo" },
              { value: "boat", label: "boAt" },
              { value: "sony", label: "Sony" },
              { value: "lg", label: "LG" },
            ]}
          />
          <p className="text-sm text-red-500 mt-1">{errors.brand?.message}</p>
        </div> */}

        <div>
          <label>Category</label>
          <FormSelect
            name="category"
            options={categories.map((item) => ({
              value: item._id,
              label: item.name,
            }))}
          />
          <p className="text-sm text-red-500 mt-1">
            {errors.category?.message}
          </p>
        </div>

        <div>
          <label>Sub Category</label>
          <FormSelect
            name="subCategory"
            options={subCategories.map((item) => ({
              value: item._id,
              label: item.name,
            }))}
            isDisabled={!category}
          />
          <p className="text-sm text-red-500 mt-1">
            {errors.subCategory?.message}
          </p>
        </div>

        <div>
          <label>SubCategory 2</label>
          <FormSelect
            name="subCategoryLevel2"
            options={level2.map((item) => ({
              value: item._id,
              label: item.name,
            }))}
            isDisabled={!subCategory}
          />
          <p className="text-sm text-red-500 mt-1">
            {errors.subCategoryLevel2?.message}
          </p>
        </div>

        <div>
          <label>Seller</label>

          <FormSelect
            name="seller"
            placeholder="Select Seller"
            options={sellers.map((item) => ({
              value: item._id,
              label: item.store?.storeName || item.fullName,
            }))}
          />
          <p className="text-sm text-red-500 mt-1">{errors.seller?.message}</p>
        </div>
        <div>
          <label>Status</label>

          <FormSelect
            name="status"
            options={[
              {
                value: "draft",
                label: "Draft",
              },

              {
                value: "active",
                label: "Active",
              },

              {
                value: "inactive",
                label: "Inactive",
              },

              {
                value: "blocked",
                label: "Blocked",
              },

              {
                value: "deleted",
                label: "Deleted",
              },
            ]}
            placeholder="Select Status"
          />
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <button type="button" onClick={next} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold">Save & Continue →</button>
      </div>
    </div>
  );
}
