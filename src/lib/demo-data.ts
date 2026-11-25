export type StockState = "sufficient" | "risk" | "recommended" | "urgent";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  /** Costo unitario de compra, en soles. */
  cost: number;
  supplier: string;
  /** Unidades vendidas en los últimos 30 días. */
  sales30: number;
  /** Variación porcentual frente al mes anterior. */
  trend: number;
  stock: number;
  minimum: number;
  safetyStock: number;
};

export const products: Product[] = [
  {
    id: "P-001",
    name: "Arroz extra · 5 kg",
    category: "Abarrotes",
    price: 24.9,
    cost: 16.4,
    supplier: "Distribuidora Lima",
    sales30: 210,
    trend: 8.4,
    stock: 68,
    minimum: 30,
    safetyStock: 15,
  },
  {
    id: "P-002",
    name: "Aceite vegetal · 1 L",
    category: "Abarrotes",
    price: 8.5,
    cost: 6.1,
    supplier: "Proveedor Sur",
    sales30: 168,
    trend: 3.1,
    stock: 14,
    minimum: 20,
    safetyStock: 10,
  },
  {
    id: "P-003",
    name: "Leche evaporada · 400 g",
    category: "Lácteos",
    price: 4.6,
    cost: 3.2,
    supplier: "Lácteos Andes",
    sales30: 240,
    trend: 12.6,
    stock: 10,
    minimum: 18,
    safetyStock: 17,
  },
  {
    id: "P-004",
    name: "Gaseosa cola · 2 L",
    category: "Bebidas",
    price: 7.5,
    cost: 4.9,
    supplier: "Bebidas del Perú",
    sales30: 285,
    trend: -2.4,
    stock: 42,
    minimum: 24,
    safetyStock: 16,
  },
  {
    id: "P-005",
    name: "Galletas surtidas · 6 un.",
    category: "Snacks",
    price: 3.2,
    cost: 2.1,
    supplier: "Dulce Sabor",
    sales30: 156,
    trend: 5.8,
    stock: 11,
    minimum: 15,
    safetyStock: 8,
  },
  {
    id: "P-006",
    name: "Detergente · 1 kg",
    category: "Limpieza",
    price: 12.9,
    cost: 8.4,
    supplier: "Limpieza Express",
    sales30: 96,
    trend: -6.2,
    stock: 7,
    minimum: 12,
    safetyStock: 12,
  },
  {
    id: "P-007",
    name: "Fideos spaghetti · 500 g",
    category: "Abarrotes",
    price: 3.5,
    cost: 2.3,
    supplier: "Molinos Unidos",
    sales30: 198,
    trend: 1.9,
    stock: 37,
    minimum: 20,
    safetyStock: 14,
  },
  {
    id: "P-008",
    name: "Azúcar rubia · 1 kg",
    category: "Abarrotes",
    price: 4.2,
    cost: 2.8,
    supplier: "Azucarera Central",
    sales30: 132,
    trend: -1.5,
    stock: 16,
    minimum: 16,
    safetyStock: 12,
  },
  {
    id: "P-009",
    name: "Agua mineral · 625 ml",
    category: "Bebidas",
    price: 1.8,
    cost: 1.1,
    supplier: "Aguas Puras",
    sales30: 312,
    trend: 15.2,
    stock: 5,
    minimum: 14,
    safetyStock: 10,
  },
  {
    id: "P-010",
    name: "Atún en lata · 170 g",
    category: "Abarrotes",
    price: 6.9,
    cost: 4.6,
    supplier: "Pesquera del Norte",
    sales30: 174,
    trend: 4.6,
    stock: 19,
    minimum: 12,
    safetyStock: 3,
  },
  {
    id: "P-011",
    name: "Papel higiénico · 4 rollos",
    category: "Higiene",
    price: 9.8,
    cost: 6.5,
    supplier: "Higiene Plus",
    sales30: 108,
    trend: -3.8,
    stock: 8,
    minimum: 10,
    safetyStock: 6,
  },
  {
    id: "P-012",
    name: "Shampoo familiar · 750 ml",
    category: "Higiene",
    price: 14.5,
    cost: 9.2,
    supplier: "Cuidado Familiar",
    sales30: 84,
    trend: 2.2,
    stock: 22,
    minimum: 12,
    safetyStock: 5,
  },
];

export type Movement = {
  id: string;
  date: string;
  productId: string;
  type: "entrada" | "salida";
  quantity: number;
};

export const inventoryMovements: Movement[] = [
  { id: "M-001", date: "2026-11-25", productId: "P-001", type: "entrada", quantity: 24 },
  { id: "M-002", date: "2026-11-25", productId: "P-009", type: "salida", quantity: 18 },
  { id: "M-003", date: "2026-11-24", productId: "P-003", type: "entrada", quantity: 12 },
  { id: "M-004", date: "2026-11-24", productId: "P-002", type: "salida", quantity: 9 },
  { id: "M-005", date: "2026-11-23", productId: "P-006", type: "entrada", quantity: 6 },
  { id: "M-006", date: "2026-11-23", productId: "P-005", type: "salida", quantity: 7 },
  { id: "M-007", date: "2026-11-22", productId: "P-012", type: "entrada", quantity: 10 },
  { id: "M-008", date: "2026-11-22", productId: "P-011", type: "salida", quantity: 4 },
];

export const salesTrend = [
  { day: "Lun", actual: 730, forecast: null },
  { day: "Mar", actual: 780, forecast: null },
  { day: "Mié", actual: 710, forecast: null },
  { day: "Jue", actual: 900, forecast: 900 },
  { day: "Vie", actual: null, forecast: 970 },
  { day: "Sáb", actual: null, forecast: 940 },
  { day: "Dom", actual: null, forecast: 1050 },
];

export const salesByDay = [
  { day: "Lun", sales: 730 },
  { day: "Mar", sales: 780 },
  { day: "Mié", sales: 710 },
  { day: "Jue", sales: 900 },
  { day: "Vie", sales: 970 },
  { day: "Sáb", sales: 1120 },
  { day: "Dom", sales: 860 },
];

export const salesByCategory = [
  { category: "Abarrotes", sales: 8420 },
  { category: "Bebidas", sales: 5260 },
  { category: "Lácteos", sales: 4180 },
  { category: "Snacks", sales: 3670 },
  { category: "Limpieza", sales: 2940 },
  { category: "Higiene", sales: 2210 },
];

export const salesHistory = [
  {
    receipt: "BOL-10842",
    date: "25 nov · 10:42",
    items: 6,
    category: "Abarrotes",
    total: 58.4,
    payment: "Yape",
  },
  {
    receipt: "BOL-10841",
    date: "25 nov · 10:18",
    items: 3,
    category: "Bebidas",
    total: 19.5,
    payment: "Efectivo",
  },
  {
    receipt: "BOL-10840",
    date: "25 nov · 09:56",
    items: 5,
    category: "Lácteos",
    total: 34.2,
    payment: "Tarjeta",
  },
  {
    receipt: "BOL-10839",
    date: "25 nov · 09:31",
    items: 2,
    category: "Limpieza",
    total: 25.8,
    payment: "Efectivo",
  },
  {
    receipt: "BOL-10838",
    date: "25 nov · 09:04",
    items: 4,
    category: "Snacks",
    total: 16.6,
    payment: "Yape",
  },
  {
    receipt: "BOL-10837",
    date: "25 nov · 08:47",
    items: 7,
    category: "Abarrotes",
    total: 71.3,
    payment: "Tarjeta",
  },
];

export const predictionDemo = {
  demand: 42,
  currentStock: 20,
  safetyStock: 5,
  recommendedPurchase: 27,
};
