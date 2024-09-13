import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/cart', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(itemData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data.updatedCart;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

export const fetchCartByUserThunk = createAsyncThunk("cart/fetchCartByUser", async (itemData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/cart', {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data.cart;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  })

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addItemToCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        const updatedCartItems = action.payload.items;
        updatedCartItems.forEach((newItem) => {
          const existingItem = state.cartItems.find(
            (item) => item.product._id === newItem.product._id
          );
          if (existingItem) {
            // If the product already exists, update its quantity
            existingItem.quantity = newItem.quantity;
          } else {
            // If it's a new product, add it to the cart
            state.cartItems.push(newItem);
          }
        });
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to add item to cart';
      })
      .addCase(fetchCartByUserThunk.fulfilled, (state, action) => {
        state.status = 'suceeded';
        state.cartItems = action.payload;
      })
  }
});

export default cartSlice.reducer;
