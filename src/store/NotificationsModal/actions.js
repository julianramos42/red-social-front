import { createAction } from "@reduxjs/toolkit";

let renderModal = createAction(
    'renderModal',
    ({state}) => {
        return {
            payload: {
                state: state
            }
        }
    }
)

const modalActions = {renderModal}
export default modalActions