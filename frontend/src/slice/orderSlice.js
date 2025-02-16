import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HOST_URL } from "../store/constant";
export const createOrderThunk = createAsyncThunk(
  "order/create",
  async (orderData, rejectWithValue) => {
    try {
      const response = await fetch(`${HOST_URL}/orders`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(orderData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      console.log("order data", data.savedOrder);
      return data.savedOrder;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

export const fetchOrdersByUser = createAsyncThunk(
    "order/fetchOrdersByUser",
    async (_, rejectWithValue) => {
      try {
        const response = await fetch(`${HOST_URL}/orders`, {
         
          credentials: "include",
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          return rejectWithValue(errorData);
        }
  
        const data = await response.json();
        console.log("order data", data);
        return data;
      } catch (err) {
        return rejectWithValue({ message: err.message });
      }
    }
  );

  export const fetchOrderByIdThunk = createAsyncThunk(
    "order/fetchOrderById",
    async (id, rejectWithValue) => {
      try {
        const response = await fetch(`${HOST_URL}/orders/${id}`, {
          credentials: "include",
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          return rejectWithValue(errorData);
        }
  
        const data = await response.json();
        console.log("order data", data.order);
        return data.order;
      } catch (err) {
        return rejectWithValue({ message: err.message });
      }
    }
  );

const orderSlice = createSlice({
  name: "order",
  initialState: { orders: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      }).addCase(fetchOrderByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderByIdThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderByIdThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrdersByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
  },
});

export default orderSlice.reducer;
