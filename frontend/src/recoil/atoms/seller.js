import { atom } from "recoil";

export const sellerState = atom({
    key: 'sellerState',
    default: {
        isAuthenticated: false,
        avatar: null,
        name: '',
        email:'',
        _id: null,
        isLoading: false,
        description: '',
        address: '',
        availableBalance: null,
    },
});