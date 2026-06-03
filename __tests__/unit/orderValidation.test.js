/**
 * UT-12: test_order_creation_validates_required_fields
 * File target: app/api/orders/route.js
 * Yang diuji:
 *   - Order ditolak jika addressId, paymentMethod, atau items kosong/tidak valid
 */

// ─── Mock Clerk ───────────────────────────────────────────────────────────────
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn().mockResolvedValue({ userId: "user-123" }),
}));

// ─── Mock Prisma ──────────────────────────────────────────────────────────────
jest.mock("@/lib/prismadb", () => ({
  order: {
    create: jest.fn(),
  },
}));

// ─── Helper: buat mock Request ────────────────────────────────────────────────
const makeRequest = (body) => ({
  json: jest.fn().mockResolvedValue(body),
});

// ─── Import handler setelah mock ──────────────────────────────────────────────
const { POST } = require("../../app/api/orders/route");

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe("UT-12 | Order Creation - Validasi Field Wajib", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("harus return 400 jika addressId kosong/null", async () => {
    const req = makeRequest({
      addressId: null,
      paymentMethod: "COD",
      items: [{ productId: "prod-1", quantity: 2, price: 10000 }],
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.message || body.error).toBeTruthy();
  });

  test("harus return 400 jika paymentMethod kosong/null", async () => {
    const req = makeRequest({
      addressId: "addr-1",
      paymentMethod: null,
      items: [{ productId: "prod-1", quantity: 2, price: 10000 }],
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
  });

  test("harus return 400 jika items array kosong", async () => {
    const req = makeRequest({
      addressId: "addr-1",
      paymentMethod: "COD",
      items: [],
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
  });

  test("harus return 400 jika items tidak dikirim (undefined)", async () => {
    const req = makeRequest({
      addressId: "addr-1",
      paymentMethod: "TRANSFER",
      // items tidak ada
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  test("harus return 400 jika semua field kosong", async () => {
    const req = makeRequest({});

    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  test("harus TIDAK memanggil Prisma create jika validasi gagal", async () => {
    const prisma = require("@/lib/prismadb");
    const req = makeRequest({
      addressId: null,
      paymentMethod: null,
      items: [],
    });

    await POST(req);

    expect(prisma.order.create).not.toHaveBeenCalled();
  });
});
