/**
 * IT-06: test_store_creation_and_seller_verification
 * Modul terlibat: store/create POST → store/is-seller GET → authSeller
 * Yang diuji:
 *   - User daftar store → store dibuat dengan status "pending"
 *   - Cek is-seller → authSeller return storeId (karena status bukan "APPROVED")
 *   - Data store tersimpan lengkap (name, username, email, logo URL)
 */

// ─── Mock Clerk ───────────────────────────────────────────────────────────────
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn().mockResolvedValue({ userId: "user-abc" }),
  currentUser: jest.fn().mockResolvedValue({
    id: "user-abc",
    emailAddresses: [{ emailAddress: "karin@example.com" }],
  }),
}));

// ─── Mock Prisma ──────────────────────────────────────────────────────────────
const mockStoreCreate = jest.fn();
const mockStoreFindUnique = jest.fn();
const mockStoreFindFirst = jest.fn();

jest.mock("@/lib/prismadb", () => ({
  store: {
    create: mockStoreCreate,
    findUnique: mockStoreFindUnique,
    findFirst: mockStoreFindFirst,
  },
}));

// ─── Mock ImageKit (upload logo) ─────────────────────────────────────────────
jest.mock("imagekit", () => {
  return jest.fn().mockImplementation(() => ({
    upload: jest.fn().mockResolvedValue({
      url: "https://ik.imagekit.io/siloshop/logo-toko.jpg",
      fileId: "img-001",
    }),
  }));
});

// ─── Helper ───────────────────────────────────────────────────────────────────
const makeRequest = (body) => ({
  json: jest.fn().mockResolvedValue(body),
});

// ─── Import handlers ──────────────────────────────────────────────────────────
const { POST: createStore } = require("../../app/api/store/create/route");
const { GET: isSeller } = require("../../app/api/store/is-seller/route");

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe("IT-06 | Store Creation & Seller Verification (Integration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Store berhasil dibuat dengan status 'pending'", async () => {
    mockStoreCreate.mockResolvedValue({
      id: "store-new",
      name: "Toko Karin",
      username: "toko-karin",
      email: "karin@example.com",
      logo: "https://ik.imagekit.io/siloshop/logo-toko.jpg",
      status: "pending",
      isActive: false,
      userId: "user-abc",
    });

    const req = makeRequest({
      name: "Toko Karin",
      username: "toko-karin",
      email: "karin@example.com",
      logo: "data:image/jpeg;base64,/9j/4AAQ...", // base64 logo
    });

    const res = await createStore(req);
    expect(res.status).toBe(200);

    // Verifikasi Prisma dipanggil dengan data lengkap
    expect(mockStoreCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "Toko Karin",
          username: "toko-karin",
          email: "karin@example.com",
          userId: "user-abc",
        }),
      })
    );
  });

  test("Data store tersimpan dengan semua field wajib (name, username, email, logo URL)", async () => {
    const storedData = {
      id: "store-new",
      name: "Toko Karin",
      username: "toko-karin",
      email: "karin@example.com",
      logo: "https://ik.imagekit.io/siloshop/logo-toko.jpg",
      status: "pending",
      userId: "user-abc",
    };
    mockStoreCreate.mockResolvedValue(storedData);

    const req = makeRequest({
      name: "Toko Karin",
      username: "toko-karin",
      email: "karin@example.com",
      logo: "data:image/jpeg;base64,/9j/4AAQ...",
    });

    await createStore(req);

    const callArgs = mockStoreCreate.mock.calls[0][0].data;
    expect(callArgs.name).toBe("Toko Karin");
    expect(callArgs.username).toBe("toko-karin");
    expect(callArgs.email).toBe("karin@example.com");
    // Logo URL harus berupa URL ImageKit (bukan base64 lagi)
    expect(callArgs.logo).toMatch(/^https?:\/\//);
  });

  test("authSeller (is-seller) return storeId meskipun status masih 'pending'", async () => {
    // Store ditemukan dengan status pending (bukan APPROVED)
    mockStoreFindFirst.mockResolvedValue({
      id: "store-new",
      userId: "user-abc",
      status: "pending",
    });

    const res = await isSeller();
    const body = await res.json();

    // authSeller return storeId jika store ada (status apapun kecuali tidak ada)
    expect(res.status).toBe(200);
    expect(body.storeId || body.id).toBeTruthy();
  });

  test("authSeller return false jika user belum mendaftar store", async () => {
    // User tidak punya store sama sekali
    mockStoreFindFirst.mockResolvedValue(null);

    const res = await isSeller();
    const body = await res.json();

    expect(body.isSeller).toBe(false);
  });

  test("Store tidak bisa dibuat tanpa field wajib (name kosong)", async () => {
    const req = makeRequest({
      name: "",
      username: "toko-karin",
      email: "karin@example.com",
    });

    const res = await createStore(req);

    expect(res.status).toBe(400);
    expect(mockStoreCreate).not.toHaveBeenCalled();
  });
});
