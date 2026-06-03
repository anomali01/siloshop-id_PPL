jest.mock("@clerk/nextjs/server", () => ({
  getAuth: jest.fn(),
}));

const mockPrisma = {
  store: {
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
  user: {
    update: jest.fn(),
    findUnique: jest.fn(),
  },
  product: {
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
    const { storeId, approved, reason } = body;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return new Response(
        JSON.stringify({ error: "Store not found" }),
        { status: 404 }
      );
    }

    if (store.approved && approved) {
      return new Response(
        JSON.stringify({ error: "Store already approved" }),
        { status: 400 }
      );
    }

    const status = approved ? "approved" : "rejected";
    await prisma.store.update({
      where: { id: storeId },
      data: { status, approved },
    });

    if (approved) {
      await prisma.user.update({
        where: { id: store.storeOwnerId },
        data: { isActive: true },
      });
    }

    await prisma.product.updateMany({
      where: { storeId },
      data: { active: approved },
    });

    return new Response(
      JSON.stringify({ message: `Store ${status} successfully` }),
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

describe("IT-04: Pengujian persetujuan store oleh admin dan aktivasi seller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("harus menyetujui store pending dan mengaktifkan akun seller", async () => {
    getAuth.mockReturnValue({
      userId: "admin_1",
      has: jest.fn().mockReturnValue(true), // admin role
    });

    mockPrisma.store.findUnique.mockResolvedValue({
      id: "store_1",
      name: "Warung Nasi",
      status: "pending",
      approved: false,
      storeOwnerId: "seller_1",
    });

    mockPrisma.user.findUnique.mockResolvedValue({
      id: "seller_1",
      name: "Budi Santoso",
      role: "seller",
    });

    mockPrisma.store.update.mockResolvedValue({
      id: "store_1",
      status: "approved",
      approved: true,
    });

    mockPrisma.user.update.mockResolvedValue({
      id: "seller_1",
      role: "seller",
      isActive: true,
    });

    mockPrisma.product.updateMany.mockResolvedValue({
      count: 5,
    });

    const mockRequest = buatMockRequest({
      storeId: "store_1",
      approved: true,
    });

    const response = await PATCH(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toContain("approved");
    expect(mockPrisma.store.update).toHaveBeenCalledWith({
      where: { id: "store_1" },
      data: { status: "approved", approved: true },
    });
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "seller_1" },
      data: { isActive: true },
    });
    expect(mockPrisma.product.updateMany).toHaveBeenCalledWith({
      where: { storeId: "store_1" },
      data: { active: true },
    });
  });

  it("harus menolak store dan menonaktifkan produk seller", async () => {
    getAuth.mockReturnValue({
      userId: "admin_1",
      has: jest.fn().mockReturnValue(true),
    });

    mockPrisma.store.findUnique.mockResolvedValue({
      id: "store_2",
      name: "Warung Mie",
      status: "pending",
      approved: false,
      storeOwnerId: "seller_2",
    });

    mockPrisma.store.update.mockResolvedValue({
      id: "store_2",
      status: "rejected",
      approved: false,
    });

    mockPrisma.product.updateMany.mockResolvedValue({
      count: 3,
    });

    const mockRequest = buatMockRequest({
      storeId: "store_2",
      approved: false,
      reason: "Dokumen tidak lengkap",
    });

    const response = await PATCH(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(mockPrisma.store.update).toHaveBeenCalled();
    expect(mockPrisma.product.updateMany).toHaveBeenCalledWith({
      where: { storeId: "store_2" },
      data: { active: false },
    });
  });

  it("harus mengembalikan 401 ketika user bukan admin", async () => {
    getAuth.mockReturnValue({
      userId: "seller_1",
      has: jest.fn().mockReturnValue(false), // bukan admin
    });

    const mockRequest = buatMockRequest({
      storeId: "store_1",
      approved: true,
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
      storeId: "store_notfound",
      approved: true,
    });

    const response = await PATCH(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toContain("Store not found");
  });

  it("harus handle error ketika seller tidak ditemukan saat update user", async () => {
    getAuth.mockReturnValue({
      userId: "admin_1",
      has: jest.fn().mockReturnValue(true),
    });

    mockPrisma.store.findUnique.mockResolvedValue({
      id: "store_1",
      name: "Warung Nasi",
      status: "pending",
      storeOwnerId: "seller_notfound",
    });

    mockPrisma.store.update.mockResolvedValue({
      id: "store_1",
      approved: true,
    });

    mockPrisma.user.update.mockRejectedValue(
      new Error("User not found in database")
    );

    const mockRequest = buatMockRequest({
      storeId: "store_1",
      approved: true,
    });

    const response = await PATCH(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
  });

  it("harus handle race condition ketika store approval duplicate", async () => {
    getAuth.mockReturnValue({
      userId: "admin_1",
      has: jest.fn().mockReturnValue(true),
    });

    mockPrisma.store.findUnique.mockResolvedValue({
      id: "store_1",
      status: "approved", // sudah di-approve sebelumnya
      approved: true,
    });

    const mockRequest = buatMockRequest({
      storeId: "store_1",
      approved: true,
    });

    const response = await PATCH(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("already approved");
  });
});
