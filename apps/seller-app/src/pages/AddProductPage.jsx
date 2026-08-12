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
import Step5SEO from "../components/product/Step5SEO";
import Step6Review from "../components/product/Step6Review";


export default function AddProduct() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const methods = useForm({
    resolver: zodResolver(productSchema),

    mode: "onChange",

    defaultValues: {

  // =========================
  // BASIC
  // =========================

  title: "",
  slug: "",

  shortDescription: "",

  description: "",

  brand: "",

  category: "",
  subCategory: "",
  subCategoryLevel2: "",

  seller: "",

  manufacturer: "",

  countryOfOrigin: "",

  highlights: [],

  tags: [],

  // =========================
  // SERVICES
  // =========================

  services: {

    returnPolicy: {

      returnable: true,

      returnDays: 7,

      returnType: "replacement",

      conditions: []

    },

    cashOnDelivery: {

      available: true

    },

    warranty: {

      available: false,

      duration: "",

      type: "none"

    },

    support: {

      available: true,

      contactType: "seller"

    }

  },

  // =========================
  // SEO
  // =========================

  seo: {

    metaTitle: "",

    metaDescription: "",

    keywords: []

  },

  // =========================
  // VARIANTS
  // =========================

  variants: [],

  status: "draft"

}
  });

  const { control, watch, setValue, handleSubmit, formState: { isSubmitting } } = methods;

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


const onSubmit = async (data) => {
  console.log("clicked")
  const result = productSchema.safeParse(data);

  if (!result.success) {
    console.log(result.error.issues);
    console.log(result.error.format());
    return;
  }

  console.log("Validation Passed");

    try {
        setLoading(true);
        const formData = new FormData();

        //------------------------------------------------
        // BASIC FIELDS
        //------------------------------------------------
        formData.append("title", data.title);
        formData.append("shortDescription", data.shortDescription);
        formData.append("description", data.description);
        formData.append("brand", data.brand);
        formData.append("category", data.category);
        formData.append("subCategory", data.subCategory || "");
        formData.append("subCategoryLevel2", data.subCategoryLevel2 || "");
        formData.append("manufacturer", data.manufacturer);
        formData.append("countryOfOrigin", data.countryOfOrigin);
        formData.append("seller", data.seller);
        formData.append("status", data.status);

        //------------------------------------------------
        // JSON DATA
        //------------------------------------------------
        const highlights = data.highlights.map(item => item.value);

        const tags = data.tags.map(item => item.value);

        const seo = {
          ...data.seo,
          keywords: data.seo.keywords.map(item => item.value),
        };

        const services = {
          ...data.services,
          returnPolicy: {
            ...data.services.returnPolicy,
            conditions:
              data.services.returnPolicy.conditions.map(
                item => item.value
              ),
          },
        };
        formData.append(
          "highlights",
          JSON.stringify(highlights)
        );

        formData.append(
          "tags",
          JSON.stringify(tags)
        );

        formData.append(
          "seo",
          JSON.stringify(seo)
        );

        formData.append(
          "services",
          JSON.stringify(services)
        );

        //------------------------------------------------
        // VARIANTS (Removing images for JSON)
        //------------------------------------------------
        const variants = data.variants.map(v => {
            const { images, ...rest } = v;
            return rest;
        });
        formData.append("variants", JSON.stringify(variants));

        //------------------------------------------------
        // VARIANT IMAGES
        //------------------------------------------------
        data.variants.forEach((variant, variantIndex) => {
            if (!variant.images?.length) return;
            variant.images.forEach((image) => {
                if (image instanceof File) {
                    formData.append(`variant_${variantIndex}`, image);
                }
            });
        });

        //------------------------------------------------
        // DEBUG
        //------------------------------------------------
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        //------------------------------------------------
        // API CALL
        //------------------------------------------------
        const response = await api.post("/api/product/add-product", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        console.log("Success:", response.data);
        if(response.data.success) {
          toast.success(response.data.message)
        } else{
          toast.error(response.data.message)
        }

    } catch (err) {
        console.error("Error in onSubmit:", err);
        toast.error(
          err.response?.data?.message ||
          err.message ||
          "Something went wrong"
        );
        console.log(err.response?.data);
    } finally{
      setLoading(false)
    }
};

  // const onError = (errors) => {
  //   const getFirstError = (obj) => {
  //     for (const key in obj) {
  //       const value = obj[key];

  //       if (value?.message) {
  //         return value.message;
  //       }

  //       if (value && typeof value === "object") {
  //         const nested = getFirstError(value);
  //         if (nested) return nested;
  //       }
  //     }
  //   };

  //   const message = getFirstError(errors);

  //   if (message) {
  //     toast.error(message);
  //   }
  // };
  const onError = (errors) => {

  console.log("========== RHF ERRORS ==========");
  console.dir(errors, { depth: null });

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

            {step === 4 && (
              <Step3Specification
                next={() => setStep(5)}
                previous={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <Step4Variants
                next={() => setStep(4)}
                previous={() => setStep(2)}
              />
            )}

            {/* {step === 5 && (
              <Step5Review
                product={watch()}
                previous={() => setStep(4)}
              />
            )} */}
            {step === 5 && (
              <Step5SEO
                next={() => setStep(6)}
                previous={() => setStep(4)}
              />
            )}

            {step === 6 && (
              <Step6Review
                product={watch()}
                previous={() => setStep(5)}
                loading={loading}
                isSubmitting={isSubmitting}
              />
            )}

          </form>

        </div>

      </div>
    </FormProvider>
  );
}