require("dotenv").config();

const pool = require("./pool");

const categories = [
  {
    name: "Laptops",
    description: "Laptop untuk kebutuhan kerja, kuliah, dan gaming.",
  },
  {
    name: "PC Components",
    description: "Komponen komputer seperti CPU, GPU, RAM, dan storage.",
  },
  {
    name: "Peripherals",
    description: "Keyboard, mouse, monitor, dan perangkat pendukung.",
  },
  {
    name: "Networking",
    description: "Router, switch, access point, dan perangkat jaringan.",
  },
];

const items = [
  {
    name: "Lenovo ThinkPad E14",
    description: "Laptop bisnis dengan layar 14 inch.",
    price: 12500000,
    quantity: 8,
    category: "Laptops",
  },
  {
    name: "ASUS ROG Zephyrus G14",
    description: "Compact gaming laptop.",
    price: 24500000,
    quantity: 4,
    category: "Laptops",
  },
  {
    name: "AMD Ryzen 7 7800X3D",
    description: "High-performance desktop processor.",
    price: 6500000,
    quantity: 12,
    category: "PC Components",
  },
  {
    name: "NVIDIA RTX 4070 Super",
    description: "Graphics card for gaming and productivity.",
    price: 10500000,
    quantity: 7,
    category: "PC Components",
  },
  {
    name: "Kingston Fury 32GB DDR5",
    description: "32GB DDR5 desktop memory.",
    price: 1650000,
    quantity: 20,
    category: "PC Components",
  },
  {
    name: "Logitech MX Master 3S",
    description: "Wireless productivity mouse.",
    price: 1450000,
    quantity: 15,
    category: "Peripherals",
  },
  {
    name: "Keychron K8 Pro",
    description: "Mechanical wireless keyboard.",
    price: 1850000,
    quantity: 10,
    category: "Peripherals",
  },
  {
    name: "TP-Link Archer AX55",
    description: "Wi-Fi 6 wireless router.",
    price: 1200000,
    quantity: 14,
    category: "Networking",
  },
  {
    name: "Ubiquiti UniFi U6+",
    description: "Wi-Fi 6 access point.",
    price: 1900000,
    quantity: 9,
    category: "Networking",
  },
];

async function seed() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query("TRUNCATE items, categories RESTART IDENTITY CASCADE");

    const categoryMap = {};

    for (const category of categories) {
      const result = await client.query(
        `
          INSERT INTO categories (name, description)
          VALUES ($1, $2)
          RETURNING id
        `,
        [category.name, category.description],
      );

      categoryMap[category.name] = result.rows[0].id;
    }

    for (const item of items) {
      await client.query(
        `
          INSERT INTO items (
            name,
            description,
            price,
            quantity,
            category_id
          )
          VALUES ($1, $2, $3, $4, $5)
        `,
        [
          item.name,
          item.description,
          item.price,
          item.quantity,
          categoryMap[item.category],
        ],
      );
    }

    await client.query("COMMIT");

    console.log("Database seeded successfully.");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Seed failed:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
