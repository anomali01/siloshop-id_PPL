const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed database with Food and Drink categories...");

  // 1. Clean up transactional/related data
  console.log("Cleaning old data...");
  await prisma.rating.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.coupon.deleteMany({});

  // 2. Define target users
  const defaultUsers = [
    {
      id: "user_3F7jamjvkAKpFvsg49iVp5spOto",
      name: "ABINAYA ARYA ZAIDAN",
      email: "agus8u7@gmail.com",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      cart: {}
    },
    {
      id: "user_3F7oFGI3Cn2AZIf3OBdf3qNspdt",
      name: "Tester Akun Kedua",
      email: "tester@email.com",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      cart: {}
    },
    {
      id: "user_mock_seller_1",
      name: "Budi Penjual",
      email: "budi@email.com",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      cart: {}
    }
  ];

  console.log("Seeding Users...");
  for (const u of defaultUsers) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        name: u.name,
        email: u.email,
        image: u.image
      },
      create: u
    });
  }

  // 3. Create Coupons
  console.log("Seeding Coupons...");
  const coupons = [
    {
      code: "SILOSHOP15",
      description: "Diskon 15% untuk semua pembelanjaan",
      discount: 15,
      forNewUser: false,
      forMember: false,
      isPublic: true,
      expiresAt: new Date("2030-01-01")
    },
    {
      code: "NEWUSER50",
      description: "Diskon Khusus Pengguna Baru 50%",
      discount: 50,
      forNewUser: true,
      forMember: false,
      isPublic: true,
      expiresAt: new Date("2030-01-01")
    },
    {
      code: "MEMBER20",
      description: "Diskon 20% khusus member Plus",
      discount: 20,
      forNewUser: false,
      forMember: true,
      isPublic: true,
      expiresAt: new Date("2030-01-01")
    },
    {
      code: "EXPIRED10",
      description: "Kupon Diskon 10% (Sudah Kedaluwarsa)",
      discount: 10,
      forNewUser: false,
      forMember: false,
      isPublic: true,
      expiresAt: new Date("2020-01-01")
    }
  ];

  for (const c of coupons) {
    await prisma.coupon.create({ data: c });
  }

  // 4. Create Addresses
  console.log("Seeding Addresses...");
  const addresses = [
    {
      id: "addr_1",
      userId: "user_3F7jamjvkAKpFvsg49iVp5spOto",
      name: "Abinaya Rumah",
      email: "agus8u7@gmail.com",
      street: "Jl. Margonda Raya No. 10",
      city: "Depok",
      state: "Jawa Barat",
      zip: "16424",
      country: "Indonesia",
      phone: "081234567890"
    },
    {
      id: "addr_2",
      userId: "user_3F7oFGI3Cn2AZIf3OBdf3qNspdt",
      name: "Tester Alamat Utama",
      email: "tester@email.com",
      street: "Jl. Sukajadi No. 143",
      city: "Bandung",
      state: "Jawa Barat",
      zip: "40161",
      country: "Indonesia",
      phone: "089988776655"
    }
  ];

  for (const a of addresses) {
    await prisma.address.create({ data: a });
  }

  // 5. Create Stores
  console.log("Seeding Stores...");
  const store1 = await prisma.store.create({
    data: {
      id: "store_abinaya",
      userId: "user_3F7jamjvkAKpFvsg49iVp5spOto",
      name: "Toko Abinaya Mart",
      description: "Menjual berbagai kebutuhan harian dan makanan lokal berkualitas",
      username: "abinaya-mart",
      address: "Jl. Margonda Raya No. 10, Depok",
      status: "approved",
      isActive: true,
      logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150",
      email: "store-abinaya@email.com",
      contact: "081234567890"
    }
  });

  const store2 = await prisma.store.create({
    data: {
      id: "store_tester",
      userId: "user_3F7oFGI3Cn2AZIf3OBdf3qNspdt",
      name: "SiloShop Tester Official Store",
      description: "Toko resmi untuk pengujian fungsionalitas produk & kuliner",
      username: "tester-official",
      address: "Jl. Sukajadi No. 143, Bandung",
      status: "approved",
      isActive: true,
      logo: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=150",
      email: "store-tester@email.com",
      contact: "089988776655"
    }
  });

  const store3 = await prisma.store.create({
    data: {
      id: "store_pending_1",
      userId: "user_mock_seller_1",
      name: "Warung Kelontong Budi",
      description: "Menunggu persetujuan admin untuk mulai jualan sembako",
      username: "warung-budi",
      address: "Jl. Kramat Raya No. 20, Jakarta",
      status: "pending",
      isActive: false,
      logo: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=150",
      email: "budi-kelontong@email.com",
      contact: "085522334455"
    }
  });

  // 6. Create Products (strictly food/drinks with matching slugs)
  console.log("Seeding Products...");
  const products = [
    // Store 1 (Abinaya Mart) - Makanan Berat & Minuman
    {
      id: "prod_kopi",
      name: "Kopi Susu Gula Aren",
      description: "Kopi espresso premium dipadu dengan susu segar dan gula aren cair murni. Rasa manis legit dan menyegarkan.",
      mrp: 18000,
      price: 15000,
      category: "minuman", // matches slug
      inStock: true,
      storeId: store1.id,
      images: ["https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500"]
    },
    {
      id: "prod_nasgor",
      name: "Nasi Goreng Spesial Ayam",
      description: "Nasi goreng bumbu jawa tradisional disajikan dengan ayam suwir, telur dadar iris, kerupuk, dan acar segar.",
      mrp: 25000,
      price: 20000,
      category: "makanan-berat", // matches slug
      inStock: true,
      storeId: store1.id,
      images: ["https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500"]
    },
    {
      id: "prod_teh",
      name: "Es Teh Manis Jasmine",
      description: "Es teh manis wangi melati yang menyegarkan dahaga.",
      mrp: 6000,
      price: 5000,
      category: "minuman", // matches slug
      inStock: true,
      storeId: store1.id,
      images: ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500"]
    },

    // Store 2 (Tester Store) - Makanan Berat, Cemilan, Manisan, Makanan Sehat
    {
      id: "prod_mie",
      name: "Mie Goreng Nyemek Jawa",
      description: "Mie telur kenyal dengan tumisan sayur segar, ayam, telur orak-arik, disajikan nyemek dengan kuah kental gurih.",
      mrp: 22000,
      price: 18000,
      category: "makanan-berat", // matches slug
      inStock: true,
      storeId: store2.id,
      images: ["https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500"]
    },
    {
      id: "prod_cireng",
      name: "Cireng Rujak Crispy",
      description: "Cireng goreng renyah di luar kenyal di dalam, disajikan dengan bumbu rujak pedas manis yang segar.",
      mrp: 15000,
      price: 12000,
      category: "cemilan", // matches slug
      inStock: true,
      storeId: store2.id,
      images: ["https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500"]
    },
    {
      id: "prod_salad",
      name: "Salad Buah Premium",
      description: "Potongan melon, apel, anggur, kiwi, dan jelly segar berbalur saus mayo creamy bertabur keju melimpah.",
      mrp: 30000,
      price: 25000,
      category: "makanan-sehat", // matches slug
      inStock: true,
      storeId: store2.id,
      images: ["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500"]
    },
    {
      id: "prod_pudding",
      name: "Pudding Lava Cokelat",
      description: "Pudding cokelat belgian lembut dengan fla cokelat meleleh di dalamnya saat disendok.",
      mrp: 18000,
      price: 15000,
      category: "manisan", // matches slug
      inStock: true,
      storeId: store2.id,
      images: ["https://images.unsplash.com/photo-1541795795328-f073b763494e?w=500"]
    }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  // 7. Create Orders, OrderItems, and Ratings
  console.log("Seeding Orders & Reviews...");
  
  // Order 1: User 1 buys from Store 2 (Tester Store)
  const order1 = await prisma.order.create({
    data: {
      id: "order_1",
      total: 36000,
      status: "DELIVERED",
      userId: "user_3F7jamjvkAKpFvsg49iVp5spOto",
      storeId: store2.id,
      addressId: "addr_1",
      isPaid: true,
      paymentMethod: "COD",
      isCouponUsed: false,
      coupon: {},
      orderItems: {
        create: [
          {
            productId: "prod_mie",
            quantity: 2,
            price: 18000
          }
        ]
      }
    }
  });

  // Rating for Order 1
  await prisma.rating.create({
    data: {
      id: "rating_1",
      rating: 5,
      review: "Mie goreng nyemeknya juara! Bumbunya meresap dan kuah kentalnya pas banget.",
      userId: "user_3F7jamjvkAKpFvsg49iVp5spOto",
      productId: "prod_mie",
      orderId: order1.id
    }
  });

  // Order 2: User 2 buys from Store 1 (Abinaya Mart)
  const order2 = await prisma.order.create({
    data: {
      id: "order_2",
      total: 35000,
      status: "DELIVERED",
      userId: "user_3F7oFGI3Cn2AZIf3OBdf3qNspdt",
      storeId: store1.id,
      addressId: "addr_2",
      isPaid: true,
      paymentMethod: "COD",
      isCouponUsed: false,
      coupon: {},
      orderItems: {
        create: [
          {
            productId: "prod_kopi",
            quantity: 1,
            price: 15000
          },
          {
            productId: "prod_nasgor",
            quantity: 1,
            price: 20000
          }
        ]
      }
    }
  });

  // Rating for Order 2 (Kopi)
  await prisma.rating.create({
    data: {
      id: "rating_2",
      rating: 4,
      review: "Kopi susu gula arennya enak dan segar, manisnya pas.",
      userId: "user_3F7oFGI3Cn2AZIf3OBdf3qNspdt",
      productId: "prod_kopi",
      orderId: order2.id
    }
  });

  console.log("🌱 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
