import uniqid from 'uniqid';

export default class List {
  constructor() {
    this.items = [];
  }
  addItem(quantity, unit, description) {
    const item = {
      id: uniqid(),
      quantity,
      unit,
      description,
    };
    this.items.push(item);
    return item;
  }

  deleteItem(id) {
    const index = this.items.findIndex((el) => el.id === id);
    this.items.splice(index, 1);
  }

  updateQuantity(id, newQuantity) {
    this.items.find((el) => el.id === id).quantity = newQuantity;
  }
}
