const express = require('express');
const router = express.Router();

// Ruta para manejar la solicitud POST del formulario de mascotas
router.post('/', (req, res) => {
  const { nombre, tipo } = req.body;
  // Haz lo que necesites con los datos de la mascota aquí
  // Por ejemplo, puedes guardarlos en una base de datos
  res.send('Mascota agregada correctamente',nombre,tipo); // Respuesta de prueba
});

module.exports = router;
