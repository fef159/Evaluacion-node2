const { Medicamento, Venta, Usuario } = require('../models');

exports.vender = async (req, res) => {
  try {
    const { CodMedicamento, cantidad } = req.body;
    const usuarioId = req.user.id;

    // Buscar medicamento
    const med = await Medicamento.findByPk(CodMedicamento);

    if (!med) {
      return res.status(404).json({ msg: 'Medicamento no encontrado' });
    }

    // Validar stock
    if (med.stock < cantidad) {
      return res.status(400).json({ msg: 'Stock insuficiente' });
    }

    // Calcular total
    const precioTotal = parseFloat(med.precioVentaUni) * cantidad;

    // Crear venta
    const venta = await Venta.create({
      usuarioId,
      medicamentoId: CodMedicamento,
      cantidad,
      precioUnitario: med.precioVentaUni,
      precioTotal
    });

    // Descontar stock
    med.stock -= cantidad;
    await med.save();

    res.json({
      msg: 'Venta realizada',
      venta: {
        id: venta.id,
        cantidad,
        precioTotal,
        stockRestante: med.stock
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: [
        { model: Usuario, attributes: ['username'] },
        { model: Medicamento, attributes: ['descripcionMed'] }
      ],
      order: [['fecha', 'DESC']]
    });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMisVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      where: { usuarioId: req.user.id },
      include: [{ model: Medicamento, attributes: ['descripcionMed'] }],
      order: [['fecha', 'DESC']]
    });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelarVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id, { include: Medicamento });

    if (!venta) {
      return res.status(404).json({ msg: 'Venta no encontrada' });
    }

    if (venta.usuarioId !== req.user.id && req.user.rol !== 'ADMIN') {
      return res.status(403).json({ msg: 'No autorizado' });
    }

    if (venta.estado === 'cancelada') {
      return res.status(400).json({ msg: 'Venta ya cancelada' });
    }

    // Devolver stock
    venta.Medicamento.stock += venta.cantidad;
    await venta.Medicamento.save();

    // Marcar como cancelada
    venta.estado = 'cancelada';
    await venta.save();

    res.json({ msg: 'Venta cancelada', venta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};