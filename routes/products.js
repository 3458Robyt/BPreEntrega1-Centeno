const express = require('express');
const router = express.Router();
const fs = require('fs');

// Ruta para obtener todos los productos
router.get('/', (req, res) => {
  // Leer productos desde el archivo productos.json
  const productos = JSON.parse(fs.readFileSync('./data/products.json'));
  res.json(productos);
});

// Ruta para obtener un producto por su ID
router.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const productos = JSON.parse(fs.readFileSync('./data/products.json'));
  const producto = productos.find((p) => p.id === pid);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(producto);
});

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  const newProduct = {
    id: generateProductId(), // Genera un nuevo ID
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails,
  };

  const productos = JSON.parse(fs.readFileSync('./data/products.json'));
  productos.push(newProduct);

  // Guarda el producto en productos.json
  fs.writeFileSync('./data/products.json', JSON.stringify(productos, null, 2));

  res.status(201).json(newProduct);
});

// Ruta para actualizar un producto por su ID
router.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const updatedProduct = req.body;

  const productos = JSON.parse(fs.readFileSync('./data/products.json'));
  const index = productos.findIndex((p) => p.id === pid);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  // No actualizamos el ID
  updatedProduct.id = pid;

  productos[index] = updatedProduct;

  // Guarda los productos actualizados en productos.json
  fs.writeFileSync('./data/productos.json', JSON.stringify(productos, null, 2));

  res.json(updatedProduct);
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  const productos = JSON.parse(fs.readFileSync('./data/products.json'));
  const index = productos.findIndex((p) => p.id === pid);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  // Elimina el producto de la lista
  productos.splice(index, 1);

  // Guarda la lista de productos actualizada en productos.json
  fs.writeFileSync('./data/productos.json', JSON.stringify(productos, null, 2));

  res.json({ message: 'Producto eliminado correctamente' });
});

// Función para generar un nuevo ID de producto
function generateProductId() {
  const productos = JSON.parse(fs.readFileSync('./data/products.json'));
  let newId;
  do {
    newId = String(Math.floor(Math.random() * 10000));
  } while (productos.some((p) => p.id === newId));
  return newId;
}

module.exports = router;
