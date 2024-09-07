import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCategories = createAsyncThunk('categories/fetch', async ()=>{
    try {
        const response = await fetch(`http://localhost:8080/categories`);
        const categoriesData = await response.json();
        return categoriesData.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
})

const categorySlice = createSlice({
    name: 'category',
    initialState: {categories: [], loading: false, error: null},
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchCategories.pending, (state) =>{
            state.loading = true;
        })
        .addCase(fetchCategories.fulfilled, (state, action) =>{
            state.loading = false;
            state.categories = action.payload;
        })
        .addCase(fetchCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
});

export default categorySlice.reducer;