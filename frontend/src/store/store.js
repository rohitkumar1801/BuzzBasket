import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '../slice/categorySlice';
import productReducer from '../slice/productSlice';

const mainStore = configureStore({
  reducer: {
    product: productReducer,
    category: categoryReducer
  },
});

export default mainStore;