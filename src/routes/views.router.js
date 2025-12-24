// src/routes/views.router.js

import { Router } from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = Router();

// GET /products (vista paginada)
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;

    const filter = {};
    if (query) {
      if (query === 'true' || query === 'false') {
        filter.status = query === 'true';
      } else {
        filter.category = query;
      }
    }

    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

    const result = await Product.paginate(filter, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption,
      lean: true
    });

    res.render('products', {
      products: result.docs,
      pagination: {
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page
      }
    });
  } catch (error) {
    console.error('Error al renderizar productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// GET /products/:pid (detalle de producto)
router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid).lean();
    if (!product) return res.status(404).send('Producto no encontrado');

    res.render('productDetail', { product });
  } catch (error) {
    console.error('Error al mostrar detalle del producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// GET /carts/:cid (vista carrito con productos)
router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product').lean();
    if (!cart) return res.status(404).send('Carrito no encontrado');

    res.render('cart', {
      cartId: cid,
      products: cart.products.map(item => ({
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.quantity * item.product.price
      }))
    });
  } catch (error) {
    console.error('Error al mostrar carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;
