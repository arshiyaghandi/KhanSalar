export type TableStatus = 'EMPTY' | 'OCCUPIED' | 'RESERVED';

export interface RestaurantTable {
  id: number;
  tableNumber: string;
  title: string;
  capacity: number;
  status: TableStatus;
  activeOrderAmount?: number;
  activeOrderId?: number;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  isAvailable: boolean;
  image?: string;
}

export interface OrderItem {
  menuItemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'SERVED' | 'PAID' | 'CANCELLED';

export interface Order {
  id: number;
  orderNumber: string;
  tableId: number;
  tableName: string;
  serverName: string;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
}

export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'VOID';

export interface Invoice {
  id: number;
  invoiceNumber: string;
  orderId: string;
  tableName?: string;
  subTotal: number;
  taxAmount: number;
  serviceFee: number;
  discountAmount: number;
  finalAmount: number;
  status: InvoiceStatus;
  issuedAt: string;
  paidAt?: string;
  items?: OrderItem[];
}

export interface LedgerItem {
  id: number;
  accountName: string;
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  debit: number;
  credit: number;
}

export interface LedgerEntry {
  id: number;
  entryNumber: string;
  description: string;
  referenceType: string;
  referenceId: string;
  transactionDate: string;
  items: LedgerItem[];
}

export interface DailyClosing {
  id: number;
  closingDate: string;
  totalSales: number;
  totalCash: number;
  totalPos: number;
  totalTax: number;
  orderCount: number;
  closedBy: string;
  createdAt: string;
}

// Enterprise ERP - Kitchen Display System (KDS)
export type KitchenStation = 'ALL' | 'GRILL' | 'KITCHEN' | 'BAR' | 'COLD' | 'DESSERT';
export type KitchenItemStatus = 'RECEIVED' | 'PREPARING' | 'READY' | 'SERVED';

export interface KitchenTicketItem {
  id: number;
  itemName: string;
  quantity: number;
  station: KitchenStation;
  status: KitchenItemStatus;
  notes?: string;
  modifiers?: string[];
}

export interface KitchenTicket {
  orderId: number;
  orderNumber: string;
  tableNumber: string;
  tableName: string;
  serverName: string;
  orderTime: string;
  elapsedMinutes: number;
  priority: 'NORMAL' | 'VIP' | 'URGENT';
  notes?: string;
  items: KitchenTicketItem[];
}

// Enterprise ERP - Inventory & Recipe (BOM)
export type InventoryCategory = 'MEAT' | 'PRODUCE' | 'DAIRY' | 'SPICES' | 'DRY_GOODS' | 'BEVERAGE' | 'PACKAGING';

export interface InventoryItem {
  id: number;
  itemCode: string;
  name: string;
  category: InventoryCategory;
  unit: string;
  currentStock: number;
  minimumThreshold: number;
  reorderPoint: number;
  unitCost: number;
  lastRestockedAt?: string;
}

export interface RecipeIngredient {
  id: number;
  menuItemId: number;
  inventoryItemId: number;
  ingredientName: string;
  quantityRequired: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

export interface MenuItemRecipeBOM {
  menuItemId: number;
  menuItemName: string;
  sellingPrice: number;
  ingredients: RecipeIngredient[];
  foodCost: number;
  foodCostPercentage: number;
  profitMargin: number;
}

// Enterprise ERP - CRM & Loyalty Club
export type CustomerTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface Customer {
  id: number;
  fullName: string;
  phoneNumber: string;
  tier: CustomerTier;
  loyaltyPoints: number;
  walletBalance: number;
  totalSpent: number;
  totalVisits: number;
  notes?: string;
  lastVisit?: string;
  birthDate?: string;
}

// Enterprise ERP - Advanced Reservations & Events (Feature 2)
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'SEATED' | 'CANCELLED' | 'NO_SHOW';
export type OccasionType = 'NORMAL' | 'BIRTHDAY' | 'BUSINESS' | 'ANNIVERSARY' | 'VIP';

export interface Reservation {
  id: number;
  reservationNumber: string;
  customerName: string;
  phoneNumber: string;
  partySize: number;
  tableId?: number;
  tableNumber?: string;
  reservationTime: string;
  status: ReservationStatus;
  occasion: OccasionType;
  depositAmount: number;
  depositPaid: boolean;
  specialRequests?: string;
  notes?: string;
  createdAt?: string;
}

// Enterprise ERP - Menu Engineering & BI Analytics (Feature 4)
export type MenuClassification = 'STAR' | 'PLOWHORSE' | 'PUZZLE' | 'DOG';

export interface MenuEngineeringItem {
  menuItemId: number;
  itemName: string;
  category: string;
  unitsSold: number;
  totalRevenue: number;
  totalProfit: number;
  unitFoodCost: number;
  unitMargin: number;
  popularityShare: number; // percentage
  marginShare: number;
  classification: MenuClassification;
}

export interface HourlySalesPoint {
  hour: string;
  orderCount: number;
  revenue: number;
}

export interface CategorySalesPoint {
  category: string;
  amount: number;
  percentage: number;
}

export interface TopSellingItemPoint {
  name: string;
  quantity: number;
  revenue: number;
}

export interface BiAnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  grossProfit: number;
  foodCostPercentage: number;
  hourlySales: HourlySalesPoint[];
  salesByCategory: CategorySalesPoint[];
  topSellingItems: TopSellingItemPoint[];
}

// Enterprise ERP - Digital Menu & Guest QR Self-Ordering (Feature 1)
export interface GuestOrderItem {
  menuItemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface GuestOrderRequest {
  tableNumber: string;
  customerName?: string;
  phoneNumber?: string;
  notes?: string;
  items: GuestOrderItem[];
}


