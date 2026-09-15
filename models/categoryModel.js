const pool = require("../db/pool");

async function getAllCategories() {
  const { rows } = await pool.query(`
    SELECT
      c.id,
      c.name,
      c.description,
      COUNT(i.id)::int AS item_count
    FROM categories c
    LEFT JOIN items i ON i.category_id = c.id
    GROUP BY c.id
    ORDER BY c.name;
  `);

  return rows;
}

async function getCategoryById(id) {
  const { rows } = await pool.query(
    `
      SELECT id, name, description
      FROM categories
      WHERE id = $1
    `,
    [id],
  );

  return rows[0];
}

async function getCategoryWithItems(id) {
  const categoryResult = await pool.query(
    `
      SELECT id, name, description
      FROM categories
      WHERE id = $1
    `,
    [id],
  );

  const category = categoryResult.rows[0];

  if (!category) {
    return null;
  }

  const itemsResult = await pool.query(
    `
      SELECT id, name, description, price, quantity
      FROM items
      WHERE category_id = $1
      ORDER BY name
    `,
    [id],
  );

  return {
    ...category,
    items: itemsResult.rows,
  };
}

async function createCategory(name, description) {
  const { rows } = await pool.query(
    `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING id
    `,
    [name, description],
  );

  return rows[0];
}

async function updateCategory(id, name, description) {
  const { rows } = await pool.query(
    `
      UPDATE categories
      SET name = $1,
          description = $2
      WHERE id = $3
      RETURNING id
    `,
    [name, description, id],
  );

  return rows[0];
}

async function deleteCategory(id) {
  await pool.query(
    `
      DELETE FROM categories
      WHERE id = $1
    `,
    [id],
  );
}

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryWithItems,
  createCategory,
  updateCategory,
  deleteCategory,
};
