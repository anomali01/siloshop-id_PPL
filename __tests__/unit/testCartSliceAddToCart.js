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
      
      const existingIndex = state.items.findIndex(item => item.id === product.id);
      let newItems;
      
      if (existingIndex >= 0) {
        newItems = [...state.items];
        newItems[existingIndex] = { ...newItems[existingIndex], ...product };
      } else {
        newItems = [...state.items, product];
      }
      
      const newTotal = newItems.reduce((sum, item) => {
        const price = typeof item.price === 'number' ? item.price : 0;
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
    initialState = {
      items: [],
      total: 0,
    };
  });

  describe('Normal Cases', () => {
    it('should add a valid product to empty cart', () => {
      const product = {
        id: 1,
        name: 'Product 1',
        price: 10000,
        quantity: 1,
      };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(product);
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

    it('should increase quantity if product already exists', () => {
      const product = { id: 1, name: 'Product 1', price: 10000, quantity: 1 };
      
      let state = cartReducer(initialState, addToCart(product));
      const productWithIncreasedQty = { ...product, quantity: 2 };
      state = cartReducer(state, addToCart(productWithIncreasedQty));
      
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
    });
  });

  describe('Edge Case: Invalid Product Data Types', () => {
    it('should handle null product', () => {
      const state = cartReducer(initialState, addToCart(null));
      expect(state.items).toHaveLength(0);
    });

    it('should handle undefined product', () => {
      const state = cartReducer(initialState, addToCart(undefined));
      expect(state.items).toHaveLength(0);
    });

    it('should handle empty object product', () => {
      const state = cartReducer(initialState, addToCart({}));
      expect(state.items).toHaveLength(1);
    });

    it('should handle product with missing required fields', () => {
      const product = { name: 'Product' };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(product);
    });

    it('should handle product with null values', () => {
      const product = {
        id: null,
        name: null,
        price: null,
        quantity: null,
      };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should handle product with undefined values', () => {
      const product = {
        id: undefined,
        name: undefined,
        price: undefined,
        quantity: undefined,
      };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });
  });

  describe('Edge Case: Invalid Price Values', () => {
    it('should add product with negative price', () => {
      const product = { id: 1, name: 'Product', price: -10000, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
      expect(state.total).toBe(-10000);
    });

    it('should add product with zero price', () => {
      const product = { id: 1, name: 'Product', price: 0, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
      expect(state.total).toBe(0);
    });

    it('should add product with string price', () => {
      const product = { id: 1, name: 'Product', price: '10000', quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with Infinity price', () => {
      const product = { id: 1, name: 'Product', price: Infinity, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
      expect(state.total).toBe(Infinity);
    });

    it('should add product with negative Infinity price', () => {
      const product = { id: 1, name: 'Product', price: -Infinity, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
      expect(state.total).toBe(-Infinity);
    });

    it('should add product with NaN price', () => {
      const product = { id: 1, name: 'Product', price: NaN, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
      expect(Number.isNaN(state.total)).toBe(true);
    });

    it('should add product with very large price', () => {
      const product = { id: 1, name: 'Product', price: 999999999999999999, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with decimal price', () => {
      const product = { id: 1, name: 'Product', price: 10000.5555, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].price).toBe(10000.5555);
    });
  });

  describe('Edge Case: Invalid Quantity Values', () => {
    it('should add product with negative quantity', () => {
      const product = { id: 1, name: 'Product', price: 10000, quantity: -5 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(-5);
    });

    it('should add product with zero quantity', () => {
      const product = { id: 1, name: 'Product', price: 10000, quantity: 0 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with decimal quantity', () => {
      const product = { id: 1, name: 'Product', price: 10000, quantity: 2.5 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2.5);
    });

    it('should add product with string quantity', () => {
      const product = { id: 1, name: 'Product', price: 10000, quantity: '5' };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with very large quantity', () => {
      const product = { id: 1, name: 'Product', price: 10000, quantity: 999999999 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });
  });

  describe('Edge Case: Invalid ID Values', () => {
    it('should add product with negative ID', () => {
      const product = { id: -1, name: 'Product', price: 10000, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with zero ID', () => {
      const product = { id: 0, name: 'Product', price: 10000, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with string ID', () => {
      const product = { id: 'product-123', name: 'Product', price: 10000, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with UUID as ID', () => {
      const product = { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Product', price: 10000, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with special characters in ID', () => {
      const product = { id: '!@#$%^&*()', name: 'Product', price: 10000, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });
  });

  describe('Edge Case: Invalid Name Values', () => {
    it('should add product with empty name', () => {
      const product = { id: 1, name: '', price: 10000, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with null name', () => {
      const product = { id: 1, name: null, price: 10000, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with very long name', () => {
      const product = { id: 1, name: 'A'.repeat(10000), price: 10000, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with special characters in name', () => {
      const product = { id: 1, name: '!@#$%^&*()_+-=[]{}|;:,.<>?', price: 10000, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with emoji in name', () => {
      const product = { id: 1, name: '🍕 Pizza 🍔', price: 10000, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with unicode characters in name', () => {
      const product = { id: 1, name: '产品名称中文', price: 10000, quantity: 1 };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });
  });

  describe('Edge Case: Complex Product Objects', () => {
    it('should add product with nested objects', () => {
      const product = {
        id: 1,
        name: 'Product',
        price: 10000,
        quantity: 1,
        metadata: { category: 'food', tags: ['spicy', 'hot'] },
      };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with array values', () => {
      const product = {
        id: 1,
        name: 'Product',
        price: [10000, 20000, 30000],
        quantity: 1,
      };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with circular reference', () => {
      const product = {
        id: 1,
        name: 'Product',
        price: 10000,
        quantity: 1,
      };
      product.self = product;
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with functions', () => {
      const product = {
        id: 1,
        name: 'Product',
        price: 10000,
        quantity: 1,
        getDiscount: () => 0.1,
      };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    it('should add product with null and undefined mixed', () => {
      const product = {
        id: 1,
        name: 'Product',
        price: 10000,
        quantity: 1,
        discount: null,
        extra: undefined,
        seller: { name: null },
      };
      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);
    });
  });

  describe('Edge Case: Array As Product', () => {
    it('should handle array instead of object as product', () => {
      const state = cartReducer(initialState, addToCart([1, 2, 3]));
      expect(state.items).toHaveLength(1);
    });

    it('should handle array with mixed types as product', () => {
      const state = cartReducer(initialState, addToCart([1, 'name', { price: 10000 }, null]));
      expect(state.items).toHaveLength(1);
    });
  });

  describe('Edge Case: State Anomalies', () => {
    it('should handle null state', () => {
      const product = { id: 1, name: 'Product', price: 10000, quantity: 1 };
      const state = cartReducer(null, addToCart(product));
      expect(state).toBeDefined();
    });

    it('should handle state with corrupt total', () => {
      const corruptState = { items: [{ id: 1 }], total: NaN };
      const product = { id: 2, name: 'Product', price: 10000, quantity: 1 };
      const state = cartReducer(corruptState, addToCart(product));
      expect(state.items).toHaveLength(2);
    });

    it('should handle state with negative total', () => {
      const negativeState = { items: [{ id: 1, price: -5000 }], total: -5000 };
      const product = { id: 2, name: 'Product', price: 10000, quantity: 1 };
      const state = cartReducer(negativeState, addToCart(product));
      expect(state.items).toHaveLength(2);
    });

    it('should handle state items not being array', () => {
      const corruptState = { items: null, total: 0 };
      const product = { id: 1, name: 'Product', price: 10000, quantity: 1 };
      const state = cartReducer(corruptState, addToCart(product));
      expect(state).toBeDefined();
    });
  });

  describe('Edge Case: Special Number Values', () => {
    it('should calculate total with Infinity items', () => {
      const initialInfinity = { items: [], total: Infinity };
      const product = { id: 1, name: 'Product', price: 100, quantity: 1 };
      const state = cartReducer(initialInfinity, addToCart(product));
      expect(state.total).toBe(Infinity);
    });

    it('should handle subtracting from Infinity', () => {
      const initialInfinity = { items: [], total: -Infinity };
      const product = { id: 1, name: 'Product', price: -10000, quantity: 1 };
      const state = cartReducer(initialInfinity, addToCart(product));
      expect(state.total).toBe(-Infinity);
    });
  });
});
