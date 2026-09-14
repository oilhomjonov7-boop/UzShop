// Initial mock data matching db.json
export const INITIAL_DATA = {
  users: [
    {
      id: 1,
      email: "admin@uzshop.uz",
      password: "password123",
      role: "Admin",
      name: "Super Admin",
      phone: "+998901234567"
    },
    {
      id: 2,
      email: "manager@uzshop.uz",
      password: "password123",
      role: "Manager",
      name: "Jasur Rahimov",
      phone: "+998935551122"
    },
    {
      id: 3,
      email: "operator@uzshop.uz",
      password: "password123",
      role: "CallCenter",
      name: "Madina Karimova",
      phone: "+998974443322"
    },
    {
      id: 4,
      email: "ali@uzshop.uz",
      password: "password123",
      role: "User",
      name: "Ali Valiyev",
      phone: "+998991234567"
    },
    {
      id: 5,
      email: "nigora@uzshop.uz",
      password: "password123",
      role: "User",
      name: "Nigora Yusupova",
      phone: "+998909876543"
    }
  ],
  categories: [
    { id: "cat-1", name: "Smartfonlar", slug: "smartphones", icon: "Smartphone" },
    { id: "cat-2", name: "Noutbuklar", slug: "laptops", icon: "Laptop" },
    { id: "cat-3", name: "Smart soatlar", slug: "smartwatches", icon: "Watch" },
    { id: "cat-4", name: "Quloqchinlar", slug: "headphones", icon: "Headphones" },
    { id: "cat-5", name: "Aksessuarlar", slug: "accessories", icon: "Cpu" }
  ],
  products: [
    {
      id: "prod-101",
      categoryId: "cat-1",
      title: "iPhone 15 Pro Max",
      price: 1450,
      discountPrice: 1350,
      stock: 12,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
      description: "256GB Natural Titanium, Super Retina XDR OLED, A17 Pro chip, Dynamic Island.",
      rating: 4.9,
      salesCount: 42
    },
    {
      id: "prod-102",
      categoryId: "cat-1",
      title: "Samsung Galaxy S24 Ultra",
      price: 1380,
      discountPrice: 1250,
      stock: 18,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
      description: "512GB Titanium Gray, Galaxy AI imkoniyatlari, 200MP kamera, S-Pen o'rnatilgan.",
      rating: 4.8,
      salesCount: 35
    },
    {
      id: "prod-103",
      categoryId: "cat-1",
      title: "Xiaomi 14 Ultra",
      price: 1100,
      discountPrice: 990,
      stock: 8,
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
      description: "Leica optikasi, 1 dyuymli asosiy sensor, Snapdragon 8 Gen 3, 90W HyperCharge.",
      rating: 4.7,
      salesCount: 19
    },
    {
      id: "prod-104",
      categoryId: "cat-2",
      title: "MacBook Pro 16\" M3 Max",
      price: 3200,
      discountPrice: 2999,
      stock: 6,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      description: "36GB Unified Memory, 1TB SSD, Liquid Retina XDR displey, Space Black.",
      rating: 5.0,
      salesCount: 14
    },
    {
      id: "prod-105",
      categoryId: "cat-2",
      title: "MacBook Air 15\" M2",
      price: 1350,
      discountPrice: 1220,
      stock: 15,
      image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80",
      description: "Yupqa va yengil korpus, 18 soat batareya quvvati, 500 nit yorqinlik.",
      rating: 4.8,
      salesCount: 27
    },
    {
      id: "prod-106",
      categoryId: "cat-2",
      title: "ASUS ROG Zephyrus G16",
      price: 2400,
      discountPrice: 2250,
      stock: 4,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
      description: "Intel Core Ultra 9, RTX 4080 12GB, 240Hz OLED ekran, 32GB RAM, 1TB SSD.",
      rating: 4.9,
      salesCount: 11
    },
    {
      id: "prod-107",
      categoryId: "cat-3",
      title: "Apple Watch Ultra 2",
      price: 890,
      discountPrice: 820,
      stock: 9,
      image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
      description: "49mm Titandan korpus, 3000 nit displey, suv osti va tog' sporti uchun tayyor.",
      rating: 4.9,
      salesCount: 31
    },
    {
      id: "prod-108",
      categoryId: "cat-3",
      title: "Samsung Galaxy Watch 6 Classic",
      price: 380,
      discountPrice: 330,
      stock: 20,
      image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
      description: "Aylanuvchi mexanik bezel, EKG va qon bosimi monitoringi, Sapphire Crystal oyna.",
      rating: 4.6,
      salesCount: 22
    },
    {
      id: "prod-109",
      categoryId: "cat-4",
      title: "AirPods Max (Space Gray)",
      price: 590,
      discountPrice: 520,
      stock: 7,
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      description: "Active Noise Cancellation, Shaxsiy fazoviy ovoz, Hi-Fi akustika va nafis metall dizayn.",
      rating: 4.7,
      salesCount: 18
    },
    {
      id: "prod-110",
      categoryId: "cat-4",
      title: "Sony WH-1000XM5",
      price: 420,
      discountPrice: 360,
      stock: 14,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      description: "Sanoat yetakchisi bo'lgan shovqinni bostirish (ANC), 30 soat batareya, multipoint ulanish.",
      rating: 4.9,
      salesCount: 45
    },
    {
      id: "prod-111",
      categoryId: "cat-5",
      title: "Apple MagSafe Battery Pack",
      price: 110,
      discountPrice: 95,
      stock: 25,
      image: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=600&auto=format&fit=crop&q=80",
      description: "iPhone uchun magnitli simsiz quvvatlagich, ixcham va xavfsiz.",
      rating: 4.5,
      salesCount: 38
    },
    {
      id: "prod-112",
      categoryId: "cat-1",
      title: "Google Pixel 8 Pro",
      price: 980,
      discountPrice: 880,
      stock: 0,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      description: "Tensor G3 protsessor, Magic Editor, 7 yillik rasmiy Android yangilanish kafolati.",
      rating: 4.6,
      salesCount: 26
    }
  ],
  orders: [
    {
      id: "ord-5001",
      userId: 4,
      items: [
        {
          productId: "prod-101",
          title: "iPhone 15 Pro Max",
          quantity: 1,
          price: 1350,
          image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80"
        }
      ],
      totalAmount: 1350,
      status: "Pending",
      paymentMethod: "Payme",
      customerInfo: {
        name: "Ali Valiyev",
        phone: "+998991234567",
        address: "Toshkent sh., Chilonzor 5-mavze, 12-uy"
      },
      createdAt: "2026-09-10T12:00:00Z",
      history: [
        { status: "Pending", date: "2026-09-10T12:00:00Z", note: "Buyurtma qabul qilindi" }
      ]
    },
    {
      id: "ord-5002",
      userId: 5,
      items: [
        {
          productId: "prod-107",
          title: "Apple Watch Ultra 2",
          quantity: 1,
          price: 820,
          image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80"
        },
        {
          productId: "prod-110",
          title: "Sony WH-1000XM5",
          quantity: 1,
          price: 360,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
        }
      ],
      totalAmount: 1180,
      status: "Confirmed",
      paymentMethod: "Click",
      customerInfo: {
        name: "Nigora Yusupova",
        phone: "+998909876543",
        address: "Samarqand sh., Registon ko'chasi 45"
      },
      createdAt: "2026-09-09T16:30:00Z",
      history: [
        { status: "Pending", date: "2026-09-09T16:30:00Z", note: "Buyurtma berildi" },
        { status: "Confirmed", date: "2026-09-09T17:10:00Z", note: "Operator tomonidan telefon orqali tasdiqlandi" }
      ]
    },
    {
      id: "ord-5003",
      userId: 4,
      items: [
        {
          productId: "prod-105",
          title: "MacBook Air 15\" M2",
          quantity: 1,
          price: 1220,
          image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80"
        }
      ],
      totalAmount: 1220,
      status: "Shipped",
      paymentMethod: "Naqd pul",
      customerInfo: {
        name: "Ali Valiyev",
        phone: "+998991234567",
        address: "Toshkent sh., Yunusobod 14-mavze"
      },
      createdAt: "2026-09-08T09:15:00Z",
      history: [
        { status: "Pending", date: "2026-09-08T09:15:00Z", note: "Buyurtma berildi" },
        { status: "Confirmed", date: "2026-09-08T10:00:00Z", note: "Tasdiqlandi" },
        { status: "Shipped", date: "2026-09-08T14:20:00Z", note: "Kuryerga topshirildi" }
      ]
    },
    {
      id: "ord-5004",
      userId: 1,
      items: [
        {
          productId: "prod-102",
          title: "Samsung Galaxy S24 Ultra",
          quantity: 1,
          price: 1250,
          image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80"
        }
      ],
      totalAmount: 1250,
      status: "Delivered",
      paymentMethod: "Payme",
      customerInfo: {
        name: "Super Admin",
        phone: "+998901234567",
        address: "Toshkent sh., Amir Temur shoh ko'chasi 107"
      },
      createdAt: "2026-09-07T11:00:00Z",
      history: [
        { status: "Pending", date: "2026-09-07T11:00:00Z", note: "Yaratildi" },
        { status: "Confirmed", date: "2026-09-07T11:45:00Z", note: "Tasdiqlandi" },
        { status: "Shipped", date: "2026-09-07T14:00:00Z", note: "Yetkazishga jo'natildi" },
        { status: "Delivered", date: "2026-09-07T18:30:00Z", note: "Muvaffaqiyatli yetkazildi" }
      ]
    }
  ]
};
