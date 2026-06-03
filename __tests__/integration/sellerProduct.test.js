jest.mock("@clerk/nextjs/server", () => ({
  getAuth: jest.fn(),
}));

jest.mock("@/middlewares/authSeller", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/configs/imageKit", () => ({
  __esModule: true,
  default: {
    upload: jest.fn(),
    url: jest.fn(),
  },
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    product: {
      create: jest.fn().mockResolvedValue({ id: "product_1" }),
    },
  },
}));

const { getAuth } = require("@clerk/nextjs/server");
const authSeller = require("@/middlewares/authSeller").default;
const imagekit = require("@/configs/imageKit").default;
const prisma = require("@/lib/prisma").default;
const { POST } = require("@/app/api/store/product/route");

describe("IT-02: Pengujian menambahkan produk oleh penjual", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("harus mengembalikan 400 ketika produk tidak memiliki nama", async () => {
    getAuth.mockReturnValue({ userId: "seller_1" });
    authSeller.mockResolvedValue("store_1");

    const mockImageFile = {
      name: "test-image.jpg",
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    };

    const formDataMap = {
      name: "",
      description: "Good ice cream",
      mrp: "20000",
      price: "15000",
      category: "Desserts",
    };

    const mockRequest = {
      formData: jest.fn().mockResolvedValue({
        get: (key) => formDataMap[key] ?? null,
        getAll: (key) => (key === "images" ? [mockImageFile] : []),
      }),
    };

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "missing product details" });
    expect(prisma.product.create).not.toHaveBeenCalled();
  });

  it("harus mengembalikan 400 ketika harga/mrp bukan angka", async () => {
    getAuth.mockReturnValue({ userId: "seller_1" });
    authSeller.mockResolvedValue("store_1");

    const mockImageFile = {
      name: "test-image.jpg",
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    };

    const formDataMap = {
      name: "Fried Chicken",
      description: "Delicious fried chicken",
      mrp: "abc",
      price: "xyz",
      category: "Foods",
    };

    const mockRequest = {
      formData: jest.fn().mockResolvedValue({
        get: (key) => formDataMap[key] ?? null,
        getAll: (key) => (key === "images" ? [mockImageFile] : []),
      }),
    };

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "missing product details" });
  });

  it("harus mengembalikan 400 ketika produk tidak memiliki gambar", async () => {
    getAuth.mockReturnValue({ userId: "seller_1" });
    authSeller.mockResolvedValue("store_1");

    const formDataMap = {
      name: "Test Product",
      description: "A product",
      mrp: "150000",
      price: "120000",
      category: "Electronics",
    };

    const mockRequest = {
      formData: jest.fn().mockResolvedValue({
        get: (key) => formDataMap[key] ?? null,
        getAll: (key) => [],
      }),
    };

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "missing product details" });
    expect(imagekit.upload).not.toHaveBeenCalled();
    expect(prisma.product.create).not.toHaveBeenCalled();
  });
});
