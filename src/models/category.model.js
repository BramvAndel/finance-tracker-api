import { db } from '../../db/db.js';

export const findAll = async (userId = null) => {
  let query = 'SELECT category_id, user_id, name, description, created_at, updated_at FROM categories WHERE deleted_yn = 0';
  const params = [];
  
  if (userId) {
    query += ' AND user_id = ?';
    params.push(userId);
  }
  
  const [rows] = await db.query(query, params);
  return rows;
};

export const findById = async (id, userId = null) => {
  let query = 'SELECT category_id, user_id, name, description, created_at, updated_at FROM categories WHERE category_id = ? AND deleted_yn = 0';
  const params = [id];
  
  if (userId) {
    query += ' AND user_id = ?';
    params.push(userId);
  }
  
  const [rows] = await db.query(query, params);
  return rows[0];
};

export const create = async (categoryData) => {
  const { user_id, name, description } = categoryData;
  const [result] = await db.query(
    'INSERT INTO categories (user_id, name, description) VALUES (?, ?, ?)',
    [user_id, name, description]
  );
  return result.insertId;
};

export const update = async (id, categoryData) => {
  const { name, description } = categoryData;
  const [result] = await db.query(
    'UPDATE categories SET name = ?, description = ? WHERE category_id = ? AND deleted_yn = 0',
    [name, description, id]
  );
  return result.affectedRows;
};

export const remove = async (id) => {
  const [result] = await db.query(
    'UPDATE categories SET deleted_yn = 1 WHERE category_id = ? AND deleted_yn = 0',
    [id]
  );
  return result.affectedRows;
};
