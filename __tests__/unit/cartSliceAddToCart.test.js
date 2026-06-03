import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock implementation cart reducer dan action
const addToCart = (product) => ({
  type: 'ADD_TO_CART',
  payload: product,
});

const cartReducer = (state = { items: [], total: 0 }, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const product = action.payload;
      if (!product) return state;
      
      const existingIndex = state.items?.findIndex?.(item => item.id === product.id) ?? -1;
      let newItems;
      
      if (existingIndex >= 0) {
        newItems = [...state.items];
        newItems[existingIndex] = { ...newItems[existingIndex], ...product };
      } else {
        newItems = [...(state.items || []), product];
      }
      
      const newTotal = newItems.reduce((sum, item) => {
        // Validasi: price harus number dan bukan NaN
        const price = (typeof item.price === 'number' && !Number.isNaN(item.price)) ? item.price : 0;
        const qty = typeof item.quantity === 'number' ? item.quantity : 1;
        return sum + (price * qty);
      }, 0);
      
      return { items: newItems, total: newTotal };
    }
    default:
      return state;
  }
};

describe('Cart Slice - Add To Cart', () => {
  let initialState;

  beforeEach(() => {
    initialState = { items: [], total: 0 };
  });

  it('should add a valid product to empty cart', () => {
    const product = { id: 1, name: 'Product 1', price: 10000, quantity: 1 };
    const state = cartReducer(initialState, addToCart(product));
    expect(state.items).toHaveLength(1);
    expect(state.total).toBe(10000);
  });

  it('should add multiple different products', () => {
    const product1 = { id: 1, name: 'Product 1', price: 10000, quantity: 1 };
    const product2 = { id: 2, name: 'Product 2', price: 20000, quantity: 1 };
    
    let state = cartReducer(initialState, addToCart(product1));
    state = cartReducer(state, addToCart(product2));
    
    expect(state.items).toHaveLength(2);
    expect(state.total).toBe(30000);
  });

  it('should handle null product', () => {
    const state = cartReducer(initialState, addToCart(null));
    expect(state.items).toHaveLength(0);
  });

  it('should handle product with negative price', () => {
    const product = { id: 1, name: 'Product', price: -10000, quantity: 1 };
    const state = cartReducer(initialState, addToCart(product));
    expect(state.items).toHaveLength(1);
    expect(state.total).toBe(-10000);
  });

  it('should handle product with zero price', () => {
    const product = { id: 1, name: 'Product', price: 0, quantity: 1 };
    const state = cartReducer(initialState, addToCart(product));
    expect(state.items).toHaveLength(1);
    expect(state.total).toBe(0);
  });

  it('should handle product with NaN price', () => {
    const product = { id: 1, name: 'Product', price: NaN, quantity: 1 };
    const state = cartReducer(initialState, addToCart(product));
    expect(state.items).toHaveLength(1);
    expect(state.total).toBe(0);
  });

  it('should handle product with emoji in name', () => {
    const product = { id: 1, name: '🍕 Pizza', price: 10000, quantity: 1 };
    const state = cartReducer(initialState, addToCart(product));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].name).toBe('🍕 Pizza');
  });

  it('should handle product with circular reference', () => {
    const product = { id: 1, name: 'Product', price: 10000, quantity: 1 };
    product.self = product;
    const state = cartReducer(initialState, addToCart(product));
    expect(state.items).toHaveLength(1);
  });
});
