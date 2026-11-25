export type StockState = "sufficient" | "risk" | "recommended" | "urgent";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minimum: number;
  stockPercent: number;
  state: StockState;
};

export const products: Product[] = [
  { id: "P-001", name: "Arroz extra · 5 kg", category: "Abarrotes", price: 24.9, stock: 68, minimum: 30, stockPercent: 100, state: "sufficient" },
  { id: "P-002", name: "Aceite vegetal · 1 L", category: "Abarrotes", price: 8.5, stock: 14, minimum: 20, stockPercent: 35, state: "risk" },
  { id: "P-003", name: "Leche evaporada · 400 g", category: "Lácteos", price: 4.6, stock: 10, minimum: 18, stockPercent: 28, state: "urgent" },
  { id: "P-004", name: "Gaseosa cola · 2 L", category: "Bebidas", price: 7.5, stock: 42, minimum: 24, stockPercent: 88, state: "sufficient" },
  { id: "P-005", name: "Galletas surtidas · 6 un.", category: "Snacks", price: 3.2, stock: 11, minimum: 15, stockPercent: 37, state: "risk" },
  { id: "P-006", name: "Detergente · 1 kg", category: "Limpieza", price: 12.9, stock: 7, minimum: 12, stockPercent: 29, state: "urgent" },
  { id: "P-007", name: "Fideos spaghetti · 500 g", category: "Abarrotes", price: 3.5, stock: 37, minimum: 20, stockPercent: 92, state: "sufficient" },
  { id: "P-008", name: "Azúcar rubia · 1 kg", category: "Abarrotes", price: 4.2, stock: 16, minimum: 16, stockPercent: 50, state: "recommended" },
  { id: "P-009", name: "Agua mineral · 625 ml", category: "Bebidas", price: 1.8, stock: 5, minimum: 14, stockPercent: 18, state: "urgent" },
  { id: "P-010", name: "Atún en lata · 170 g", category: "Abarrotes", price: 6.9, stock: 19, minimum: 12, stockPercent: 79, state: "sufficient" },
  { id: "P-011", name: "Papel higiénico · 4 rollos", category: "Higiene", price: 9.8, stock: 8, minimum: 10, stockPercent: 32, state: "risk" },
  { id: "P-012", name: "Shampoo familiar · 750 ml", category: "Higiene", price: 14.5, stock: 22, minimum: 12, stockPercent: 91, state: "sufficient" },
];

export const monthlyMetrics = [
  { label: "Ventas del mes", value: "S/ 28,430", note: "Ingresos acumulados", icon: "sales" },
  { label: "Productos en riesgo", value: "4", note: "Requieren seguimiento", icon: "risk" },
  { label: "Demanda de mañana", value: "178 u.", note: "Estimación de unidades", icon: "demand" },
  { label: "Stock total", value: "1,248 u.", note: "Unidades disponibles", icon: "stock" },
] as const;

export const salesTrend = [
  { day: "Lun", actual: 730, forecast: null },
  { day: "Mar", actual: 780, forecast: null },
  { day: "Mié", actual: 710, forecast: null },
  { day: "Jue", actual: 900, forecast: 900 },
  { day: "Vie", actual: null, forecast: 970 },
  { day: "Sáb", actual: null, forecast: 940 },
  { day: "Dom", actual: null, forecast: 1050 },
];

export const categoryStock = [
  { category: "Abarrotes", units: 392 },
  { category: "Bebidas", units: 286 },
  { category: "Lácteos", units: 164 },
  { category: "Limpieza", units: 146 },
  { category: "Snacks", units: 138 },
  { category: "Higiene", units: 122 },
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
  { receipt: "BOL-10842", date: "25 nov · 10:42", items: 6, category: "Abarrotes", total: 58.4, payment: "Yape" },
  { receipt: "BOL-10841", date: "25 nov · 10:18", items: 3, category: "Bebidas", total: 19.5, payment: "Efectivo" },
  { receipt: "BOL-10840", date: "25 nov · 09:56", items: 5, category: "Lácteos", total: 34.2, payment: "Tarjeta" },
  { receipt: "BOL-10839", date: "25 nov · 09:31", items: 2, category: "Limpieza", total: 25.8, payment: "Efectivo" },
  { receipt: "BOL-10838", date: "25 nov · 09:04", items: 4, category: "Snacks", total: 16.6, payment: "Yape" },
  { receipt: "BOL-10837", date: "25 nov · 08:47", items: 7, category: "Abarrotes", total: 71.3, payment: "Tarjeta" },
];

export const replenishmentAlerts = [
  { product: "Leche evaporada · 400 g", detail: "10 unidades · mínimo 18", state: "urgent" as const, suggested: "Comprar 24 u." },
  { product: "Agua mineral · 625 ml", detail: "5 unidades · mínimo 14", state: "urgent" as const, suggested: "Comprar 20 u." },
  { product: "Aceite vegetal · 1 L", detail: "14 unidades · mínimo 20", state: "risk" as const, suggested: "Comprar 16 u." },
  { product: "Galletas surtidas · 6 un.", detail: "11 unidades · mínimo 15", state: "risk" as const, suggested: "Comprar 12 u." },
];

export const predictionDemo = {
  demand: 42,
  currentStock: 20,
  safetyStock: 5,
  recommendedPurchase: 27,
};