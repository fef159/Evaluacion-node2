const sequelize = require('../config/db');
const { Medicamento, Compra, CompraDetalle, Laboratorio } = require('../models');

exports.createCompra = async (req, res) => {
  const { laboratorio, items } = req.body;

  if (!laboratorio || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ msg: 'Laboratorio e items son obligatorios' });
  }

  const transaction = await sequelize.transaction();

  try {
    const [lab] = await Laboratorio.findOrCreate({
      where: { razonSocial: laboratorio },
      defaults: { razonSocial: laboratorio },
      transaction
    });

    let total = 0;
    const detalles = [];

    for (const item of items) {
      const { CodMedicamento, cantidad, precioUnitario } = item;

      if (!CodMedicamento || !cantidad || cantidad <= 0 || !precioUnitario || precioUnitario < 0) {
        await transaction.rollback();
        return res.status(400).json({ msg: 'Cada item debe tener CodMedicamento, cantidad positiva y precioUnitario válido' });
      }

      const medicamento = await Medicamento.findByPk(CodMedicamento, { transaction });
      if (!medicamento) {
        await transaction.rollback();
        return res.status(404).json({ msg: `Medicamento ${CodMedicamento} no encontrado` });
      }

      const precioTotal = parseFloat(precioUnitario) * cantidad;
      total += precioTotal;

      detalles.push({
        medicamentoId: CodMedicamento,
        cantidad,
        precioUnitario,
        precioTotal
      });

      medicamento.stock += cantidad;
      await medicamento.save({ transaction });
    }

    const compra = await Compra.create({
      laboratorioId: lab.id,
      total
    }, { transaction });

    for (const detalle of detalles) {
      await CompraDetalle.create({
        compraId: compra.id,
        medicamentoId: detalle.medicamentoId,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
        precioTotal: detalle.precioTotal
      }, { transaction });
    }

    await transaction.commit();

    const compraConDetalle = await Compra.findByPk(compra.id, {
      include: [
        { model: Laboratorio, attributes: ['nombre'] },
        {
          model: CompraDetalle,
          include: [{ model: Medicamento, attributes: ['descripcionMed'] }]
        }
      ]
    });

    res.status(201).json(compraConDetalle);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCompras = async (req, res) => {
  try {
    const compras = await Compra.findAll({
      include: [
        { model: Laboratorio, attributes: ['nombre'] },
        {
          model: CompraDetalle,
          include: [{ model: Medicamento, attributes: ['descripcionMed'] }]
        }
      ],
      order: [['fecha', 'DESC']]
    });
    res.json(compras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompraById = async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await Compra.findByPk(id, {
      include: [
        { model: Laboratorio, attributes: ['nombre'] },
        {
          model: CompraDetalle,
          include: [{ model: Medicamento, attributes: ['descripcionMed'] }]
        }
      ]
    });

    if (!compra) {
      return res.status(404).json({ msg: 'Compra no encontrada' });
    }

    res.json(compra);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
