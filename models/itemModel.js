const pool = require("../db/pool");

async function getAllItems() {
  const { rows } = await pool.query(`
    SELECT
      i.id,
      i.name,
      i.description,
      i.price,
      i.quantity,
      i.category_id,
      c.name AS category_name
    FROM items i
    JOIN categories c ON c.id = i.category_id
    ORDER BY i.name;
  `);

  return rows;
}

async function getItemById(id) {
  const { rows } = await pool.query(
    `
      SELECT
        i.id,
        i.name,
        i.description,
        i.price,
        i.quantity,
        i.category_id,
        c.name AS category_name
      FROM items i
      JOIN categories c ON c.id = i.category_id
      WHERE i.id = $1
    `,
    [id],
  );

  return rows[0];
}

async function createItem(name, description, price, quantity, categoryId) {
  const { rows } = await pool.query(
    `
      INSERT INTO items (
        name,
        description,
        price,
        quantity,
        category_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `,
    [name, description, price, quantity, categoryId],
  );

  return rows[0];
}

async function updateItem(id, name, description, price, quantity, categoryId) {
  const { rows } = await pool.query(
    `
      UPDATE items
      SET
        name = $1,
        description = $2,
        price = $3,
        quantity = $4,
        category_id = $5
      WHERE id = $6
      RETURNING id
    `,
    [name, description, price, quantity, categoryId, id],
  );

  return rows[0];
}

async function deleteItem(id) {
  await pool.query(
    `
      DELETE FROM items
      WHERE id = $1
    `,
    [id],
  );
}

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
