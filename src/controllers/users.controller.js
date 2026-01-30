import * as UserService from '../services/user.service.js';

export const getAllUsers = async (req, res) => {
  const result = await UserService.getAllUsers();
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
};

export const getUserById = async (req, res) => {
  const result = await UserService.getUserById(req.params.id);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(404).json({ error: result.error });
  }
};

export const createUser = async (req, res) => {
  const result = await UserService.createUser(req.body);
  if (result.success) {
    res.status(201).json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
};

export const updateUser = async (req, res) => {
  const result = await UserService.updateUser(req.params.id, req.body);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
};

export const deleteUser = async (req, res) => {
  const result = await UserService.deleteUser(req.params.id);
  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(404).json({ error: result.error });
  }
};
