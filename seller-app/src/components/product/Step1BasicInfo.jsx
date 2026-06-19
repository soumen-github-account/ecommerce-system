import { Controller, useFormContext } from "react-hook-form";
import FormSelect from "../common/FormSelect";

import useSellers from "../../hooks/useSellers";

import Select from "react-select/base";
import {
  useCategories,
  useSubCategories,
  useLevel2Categories,
} from "../../hooks/useCategories";

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

  const { data: categories = [] } = useCategories();
  const { data: subCategories = [] } = useSubCategories(category);
  const { data: level2 = [] } = useLevel2Categories(subCategory);
  const { data: sellers = [] } = useSellers();

  return (
    <div className="bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-8">Basic Information</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label>Product Title</label>

          <input
            {...register("title")}
            className="w-full border rounded-lg p-3 mt-2"
          />

          <p className="text-red-500 text-sm">{errors.title?.message}</p>
        </div>

        <div>
          <label>Slug</label>

          <input
            value={watch("slug")}
            readOnly
            className="w-full border rounded-lg p-3 mt-2 bg-gray-100"
          />
        </div>

        {/* <div>
          <label>Brand</label>
          <input
            {...register("brand")}
            className="w-full border rounded-lg p-3 mt-2"
          />
        </div> */}
        <div>
          <label>Brand</label>

          <FormSelect
            name="brand"
            placeholder="Select Brand"
            options={[
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
        </div>

        <div>
          <label>Category</label>
          <FormSelect name="category" 
          options={categories.map((item) => ({
            value: item._id,
            label: item.name,
          }))}
          />
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
        </div>

        <div>
          <label>Seller</label>

          <FormSelect
            name="seller"
            placeholder="Select Seller"
            options={[
              {
                value: "seller_1",
                label: "Tech World Pvt Ltd",
              },
              {
                value: "seller_2",
                label: "Mobile Hub",
              },
              {
                value: "seller_3",
                label: "Fashion Store",
              },
              {
                value: "seller_4",
                label: "Electronics Mart",
              },
            ]}
          />
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
                value: "blocked",
                label: "Blocked",
              },
            ]}
            placeholder="Select Status"
          />
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <button
          type="button"
          onClick={next}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
