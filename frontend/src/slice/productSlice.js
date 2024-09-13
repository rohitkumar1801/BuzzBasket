import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ITEMS_PER_PAGE } from "../store/constant";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ page, category, brand, _sort, _order }) => {
    try {
      // Construct the category filter
      const categoryFilter = category ? `category=${category}&` : "";

      // Construct the brand filter (multiple brands separated by commas)
      const brandFilter = brand ? `brand=${brand}&` : "";
      console.log(brand);

      const sortFilter = _sort ? `_sort=${_sort}&` : "";
      const orderFilter = _order ? `_order=${_order}&` : "";

      // Fetch data from the API, combining all filters
      const response = await fetch(
        `http://localhost:8080/products?${categoryFilter}${brandFilter}${sortFilter}${orderFilter}_page=${page}&_limit=${ITEMS_PER_PAGE}`
      );

      // Extract total items count and product data
      const items = await response.headers.get("X-Total-Count");
      const productData = await response.json();
      console.log(productData);

      // Return both products and available brands
      return {
        products: productData.data,
        brands: productData.brands,
        items: items,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/products/${id}`);

      const data = await response.json();
      return data.product;
    } catch (err) {
      console.log(err);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    brands: [],
    totalItems: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalItems = action.payload.items;
        state.brands = action.payload.brands;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
