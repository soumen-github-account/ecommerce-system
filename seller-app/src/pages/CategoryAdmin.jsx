import React, { useEffect, useState } from "react";
import {
  createCategory,
  createSubCategory,
  createLevel2,
  getCategories,
  getSubCategories,
} from "../services/categoryApi";
import { toast } from "sonner";

export default function CategoryAdmin() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    type: "category",
    name: "",
    image: null,
    categoryId: "",
    subCategoryId: "",
  });

  // -----------------------
  // LOAD CATEGORIES
  // -----------------------
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res); 
    } catch (err) {
      console.log(err);
    }
  };

  const loadSubCategories = async (categoryId) => {
    try {
        const res = await getSubCategories(categoryId);

        setSubCategories(res || []);
    } catch (err) {
        console.log(err);
        setSubCategories([]);
    }
};

  // -----------------------
  // HANDLE INPUT
  // -----------------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({ ...form, image: files[0] });
      return;
    }

    // CATEGORY CHANGE → reset subCategory
    if (name === "categoryId") {
      setForm({
        ...form,
        categoryId: value,
        subCategoryId: "",
      });

      loadSubCategories(value);
      return;
    }

    // SUBCATEGORY CHANGE
    if (name === "subCategoryId") {
      setForm({ ...form, subCategoryId: value });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  
  // const handleSubmit = async () => {
  //   setLoading(true)
  //   const data = new FormData();

  //   data.append("name", form.name);
  //   data.append("image", form.image);

  //   try {
  //     if (form.type === "category") {
  //       await createCategory(data);
  //     }

  //     if (form.type === "subCategory") {
  //       data.append("categoryId", form.categoryId);
  //       await createSubCategory(data);
  //     }

  //     if (form.type === "level2") {
  //       data.append("subCategoryId", form.subCategoryId);
  //       await createLevel2(data);
  //     }

  //     toast.success("Created successfully..")

  //     // RESET FORM (IMPORTANT FIX)
  //     setForm({
  //       type: "category",
  //       name: "",
  //       image: null,
  //       categoryId: "",
  //       subCategoryId: "",
  //     });

  //     setSubCategories([]);

  //     loadCategories();
  //     setLoading(false)
  //   } catch (err) {
  //     console.log(err);
  //     toast.error(err.response?.data?.message || err.message);
  //     setLoading(false)
  //   }
  // };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // CATEGORY
      if (form.type === "category") {
        const data = new FormData();

        data.append("name", form.name);

        if (form.image) {
          data.append("image", form.image);
        }

        await createCategory(data);
      }

      // SUB CATEGORY (JSON)
      if (form.type === "subCategory") {
        await createSubCategory({
          name: form.name,
          categoryId: form.categoryId,
        });
      }

      // LEVEL2
      if (form.type === "level2") {
        const data = new FormData();

        data.append("name", form.name);
        data.append("subCategoryId", form.subCategoryId);

        if (form.image) {
          data.append("image", form.image);
        }

        await createLevel2(data);
      }

      toast.success("Created successfully.");

      setForm({
        type: "category",
        name: "",
        image: null,
        categoryId: "",
        subCategoryId: "",
      });

      setSubCategories([]);

      loadCategories();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">

        <h1 className="text-xl font-bold mb-4">
          Flipkart Category Admin
        </h1>

        {/* TYPE */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        >
          <option value="category">Category</option>
          <option value="subCategory">Sub Category</option>
          <option value="level2">Level 2</option>
        </select>

        {/* NAME */}
        <input
          name="name"
          value={form.name}
          placeholder="Name"
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        />

        {/* IMAGE */}
        {/* <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        /> */}
        {(form.type === "category" || form.type === "level2") && (
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full border p-2 mb-3"
          />
        )}

        {/* CATEGORY */}
        {(form.type === "subCategory" || form.type === "level2") && (
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border p-2 mb-3"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        {/* SUBCATEGORY */}
        {form.type === "level2" && (
          <select
            name="subCategoryId"
            value={form.subCategoryId}
            onChange={handleChange}
            className="w-full border p-2 mb-3"
          >
            <option value="">Select SubCategory</option>
            {Array.isArray(subCategories) && subCategories.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        )}

        {/* SUBMIT */}
        {
          !loading && 
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Create
          </button>
          }
      </div>
    </div>
  );
}