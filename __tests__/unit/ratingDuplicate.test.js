/**
 * UT-15: test_rating_prevents_duplicate_review
 * File target: app/api/rating/route.js
 * Yang diuji:
 *   - User tidak bisa memberi rating dua kali untuk produk & order yang sama
 *   - Cek field isAlredyRated (sesuai nama di source)
 */

// ─── Mock Clerk ───────────────────────────────────────────────────────────────
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn().mockResolvedValue({ userId: "user-123" }),
}));

// ─── Mock Prisma ──────────────────────────────────────────────────────────────
const mockRatingFindFirst = jest.fn();
const mockRatingCreate = jest.fn();

jest.mock("@/lib/prismadb", () => ({
  rating: {
    findFirst: mockRatingFindFirst,
    create: mockRatingCreate,
  },
}));

// ─── Helper: buat mock Request ────────────────────────────────────────────────
const makeRequest = (body) => ({
  json: jest.fn().mockResolvedValue(body),
});

// ─── Import handler setelah mock ──────────────────────────────────────────────
const { POST } = require("../../app/api/rating/route");

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe("UT-15 | Rating - Mencegah Review Duplikat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("harus return 400 jika user sudah pernah memberi rating untuk produk & order yang sama", async () => {
    // Simulasi: rating sudah ada (isAlredyRated = ada data)
    mockRatingFindFirst.mockResolvedValue({
      id: "rating-existing",
      userId: "user-123",
      productId: "prod-1",
      orderId: "order-1",
      rating: 4,
    });

    const req = makeRequest({
      productId: "prod-1",
      orderId: "order-1",
      rating: 5,
      review: "Produknya bagus banget!",
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  test("harus TIDAK memanggil prisma.rating.create jika sudah pernah rating", async () => {
    mockRatingFindFirst.mockResolvedValue({
      id: "rating-existing",
      userId: "user-123",
      productId: "prod-1",
      orderId: "order-1",
    });

    const req = makeRequest({
      productId: "prod-1",
      orderId: "order-1",
      rating: 5,
    });

    await POST(req);

    expect(mockRatingCreate).not.toHaveBeenCalled();
  });

  test("harus return 200 dan simpan rating jika user BELUM pernah rating produk & order ini", async () => {
    // Tidak ada rating sebelumnya
    mockRatingFindFirst.mockResolvedValue(null);

    mockRatingCreate.mockResolvedValue({
      id: "rating-new",
      userId: "user-123",
      productId: "prod-1",
      orderId: "order-1",
      rating: 5,
    });

    const req = makeRequest({
      productId: "prod-1",
      orderId: "order-1",
      rating: 5,
      review: "Recommended!",
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockRatingCreate).toHaveBeenCalledTimes(1);
  });

  test("harus memanggil prisma.rating.findFirst dengan userId, productId, dan orderId", async () => {
    mockRatingFindFirst.mockResolvedValue(null);
    mockRatingCreate.mockResolvedValue({ id: "rating-new" });

    const req = makeRequest({
      productId: "prod-1",
      orderId: "order-1",
      rating: 4,
    });

    await POST(req);

    expect(mockRatingFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: "user-123",
          productId: "prod-1",
          orderId: "order-1",
        }),
      })
    );
  });

  test("rating yang tersimpan harus mengandung userId, productId, dan orderId", async () => {
    mockRatingFindFirst.mockResolvedValue(null);
    mockRatingCreate.mockResolvedValue({
      id: "rating-new",
      userId: "user-123",
      productId: "prod-2",
      orderId: "order-2",
      rating: 3,
    });

    const req = makeRequest({
      productId: "prod-2",
      orderId: "order-2",
      rating: 3,
    });

    await POST(req);

    expect(mockRatingCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user-123",
          productId: "prod-2",
          orderId: "order-2",
        }),
      })
    );
  });
});
