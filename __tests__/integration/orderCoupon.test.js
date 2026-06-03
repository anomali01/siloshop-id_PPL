jest.mock("@clerk/nextjs/server", () => ({
  getAuth: jest.fn(),
}));

const mockPrisma = {
  coupon: {
    findUnique: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
  },
  order: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  user: {
    update: jest.fn().mockResolvedValue({}),
  },
};
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: mockPrisma,
}));

jest.mock("@prisma/client", () => ({
  PaymentMethod: {
    COD: "COD",
    STRIPE: "STRIPE",
  },
}));

const { getAuth } = require("@clerk/nextjs/server");
const { POST } = require("@/app/api/orders/route");

function buatMockRequest(body) {
  return {
    json: jest.fn().mockResolvedValue(body),
  };
}

describe("Integration Test - Pembuatan Pesanan dan Kupon", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("IT-01: Pengujian pembuatan pesanan dengan input tidak wajar", () => {
    it("harus mengembalikan 401 ketika array items kosong → bug kode status salah", async () => {
      getAuth.mockReturnValue({
        userId: "user_empty_cart",
        has: jest.fn().mockReturnValue(false),
      });

      const mockRequest = buatMockRequest({
        addressId: "address_1",
        items: [],
        couponCode: null,
        paymentMethod: "COD",
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: "missing order details" });
      expect(mockPrisma.order.create).not.toHaveBeenCalled();
    });

    it("harus mengizinkan pesanan dengan kuantitas negatif → bug tidak ada validasi", async () => {
      getAuth.mockReturnValue({
        userId: "user_hacker",
        has: jest.fn().mockReturnValue(false),
      });

      mockPrisma.product.findUnique.mockResolvedValue({
        id: "product_1",
        price: 100000,
        storeId: "store_1",
      });

      mockPrisma.order.create.mockResolvedValue({ id: "order_hack" });

      const mockRequest = buatMockRequest({
        addressId: "address_1",
        items: [{ id: "product_1", quantity: -5 }],
        couponCode: null,
        paymentMethod: "COD",
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data).toEqual({ message: "Orders Place Successfully" });

      const panggilanBuatPesanan = mockPrisma.order.create.mock.calls[0][0];
      expect(panggilanBuatPesanan.data.total).toBe(-499995);
    });
  });
});
