const mockGetUser = jest.fn();
jest.mock("@clerk/nextjs/server", () => ({
  clerkClient: jest.fn().mockResolvedValue({
    users: {
      getUser: mockGetUser,
    },
  }),
}));

const authAdmin = require("@/middlewares/authAdmin").default;

describe("Unit Test - Otorisasi Admin", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.ADMIN_EMAIL = "admin@test.com,admin2@test.com";
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("UT-03: Pengujian authAdmin", () => {
    it("harus mengembalikan false ketika pengguna memiliki array emailAddresses kosong", async () => {
      mockGetUser.mockResolvedValue({
        emailAddresses: [],
      });

      const result = await authAdmin("user_no_email");

      expect(result).toBe(false);
    });

    it("harus mengembalikan false ketika ADMIN_EMAIL env tidak di-set", async () => {
      delete process.env.ADMIN_EMAIL;

      mockGetUser.mockResolvedValue({
        emailAddresses: [{ emailAddress: "admin@test.com" }],
      });

      const result = await authAdmin("user_admin_env_missing");

      expect(result).toBe(false);
    });

    it("harus mengembalikan false ketika userId berupa string kosong", async () => {
      const result = await authAdmin("");

      expect(result).toBe(false);
      expect(mockGetUser).not.toHaveBeenCalled();
    });
  });
});
