const express = require('express');
const router = express.Router();
const fs = require('fs');

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
  const newCart = {
    id: generateCartId(), // Genera un nuevo ID de carrito
    products: [],
  };

  const carritos = JSON.parse(fs.readFileSync('./data/carrito.json'));
  carritos.push(newCart);

  // Guarda el carrito en carrito.json
  fs.writeFileSync('./data/carrito.json', JSON.stringify(carritos, null, 2));

  res.status(201).json(newCart);
});

// Ruta para obtener productos de un carrito por su ID
router.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const carritos = JSON.parse(fs.readFileSync('./data/carrito.json'));
  const carrito = carritos.find((c) => c.id === cid);

  if (!carrito) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.json(carrito.products);
});

// Ruta para agregar un producto a un carrito por su ID de carrito y ID de producto
router.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const carritos = JSON.parse(fs.readFileSync('./data/carrito.json'));
  const carrito = carritos.find((c) => c.id === cid);

  if (!carrito) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const productos = JSON.parse(fs.readFileSync('./data/products.json'));
  const producto = productos.find((p) => p.id === pid);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  // Verifica si el producto ya está en el carrito
  const existingProduct = carrito.products.find((p) => p.id === pid);

  if (existingProduct) {
    // Si el producto ya está en el carrito, incrementa la cantidad
    existingProduct.quantity += quantity;
  } else {
    // Si el producto no está en el carrito, agrégalo
    carrito.products.push({
      id: pid,
      quantity,
    });
  }

  // Guarda el carrito actualizado en carrito.json
  fs.writeFileSync('./data/carrito.json', JSON.stringify(carritos, null, 2));

  res.status(201).json(carrito.products);
});

// Función para generar un nuevo ID de carrito
function generateCartId() {
  const carritos = JSON.parse(fs.readFileSync('./data/carrito.json'));
  let newId;
  do {
    newId = String(Math.floor(Math.random() * 10000));
  } while (carritos.some((c) => c.id === newId));
  return newId;
}

module.exports = router;
