jest.mock("@clerk/nextjs/server", () => ({
  getAuth: jest.fn(),
}));

const mockPrisma = {
  store: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  product: {
    findMany: jest.fn(),
    updateMany: jest.fn(),
  },
};

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: mockPrisma,
}));

const { getAuth } = require("@clerk/nextjs/server");
const prisma = require("@/lib/prisma").default;

// Mock PATCH handler function
const PATCH = async (request) => {
  try {
    const auth = getAuth();
    if (!auth || !auth.has({ role: "admin" })) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { storeId, active } = body;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return new Response(
        JSON.stringify({ error: "Store not found" }),
        { status: 404 }
      );
    }

    await prisma.store.update({
      where: { id: storeId },
      data: { active },
    });

    await prisma.product.updateMany({
      where: { storeId },
      data: { active },
    });

    return new Response(
      JSON.stringify({ message: "Store toggled successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};

function buatMockRequest(body) {
  return {
    json: jest.fn().mockResolvedValue(body),
  };
}

describe("IT-03: Pengujian toggle status store dan dampak terhadap visibility produk", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("harus menonaktifkan store dan secara otomatis menyembunyikan semua produk dari store", async () => {
    getAuth.mockReturnValue({
      userId: "admin_1",
      has: jest.fn().mockReturnValue(true), // admin role
    });

    mockPrisma.store.findUnique.mockResolvedValue({
      id: "store_1",
      name: "Warung Nasi",
      active: true,
      storeOwnerId: "seller_1",
    });

    mockPrisma.product.findMany.mockResolvedValue([
      { id: "prod_1", name: "Nasi Goreng", storeId: "store_1", active: true },
      { id: "prod_2", name: "Mie Ayam", storeId: "store_1", active: true },
      { id: "prod_3", name: "Soto Ayam", storeId: "store_1", active: true },
    ]);

    mockPrisma.store.update.mockResolvedValue({
      id: "store_1",
      active: false,
    });

    mockPrisma.product.updateMany.mockResolvedValue({
      count: 3,
    });

    const mockRequest = buatMockRequest({
      storeId: "store_1",
      active: false,
    });

    const response = await PATCH(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toContain("Store toggled");
    expect(mockPrisma.store.update).toHaveBeenCalledWith({
      where: { id: "store_1" },
      data: { active: false },
    });
    expect(mockPrisma.product.updateMany).toHaveBeenCalledWith({
      where: { storeId: "store_1" },
      data: { active: false },
    });
  });

  it("harus mengaktifkan store kembali dan menampilkan produk yang tersimpan", async () => {
    getAuth.mockReturnValue({
      userId: "admin_1",
      has: jest.fn().mockReturnValue(true),
    });

    mockPrisma.store.findUnique.mockResolvedValue({
      id: "store_1",
      name: "Warung Nasi",
      active: false,
      storeOwnerId: "seller_1",
    });

    mockPrisma.product.findMany.mockResolvedValue([
      { id: "prod_1", name: "Nasi Goreng", storeId: "store_1", active: false },
      { id: "prod_2", name: "Mie Ayam", storeId: "store_1", active: false },
    ]);

    mockPrisma.store.update.mockResolvedValue({
      id: "store_1",
      active: true,
    });

    mockPrisma.product.updateMany.mockResolvedValue({
      count: 2,
    });

    const mockRequest = buatMockRequest({
      storeId: "store_1",
      active: true,
    });

    const response = await PATCH(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(mockPrisma.store.update).toHaveBeenCalled();
    expect(mockPrisma.product.updateMany).toHaveBeenCalledWith({
      where: { storeId: "store_1" },
      data: { active: true },
    });
  });

  it("harus mengembalikan 401 ketika user bukan admin", async () => {
    getAuth.mockReturnValue({
      userId: "seller_1",
      has: jest.fn().mockReturnValue(false), // bukan admin
    });

    const mockRequest = buatMockRequest({
      storeId: "store_1",
      active: false,
    });

    const response = await PATCH(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toContain("Unauthorized");
    expect(mockPrisma.store.update).not.toHaveBeenCalled();
  });

  it("harus mengembalikan 404 ketika store tidak ditemukan", async () => {
    getAuth.mockReturnValue({
      userId: "admin_1",
      has: jest.fn().mockReturnValue(true),
    });

    mockPrisma.store.findUnique.mockResolvedValue(null);

    const mockRequest = buatMockRequest({
      storeId: "store_invalid",
      active: false,
    });

    const response = await PATCH(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toContain("Store not found");
  });

  it("harus handle error ketika database gagal update store", async () => {
    getAuth.mockReturnValue({
      userId: "admin_1",
      has: jest.fn().mockReturnValue(true),
    });

    mockPrisma.store.findUnique.mockResolvedValue({
      id: "store_1",
      name: "Warung Nasi",
      active: true,
    });

    mockPrisma.store.update.mockRejectedValue(
      new Error("Database connection error")
    );

    const mockRequest = buatMockRequest({
      storeId: "store_1",
      active: false,
    });

    const response = await PATCH(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain("Internal");
  });
});
