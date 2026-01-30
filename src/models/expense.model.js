import { db } from '../../db/db.js';

export const findAll = async () => {
  const [rows] = await db.query(`
    SELECT 
      e.expense_id, 
      e.user_id, 
      e.expense_date, 
      e.amount, 
      e.description,
      e.store_name, 
      e.created_at, 
      e.updated_at,
      GROUP_CONCAT(c.name) as categories
    FROM expenses e
    LEFT JOIN expense_category ec ON e.expense_id = ec.expense_id AND ec.deleted_yn = 0
    LEFT JOIN categories c ON ec.category_id = c.category_id AND c.deleted_yn = 0
    WHERE e.deleted_yn = 0
    GROUP BY e.expense_id
  `);
  return rows;
};

export const findById = async (id) => {
  const [rows] = await db.query(`
    SELECT 
      e.expense_id, 
      e.user_id, 
      e.expense_date, 
      e.amount, 
      e.description,
      e.store_name, 
      e.created_at, 
      e.updated_at,
      GROUP_CONCAT(c.category_id) as category_ids,
      GROUP_CONCAT(c.name) as categories
    FROM expenses e
    LEFT JOIN expense_category ec ON e.expense_id = ec.expense_id AND ec.deleted_yn = 0
    LEFT JOIN categories c ON ec.category_id = c.category_id AND c.deleted_yn = 0
    WHERE e.expense_id = ? AND e.deleted_yn = 0
    GROUP BY e.expense_id
  `, [id]);
  return rows[0];
};

export const findByUserId = async (userId) => {
  const [rows] = await db.query(`
    SELECT 
      e.expense_id, 
      e.user_id, 
      e.expense_date, 
      e.amount, 
      e.description,
      e.store_name, 
      e.created_at, 
      e.updated_at,
      GROUP_CONCAT(c.name) as categories
    FROM expenses e
    LEFT JOIN expense_category ec ON e.expense_id = ec.expense_id AND ec.deleted_yn = 0
    LEFT JOIN categories c ON ec.category_id = c.category_id AND c.deleted_yn = 0
    WHERE e.user_id = ? AND e.deleted_yn = 0
    GROUP BY e.expense_id
  `, [userId]);
  return rows;
};

export const create = async (expenseData) => {
  const { user_id, expense_date, amount, description, store_name } = expenseData;
  const [result] = await db.query(
    'INSERT INTO expenses (user_id, expense_date, amount, description, store_name) VALUES (?, ?, ?, ?, ?)',
    [user_id, expense_date, amount, description, store_name]
  );
  return result.insertId;
};

export const update = async (id, expenseData) => {
  const { user_id, expense_date, amount, description, store_name } = expenseData;
  const [result] = await db.query(
    'UPDATE expenses SET user_id = ?, expense_date = ?, amount = ?, description = ?, store_name = ? WHERE expense_id = ? AND deleted_yn = 0',
    [user_id, expense_date, amount, description, store_name, id]
  );
  return result.affectedRows;
};

export const remove = async (id) => {
  const [result] = await db.query(
    'UPDATE expenses SET deleted_yn = 1 WHERE expense_id = ? AND deleted_yn = 0',
    [id]
  );
  return result.affectedRows;
};

// Expense-Category junction table operations
export const addCategory = async (expenseId, categoryId) => {
  const [result] = await db.query(
    'INSERT INTO expense_category (expense_id, category_id) VALUES (?, ?)',
    [expenseId, categoryId]
  );
  return result.insertId;
};

export const removeCategory = async (expenseId, categoryId) => {
  const [result] = await db.query(
    'UPDATE expense_category SET deleted_yn = 1 WHERE expense_id = ? AND category_id = ?',
    [expenseId, categoryId]
  );
  return result.affectedRows;
};

export const setCategories = async (expenseId, categoryIds) => {
  // First, soft delete all existing categories for this expense
  await db.query(
    'UPDATE expense_category SET deleted_yn = 1 WHERE expense_id = ?',
    [expenseId]
  );
  
  // Then add new categories
  if (categoryIds && categoryIds.length > 0) {
    const values = categoryIds.map(catId => [expenseId, catId]);
    await db.query(
      'INSERT INTO expense_category (expense_id, category_id) VALUES ?',
      [values]
    );
  }
};
