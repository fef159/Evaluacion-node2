const Medicamento = require('../models/medicamento.model');

exports.create = async (req, res) => {
  try {
    const { descripcionMed, stock, precioVentaUni } = req.body;

    const medicamento = await Medicamento.create({
      descripcionMed,
      stock,
      precioVentaUni
    });

    res.status(201).json(medicamento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicamento = await Medicamento.findByPk(id);
    if (!medicamento) {
      return res.status(404).json({ msg: 'Medicamento no encontrado' });
    }
    res.json(medicamento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const medicamentos = await Medicamento.findAll();
    res.json(medicamentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcionMed, stock, precioVentaUni } = req.body;

    const medicamento = await Medicamento.findByPk(id);
    if (!medicamento) {
      return res.status(404).json({ msg: 'Medicamento no encontrado' });
    }

    await medicamento.update({
      descripcionMed,
      stock,
      precioVentaUni
    });

    res.json(medicamento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const medicamento = await Medicamento.findByPk(id);
    if (!medicamento) {
      return res.status(404).json({ msg: 'Medicamento no encontrado' });
    }

    await medicamento.destroy();
    res.json({ msg: 'Medicamento eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};