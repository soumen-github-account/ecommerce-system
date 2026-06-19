import { createContext, useContext, useReducer } from "react";

import { initialProduct } from "../constants/initialProduct";
import { productReducer } from "../reducers/productReducer";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [product, dispatch] = useReducer(
    productReducer,
    initialProduct
  );

  return (
    <ProductContext.Provider
      value={{
        product,
        dispatch,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  return useContext(ProductContext);
}