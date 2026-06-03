import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock implementation filterProductsByName
const filterProductsByName = (products, searchTerm) => {
  try {
    if (!Array.isArray(products)) return [];
    if (!searchTerm) return products;
    
    const term = String(searchTerm).toLowerCase();
    return products.filter(product => {
      if (!product || typeof product !== 'object') return false;
      const name = product.name;
      if (!name) return false;
      return String(name).toLowerCase().includes(term);
    });
  } catch (error) {
    return [];
  }
};

describe('Product Search - Filter By Name', () => {
  let products;

  beforeEach(() => {
    products = [
      { id: 1, name: 'Nasi Goreng', price: 15000 },
      { id: 2, name: 'Mie Ayam', price: 12000 },
      { id: 3, name: 'Soto Ayam', price: 10000 },
      { id: 4, name: 'Bakso Ayam', price: 14000 },
      { id: 5, name: 'Ayam Panggang', price: 25000 },
    ];
  });

  it('should filter products by exact name', () => {
    const result = filterProductsByName(products, 'Nasi Goreng');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('should filter products by partial name', () => {
    const result = filterProductsByName(products, 'Ayam');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(p => p.name.includes('Ayam'))).toBe(true);
  });

  it('should return empty array if no match', () => {
    const result = filterProductsByName(products, 'Pizza');
    expect(result).toHaveLength(0);
  });

  it('should be case insensitive', () => {
    const result = filterProductsByName(products, 'nasi goreng');
    expect(result).toHaveLength(1);
  });

  it('should handle null search term', () => {
    const result = filterProductsByName(products, null);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle null products array', () => {
    const result = filterProductsByName(null, 'Ayam');
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle search term with special characters', () => {
    const result = filterProductsByName(products, '!@#$%^&*()');
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle very long search term', () => {
    const longSearch = 'A'.repeat(10000);
    const result = filterProductsByName(products, longSearch);
    expect(result).toHaveLength(0);
  });

  it('should handle products with null names', () => {
    const nullNameProducts = [
      { id: 1, name: null, price: 10000 },
      { id: 2, name: 'Nasi Goreng', price: 15000 },
    ];
    const result = filterProductsByName(nullNameProducts, 'Nasi');
    expect(Array.isArray(result)).toBe(true);
  });
});
