export interface ProductsShippingMap {
    [productName: string]: string;
}

export interface Product {
    dataValues: any;
    id: number;
    nameProduct: string;
    cost: number;
    shippingRestrictions: string;
    quantityStock: number;
    dueDate: string;
    inventoryCost: number;
  }