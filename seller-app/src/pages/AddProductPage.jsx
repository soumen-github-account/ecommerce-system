import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";

import { productSchema } from "../schemas/product.schema";

import ProductStepper from "../components/product/ProductStepper";

import Step1BasicInfo from "../components/product/Step1BasicInfo";
import Step2ProductDetails from "../components/product/Step2ProductDetails";
import Step3Specification from "../components/product/Step3Specification";
import Step4Variants from "../components/product/Step4Variants";
import Step5Review from "../components/product/Step5Review";
import { useFormPersist } from "../hooks/useFormPersist";
import axios from "axios";
import { toast } from "sonner";


export default function AddProduct() {
  const [step, setStep] = useState(1);
  
  const methods = useForm({
    resolver: zodResolver(productSchema),

    mode: "onChange",

    defaultValues: {
      title: "",
      slug: "",

      brand: "",
      category: "",
      subCategory: "",
      subCategoryLevel2: "",

      seller: "",

      status: "draft",

      description: "",

      highlights: [],

      tags: [],

      warranty: "",

      returnPolicy: "",

      specification: [],

      variants: [],
    },
  });

  const { control, watch, setValue, handleSubmit } = methods;

  const title = watch("title");

  React.useEffect(() => {
    setValue(
      "slug",
      slugify(title || "", {
        lower: true,
        strict: true,
      })
    );
  }, [title]);

  useFormPersist("product_form_data", { control, setValue });
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  });


  // const onSubmit = async (data) => {
  //   console.log("submitted")
  //   console.log(data.variants[0]);
  //   console.log(JSON.stringify(data.variants).length);
  //   console.log(data.variants[0].images);
  //   const formData = new FormData();

  //   // 1. Text fields ko append karein
  //   Object.keys(data).forEach((key) => {
  //     if (key === "variants" || key === "specification" || key === "highlights" || key === "tags") {
  //       // JSON stringify karke bhejein kyunki controller parse kar raha hai
  //       formData.append(key, JSON.stringify(data[key]));
  //     } else {
  //       formData.append(key, data[key]);
  //     }
  //   });

  //   // 2. Images ko append karein
  //   data.variants.forEach((variant, vIndex) => {
  //     if (variant.images) {
  //       variant.images.forEach((imgObj) => {
  //         // Yahan 'imgObj.file' hona chahiye (input type file se aaya hua)
  //         formData.append(`variant_${vIndex}`, imgObj.file);
  //       });
  //     }
  //   });

  //   // 3. API Call
  //   try {
  //     const res = await api.post("/api/product/add-product", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     // Success hone par storage clear karein
  //     localStorage.removeItem("product_form_data");
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const onError = (errors) => {
  //   const messages = [];

  //   const extractErrors = (obj) => {
  //     Object.values(obj).forEach((value) => {
  //       if (value?.message) {
  //         messages.push(value.message);
  //       }

  //       if (value && typeof value === "object") {
  //         extractErrors(value);
  //       }
  //     });
  //   };

  //   extractErrors(errors);

  //   messages.forEach((msg) => {
  //     toast.error(msg);
  //   });
  // };

  const onSubmit = async (data) => {
  try {
    console.log(
  data.variants.map(v =>
    v.images?.map(img => ({
      hasFile: !!img.file
    }))
  )
);

console.log(
  data.variants.map((v) => ({
    images: v.images?.map((img) => ({
      isFile: img.file instanceof File,
      file: img.file,
      url: img.url?.substring(0, 30),
    })),
  }))
);
    const formData = new FormData();

    // variants se images remove karo
    const cleanVariants = data.variants.map((variant) => {
      const { images, ...rest } = variant;
      return rest;
    });

    // normal fields
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("brand", data.brand);
    formData.append("category", data.category);
    formData.append("subCategory", data.subCategory);
    formData.append("subCategoryLevel2", data.subCategoryLevel2);
    formData.append("seller", data.seller);
    formData.append("status", data.status);
    formData.append("description", data.description);
    formData.append("warranty", data.warranty);
    formData.append("returnPolicy", data.returnPolicy);

    // JSON fields
    formData.append(
      "highlights",
      JSON.stringify(data.highlights)
    );

    formData.append(
      "tags",
      JSON.stringify(data.tags)
    );

    formData.append(
      "specification",
      JSON.stringify(data.specification)
    );

    formData.append(
      "variants",
      JSON.stringify(cleanVariants)
    );

    // images separately upload karo
    // data.variants.forEach((variant, vIndex) => {
    //   variant.images?.forEach((imgObj) => {
    //     if (imgObj.file) {
    //       formData.append(
    //         `variant_${vIndex}`,
    //         imgObj.file
    //       );
    //     }
    //   });
    // });
    data.variants.forEach((variant, index) => {
  variant.images?.forEach((img) => {
    if (img.file instanceof File) {
      formData.append(`variant_${index}`, img.file);
    }
  });
});

    console.log(
      "variants size:",
      JSON.stringify(cleanVariants).length
    );
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const res = await api.post(
      "/api/product/add-product",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(res.data);

    toast.success("Product created successfully");

    // localStorage.removeItem("product_form_data");

  } catch (err) {
    console.error(err);

    toast.error(
      err?.response?.data?.message ||
      "Failed to create product"
    );
  }
};

  const onError = (errors) => {
    const getFirstError = (obj) => {
      for (const key in obj) {
        const value = obj[key];

        if (value?.message) {
          return value.message;
        }

        if (value && typeof value === "object") {
          const nested = getFirstError(value);
          if (nested) return nested;
        }
      }
    };

    const message = getFirstError(errors);

    if (message) {
      toast.error(message);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-100 py-8">

        <div className="max-w-7xl mx-auto px-5">

          <ProductStepper currentStep={step} />

          <form onSubmit={handleSubmit(onSubmit, onError)}>
            {step === 1 && (
              <Step1BasicInfo
                next={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <Step2ProductDetails
                next={() => setStep(3)}
                previous={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <Step3Specification
                next={() => setStep(4)}
                previous={() => setStep(2)}
              />
            )}

            {step === 4 && (
              <Step4Variants
                next={() => setStep(5)}
                previous={() => setStep(3)}
              />
            )}

            {step === 5 && (
              <Step5Review
                product={watch()}
                previous={() => setStep(4)}
              />
            )}

          </form>

        </div>

      </div>
    </FormProvider>
  );
}