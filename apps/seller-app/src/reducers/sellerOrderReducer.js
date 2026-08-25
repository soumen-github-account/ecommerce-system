// export const initialState = {

//     //----------------------------------
//     // Orders
//     //----------------------------------

//     orders: [],

//     loading: false,

//     error: null,

//     //----------------------------------
//     // Pagination
//     //----------------------------------

//     pagination: {

//         page: 1,

//         limit: 10,

//         total: 0,

//         totalPages: 1

//     },

//     //----------------------------------
//     // Filters
//     //----------------------------------

//     filters: {

//         search: "",

//         status: "",

//         courier: "",

//         date: ""

//     },

//     //----------------------------------
//     // Selection
//     //----------------------------------

//     selectedOrders: [],

//     //----------------------------------
//     // Drawer
//     //----------------------------------

//     currentOrder: null,

//     drawerOpen: false,
//     shipmentModalOpen: false,
//     shipmentOrder: null,

// };
export const initialState = {
  //----------------------------------
  // Orders
  //----------------------------------

  orders: [],

  loading: false,

  error: null,

  //----------------------------------
  // Stats
  //----------------------------------

  stats: {
    total: 0,
    pending: 0,
    confirmed: 0,
    packed: 0,
    readyToShip: 0,
    shipped: 0,
    returns: 0,
    cancelled: 0,

    // percentage
    changes: {
      total: 0,
      pending: 0,
      confirmed: 0,
      packed: 0,
      readyToShip: 0,
      shipped: 0,
      returns: 0,
      cancelled: 0,
    },
  },

  //----------------------------------
  // Pagination
  //----------------------------------

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },

  //----------------------------------
  // Filters
  //----------------------------------

  filters: {
    search: "",
    status: "",
    courier: "",
    paymentStatus: "",
    date: "",
  },

  //----------------------------------
  // Selection
  //----------------------------------

  selectedOrders: [],

  //----------------------------------
  // Drawer
  //----------------------------------

  currentOrder: null,
  drawerOpen: false,

  //----------------------------------
  // Shipment
  //----------------------------------

  shipmentModalOpen: false,
  shipmentOrder: null,
};


export function sellerOrderReducer(state, action) {

    switch (action.type) {

        case "SET_LOADING":

            return {

                ...state,

                loading: action.payload

            };

        case "SET_ORDERS":
            return {
                ...state,
                orders: action.payload.orders || [],

                pagination:
                action.payload.pagination ||
                state.pagination,
            };

        case "SET_ERROR":

            return {

                ...state,

                error: action.payload

            };

        case "SET_FILTERS":

            return {

                ...state,

                filters: {

                    ...state.filters,

                    ...action.payload

                }

            };

        case "SET_SELECTED":

            return {

                ...state,

                selectedOrders: action.payload

            };

        case "OPEN_DRAWER":

            return {

                ...state,

                drawerOpen: true,

                currentOrder: action.payload

            };

        case "CLOSE_DRAWER":

            return {

                ...state,

                drawerOpen: false,

                currentOrder: null

            };

        case "OPEN_SHIPMENT_MODAL":

            return {

                ...state,

                shipmentModalOpen: true,

                shipmentOrder: action.payload

            };

        case "CLOSE_SHIPMENT_MODAL":

            return {

                ...state,

                shipmentModalOpen: false,

                shipmentOrder: null

            };

        case "SET_STATS":
            return {
                ...state,

                stats: {
                ...state.stats,

                ...action.payload,

                changes: {
                    ...state.stats?.changes,

                    ...(action.payload?.changes || {}),
                },
                },
            };

        default:

            return state;

    }
}