// import { useEffect } from 'react';
// import { useWatch } from 'react-hook-form';

// export const useFormPersist = (key, { control, setValue }) => {
//   const allValues = useWatch({ control });

//   // 1. Initial Load (Pehle jaisa hi rahega)
//   useEffect(() => {
//     const savedData = localStorage.getItem(key);
//     if (savedData) {
//       try {
//         const parsedData = JSON.parse(savedData);
//         Object.keys(parsedData).forEach((field) => {
//           setValue(field, parsedData[field]);
//         });
//       } catch (e) {
//         console.error("Error parsing saved data", e);
//       }
//     }
//   }, [key, setValue]);


//   // 2. Debounced Save: Ab yahan timeout use karenge
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       localStorage.setItem(key, JSON.stringify(allValues));
//     }, 1000); // 1 second ka gap rakha hai taaki user type karta rahe toh baar-baar save na ho

//     return () => clearTimeout(handler); // Cleanup
//   }, [allValues, key]);
// };

import { useEffect } from "react";
import { useWatch } from "react-hook-form";

export const useFormPersist = (key, { control, setValue }) => {
  const allValues = useWatch({ control });

  // ==========================
  // LOAD
  // ==========================
  useEffect(() => {
    const saved = localStorage.getItem(key);

    if (!saved) return;

    try {
      const data = JSON.parse(saved);

      // Images ko restore mat karo
      if (data.variants) {
        data.variants = data.variants.map((v) => ({
          ...v,
          images: [],
        }));
      }

      Object.keys(data).forEach((field) => {
        setValue(field, data[field]);
      });

    } catch (err) {
      console.error(err);
    }
  }, [key, setValue]);

  // ==========================
  // SAVE
  // ==========================
  useEffect(() => {
    const timer = setTimeout(() => {

      const data = {
        ...allValues,

        variants: (allValues.variants || []).map((variant) => ({
          ...variant,

          // File object save mat karo
          images: [],
        })),
      };

      localStorage.setItem(
        key,
        JSON.stringify(data)
      );

    }, 1000);

    return () => clearTimeout(timer);

  }, [allValues, key]);
};