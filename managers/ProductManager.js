import fs from 'fs/promises';

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id == id);
  }

  async addProduct(productData) {
    const products = await this.getProducts();
    const newId = products.length > 0 ? (parseInt(products[products.length - 1].id) + 1).toString() : "1";

    const newProduct = {
      id: newId,
      ...productData
    };

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updateData) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;

    if (updateData.id) delete updateData.id;

    products[index] = { ...products[index], ...updateData };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return false;

    products.splice(index, 1);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return true;
  }
}


