export interface ProductData { id: number; name: string; type: string; price: number; }
export interface IProduct extends ProductData { calculateFreight(): number; }
