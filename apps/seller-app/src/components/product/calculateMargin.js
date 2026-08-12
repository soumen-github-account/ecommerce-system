/**
 * Flipkart-Style Margin Calculation
 * Formula: ((SellingPrice - CostPrice) / SellingPrice) * 100
 */
export const calculateMargin = (sellingPrice, costPrice) => {
  const s = parseFloat(sellingPrice);
  const c = parseFloat(costPrice);

  if (!s || s <= 0) return "0.0";
  
  const profit = s - c;
  const margin = (profit / s) * 100;
  
  return margin.toFixed(1);
};

/**
 * Generate Default SKU if seller doesn't provide
 */
export const generateSlug = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
};