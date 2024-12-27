import axios from 'axios';

// Action to fetch item details by reference (ITMREF)
export const getItemDetailsByRef = (itmref) => async (dispatch) => {
    dispatch({ type: 'GET_ITEM_DETAILS_REQUEST' }); // Dispatch request action

    try {
        // Make the API call
        const response = await axios.get(`https://topinvapi2.onrender.com/api/getvaliddata/getItemDetailsByRef/${itmref}`// Send the ITMREF as a query parameter
        );

        // Dispatch success action with the response data
        dispatch({ type: 'GET_ITEM_DETAILS_SUCCESS', payload: response.data });
    } catch (error) {
        // Dispatch failure action with error message
        dispatch({
            type: 'GET_ITEM_DETAILS_FAILED',
            payload: { message: error.message, code: error.code },
        });
    }
};
