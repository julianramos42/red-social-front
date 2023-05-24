import { createReducer } from "@reduxjs/toolkit";
import modalActions from "./actions";

const {renderModal} = modalActions

const initialState = {
    state: false
}

const modalReducer = createReducer(
    initialState,
    (builder) => builder
        .addCase(
            renderModal,
            (state,action) => {
                let newState = {
                    ...state,
                    state: action.payload.state
                }
                return newState
            }
        )
)

export default modalReducer