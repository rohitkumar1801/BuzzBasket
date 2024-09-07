import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk('fetchProducts', async ({currentPage, selectedCategory})=>{
    try {
        console.log(`http://localhost:8080/products?category=${selectedCategory}&_page=${currentPage}&_limit=16`)
        const response = await fetch(`http://localhost:8080/products?category=${selectedCategory}&_page=${currentPage}&_limit=16`);
        const items = await response.headers.get("X-Total-Count");
        const productData = await response.json();
        return {products: productData.data, items: items};
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
})

const productSlice = createSlice({
    name: 'product',
    initialState: {products: [], totalItems:0, loading: false, error: null},
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (state) =>{
            state.loading = true;
        })
        .addCase(fetchProducts.fulfilled, (state, action) =>{
            state.loading = false;
            state.products = action.payload.products;
            state.totalItems = action.payload.items;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
});

export default productSlice.reducer;