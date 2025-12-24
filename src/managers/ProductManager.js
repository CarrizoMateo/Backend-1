import fs from 'fs/promises';

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async saveProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  async addProduct(productData) {
    const products = await this.getProducts();
    const newId = products.length > 0
      ? (parseInt(products[products.length - 1].id) + 1).toString()
      : "1";

    const newProduct = {
      id: newId,
      ...productData
    };

    products.push(newProduct);
    await this.saveProducts(products);
    return newProduct;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return false;

    products.splice(index, 1);
    await this.saveProducts(products);
    return true;
  }
}



