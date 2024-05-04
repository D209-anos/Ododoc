import { SET_PROVIDER } from "../actionTypes";

// provider 타입 정의
export type Provider = 'kakao' | 'google' | 'naver' | null;

interface SetProviderAction {
    type: typeof SET_PROVIDER;
    payload: Provider;
}

export const setProvider = (provider: Provider): SetProviderAction => ({
    type: SET_PROVIDER,
    payload: provider
})

export type ProviderActions = SetProviderAction;