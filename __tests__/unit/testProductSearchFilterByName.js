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

  describe('Normal Cases', () => {
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
  });

  describe('Edge Case: Empty Or Null Inputs', () => {
    it('should handle null search term', () => {
      const result = filterProductsByName(products, null);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle undefined search term', () => {
      const result = filterProductsByName(products, undefined);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty string search term', () => {
      const result = filterProductsByName(products, '');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle whitespace only search term', () => {
      const result = filterProductsByName(products, '   ');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle null products array', () => {
      const result = filterProductsByName(null, 'Ayam');
      expect(Array.isArray(result) || result === null).toBe(true);
    });

    it('should handle undefined products array', () => {
      const result = filterProductsByName(undefined, 'Ayam');
      expect(Array.isArray(result) || result === undefined).toBe(true);
    });

    it('should handle empty products array', () => {
      const result = filterProductsByName([], 'Ayam');
      expect(result).toHaveLength(0);
    });
  });

  describe('Edge Case: Special Characters', () => {
    it('should handle search term with special characters', () => {
      const specialProducts = [
        { id: 1, name: 'Nasi Goreng!@#$%', price: 15000 },
        { id: 2, name: 'Mie Ayam (Spicy)', price: 12000 },
      ];
      const result = filterProductsByName(specialProducts, '!@#$%');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term with regex special chars', () => {
      const regexProducts = [
        { id: 1, name: 'Product [A]', price: 10000 },
        { id: 2, name: 'Product {B}', price: 10000 },
      ];
      const result = filterProductsByName(regexProducts, '[A]');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term with dots and asterisks', () => {
      const result = filterProductsByName(products, '.*');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term with backslashes', () => {
      const result = filterProductsByName(products, '\\n\\t\\r');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term with quote characters', () => {
      const result = filterProductsByName(products, '"\'`');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Edge Case: Unusual String Values', () => {
    it('should handle very long search term', () => {
      const longSearch = 'A'.repeat(10000);
      const result = filterProductsByName(products, longSearch);
      expect(result).toHaveLength(0);
    });

    it('should handle search term with only numbers', () => {
      const numProducts = [
        { id: 1, name: '12345', price: 10000 },
        { id: 2, name: 'Product 123', price: 12000 },
      ];
      const result = filterProductsByName(numProducts, '12345');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term with unicode characters', () => {
      const unicodeProducts = [
        { id: 1, name: '产品名称', price: 10000 },
        { id: 2, name: 'Café', price: 12000 },
      ];
      const result = filterProductsByName(unicodeProducts, '产品');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term with emoji', () => {
      const emojiProducts = [
        { id: 1, name: '🍕 Pizza', price: 10000 },
        { id: 2, name: '🍔 Burger', price: 12000 },
      ];
      const result = filterProductsByName(emojiProducts, '🍕');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term with newlines', () => {
      const result = filterProductsByName(products, 'Ayam\nGoreng');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term with tabs', () => {
      const result = filterProductsByName(products, 'Ayam\tGoreng');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term with null character', () => {
      const result = filterProductsByName(products, 'Ayam\0Goreng');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Edge Case: Invalid Product Objects', () => {
    it('should handle products with null names', () => {
      const nullNameProducts = [
        { id: 1, name: null, price: 10000 },
        { id: 2, name: 'Nasi Goreng', price: 15000 },
      ];
      const result = filterProductsByName(nullNameProducts, 'Nasi');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle products with undefined names', () => {
      const undefinedNameProducts = [
        { id: 1, name: undefined, price: 10000 },
        { id: 2, name: 'Mie Ayam', price: 12000 },
      ];
      const result = filterProductsByName(undefinedNameProducts, 'Mie');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle products with empty string names', () => {
      const emptyNameProducts = [
        { id: 1, name: '', price: 10000 },
        { id: 2, name: 'Soto Ayam', price: 10000 },
      ];
      const result = filterProductsByName(emptyNameProducts, 'Soto');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle products with non-string names (numbers)', () => {
      const numNameProducts = [
        { id: 1, name: 12345, price: 10000 },
        { id: 2, name: 'Nasi Goreng', price: 15000 },
      ];
      const result = filterProductsByName(numNameProducts, 'Nasi');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle products with object names', () => {
      const objNameProducts = [
        { id: 1, name: { category: 'food' }, price: 10000 },
        { id: 2, name: 'Mie Ayam', price: 12000 },
      ];
      const result = filterProductsByName(objNameProducts, 'Mie');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle products with array names', () => {
      const arrNameProducts = [
        { id: 1, name: ['Nasi', 'Goreng'], price: 10000 },
        { id: 2, name: 'Mie Ayam', price: 12000 },
      ];
      const result = filterProductsByName(arrNameProducts, 'Nasi');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle products missing name property entirely', () => {
      const noNameProducts = [
        { id: 1, price: 10000 },
        { id: 2, name: 'Soto Ayam', price: 10000 },
      ];
      const result = filterProductsByName(noNameProducts, 'Soto');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle products with extremely long names', () => {
      const longNameProducts = [
        { id: 1, name: 'A'.repeat(50000), price: 10000 },
        { id: 2, name: 'Nasi Goreng', price: 15000 },
      ];
      const result = filterProductsByName(longNameProducts, 'Nasi');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Edge Case: Products Array Anomalies', () => {
    it('should handle array with null elements', () => {
      const mixedProducts = [
        null,
        { id: 1, name: 'Nasi Goreng', price: 15000 },
        null,
      ];
      const result = filterProductsByName(mixedProducts, 'Nasi');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle array with undefined elements', () => {
      const mixedProducts = [
        undefined,
        { id: 2, name: 'Mie Ayam', price: 12000 },
        undefined,
      ];
      const result = filterProductsByName(mixedProducts, 'Mie');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle array with non-object elements', () => {
      const mixedProducts = [
        'not an object',
        123,
        true,
        { id: 1, name: 'Nasi Goreng', price: 15000 },
      ];
      const result = filterProductsByName(mixedProducts, 'Nasi');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle extremely large products array', () => {
      const largeProducts = Array.from({ length: 100000 }, (_, i) => ({
        id: i,
        name: `Product ${i}`,
        price: 10000,
      }));
      const result = filterProductsByName(largeProducts, 'Product 50000');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle deeply nested product objects', () => {
      const deepProducts = [
        { id: 1, name: 'Nasi Goreng', data: { nested: { deep: { value: 'test' } } } },
        { id: 2, name: 'Mie Ayam', data: { nested: { deep: { value: 'test' } } } },
      ];
      const result = filterProductsByName(deepProducts, 'Mie');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle products with circular references', () => {
      const circularProduct = { id: 1, name: 'Nasi Goreng', price: 15000 };
      circularProduct.self = circularProduct;
      const products = [circularProduct];
      const result = filterProductsByName(products, 'Nasi');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Edge Case: Search Term Data Types', () => {
    it('should handle search term as number', () => {
      const result = filterProductsByName(products, 123);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term as object', () => {
      const result = filterProductsByName(products, { search: 'Ayam' });
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term as array', () => {
      const result = filterProductsByName(products, ['Ayam', 'Goreng']);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term as boolean', () => {
      const result = filterProductsByName(products, true);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term as function', () => {
      const result = filterProductsByName(products, () => 'Ayam');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term as Symbol', () => {
      const result = filterProductsByName(products, Symbol('search'));
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term as Date', () => {
      const result = filterProductsByName(products, new Date());
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term as RegExp', () => {
      const result = filterProductsByName(products, /Ayam/);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term as Infinity', () => {
      const result = filterProductsByName(products, Infinity);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term as NaN', () => {
      const result = filterProductsByName(products, NaN);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Edge Case: Case Sensitivity And Normalization', () => {
    it('should handle mixed case search terms', () => {
      const result = filterProductsByName(products, 'NaSi GoReNg');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle search term with leading/trailing spaces', () => {
      const result = filterProductsByName(products, '  Ayam  ');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle accented characters', () => {
      const accentProducts = [
        { id: 1, name: 'Café', price: 10000 },
        { id: 2, name: 'Naïve', price: 12000 },
      ];
      const result = filterProductsByName(accentProducts, 'café');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Edge Case: Multiple Matches', () => {
    it('should handle search term matching multiple products with exact duplicates', () => {
      const duplicateProducts = [
        { id: 1, name: 'Nasi Goreng', price: 15000 },
        { id: 2, name: 'Nasi Goreng', price: 15000 },
        { id: 3, name: 'Nasi Goreng', price: 15000 },
      ];
      const result = filterProductsByName(duplicateProducts, 'Nasi Goreng');
      expect(result.length).toBe(3);
    });

    it('should handle search term matching all products', () => {
      const result = filterProductsByName(products, '');
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
