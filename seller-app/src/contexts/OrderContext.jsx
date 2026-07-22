// import {
//     createContext,
//     useContext,
//     useReducer
// } from "react";

// import {
//     sellerOrderReducer,
//     initialState
// } from "../reducers/sellerOrderReducer";

// const OrderContext =
//     createContext();

// export function OrderProvider({
//     children
// }) {

//     const [state, dispatch] =
//         useReducer(
//             sellerOrderReducer,
//             initialState
//         );

//     return (

//         <OrderContext.Provider
//             value={{
//                 state,
//                 dispatch
//             }}
//         >

//             {children}

//         </OrderContext.Provider>

//     );

// }

// export function useOrderContext() {

//     const context =
//         useContext(OrderContext);

//     if (!context) {

//         throw new Error(
//             "useOrderContext must be used inside OrderProvider"
//         );

//     }

//     return context;

// }

import { createContext, useContext, useReducer } from "react";

import {
    sellerOrderReducer,
    initialState
} from "../reducers/sellerOrderReducer";

const OrderContext = createContext();

export function OrderProvider({ children }) {

    const [state, dispatch] = useReducer(

        sellerOrderReducer,

        initialState

    );

    return (

        <OrderContext.Provider
            value={{

                state,

                dispatch

            }}
        >

            {children}

        </OrderContext.Provider>

    );

}

export function useOrderContext() {

    const context = useContext(OrderContext);

    if (!context) {

        throw new Error(
            "useOrderContext must be used inside OrderProvider"
        );

    }

    return context;

}