// Initial state
const initialState = { itemDetails: {}, loading: false, error: null };

// Reducer for item details
export const getItemDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ITEM_DETAILS_REQUEST':
            return { ...state, loading: true, error: null };

        case 'GET_ITEM_DETAILS_SUCCESS':
            return { ...state, loading: false, itemDetails: action.payload };

        case 'GET_ITEM_DETAILS_FAILED':
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
