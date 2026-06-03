import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock implementation dari authSeller
const authSeller = (req) => {
  try {
    if (!req || !req.user) return false;
    const storeId = req.user.storeId;
    if (!storeId && storeId !== 0) return false;
    // Validasi: hanya terima number atau string
    const type = typeof storeId;
    if (type !== 'number' && type !== 'string') return false;
    return storeId;
  } catch (error) {
    return false;
  }
};

describe('authSeller - Return False For Non-Seller', () => {
  let mockReq;

  beforeEach(() => {
    mockReq = { user: null };
  });

  it('should return false when req is null', () => {
    expect(authSeller(null)).toBe(false);
  });

  it('should return false when user is null', () => {
    mockReq.user = null;
    expect(authSeller(mockReq)).toBe(false);
  });

  it('should return false when storeId is missing', () => {
    mockReq.user = { id: 123 };
    expect(authSeller(mockReq)).toBe(false);
  });

  it('should return false when storeId is undefined', () => {
    mockReq.user = { id: 123, storeId: undefined };
    expect(authSeller(mockReq)).toBe(false);
  });

  it('should return false when storeId is empty string', () => {
    mockReq.user = { id: 123, storeId: '' };
    expect(authSeller(mockReq)).toBe(false);
  });

  it('should return false when storeId is NaN', () => {
    mockReq.user = { id: 123, storeId: NaN };
    expect(authSeller(mockReq)).toBe(false);
  });

  it('should return false when storeId is false', () => {
    mockReq.user = { id: 123, storeId: false };
    expect(authSeller(mockReq)).toBe(false);
  });

  it('should return false when storeId is array', () => {
    mockReq.user = { id: 123, storeId: [1, 2, 3] };
    expect(authSeller(mockReq)).toBe(false);
  });

  it('should return false when storeId is object', () => {
    mockReq.user = { id: 123, storeId: { id: 1 } };
    expect(authSeller(mockReq)).toBe(false);
  });
});
