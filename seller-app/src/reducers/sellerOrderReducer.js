export const initialState = {

    //----------------------------------
    // Orders
    //----------------------------------

    orders: [],

    loading: false,

    error: null,

    //----------------------------------
    // Pagination
    //----------------------------------

    pagination: {

        page: 1,

        limit: 10,

        total: 0,

        totalPages: 1

    },

    //----------------------------------
    // Filters
    //----------------------------------

    filters: {

        search: "",

        status: "",

        courier: "",

        date: ""

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

                orders: action.payload.orders,

                pagination: action.payload.pagination

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

        default:

            return state;

    }

}