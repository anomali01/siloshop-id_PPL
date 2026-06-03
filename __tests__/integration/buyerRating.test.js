/**
 * IT-05: test_buyer_add_rating_after_order
 * Modul terlibat: orders POST → rating POST → Prisma
 * Yang diuji:
 *   - Alur: buyer buat order → order berhasil → buyer beri rating pada produk
 *   - Rating terhubung dengan userId, productId, orderId
 */

// ─── Mock Clerk ───────────────────────────────────────────────────────────────
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn().mockResolvedValue({ userId: "buyer-123" }),
}));

// ─── Mock Prisma ──────────────────────────────────────────────────────────────
const mockProductFindMany = jest.fn();
const mockCouponFindFirst = jest.fn();
const mockOrderCreate = jest.fn();
const mockCartDeleteMany = jest.fn();
const mockRatingFindFirst = jest.fn();
const mockRatingCreate = jest.fn();

jest.mock("@/lib/prismadb", () => ({
  product: { findMany: mockProductFindMany },
  coupon: { findFirst: mockCouponFindFirst },
  order: { create: mockOrderCreate },
  cart: { deleteMany: mockCartDeleteMany },
  rating: {
    findFirst: mockRatingFindFirst,
    create: mockRatingCreate,
  },
}));

// ─── Helper ───────────────────────────────────────────────────────────────────
const makeRequest = (body) => ({
  json: jest.fn().mockResolvedValue(body),
});

// ─── Import handlers ──────────────────────────────────────────────────────────
const { POST: createOrder } = require("../../app/api/orders/route");
const { POST: createRating } = require("../../app/api/rating/route");

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe("IT-05 | Buyer Add Rating After Order (Integration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Alur lengkap: order berhasil dibuat → rating berhasil disimpan", async () => {
    // ── Step 1: Setup mock untuk order ─────────────────────────────────────
    mockProductFindMany.mockResolvedValue([
      { id: "prod-1", price: 25000, storeId: "store-1" },
    ]);
    mockCouponFindFirst.mockResolvedValue(null); // tanpa kupon
    mockOrderCreate.mockResolvedValue({
      id: "order-baru",
      userId: "buyer-123",
      total: 25000,
      items: [{ productId: "prod-1", quantity: 1 }],
    });
    mockCartDeleteMany.mockResolvedValue({ count: 1 });

    // ── Step 2: Buyer membuat order ─────────────────────────────────────────
    const orderReq = makeRequest({
      addressId: "addr-1",
      paymentMethod: "COD",
      items: [{ productId: "prod-1", quantity: 1, price: 25000 }],
    });

    const orderRes = await createOrder(orderReq);
    expect(orderRes.status).toBe(200);

    const orderData = await orderRes.json();
    const orderId = orderData.id || "order-baru"; // ambil id dari response

    // ── Step 3: Setup mock untuk rating ────────────────────────────────────
    mockRatingFindFirst.mockResolvedValue(null); // belum pernah rating
    mockRatingCreate.mockResolvedValue({
      id: "rating-1",
      userId: "buyer-123",
      productId: "prod-1",
      orderId: orderId,
      rating: 5,
      review: "Produk sangat memuaskan!",
    });

    // ── Step 4: Buyer memberi rating ────────────────────────────────────────
    const ratingReq = makeRequest({
      productId: "prod-1",
      orderId: orderId,
      rating: 5,
      review: "Produk sangat memuaskan!",
    });

    const ratingRes = await createRating(ratingReq);
    expect(ratingRes.status).toBe(200);

    // ── Step 5: Verifikasi rating tersimpan dengan relasi yang benar ────────
    expect(mockRatingCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "buyer-123",
          productId: "prod-1",
          orderId: orderId,
        }),
      })
    );
  });

  test("Rating tidak tersimpan jika order belum ada / orderId tidak valid", async () => {
    mockRatingFindFirst.mockResolvedValue(null);
    mockRatingCreate.mockRejectedValue(
      new Error("Foreign key constraint failed on orderId")
    );

    const ratingReq = makeRequest({
      productId: "prod-1",
      orderId: "order-tidak-ada",
      rating: 4,
    });

    const ratingRes = await createRating(ratingReq);
    // Harus return error (400 atau 500), bukan 200
    expect(ratingRes.status).not.toBe(200);
  });

  test("Rating kedua untuk order & produk yang sama harus ditolak (cegah duplikat)", async () => {
    // Simulasi: rating pertama sudah ada
    mockRatingFindFirst.mockResolvedValue({
      id: "rating-lama",
      userId: "buyer-123",
      productId: "prod-1",
      orderId: "order-baru",
    });

    const ratingReq = makeRequest({
      productId: "prod-1",
      orderId: "order-baru",
      rating: 3,
      review: "Mau ubah review",
    });

    const ratingRes = await createRating(ratingReq);
    expect(ratingRes.status).toBe(400);
    expect(mockRatingCreate).not.toHaveBeenCalled();
  });
});
