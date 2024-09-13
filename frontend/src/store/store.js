import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '../slice/categorySlice';
import productReducer from '../slice/productSlice';
import userReducer from '../slice/userSlice';
import cartReducer from '../slice/cartSlice';

const mainStore = configureStore({
  reducer: {
    product: productReducer,
    category: categoryReducer,
    user: userReducer,
    cart: cartReducer,
  },
});

export default mainStore;