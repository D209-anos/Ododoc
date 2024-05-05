import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Provider = 'kakao' | 'google' | 'naver' | null;

interface ProviderState {
  provider: Provider | null;
}

const initialState: ProviderState = {
  provider: null
};

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    setProvider(state, action: PayloadAction<Provider>) {
        state.provider = action.payload;
    }
  }
});

export const { setProvider } = providerSlice.actions;
export default providerSlice.reducer;