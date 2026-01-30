import { db } from '../../db/db.js';

export const findAll = async () => {
  const [rows] = await db.query(
    'SELECT user_id, first_name, last_name, role, created_at, updated_at FROM users WHERE deleted_yn = 0'
  );
  return rows;
};

export const findById = async (id) => {
  const [rows] = await db.query(
    'SELECT user_id, first_name, last_name, role, created_at, updated_at FROM users WHERE user_id = ? AND deleted_yn = 0',
    [id]
  );
  return rows[0];
};

export const create = async (userData) => {
  const { first_name, last_name, password_hash, role } = userData;
  const [result] = await db.query(
    'INSERT INTO users (first_name, last_name, password_hash, role) VALUES (?, ?, ?, ?)',
    [first_name, last_name, password_hash, role || 'user']
  );
  return result.insertId;
};

export const update = async (id, userData) => {
  const { first_name, last_name, password_hash, role } = userData;
  const [result] = await db.query(
    'UPDATE users SET first_name = ?, last_name = ?, password_hash = ?, role = ? WHERE user_id = ? AND deleted_yn = 0',
    [first_name, last_name, password_hash, role, id]
  );
  return result.affectedRows;
};

export const remove = async (id) => {
  const [result] = await db.query(
    'UPDATE users SET deleted_yn = 1 WHERE user_id = ? AND deleted_yn = 0',
    [id]
  );
  return result.affectedRows;
};
