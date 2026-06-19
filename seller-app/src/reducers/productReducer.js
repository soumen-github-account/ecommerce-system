export const productReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "UPDATE_PRODUCT":
      return {
        ...state,
        ...action.payload,
      };

    case "SET_SPECIFICATION":
      return {
        ...state,
        specification: action.payload,
      };

    case "SET_VARIANTS":
      return {
        ...state,
        variants: action.payload,
      };

    case "RESET_PRODUCT":
      return action.payload;

    default:
      return state;
  }
};