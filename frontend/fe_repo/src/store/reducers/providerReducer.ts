import { ProviderActions } from '../actions/providerActions';
import { SET_PROVIDER } from '../actionTypes';
import { Provider } from '../actions/providerActions'

export interface ProviderState {
    provider: Provider;
}

const initialState: ProviderState = {
    provider: null
};

const providerReducer = (state = initialState, action: ProviderActions): ProviderState => {
    switch (action.type) {
        case SET_PROVIDER:
            return {
                ...state,
                provider: action.payload
            };
        default:
            return state;
    }
};

export default providerReducer;