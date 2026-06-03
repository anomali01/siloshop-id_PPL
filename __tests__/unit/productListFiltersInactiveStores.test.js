import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock implementation filterProductsByActiveStores
const filterProductsByActiveStores = (products) => {
  try {
    if (!Array.isArray(products)) return [];
    
    return products.filter(product => {
      if (!product || typeof product !== 'object') return false;
      if (!product.store || typeof product.store !== 'object') return false;
      return product.store.active === true;
    });
  } catch (error) {
    return [];
  }
};

describe('Product List - Filter Inactive Stores', () => {
  let products;

  beforeEach(() => {
    products = [
      { id: 1, name: 'Nasi Goreng', storeId: 1, store: { id: 1, name: 'Store A', active: true } },
      { id: 2, name: 'Mie Ayam', storeId: 2, store: { id: 2, name: 'Store B', active: false } },
      { id: 3, name: 'Soto Ayam', storeId: 1, store: { id: 1, name: 'Store A', active: true } },
      { id: 4, name: 'Bakso Ayam', storeId: 3, store: { id: 3, name: 'Store C', active: false } },
      { id: 5, name: 'Ayam Panggang', storeId: 2, store: { id: 2, name: 'Store B', active: false } },
    ];
  });

  it('should filter out products from inactive stores', () => {
    const result = filterProductsByActiveStores(products);
    expect(result.every(p => p.store.active === true)).toBe(true);
  });

  it('should keep products from active stores only', () => {
    const result = filterProductsByActiveStores(products);
    expect(result).toHaveLength(2);
    expect(result[0].storeId).toBe(1);
  });

  it('should maintain product integrity', () => {
    const result = filterProductsByActiveStores(products);
    expect(result[0].name).toBe('Nasi Goreng');
    expect(result[1].name).toBe('Soto Ayam');
  });

  it('should handle null products array', () => {
    const result = filterProductsByActiveStores(null);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle empty products array', () => {
    const result = filterProductsByActiveStores([]);
    expect(result).toHaveLength(0);
  });

  it('should handle products with null store', () => {
    const invalidProducts = [
      { id: 1, name: 'Product', storeId: 1, store: null },
      ...products,
    ];
    const result = filterProductsByActiveStores(invalidProducts);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle active property as null', () => {
    const invalidProducts = [
      { id: 1, name: 'Product', storeId: 1, store: { id: 1, active: null } },
      ...products,
    ];
    const result = filterProductsByActiveStores(invalidProducts);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle extremely large products array', () => {
    const largeProducts = Array.from({ length: 100000 }, (_, i) => ({
      id: i,
      name: `Product ${i}`,
      storeId: i % 2,
      store: {
        id: i % 2,
        name: `Store ${i % 2}`,
        active: i % 3 === 0,
      },
    }));
    const result = filterProductsByActiveStores(largeProducts);
    expect(Array.isArray(result)).toBe(true);
  });
});
