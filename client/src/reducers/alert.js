import { SET_ALERT, REMOVE_ALERT } from "../actions/types"

const initialState = [];

//action include (1. typ2, 2. payload/data)
export default function (state = initialState, action) {
    const { type, payload } = action;
    // to evaluate the data, we need to use switch
    switch (action.type) {
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload);
        default: return state;
    }
}