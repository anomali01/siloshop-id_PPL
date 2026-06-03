/**
 * UT-11: test_cartSlice_removeFromCart_and_deleteItem
 * File target: lib/features/cart/cartSlice.js
 * Yang diuji:
 *   - removeFromCart: kurangi quantity item (hapus jika quantity jadi 0)
 *   - deleteItemFromCart: hapus item sepenuhnya dari cart
 */

// Import reducer dan actions dari cartSlice
const cartReducer = require("../../lib/features/cart/cartSlice").default;
const {
  removeFromCart,
  deleteItemFromCart,
} = require("../../lib/features/cart/cartSlice");

// ─── State awal untuk semua test ─────────────────────────────────────────────
const initialStateWithItems = {
  items: [
    { id: "prod-1", name: "Kripik Singkong", price: 10000, quantity: 3 },
    { id: "prod-2", name: "Teh Botol", price: 5000, quantity: 1 },
  ],
  total: 2, // total jumlah jenis item
};

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe("UT-11 | cartSlice - removeFromCart & deleteItemFromCart", () => {
  // ── removeFromCart ──────────────────────────────────────────────────────────

  test("removeFromCart: harus mengurangi quantity item sebesar 1", () => {
    const state = cartReducer(
      initialStateWithItems,
      removeFromCart({ id: "prod-1" })
    );

    const item = state.items.find((i) => i.id === "prod-1");
    expect(item).toBeDefined();
    expect(item.quantity).toBe(2); // dari 3 menjadi 2
  });

  test("removeFromCart: harus menghapus item jika quantity menjadi 0", () => {
    const state = cartReducer(
      initialStateWithItems,
      removeFromCart({ id: "prod-2" }) // quantity awal = 1, setelah dikurangi = 0
    );

    const item = state.items.find((i) => i.id === "prod-2");
    expect(item).toBeUndefined(); // item harus hilang dari cart
  });

  test("removeFromCart: total harus berkurang jika item dihapus karena quantity 0", () => {
    const state = cartReducer(
      initialStateWithItems,
      removeFromCart({ id: "prod-2" }) // akan dihapus
    );

    expect(state.total).toBe(1); // dari 2 jenis menjadi 1
  });

  test("removeFromCart: total TIDAK berubah jika hanya mengurangi quantity (item masih ada)", () => {
    const state = cartReducer(
      initialStateWithItems,
      removeFromCart({ id: "prod-1" }) // quantity masih tersisa, item tidak dihapus
    );

    expect(state.total).toBe(2); // tetap 2 jenis item
  });

  // ── deleteItemFromCart ──────────────────────────────────────────────────────

  test("deleteItemFromCart: harus menghapus item sepenuhnya meskipun quantity masih banyak", () => {
    const state = cartReducer(
      initialStateWithItems,
      deleteItemFromCart({ id: "prod-1" }) // quantity = 3, tapi langsung dihapus semua
    );

    const item = state.items.find((i) => i.id === "prod-1");
    expect(item).toBeUndefined();
  });

  test("deleteItemFromCart: total harus berkurang setelah item dihapus", () => {
    const state = cartReducer(
      initialStateWithItems,
      deleteItemFromCart({ id: "prod-1" })
    );

    expect(state.total).toBe(1); // dari 2 menjadi 1
  });

  test("deleteItemFromCart: item lain tidak ikut terhapus", () => {
    const state = cartReducer(
      initialStateWithItems,
      deleteItemFromCart({ id: "prod-1" })
    );

    const remainingItem = state.items.find((i) => i.id === "prod-2");
    expect(remainingItem).toBeDefined();
    expect(remainingItem.quantity).toBe(1); // tidak berubah
  });
});
