import fs from 'fs/promises';

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async saveCarts(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  async createCart() {
    const carts = await this.getCarts();
    const newId = carts.length > 0
      ? (parseInt(carts[carts.length - 1].id) + 1).toString()
      : "1";

    const newCart = {
      id: newId,
      products: []
    };

    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id == id);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(c => c.id == cid);
    if (cartIndex === -1) return null;

    const cart = carts[cartIndex];
    const productInCart = cart.products.find(p => p.product === pid);

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await this.saveCarts(carts);
    return cart;
  }
}

