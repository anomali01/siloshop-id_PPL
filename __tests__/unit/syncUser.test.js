const mockPrisma = {
  user: {
    create: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  },
};
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: mockPrisma,
}));

const handlers = {};
jest.mock("../../inngest/client", () => ({
  inngest: {
    createFunction: (config, eventConfig, handler) => {
      handlers[config.id] = handler;
      return handler;
    },
  },
}));

require("../../inngest/functions");

describe("Unit Test sinkronisasi pengguna", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("UT-01: Pengujian pembuatan pengguna dengan input tidak wajar", () => {
    it("harus menangani pembuatan pengguna ketika id bernilai null → prisma menerima id null", async () => {
      const mockEvent = {
        data: {
          id: null,
          first_name: "Raka",
          last_name: "Maulana",
          image_url: "https://i.pinimg.com/736x/24/f2/25/24f22516ec47facdc2dc114f8c3de7db.jpg",
          primary_email_address_id: "email_1",
          email_addresses: [{ id: "email_1", email_address: "raka@test.com" }],
        },
      };

      const handler = handlers["sync-user-create"];
      await handler({ event: mockEvent });

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          id: null,
          email: "raka@test.com",
          name: "Raka Maulana",
          image: "https://i.pinimg.com/736x/24/f2/25/24f22516ec47facdc2dc114f8c3de7db.jpg",
        },
      });
    });

    it("harus menghasilkan nama kosong ketika first_name dan last_name keduanya null", async () => {
      const mockEvent = {
        data: {
          id: "user_no_name",
          first_name: null,
          last_name: null,
          image_url: null,
          primary_email_address_id: null,
          email_addresses: [{ id: "email_1", email_address: "noname@test.com" }],
        },
      };

      const handler = handlers["sync-user-create"];
      await handler({ event: mockEvent });

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          id: "user_no_name",
          email: "noname@test.com",
          name: "",
          image: null,
        },
      });
    });

    it("harus menangani email_addresses yang undefined (properti tidak ada sama sekali)", async () => {
      const mockEvent = {
        data: {
          id: "user_no_email_field",
          first_name: "Raka",
          last_name: "Maulana",
          image_url: "https://i.pinimg.com/736x/24/f2/25/24f22516ec47facdc2dc114f8c3de7db.jpg",
          primary_email_address_id: "email_1",
        },
      };

      const handler = handlers["sync-user-create"];
      await handler({ event: mockEvent });

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          id: "user_no_email_field",
          email: "noemail@clerk.dev",
          name: "Raka Maulana",
          image: "https://i.pinimg.com/736x/24/f2/25/24f22516ec47facdc2dc114f8c3de7db.jpg",
        },
      });
    });
  });

  describe("UT-02: Pengujian penghapusan pengguna dengan id null", () => {
    it("harus meneruskan id null ke prisma.user.delete tanpa validasi", async () => {
      const mockEvent = {
        data: { id: null },
      };

      const handler = handlers["sync-user-delete"];
      await handler({ event: mockEvent });

      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: null },
      });
    });
  });
});
