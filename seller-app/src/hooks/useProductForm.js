import { useEffect, useState } from "react";
import slugify from "slugify";
import { useProduct } from "../contexts/ProductContext";

export default function useProductForm() {
  const { product, dispatch } = useProduct();

  const [step, setStep] = useState(1);

  // -----------------------------
  // Auto Slug
  // -----------------------------

  useEffect(() => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "slug",
      value: slugify(product.title || "", {
        lower: true,
        strict: true,
      }),
    });
  }, [product.title]);

  // -----------------------------
  // Update Single Field
  // -----------------------------

  // const updateField = (field, value) => {
  //   dispatch({
  //     type: "UPDATE_FIELD",
  //     field,
  //     value,
  //   });
  // };

  // -----------------------------
  // Update Multiple Fields
  // -----------------------------

  const updateProduct = (payload) => {
    dispatch({
      type: "UPDATE_PRODUCT",
      payload,
    });
  };

  // -----------------------------
  // Specification
  // -----------------------------

  const setSpecification = (specification) => {
    dispatch({
      type: "SET_SPECIFICATION",
      payload: specification,
    });
  };

  // -----------------------------
  // Variants
  // -----------------------------

  const setVariants = (variants) => {
    dispatch({
      type: "SET_VARIANTS",
      payload: variants,
    });
  };

    const updateField = (e) => {
        const { name, value } = e.target;

        dispatch({
            type: "UPDATE_FIELD",
            field: name,
            value
        });
    };

    const updateSpecification = (specification) => {
        dispatch({
            type: "SET_SPECIFICATION",
            payload: specification
        });
    };

    const updateVariants = (variants) => {
        dispatch({
            type: "SET_VARIANTS",
            payload: variants
        });
    };

  // -----------------------------
  // Validation
  // -----------------------------

  const validateStep = () => {
    switch (step) {
      case 1:
        return (
          product.title &&
          product.brand &&
          product.category &&
          product.subCategory &&
          product.subCategoryLevel2 &&
          product.seller
        );

      case 2:
        return product.description;

      case 3:
        return product.specification.length > 0;

      case 4:
        return product.variants.length > 0;

      default:
        return true;
    }
  };

  // -----------------------------
  // Navigation
  // -----------------------------

  const nextStep = () => {
    if (!validateStep()) {
      alert("Please complete this step first.");
      return;
    }

    setStep((prev) => Math.min(prev + 1, 5));
  };

  const previousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return {
    product,
    step,
    nextStep,
    previousStep,
    updateField,
    updateSpecification,
    updateVariants,
  };
}