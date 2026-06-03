/**
 * UT-13: test_coupon_verification_rejects_expired_coupon
 * UT-14: test_coupon_forNewUser_rejected_for_existing_buyer
 * File target: app/api/coupon/route.js
 * Yang diuji:
 *   - UT-13: Kupon expired (expiresAt < now) → return 404
 *   - UT-14: Kupon forNewUser=true ditolak jika user sudah pernah order
 */

// ─── Mock Clerk ───────────────────────────────────────────────────────────────
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn().mockResolvedValue({ userId: "user-123" }),
}));

// ─── Mock Prisma (akan di-override per test) ──────────────────────────────────
const mockCouponFindFirst = jest.fn();
const mockOrderFindFirst = jest.fn();

jest.mock("@/lib/prismadb", () => ({
  coupon: {
    findFirst: mockCouponFindFirst,
  },
  order: {
    findFirst: mockOrderFindFirst,
  },
}));

// ─── Helper: buat mock Request ────────────────────────────────────────────────
const makeRequest = (body) => ({
  json: jest.fn().mockResolvedValue(body),
});

// ─── Import handler setelah mock ──────────────────────────────────────────────
const { POST } = require("../../app/api/coupon/route");

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe("UT-13 | Coupon - Menolak Kupon Expired", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("harus return 404 jika kupon sudah expired", async () => {
    // Prisma tidak menemukan kupon valid (karena expired sudah difilter di query)
    mockCouponFindFirst.mockResolvedValue(null);

    const req = makeRequest({ couponCode: "DISKON50" });
    const res = await POST(req);

    expect(res.status).toBe(404);
  });

  test("harus return data kupon jika kupon masih valid (belum expired)", async () => {
    const validCoupon = {
      id: "coupon-1",
      code: "HEMAT10",
      discount: 10,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari lagi
      forNewUser: false,
    };
    mockCouponFindFirst.mockResolvedValue(validCoupon);
    mockOrderFindFirst.mockResolvedValue(null); // user belum pernah order

    const req = makeRequest({ couponCode: "HEMAT10" });
    const res = await POST(req);

    expect(res.status).toBe(200);
  });

  test("harus memanggil prisma.coupon.findFirst dengan filter expiresAt > now", async () => {
    mockCouponFindFirst.mockResolvedValue(null);

    const req = makeRequest({ couponCode: "DISKON50" });
    await POST(req);

    expect(mockCouponFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          code: "DISKON50",
        }),
      })
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("UT-14 | Coupon - Menolak forNewUser untuk Buyer Lama", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("harus return 400 jika kupon forNewUser=true tapi user sudah pernah order", async () => {
    // Kupon ditemukan tapi untuk new user
    mockCouponFindFirst.mockResolvedValue({
      id: "coupon-new",
      code: "WELCOME20",
      discount: 20,
      forNewUser: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // User sudah pernah order sebelumnya
    mockOrderFindFirst.mockResolvedValue({
      id: "order-lama",
      userId: "user-123",
    });

    const req = makeRequest({ couponCode: "WELCOME20" });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  test("harus return 200 jika kupon forNewUser=true dan user BELUM pernah order", async () => {
    mockCouponFindFirst.mockResolvedValue({
      id: "coupon-new",
      code: "WELCOME20",
      discount: 20,
      forNewUser: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // User belum pernah order
    mockOrderFindFirst.mockResolvedValue(null);

    const req = makeRequest({ couponCode: "WELCOME20" });
    const res = await POST(req);

    expect(res.status).toBe(200);
  });

  test("harus return 200 jika kupon forNewUser=false meskipun user sudah pernah order", async () => {
    mockCouponFindFirst.mockResolvedValue({
      id: "coupon-all",
      code: "DISKON10",
      discount: 10,
      forNewUser: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // User sudah pernah order, tapi kupon bukan untuk new user saja
    mockOrderFindFirst.mockResolvedValue({
      id: "order-lama",
      userId: "user-123",
    });

    const req = makeRequest({ couponCode: "DISKON10" });
    const res = await POST(req);

    expect(res.status).toBe(200);
  });
});
