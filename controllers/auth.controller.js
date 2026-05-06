const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { username, password, rol } = req.body;

  if (!username || !password || !rol) {
    return res.status(400).json({ msg: 'Username, password y rol son obligatorios' });
  }

  const existingUser = await Usuario.findOne({ where: { username } });
  if (existingUser) {
    return res.status(409).json({ msg: 'Usuario ya existe' });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await Usuario.create({
    username,
    password: hash,
    rol
  });

  res.status(201).json({ id: user.id, username: user.username, rol: user.rol });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Username y password son obligatorios' });
  }

  const user = await Usuario.findOne({ where: { username } });

  if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(401).json({ msg: 'Password incorrecto' });

  const token = jwt.sign(
    { id: user.id, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};