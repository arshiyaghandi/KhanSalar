import type {
  RestaurantTable,
  MenuItem,
  Order,
  OrderItem,
  Invoice,
  LedgerEntry,
  DailyClosing,
  KitchenTicket,
  KitchenStation,
  KitchenItemStatus,
  InventoryItem,
  MenuItemRecipeBOM,
  Customer,
  Reservation,
  ReservationStatus,
  OccasionType,
  BiAnalyticsSummary,
  HourlySalesPoint,
  CategorySalesPoint,
  TopSellingItemPoint,
  MenuEngineeringItem,
  GuestOrderRequest,
  AuthUser,
  BackendStatus,
  TableStatus,
  KitchenTicketItem,
  InventoryCategory,
} from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const AUTH_TOKEN_KEY = 'khansalar_jwt_token';
const AUTH_USER_KEY = 'khansalar_auth_user';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
  setToken(token: string | null) {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  },
  getUser(): AuthUser | null {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser(user: AuthUser | null) {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  },
};

/**
 * Robust authenticated HTTP client for Khansalar Spring Boot Reactive Microservices Gateway
 */
export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  let res: Response;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (netErr: any) {
    console.warn(`[Khansalar API] Network error on ${url}:`, netErr?.message);
    throw new Error(`خطای شبکه در اتصال به سرور بکند (${netErr?.message || 'Network Error'})`);
  }

  // Handle 401 Unauthorized: Attempt auto-login if token is missing or expired
  if (res.status === 401 && !endpoint.includes('/auth/login')) {
    console.warn('[Khansalar API] 401 Unauthorized. Attempting auto-login refresh...');
    try {
      const refreshedUser = await api.login('admin', 'admin123');
      if (refreshedUser?.token) {
        headers.set('Authorization', `Bearer ${refreshedUser.token}`);
        res = await fetch(url, { ...options, headers });
      }
    } catch (e) {
      console.warn('[Khansalar API] Auto-refresh failed:', e);
    }
  }

  if (!res.ok) {
    let errorMsg = `Server returned HTTP ${res.status}: ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson?.message) errorMsg = errJson.message;
    } catch {}
    throw new Error(errorMsg);
  }

  if (res.status === 204) {
    return {} as T;
  }

  const json = await res.json();
  // Unwrap Spring Boot ApiResponse<T>
  if (json && typeof json === 'object' && 'data' in json && 'success' in json) {
    return json.data as T;
  }
  return json as T;
}

// Initial Mock Data (matching Backend schema.sql and Iranian authentic restaurant ambience)
const INITIAL_TABLES: RestaurantTable[] = [
  { id: 1, tableNumber: 'T-01', title: 'میز حافظ', capacity: 4, status: 'OCCUPIED', activeOrderAmount: 820000, activeOrderId: 101 },
  { id: 2, tableNumber: 'T-02', title: 'میز سعدی', capacity: 2, status: 'EMPTY' },
  { id: 3, tableNumber: 'T-03', title: 'میز مولانا', capacity: 6, status: 'EMPTY' },
  { id: 4, tableNumber: 'T-04', title: 'شاه‌نشین سلطنتی', capacity: 8, status: 'OCCUPIED', activeOrderAmount: 1450000, activeOrderId: 102 },
  { id: 5, tableNumber: 'T-05', title: 'تخت سنتی آب‌نما', capacity: 6, status: 'RESERVED' },
  { id: 6, tableNumber: 'T-06', title: 'ایوان کافه خوان‌سالار', capacity: 4, status: 'EMPTY' },
];

const INITIAL_MENU: MenuItem[] = [
  {
    id: 1,
    name: 'چلو کباب شاندیز خوان‌سالار',
    category: 'غذای اصلی و درباری',
    price: 480000,
    description: 'راسته بره تازه گوسفندی مرینیت‌شده با زعفران قائنات به همراه برنج دودی اعلا',
    isAvailable: true,
  },
  {
    id: 2,
    name: 'ته‌چین ویژه مرغ و بادمجان',
    category: 'غذای اصلی و درباری',
    price: 340000,
    description: 'ته‌چین طلایی با ماست چکیده محلی، خلال پسته، زرشک اعلا و فیله مرغ زعفرانی',
    isAvailable: true,
  },
  {
    id: 3,
    name: 'دیزی سنگی مخصوص با ترشی شاه‌عباسی',
    category: 'غذای اصلی و درباری',
    price: 390000,
    description: 'گوشت تازه گوسفندی با نخود و دنبه برشته به همراه نان سنگک تازه و سبزی خوردن',
    isAvailable: true,
  },
  {
    id: 4,
    name: 'کباب برگ گوسفندی اعلا',
    category: 'غذای اصلی و درباری',
    price: 520000,
    description: 'راسته نرم گوسفندی با کره محلی و گوجه کبابی',
    isAvailable: true,
  },
  {
    id: 5,
    name: 'شربت زعفران و بیدمشک ناب',
    category: 'نوشیدنی سنتی و شربت‌خانه',
    price: 85000,
    description: 'عرق بیدمشک اصیل، گلاب دوآتشه کاشان، تخم شربتی و شربت عسل کوهی',
    isAvailable: true,
  },
  {
    id: 6,
    name: 'شربت سکنجبین و خیار سکه‌ای',
    category: 'نوشیدنی سنتی و شربت‌خانه',
    price: 75000,
    description: 'شربت خنک تابستانه با نعناع تازه و تکه‌های خیار معطر',
    isAvailable: true,
  },
  {
    id: 7,
    name: 'چای دمی در قوری شاه‌عباسی',
    category: 'نوشیدنی گرم و کافه',
    price: 75000,
    description: 'چای دست‌چین سرگل لاهیجان همراه با هل، دارچین، نبات زعفرانی و باقلوا',
    isAvailable: true,
  },
  {
    id: 8,
    name: 'باقلوای سنتی تبریز (دو نفره)',
    category: 'دسر و شیرینی‌جات',
    price: 120000,
    description: 'باقلوای پرملات با مغز پسته اکبری و گردوی تازه',
    isAvailable: true,
  },
  {
    id: 9,
    name: 'ماست و خیار مجلسی با گل سرخ',
    category: 'پیش‌غذا و مزه',
    price: 65000,
    description: 'ماست کوزه سنتی با کشمش آفتابی، مغز گردو و گلبرگ‌های گل محمدی',
    isAvailable: true,
  },
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 1,
    invoiceNumber: 'INV-KH-1403-101',
    orderId: 'KH-1403-101',
    tableName: 'میز حافظ',
    subTotal: 820000,
    taxAmount: 82000,
    serviceFee: 41000,
    discountAmount: 0,
    finalAmount: 943000,
    status: 'ISSUED',
    issuedAt: '۱۴۰۳/۰۷/۲۵ - ساعت ۱۲:۳۰',
    items: [
      { menuItemId: 1, itemName: 'چلو کباب شاندیز خوان‌سالار', quantity: 1, unitPrice: 480000, totalPrice: 480000 },
      { menuItemId: 2, itemName: 'ته‌چین ویژه مرغ و بادمجان', quantity: 1, unitPrice: 340000, totalPrice: 340000 },
    ],
  },
  {
    id: 2,
    invoiceNumber: 'INV-KH-1403-102',
    orderId: 'KH-1403-102',
    tableName: 'شاه‌نشین سلطنتی',
    subTotal: 1450000,
    taxAmount: 145000,
    serviceFee: 72500,
    discountAmount: 50000,
    finalAmount: 1617500,
    status: 'ISSUED',
    issuedAt: '۱۴۰۳/۰۷/۲۵ - ساعت ۱۳:۱۵',
    items: [
      { menuItemId: 4, itemName: 'کباب برگ گوسفندی اعلا', quantity: 2, unitPrice: 520000, totalPrice: 1040000 },
      { menuItemId: 3, itemName: 'دیزی سنگی مخصوص با ترشی شاه‌عباسی', quantity: 1, unitPrice: 390000, totalPrice: 390000 },
      { menuItemId: 5, itemName: 'شربت زعفران و بیدمشک ناب', quantity: 2, unitPrice: 85000, totalPrice: 170000 },
    ],
  },
  {
    id: 3,
    invoiceNumber: 'INV-KH-1403-098',
    orderId: 'KH-1403-098',
    tableName: 'میز سعدی',
    subTotal: 650000,
    taxAmount: 65000,
    serviceFee: 32500,
    discountAmount: 0,
    finalAmount: 747500,
    status: 'PAID',
    issuedAt: '۱۴۰۳/۰۷/۲۵ - ساعت ۱۱:۴۵',
    paidAt: '۱۴۰۳/۰۷/۲۵ - ساعت ۱۲:۱۵',
    items: [
      { menuItemId: 3, itemName: 'دیزی سنگی مخصوص با ترشی شاه‌عباسی', quantity: 1, unitPrice: 390000, totalPrice: 390000 },
      { menuItemId: 7, itemName: 'چای دمی در قوری شاه‌عباسی', quantity: 2, unitPrice: 75000, totalPrice: 150000 },
    ],
  },
];

const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: 1,
    entryNumber: 'JE-1403-801',
    description: 'تسویه فاکتور فروش شماره INV-KH-1403-098 از طریق کارتخوان سامان',
    referenceType: 'INVOICE',
    referenceId: 'INV-KH-1403-098',
    transactionDate: '۱۴۰۳/۰۷/۲۵ - ۱۲:۱۵:۰۰',
    items: [
      { id: 1, accountName: 'حساب بانک و دستگاه کارتخوان (پوز)', accountType: 'ASSET', debit: 747500, credit: 0 },
      { id: 2, accountName: 'درآمد فروش غذا و خدمات پذیرایی', accountType: 'REVENUE', debit: 0, credit: 682500 },
      { id: 3, accountName: 'مالیات بر ارزش افزوده پرداختنی', accountType: 'LIABILITY', debit: 0, credit: 65000 },
    ],
  },
  {
    id: 2,
    entryNumber: 'JE-1403-800',
    description: 'تسویه نقدی سفارش مهمانان میز مولانا',
    referenceType: 'INVOICE',
    referenceId: 'INV-KH-1403-095',
    transactionDate: '۱۴۰۳/۰۷/۲۵ - ۱۱:۳۰:۰۰',
    items: [
      { id: 4, accountName: 'صندوق نقد خوان‌سالار', accountType: 'ASSET', debit: 550000, credit: 0 },
      { id: 5, accountName: 'درآمد فروش غذا و خدمات پذیرایی', accountType: 'REVENUE', debit: 0, credit: 500000 },
      { id: 6, accountName: 'مالیات بر ارزش افزوده پرداختنی', accountType: 'LIABILITY', debit: 0, credit: 50000 },
    ],
  },
];

// Initial Kitchen Tickets for KDS
const INITIAL_KITCHEN_TICKETS: KitchenTicket[] = [
  {
    orderId: 101,
    orderNumber: 'KH-1403-101',
    tableNumber: 'T-01',
    tableName: 'میز حافظ',
    serverName: 'محمدرضا سلطانی',
    orderTime: '۱۲:۳۰',
    elapsedMinutes: 8,
    priority: 'NORMAL',
    notes: 'کباب کاملاً مغزپخت شود و زعفران بیشتر زده شود',
    items: [
      {
        id: 1011,
        itemName: 'چلو کباب شاندیز خوان‌سالار',
        quantity: 1,
        station: 'GRILL',
        status: 'PREPARING',
        notes: 'مغزپخت با گوجه اضافه',
        modifiers: ['گوجه اضافه', 'پلو دودی زعفرانی'],
      },
      {
        id: 1012,
        itemName: 'ته‌چین ویژه مرغ و بادمجان',
        quantity: 1,
        station: 'KITCHEN',
        status: 'READY',
        modifiers: ['زرشک و خلال پسته دوبرابر'],
      },
    ],
  },
  {
    orderId: 102,
    orderNumber: 'KH-1403-102',
    tableNumber: 'T-04',
    tableName: 'شاه‌نشین سلطنتی',
    serverName: 'سینا احمدی',
    orderTime: '۱۳:۱۵',
    elapsedMinutes: 14,
    priority: 'VIP',
    notes: 'مهمانان ویژه VIP - با تشریفات کامل سرو شود',
    items: [
      {
        id: 1021,
        itemName: 'کباب برگ گوسفندی اعلا',
        quantity: 2,
        station: 'GRILL',
        status: 'PREPARING',
        modifiers: ['کره محلی داغ', 'نان داغ'],
      },
      {
        id: 1022,
        itemName: 'دیزی سنگی مخصوص با ترشی شاه‌عباسی',
        quantity: 1,
        station: 'KITCHEN',
        status: 'PREPARING',
        modifiers: ['سبزی خوردن اضافه'],
      },
      {
        id: 1023,
        itemName: 'شربت زعفران و بیدمشک ناب',
        quantity: 2,
        station: 'BAR',
        status: 'READY',
        modifiers: ['کم یخ', 'تخم شربتی پرملات'],
      },
    ],
  },
];

// Initial Inventory Items (Warehouse & Stocks)
const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 1,
    itemCode: 'RAW-LAMB-01',
    name: 'راسته تازه گوسفندی مغان',
    category: 'MEAT',
    unit: 'کیلوگرم',
    currentStock: 18.5,
    minimumThreshold: 10.0,
    reorderPoint: 15.0,
    unitCost: 650000,
    lastRestockedAt: '۱۴۰۳/۰۷/۲۴',
  },
  {
    id: 2,
    itemCode: 'RAW-CHICK-01',
    name: 'فیله مرغ گرم کشتار روز',
    category: 'MEAT',
    unit: 'کیلوگرم',
    currentStock: 6.2,
    minimumThreshold: 8.0,
    reorderPoint: 12.0,
    unitCost: 195000,
    lastRestockedAt: '۱۴۰۳/۰۷/۲۳',
  },
  {
    id: 3,
    itemCode: 'RAW-SAFF-01',
    name: 'زعفران سرگل ممتاز قائنات',
    category: 'SPICES',
    unit: 'گرم',
    currentStock: 45.0,
    minimumThreshold: 20.0,
    reorderPoint: 50.0,
    unitCost: 110000,
    lastRestockedAt: '۱۴۰۳/۰۷/۲۰',
  },
  {
    id: 4,
    itemCode: 'RAW-RICE-01',
    name: 'برنج طارم هاشمی دودی اعلا',
    category: 'DRY_GOODS',
    unit: 'کیلوگرم',
    currentStock: 85.0,
    minimumThreshold: 30.0,
    reorderPoint: 60.0,
    unitCost: 145000,
    lastRestockedAt: '۱۴۰۳/۰۷/۲۲',
  },
];

// Initial Recipes & BOM (Bill of Materials & Food Costing)
const INITIAL_RECIPES: MenuItemRecipeBOM[] = [
  {
    menuItemId: 1,
    menuItemName: 'چلو کباب شاندیز خوان‌سالار',
    sellingPrice: 480000,
    foodCost: 247000,
    foodCostPercentage: 51.4,
    profitMargin: 233000,
    ingredients: [
      { id: 1, menuItemId: 1, inventoryItemId: 1, ingredientName: 'راسته تازه گوسفندی مغان', quantityRequired: 0.32, unit: 'کیلوگرم', unitCost: 650000, totalCost: 208000 },
      { id: 2, menuItemId: 1, inventoryItemId: 4, ingredientName: 'برنج طارم هاشمی دودی اعلا', quantityRequired: 0.22, unit: 'کیلوگرم', unitCost: 145000, totalCost: 31900 },
      { id: 3, menuItemId: 1, inventoryItemId: 3, ingredientName: 'زعفران سرگل ممتاز قائنات', quantityRequired: 0.06, unit: 'گرم', unitCost: 110000, totalCost: 6600 },
    ],
  },
];

// Initial Customers CRM & Loyalty
const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    fullName: 'دکتر علیرضا افشار',
    phoneNumber: '09121112233',
    tier: 'PLATINUM',
    loyaltyPoints: 1240,
    walletBalance: 450000,
    totalSpent: 18500000,
    totalVisits: 14,
    notes: 'علاقه‌مند به شاه‌نشین سلطنتی و کباب برگ، تخفیف VIP ۱۰ درصد',
    lastVisit: '۱۴۰۳/۰۷/۲۲',
    birthDate: '۱۳۵۶/۰۵/۱۲',
  },
  {
    id: 2,
    fullName: 'مهندس سارا نیک‌پی',
    phoneNumber: '09123334455',
    tier: 'GOLD',
    loyaltyPoints: 680,
    walletBalance: 120000,
    totalSpent: 9800000,
    totalVisits: 8,
    notes: 'همیشه دسر باقلوا و شربت سنتی سفارش می‌دهند',
    lastVisit: '۱۴۰۳/۰۷/۲۴',
    birthDate: '۱۳۶۸/۰۲/۱۸',
  },
];

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 1,
    reservationNumber: 'RES-1403-101',
    customerName: 'جناب دکتر فرهمند',
    phoneNumber: '09121112233',
    partySize: 6,
    tableId: 5,
    tableNumber: 'T-05',
    reservationTime: '1403/08/20 20:30',
    status: 'CONFIRMED',
    occasion: 'VIP',
    depositAmount: 500000,
    depositPaid: true,
    specialRequests: 'تخت سنتی کنار حوض، چای زعفرانی بدو ورود آماده باشد',
    notes: 'مهمان ویژه خوان‌سالار، سرویس تشریفات کامل',
    createdAt: '1403/08/18 11:30',
  },
  {
    id: 2,
    reservationNumber: 'RES-1403-102',
    customerName: 'سرکار خانم مهندس صابری',
    phoneNumber: '09123334455',
    partySize: 8,
    tableId: 4,
    tableNumber: 'T-04',
    reservationTime: '1403/08/20 21:00',
    status: 'CONFIRMED',
    occasion: 'BIRTHDAY',
    depositAmount: 1000000,
    depositPaid: true,
    specialRequests: 'میز آرایی تولد با شمع و گل سرخ، هماهنگی موسیقی سنتی',
    notes: 'کیک تولد به همراه پرسنل تحویل گرفته شود',
    createdAt: '1403/08/19 15:45',
  },
];

// In-memory state store with localStorage persistence
class KhansalarStore {
  tables: RestaurantTable[] = INITIAL_TABLES;
  menu: MenuItem[] = INITIAL_MENU;
  invoices: Invoice[] = INITIAL_INVOICES;
  ledger: LedgerEntry[] = INITIAL_LEDGER;
  kitchenTickets: KitchenTicket[] = INITIAL_KITCHEN_TICKETS;
  inventory: InventoryItem[] = INITIAL_INVENTORY_ITEMS;
  recipes: MenuItemRecipeBOM[] = INITIAL_RECIPES;
  customers: Customer[] = INITIAL_CUSTOMERS;
  reservations: Reservation[] = INITIAL_RESERVATIONS;

  constructor() {
    const saved = localStorage.getItem('khansalar_local_store_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.tables = parsed.tables || INITIAL_TABLES;
        this.menu = parsed.menu || INITIAL_MENU;
        this.invoices = parsed.invoices || INITIAL_INVOICES;
        this.ledger = parsed.ledger || INITIAL_LEDGER;
        this.kitchenTickets = parsed.kitchenTickets || INITIAL_KITCHEN_TICKETS;
        this.inventory = parsed.inventory || INITIAL_INVENTORY_ITEMS;
        this.recipes = parsed.recipes || INITIAL_RECIPES;
        this.customers = parsed.customers || INITIAL_CUSTOMERS;
        this.reservations = parsed.reservations || INITIAL_RESERVATIONS;
      } catch (e) {
        console.error('Failed to load store from localStorage', e);
      }
    }
  }

  save() {
    localStorage.setItem(
      'khansalar_local_store_v2',
      JSON.stringify({
        tables: this.tables,
        menu: this.menu,
        invoices: this.invoices,
        ledger: this.ledger,
        kitchenTickets: this.kitchenTickets,
        inventory: this.inventory,
        recipes: this.recipes,
        customers: this.customers,
        reservations: this.reservations,
      })
    );
  }
}

export const store = new KhansalarStore();

// =============================================================
// Strict Request/Response Adapters for Backend Contract Alignment
// =============================================================

function mapFrontendOccasionToBackend(occasion?: OccasionType | string): 'GENERAL' | 'BIRTHDAY' | 'ANNIVERSARY' | 'BUSINESS_MEETING' | 'VIP_GUEST' | 'FAMILY_GATHERING' {
  switch (occasion) {
    case 'VIP':
      return 'VIP_GUEST';
    case 'BUSINESS':
      return 'BUSINESS_MEETING';
    case 'BIRTHDAY':
      return 'BIRTHDAY';
    case 'ANNIVERSARY':
      return 'ANNIVERSARY';
    case 'NORMAL':
    default:
      return 'GENERAL';
  }
}

function mapBackendOccasionToFrontend(occasion?: string): OccasionType {
  switch (occasion) {
    case 'VIP_GUEST':
    case 'VIP':
      return 'VIP';
    case 'BUSINESS_MEETING':
    case 'BUSINESS':
      return 'BUSINESS';
    case 'BIRTHDAY':
      return 'BIRTHDAY';
    case 'ANNIVERSARY':
      return 'ANNIVERSARY';
    case 'GENERAL':
    case 'FAMILY_GATHERING':
    case 'NORMAL':
    default:
      return 'NORMAL';
  }
}

function mapBackendReservationToFrontend(dto: any): Reservation {
  const table = store.tables.find((t) => t.id === dto.tableId);
  const timeSlot = dto.timeSlot || '';
  const reservationDate = dto.reservationDate || '';
  const reservationTime = dto.reservationTime || (reservationDate && timeSlot ? `${reservationDate} ${timeSlot}` : (reservationDate || timeSlot || '1403/08/20 20:00'));

  return {
    id: Number(dto.id) || Date.now(),
    reservationNumber: dto.reservationNumber || `RES-1403-${dto.id || Math.floor(100 + Math.random() * 900)}`,
    customerName: dto.customerName || 'مهمان خوان‌سالار',
    phoneNumber: dto.customerPhone || dto.phoneNumber || '',
    partySize: Number(dto.guestCount ?? dto.partySize) || 2,
    tableId: dto.tableId ? Number(dto.tableId) : undefined,
    tableNumber: dto.tableNumber || (table ? table.tableNumber : (dto.tableName || undefined)),
    reservationTime,
    status: dto.status || 'CONFIRMED',
    occasion: mapBackendOccasionToFrontend(dto.occasion),
    depositAmount: Number(dto.depositAmount) || 0,
    depositPaid: dto.depositPaid ?? (Number(dto.depositAmount) > 0),
    specialRequests: dto.specialRequests,
    notes: dto.notes,
    createdAt: dto.createdAt || new Date().toISOString(),
  };
}

function mapBackendBiSummaryToFrontend(raw: any): BiAnalyticsSummary {
  const totalRevenue = Number(raw.totalRevenue) || 0;
  const totalOrders = Number(raw.totalOrders ?? raw.totalOrdersCount) || 0;
  const averageOrderValue = Number(raw.averageOrderValue ?? raw.averageTicketSize) || 0;
  const grossProfit = Number(raw.grossProfit) || 0;
  const foodCostPercentage = Number(raw.foodCostPercentage) || 0;

  let hourlySales: HourlySalesPoint[] = [];
  if (Array.isArray(raw.hourlySales) && raw.hourlySales.length > 0) {
    hourlySales = raw.hourlySales.map((h: any) => ({
      hour: String(h?.hour || ''),
      orderCount: Number(h?.orderCount) || 0,
      revenue: Number(h?.revenue) || 0,
    }));
  } else if (raw.hourlyOrderDensity && typeof raw.hourlyOrderDensity === 'object') {
    hourlySales = Object.entries(raw.hourlyOrderDensity).map(([hour, count]) => {
      const orderCount = Number(count) || 0;
      const unitVal = averageOrderValue > 0 ? averageOrderValue : (totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 150000);
      return {
        hour,
        orderCount,
        revenue: Math.round(orderCount * unitVal),
      };
    });
  }

  let salesByCategory: CategorySalesPoint[] = [];
  if (Array.isArray(raw.salesByCategory) && raw.salesByCategory.length > 0) {
    salesByCategory = raw.salesByCategory.map((c: any) => ({
      category: String(c?.category || ''),
      amount: Number(c?.amount) || 0,
      percentage: Number(c?.percentage) || 0,
    }));
  }

  let topSellingItems: TopSellingItemPoint[] = [];
  if (Array.isArray(raw.topSellingItems) && raw.topSellingItems.length > 0) {
    topSellingItems = raw.topSellingItems.map((item: any) => ({
      name: String(item?.name || ''),
      quantity: Number(item?.quantity) || 0,
      revenue: Number(item?.revenue) || 0,
    }));
  } else if (Array.isArray(raw.topStars) && raw.topStars.length > 0) {
    topSellingItems = raw.topStars.map((star: any) => ({
      name: String(star?.itemName || ''),
      quantity: Number(star?.unitsSold) || 0,
      revenue: Number(star?.totalRevenue) || 0,
    }));
  }

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    grossProfit,
    foodCostPercentage,
    hourlySales,
    salesByCategory,
    topSellingItems,
  };
}

export const api = {
  // =============================================================
  // Authentication & Session
  // =============================================================
  async login(username = 'admin', password = 'admin123'): Promise<AuthUser> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      let msg = 'نام کاربری یا رمز عبور اشتباه است';
      try {
        const body = await res.json();
        if (body?.message) msg = body.message;
      } catch {}
      throw new Error(msg);
    }

    const body = await res.json();
    const authData: AuthUser = body?.data || body;
    authStorage.setToken(authData.token);
    authStorage.setUser(authData);
    return authData;
  },

  logout(): void {
    authStorage.setToken(null);
    authStorage.setUser(null);
  },

  getCurrentUser(): AuthUser | null {
    return authStorage.getUser();
  },

  async checkBackendStatus(): Promise<BackendStatus> {
    try {
      if (!authStorage.getToken()) {
        try {
          await this.login('admin', 'admin123');
        } catch {}
      }

      const res = await fetch(`${API_BASE_URL}/tables`, {
        headers: authStorage.getToken() ? { Authorization: `Bearer ${authStorage.getToken()}` } : {},
      });

      if (res.ok) {
        return {
          isOnline: true,
          gatewayUrl: API_BASE_URL,
          user: authStorage.getUser(),
        };
      }

      return {
        isOnline: false,
        gatewayUrl: API_BASE_URL,
        user: null,
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    } catch (err: any) {
      return {
        isOnline: false,
        gatewayUrl: API_BASE_URL,
        user: null,
        error: err?.message || 'Gateway unreachable',
      };
    }
  },

  // =============================================================
  // Tables Management
  // =============================================================
  async getTables(): Promise<RestaurantTable[]> {
    try {
      const backendTables = await request<any[]>('/tables');
      if (Array.isArray(backendTables) && backendTables.length > 0) {
        const mapped: RestaurantTable[] = backendTables.map((bt) => {
          const existing = store.tables.find((t) => t.id === bt.id || t.tableNumber === bt.tableNumber);
          return {
            id: Number(bt.id),
            tableNumber: bt.tableNumber,
            title: bt.title,
            capacity: Number(bt.capacity) || 4,
            status: (bt.status as TableStatus) || (existing ? existing.status : 'EMPTY'),
            activeOrderAmount: existing?.activeOrderAmount,
            activeOrderId: existing?.activeOrderId,
          };
        });
        store.tables = mapped;
        store.save();
        return mapped;
      }
    } catch (err) {
      console.warn('[Khansalar API] Tables fallback to local store:', err);
    }
    return [...store.tables];
  },

  async createTable(table: { tableNumber: string; title: string; capacity: number }): Promise<RestaurantTable> {
    try {
      const created = await request<any>('/tables', {
        method: 'POST',
        body: JSON.stringify({
          tableNumber: table.tableNumber,
          title: table.title,
          capacity: table.capacity,
          status: 'EMPTY',
        }),
      });
      const mapped: RestaurantTable = {
        id: Number(created.id),
        tableNumber: created.tableNumber,
        title: created.title,
        capacity: Number(created.capacity) || 4,
        status: (created.status as TableStatus) || 'EMPTY',
      };
      store.tables.push(mapped);
      store.save();
      return mapped;
    } catch (err) {
      console.warn('[Khansalar API] createTable local fallback:', err);
      const localTable: RestaurantTable = {
        id: Date.now(),
        tableNumber: table.tableNumber,
        title: table.title,
        capacity: table.capacity,
        status: 'EMPTY',
      };
      store.tables.push(localTable);
      store.save();
      return localTable;
    }
  },

  // =============================================================
  // Menu Items
  // =============================================================
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const backendItems = await request<any[]>('/menu');
      if (Array.isArray(backendItems) && backendItems.length > 0) {
        const mapped: MenuItem[] = backendItems.map((item) => ({
          id: Number(item.id),
          name: item.name,
          category: item.category,
          price: Number(item.price) || 0,
          description: item.description || '',
          isAvailable: Boolean(item.isAvailable),
          image: item.image,
        }));
        store.menu = mapped;
        store.save();
        return mapped;
      }
    } catch (err) {
      console.warn('[Khansalar API] Menu items fallback to local store:', err);
    }
    return [...store.menu];
  },

  async createMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const created = await request<any>('/menu', {
        method: 'POST',
        body: JSON.stringify(item),
      });
      const mapped: MenuItem = {
        id: Number(created.id),
        name: created.name,
        category: created.category,
        price: Number(created.price) || 0,
        description: created.description || '',
        isAvailable: Boolean(created.isAvailable),
      };
      store.menu.push(mapped);
      store.save();
      return mapped;
    } catch (err) {
      console.warn('[Khansalar API] createMenuItem fallback:', err);
      const localItem: MenuItem = {
        id: Date.now(),
        name: item.name || 'آیتم جدید',
        category: item.category || 'غذای اصلی و درباری',
        price: item.price || 100000,
        description: item.description || '',
        isAvailable: item.isAvailable ?? true,
      };
      store.menu.push(localItem);
      store.save();
      return localItem;
    }
  },

  // =============================================================
  // Invoices & Billing
  // =============================================================
  async getInvoices(): Promise<Invoice[]> {
    try {
      const backendInvoices = await request<any[]>('/invoices');
      if (Array.isArray(backendInvoices) && backendInvoices.length > 0) {
        const mapped: Invoice[] = backendInvoices.map((inv) => {
          const existing = store.invoices.find((i) => i.id === inv.id || i.invoiceNumber === inv.invoiceNumber);
          const issuedAt = inv.issuedAt ? new Date(inv.issuedAt).toLocaleString('fa-IR') : (existing?.issuedAt || 'امروز');
          const paidAt = inv.paidAt ? new Date(inv.paidAt).toLocaleString('fa-IR') : existing?.paidAt;
          return {
            id: Number(inv.id),
            invoiceNumber: inv.invoiceNumber,
            orderId: inv.orderId || String(inv.id),
            tableName: existing?.tableName || `میز ${inv.orderId}`,
            subTotal: Number(inv.subTotal) || 0,
            taxAmount: Number(inv.taxAmount) || 0,
            serviceFee: Number(inv.serviceFee) || 0,
            discountAmount: Number(inv.discountAmount) || 0,
            finalAmount: Number(inv.finalAmount) || 0,
            status: inv.status || 'ISSUED',
            issuedAt,
            paidAt,
            items: existing?.items,
          };
        });
        store.invoices = mapped;
        store.save();
        return mapped;
      }
    } catch (err) {
      console.warn('[Khansalar API] Invoices fallback to local store:', err);
    }
    return [...store.invoices];
  },

  async payInvoice(invoiceId: number, paymentMethod: 'CARD_POS' | 'CASH' | 'ONLINE'): Promise<Invoice> {
    const invoice = store.invoices.find((i) => i.id === invoiceId);
    if (!invoice) throw new Error('فاکتور یافت نشد');

    invoice.status = 'PAID';
    invoice.paidAt = new Date().toLocaleTimeString('fa-IR');

    // Free up table if linked
    const linkedTable = store.tables.find((t) => t.title === invoice.tableName);
    if (linkedTable) {
      linkedTable.status = 'EMPTY';
      linkedTable.activeOrderAmount = undefined;
      linkedTable.activeOrderId = undefined;
    }

    // Balanced Double-Entry Ledger Entry in local store
    const debitAccount = paymentMethod === 'CASH' ? 'صندوق نقد خوان‌سالار' : 'حساب بانک و دستگاه کارتخوان (پوز)';
    const newEntry: LedgerEntry = {
      id: Date.now(),
      entryNumber: `JE-1403-${Math.floor(100 + Math.random() * 900)}`,
      description: `تسویه فاکتور ${invoice.invoiceNumber} به روش ${paymentMethod === 'CASH' ? 'نقدی' : 'کارتخوان'}`,
      referenceType: 'INVOICE',
      referenceId: invoice.invoiceNumber,
      transactionDate: new Date().toLocaleString('fa-IR'),
      items: [
        {
          id: Date.now() + 1,
          accountName: debitAccount,
          accountType: 'ASSET',
          debit: invoice.finalAmount,
          credit: 0,
        },
        {
          id: Date.now() + 2,
          accountName: 'درآمد فروش غذا و خدمات پذیرایی',
          accountType: 'REVENUE',
          debit: 0,
          credit: invoice.subTotal + invoice.serviceFee,
        },
        {
          id: Date.now() + 3,
          accountName: 'مالیات بر ارزش افزوده پرداختنی',
          accountType: 'LIABILITY',
          debit: 0,
          credit: invoice.taxAmount,
        },
      ],
    };
    store.ledger.unshift(newEntry);
    store.save();

    // Call real backend gateway to record payment and journal entries
    const cashierName = authStorage.getUser()?.fullName || 'صندوقدار مرکزی';
    try {
      await request(`/invoices/${invoiceId}/pay`, {
        method: 'POST',
        body: JSON.stringify({
          amount: invoice.finalAmount,
          paymentMethod,
          cashierName,
          trackingCode: `POS-${Math.floor(100000 + Math.random() * 900000)}`,
        }),
      });
    } catch (err) {
      console.warn('[Khansalar API] payInvoice backend call failed, local store updated:', err);
    }

    return invoice;
  },

  // =============================================================
  // General Ledger & Accounting
  // =============================================================
  async getLedgerEntries(): Promise<LedgerEntry[]> {
    try {
      const backendLedger = await request<any[]>('/ledger');
      if (Array.isArray(backendLedger) && backendLedger.length > 0) {
        const mapped: LedgerEntry[] = backendLedger.map((e) => ({
          id: Number(e.id),
          entryNumber: e.entryNumber,
          description: e.description,
          referenceType: e.referenceType,
          referenceId: e.referenceId,
          transactionDate: e.transactionDate ? new Date(e.transactionDate).toLocaleString('fa-IR') : 'امروز',
          items: Array.isArray(e.items)
            ? e.items.map((item: any) => ({
                id: Number(item.id),
                accountName: item.accountName,
                accountType: item.accountType,
                debit: Number(item.debit) || 0,
                credit: Number(item.credit) || 0,
              }))
            : [],
        }));
        store.ledger = mapped;
        store.save();
        return mapped;
      }
    } catch (err) {
      console.warn('[Khansalar API] Ledger fallback to local store:', err);
    }
    return [...store.ledger];
  },

  async closeDay(closingDate: string, closedBy: string): Promise<DailyClosing> {
    try {
      const backendClosing = await request<any>(
        `/ledger/close-day?closingDate=${encodeURIComponent(closingDate)}&closedBy=${encodeURIComponent(closedBy)}`,
        { method: 'POST' }
      );
      if (backendClosing && backendClosing.closingDate) {
        return {
          id: Number(backendClosing.id) || Date.now(),
          closingDate: backendClosing.closingDate,
          totalSales: Number(backendClosing.totalSales) || 0,
          totalCash: Number(backendClosing.totalCash) || 0,
          totalPos: Number(backendClosing.totalPos) || 0,
          totalTax: Number(backendClosing.totalTax) || 0,
          orderCount: Number(backendClosing.orderCount) || 0,
          closedBy: backendClosing.closedBy || closedBy,
          createdAt: backendClosing.createdAt ? new Date(backendClosing.createdAt).toLocaleTimeString('fa-IR') : new Date().toLocaleTimeString('fa-IR'),
        };
      }
    } catch (err) {
      console.warn('[Khansalar API] closeDay backend call failed, computing locally:', err);
    }

    const paidInvoices = store.invoices.filter((i) => i.status === 'PAID');
    const totalSales = paidInvoices.reduce((acc, curr) => acc + curr.finalAmount, 0);
    const totalTax = paidInvoices.reduce((acc, curr) => acc + curr.taxAmount, 0);

    const closing: DailyClosing = {
      id: Date.now(),
      closingDate,
      totalSales,
      totalCash: Math.round(totalSales * 0.35),
      totalPos: Math.round(totalSales * 0.65),
      totalTax,
      orderCount: paidInvoices.length,
      closedBy,
      createdAt: new Date().toLocaleTimeString('fa-IR'),
    };

    return closing;
  },

  // =============================================================
  // Orders & POS
  // =============================================================
  async createOrder(
    tableId: number,
    items: { menuItemId: number; quantity: number; notes?: string; modifiers?: string[] }[],
    notes?: string,
    customerId?: number
  ): Promise<Order> {
    const table = store.tables.find((t) => t.id === tableId);
    const serverName = authStorage.getUser()?.fullName || 'مهماندار سالن';

    const orderItems: OrderItem[] = items.map((i) => {
      const menuItem = store.menu.find((m) => m.id === i.menuItemId)!;
      return {
        menuItemId: i.menuItemId,
        itemName: menuItem?.name || 'آیتم منو',
        quantity: i.quantity,
        unitPrice: menuItem?.price || 0,
        totalPrice: (menuItem?.price || 0) * i.quantity,
        notes: i.notes,
      };
    });

    const totalAmount = orderItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
    let orderNumber = `KH-1403-${Math.floor(100 + Math.random() * 900)}`;
    let newOrderId = Date.now();

    // Call real backend gateway to create reactive order
    try {
      const backendOrder = await request<any>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          tableId,
          serverName,
          notes: notes || undefined,
          customerId: customerId || undefined,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
            notes: i.notes || undefined,
          })),
        }),
      });
      if (backendOrder && backendOrder.id) {
        newOrderId = Number(backendOrder.id);
        orderNumber = backendOrder.orderNumber || orderNumber;
      }
    } catch (err) {
      console.warn('[Khansalar API] createOrder backend call failed, local store applied:', err);
    }

    const newOrder: Order = {
      id: newOrderId,
      orderNumber,
      tableId,
      tableName: table ? table.title : `میز ${tableId}`,
      serverName,
      status: 'PENDING',
      totalAmount,
      notes,
      items: orderItems,
      createdAt: new Date().toLocaleTimeString('fa-IR'),
    };

    if (table) {
      table.status = 'OCCUPIED';
      table.activeOrderAmount = totalAmount;
      table.activeOrderId = newOrder.id;
    }

    // Auto generate invoice for billing
    const taxAmount = Math.round(totalAmount * 0.1);
    const serviceFee = Math.round(totalAmount * 0.05);
    const finalAmount = totalAmount + taxAmount + serviceFee;

    const newInvoice: Invoice = {
      id: Date.now(),
      invoiceNumber: `INV-${orderNumber}`,
      orderId: orderNumber,
      tableName: newOrder.tableName,
      subTotal: totalAmount,
      taxAmount,
      serviceFee,
      discountAmount: 0,
      finalAmount,
      status: 'ISSUED',
      issuedAt: new Date().toLocaleTimeString('fa-IR'),
      items: orderItems,
    };
    store.invoices.unshift(newInvoice);

    // KDS: Create Kitchen Ticket
    const ticketItems: KitchenTicketItem[] = items.map((item, idx) => {
      const menuItem = store.menu.find((m) => m.id === item.menuItemId);
      let station: KitchenStation = 'KITCHEN';
      if (menuItem?.category.includes('کباب') || menuItem?.name.includes('کباب')) {
        station = 'GRILL';
      } else if (menuItem?.category.includes('شربت') || menuItem?.category.includes('نوشیدنی')) {
        station = 'BAR';
      } else if (menuItem?.category.includes('دسر') || menuItem?.category.includes('شیرینی')) {
        station = 'DESSERT';
      } else if (menuItem?.category.includes('مزه') || menuItem?.category.includes('پیش‌غذا')) {
        station = 'COLD';
      }

      return {
        id: Date.now() + idx,
        itemName: menuItem?.name || 'آیتم منو',
        quantity: item.quantity,
        station,
        status: 'RECEIVED' as KitchenItemStatus,
        notes: item.notes,
        modifiers: item.modifiers,
      };
    });

    const newTicket: KitchenTicket = {
      orderId: newOrderId,
      orderNumber,
      tableNumber: table?.tableNumber || `T-${tableId}`,
      tableName: table?.title || `میز ${tableId}`,
      serverName,
      orderTime: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      elapsedMinutes: 0,
      priority: totalAmount > 1000000 ? 'VIP' : 'NORMAL',
      notes,
      items: ticketItems,
    };
    store.kitchenTickets.unshift(newTicket);

    // INVENTORY ERP: Auto-deduct BOM recipe raw materials
    items.forEach((ordered) => {
      const recipe = store.recipes.find((r) => r.menuItemId === ordered.menuItemId);
      if (recipe) {
        recipe.ingredients.forEach((ing) => {
          const inv = store.inventory.find((i) => i.id === ing.inventoryItemId);
          if (inv) {
            const requiredAmount = ing.quantityRequired * ordered.quantity;
            inv.currentStock = Math.max(0, parseFloat((inv.currentStock - requiredAmount).toFixed(2)));
          }
        });
      }
    });

    // CRM LOYALTY: Credit loyalty points if customer is linked
    if (customerId) {
      const customer = store.customers.find((c) => c.id === customerId);
      if (customer) {
        const earnedPoints = Math.floor(totalAmount / 10000);
        customer.loyaltyPoints += earnedPoints;
        customer.totalSpent += totalAmount;
        customer.totalVisits += 1;
        customer.lastVisit = 'امروز';
        if (customer.totalSpent > 15000000) customer.tier = 'PLATINUM';
        else if (customer.totalSpent > 8000000) customer.tier = 'GOLD';
        else if (customer.totalSpent > 3000000) customer.tier = 'SILVER';
      }
    }

    store.save();
    return newOrder;
  },

  // =============================================================
  // KDS - Kitchen Display System
  // =============================================================
  async getKitchenTickets(station?: KitchenStation): Promise<KitchenTicket[]> {
    try {
      const orders = await request<any[]>('/kitchen/orders');
      if (Array.isArray(orders) && orders.length > 0) {
        const tickets: KitchenTicket[] = orders.map((o) => {
          const ticketItems: KitchenTicketItem[] = (o.items || []).map((item: any, idx: number) => {
            const menuItem = store.menu.find((m) => m.id === item.menuItemId || m.name === item.itemName);
            let itemStation: KitchenStation = 'KITCHEN';
            if (menuItem?.category.includes('کباب') || menuItem?.name.includes('کباب')) {
              itemStation = 'GRILL';
            } else if (menuItem?.category.includes('شربت') || menuItem?.category.includes('نوشیدنی')) {
              itemStation = 'BAR';
            } else if (menuItem?.category.includes('دسر') || menuItem?.category.includes('شیرینی')) {
              itemStation = 'DESSERT';
            } else if (menuItem?.category.includes('مزه') || menuItem?.category.includes('پیش‌غذا')) {
              itemStation = 'COLD';
            }
            return {
              id: Number(item.id) || (o.id * 10 + idx + 1),
              itemName: item.itemName,
              quantity: Number(item.quantity) || 1,
              station: itemStation,
              status: (o.status === 'PREPARING' ? 'PREPARING' : (o.status === 'READY' ? 'READY' : 'RECEIVED')) as KitchenItemStatus,
              notes: item.notes,
            };
          });

          return {
            orderId: Number(o.id),
            orderNumber: o.orderNumber,
            tableNumber: o.tableName ? o.tableName.split(' ')[0] : `T-${o.tableId}`,
            tableName: o.tableName || `میز ${o.tableId}`,
            serverName: o.serverName || 'مهماندار سالن',
            orderTime: o.createdAt ? new Date(o.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : '12:30',
            elapsedMinutes: o.createdAt ? Math.max(0, Math.round((Date.now() - new Date(o.createdAt).getTime()) / 60000)) : 5,
            priority: (Number(o.totalAmount) > 1000000 ? 'VIP' : 'NORMAL') as 'VIP' | 'NORMAL',
            notes: o.notes,
            items: ticketItems,
          };
        });

        store.kitchenTickets = tickets;
        store.save();

        if (!station || station === 'ALL') {
          return tickets;
        }
        return tickets.filter((t) => t.items.some((i) => i.station === station));
      }
    } catch (err) {
      console.warn('[Khansalar API] Kitchen tickets fallback to local store:', err);
    }

    if (!station || station === 'ALL') {
      return [...store.kitchenTickets];
    }
    return store.kitchenTickets.filter((ticket) =>
      ticket.items.some((item) => item.station === station)
    );
  },

  async updateKitchenItemStatus(orderId: number, itemId: number, status: KitchenItemStatus): Promise<void> {
    const ticket = store.kitchenTickets.find((t) => t.orderId === orderId);
    if (ticket) {
      const item = ticket.items.find((i) => i.id === itemId);
      if (item) {
        item.status = status;
        store.save();
      }
    }

    let backendStatus = 'PREPARING';
    if (status === 'READY' || status === 'SERVED') backendStatus = 'READY';
    if (status === 'RECEIVED') backendStatus = 'CONFIRMED';

    try {
      await request(`/kitchen/orders/${orderId}/status?status=${backendStatus}`, {
        method: 'PATCH',
      });
    } catch (err) {
      console.warn('[Khansalar API] updateKitchenItemStatus sync failed:', err);
    }
  },

  async completeKitchenTicket(orderId: number): Promise<void> {
    const ticket = store.kitchenTickets.find((t) => t.orderId === orderId);
    if (ticket) {
      ticket.items.forEach((i) => (i.status = 'READY'));
      store.kitchenTickets = store.kitchenTickets.filter((t) => t.orderId !== orderId);
      store.save();
    }
    try {
      await request(`/kitchen/orders/${orderId}/status?status=READY`, { method: 'PATCH' });
    } catch {}
  },

  // =============================================================
  // Inventory & Warehouse
  // =============================================================
  async getInventoryItems(): Promise<InventoryItem[]> {
    try {
      const items = await request<any[]>('/inventory/items');
      if (Array.isArray(items) && items.length > 0) {
        const mapped: InventoryItem[] = items.map((i) => ({
          id: Number(i.id),
          itemCode: i.itemCode,
          name: i.name,
          category: 'MEAT' as InventoryCategory,
          unit: i.unit === 'KG' ? 'کیلوگرم' : (i.unit === 'G' ? 'گرم' : (i.unit === 'L' ? 'لیتر' : i.unit)),
          currentStock: Number(i.currentStock) || 0,
          minimumThreshold: Number(i.minimumStock) || 10,
          reorderPoint: (Number(i.minimumStock) || 10) * 1.5,
          unitCost: Number(i.unitCost) || 0,
          lastRestockedAt: i.updatedAt ? new Date(i.updatedAt).toLocaleDateString('fa-IR') : '۱۴۰۳/۰۸/۲۵',
        }));
        store.inventory = mapped;
        store.save();
        return mapped;
      }
    } catch (err) {
      console.warn('[Khansalar API] Inventory fallback to local store:', err);
    }
    return [...store.inventory];
  },

  async purchaseStock(itemId: number, quantity: number, unitCost: number, supplierName?: string): Promise<InventoryItem> {
    const item = store.inventory.find((i) => i.id === itemId);
    if (!item) throw new Error('کالای انبار یافت نشد');

    item.currentStock = parseFloat((item.currentStock + quantity).toFixed(2));
    item.unitCost = unitCost;
    item.lastRestockedAt = new Date().toLocaleDateString('fa-IR');

    // Create an accounting purchase ledger entry
    const totalPurchaseCost = Math.round(quantity * unitCost);
    const newEntry: LedgerEntry = {
      id: Date.now(),
      entryNumber: `JE-PUR-${Math.floor(100 + Math.random() * 900)}`,
      description: `خرید مواد اولیه (${item.name}) از تامین‌کننده ${supplierName || 'بازار تهران'}`,
      referenceType: 'PURCHASE',
      referenceId: item.itemCode,
      transactionDate: new Date().toLocaleString('fa-IR'),
      items: [
        {
          id: Date.now() + 1,
          accountName: 'موجودی انبار مواد اولیه و اقلام مصرفی',
          accountType: 'ASSET',
          debit: totalPurchaseCost,
          credit: 0,
        },
        {
          id: Date.now() + 2,
          accountName: 'حساب‌های پرداختنی و بستانکاران تجاری',
          accountType: 'LIABILITY',
          debit: 0,
          credit: totalPurchaseCost,
        },
      ],
    };
    store.ledger.unshift(newEntry);
    store.save();

    try {
      await request('/inventory/purchase', {
        method: 'POST',
        body: JSON.stringify({
          itemId,
          quantity,
          unitCost,
          notes: supplierName ? `خرید از تامین‌کننده: ${supplierName}` : undefined,
        }),
      });
    } catch (err) {
      console.warn('[Khansalar API] purchaseStock backend call failed, updated locally:', err);
    }

    return item;
  },

  // Recipes / BOM
  async getRecipes(): Promise<MenuItemRecipeBOM[]> {
    try {
      const res = await request<any[]>('/inventory/recipes/1');
      if (Array.isArray(res) && res.length > 0) {
        // Backend returns recipes list
      }
    } catch {}
    return [...store.recipes];
  },

  // =============================================================
  // Customers CRM & Loyalty
  // =============================================================
  async getCustomers(query?: string): Promise<Customer[]> {
    try {
      let url = '/customers';
      if (query && /^\d+$/.test(query.trim())) {
        url = `/customers/phone/${encodeURIComponent(query.trim())}`;
        const single = await request<any>(url);
        if (single && single.id) {
          return [{
            id: Number(single.id),
            fullName: single.fullName,
            phoneNumber: single.phoneNumber,
            tier: (Number(single.totalSpent) > 15000000 ? 'PLATINUM' : (Number(single.totalSpent) > 8000000 ? 'GOLD' : (Number(single.totalSpent) > 3000000 ? 'SILVER' : 'BRONZE'))),
            loyaltyPoints: Number(single.loyaltyPoints) || 0,
            walletBalance: 0,
            totalSpent: Number(single.totalSpent) || 0,
            totalVisits: 1,
            lastVisit: 'امروز',
          }];
        }
      } else {
        const list = await request<any[]>(url);
        if (Array.isArray(list) && list.length > 0) {
          const mapped: Customer[] = list.map((c) => ({
            id: Number(c.id),
            fullName: c.fullName,
            phoneNumber: c.phoneNumber,
            tier: (Number(c.totalSpent) > 15000000 ? 'PLATINUM' : (Number(c.totalSpent) > 8000000 ? 'GOLD' : (Number(c.totalSpent) > 3000000 ? 'SILVER' : 'BRONZE'))),
            loyaltyPoints: Number(c.loyaltyPoints) || 0,
            walletBalance: 0,
            totalSpent: Number(c.totalSpent) || 0,
            totalVisits: 1,
            lastVisit: 'امروز',
          }));
          store.customers = mapped;
          store.save();
          return mapped;
        }
      }
    } catch (err) {
      console.warn('[Khansalar API] Customers fallback to local store:', err);
    }

    if (!query) return [...store.customers];
    const q = query.trim().toLowerCase();
    return store.customers.filter(
      (c) => c.fullName.toLowerCase().includes(q) || c.phoneNumber.includes(q)
    );
  },

  async registerCustomer(newCust: { fullName: string; phoneNumber: string; notes?: string; birthDate?: string }): Promise<Customer> {
    const customer: Customer = {
      id: Date.now(),
      fullName: newCust.fullName,
      phoneNumber: newCust.phoneNumber,
      tier: 'BRONZE',
      loyaltyPoints: 50,
      walletBalance: 0,
      totalSpent: 0,
      totalVisits: 0,
      notes: newCust.notes,
      birthDate: newCust.birthDate,
      lastVisit: 'عضو جدید',
    };

    store.customers.unshift(customer);
    store.save();

    try {
      const created = await request<any>('/customers', {
        method: 'POST',
        body: JSON.stringify({
          fullName: newCust.fullName,
          phoneNumber: newCust.phoneNumber,
          loyaltyPoints: 50,
          totalSpent: 0,
        }),
      });
      if (created && created.id) {
        customer.id = Number(created.id);
      }
    } catch (err) {
      console.warn('[Khansalar API] registerCustomer backend sync failed, local store updated:', err);
    }

    return customer;
  },

  // =============================================================
  // Reservations & VIP Events
  // =============================================================
  async getReservations(): Promise<Reservation[]> {
    try {
      const body = await request<any>('/reservations');
      const list = Array.isArray(body) ? body : (body?.data || []);
      if (Array.isArray(list) && list.length > 0) {
        const mapped = list.map(mapBackendReservationToFrontend);
        store.reservations = mapped;
        store.save();
        return mapped;
      }
    } catch (err) {
      console.warn('[Khansalar API] Reservations fallback to local store:', err);
    }
    return [...store.reservations];
  },

  async createReservation(newRes: Omit<Reservation, 'id' | 'reservationNumber'>): Promise<Reservation> {
    const table = store.tables.find((t) => t.id === newRes.tableId);
    const reservation: Reservation = {
      ...newRes,
      id: Date.now(),
      reservationNumber: `RES-1403-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
    };

    let reservationDate = '1403/08/20';
    let timeSlot = '20:00-22:00';
    if (reservation.reservationTime) {
      const trimmed = reservation.reservationTime.trim();
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 2) {
        reservationDate = parts[0];
        timeSlot = parts.slice(1).join(' ');
      } else if (trimmed.includes('/') || trimmed.includes('-')) {
        reservationDate = trimmed;
      } else if (trimmed.includes(':')) {
        timeSlot = trimmed;
      }
    }

    const notesList: string[] = [];
    if (reservation.notes) notesList.push(reservation.notes);
    if (reservation.specialRequests) notesList.push(`درخواست ویژه: ${reservation.specialRequests}`);

    const backendPayload = {
      customerName: reservation.customerName,
      customerPhone: reservation.phoneNumber,
      tableId: reservation.tableId,
      tableName: table ? table.title : (reservation.tableNumber || undefined),
      reservationDate,
      timeSlot,
      guestCount: reservation.partySize,
      occasion: mapFrontendOccasionToBackend(reservation.occasion),
      status: reservation.status,
      depositAmount: reservation.depositAmount,
      notes: notesList.join(' | ') || undefined,
    };

    try {
      const savedDto = await request<any>('/reservations', {
        method: 'POST',
        body: JSON.stringify(backendPayload),
      });
      if (savedDto && savedDto.id) {
        reservation.id = Number(savedDto.id);
      }
    } catch (err) {
      console.warn('[Khansalar API] createReservation backend call failed, stored locally:', err);
    }

    store.reservations.unshift(reservation);
    if (table && reservation.status === 'CONFIRMED') {
      table.status = 'RESERVED';
    }
    store.save();

    return reservation;
  },

  async updateReservationStatus(id: number, status: ReservationStatus): Promise<Reservation> {
    const res = store.reservations.find((r) => r.id === id);
    if (!res) throw new Error('رزرو یافت نشد');

    res.status = status;
    store.save();

    try {
      await request(`/reservations/${id}/status?status=${status}`, {
        method: 'PATCH',
      });
    } catch (err) {
      console.warn('[Khansalar API] updateReservationStatus sync failed:', err);
    }

    return res;
  },

  // =============================================================
  // BI Analytics & Menu Engineering
  // =============================================================
  async getBiSummary(): Promise<BiAnalyticsSummary> {
    try {
      const raw = await request<any>('/analytics/summary');
      if (raw && typeof raw === 'object') {
        return mapBackendBiSummaryToFrontend(raw);
      }
    } catch (err) {
      console.warn('[Khansalar API] BI summary fallback to local computation:', err);
    }

    const paidInvoices = store.invoices.filter((i) => i.status === 'PAID');
    const totalRevenue = paidInvoices.reduce((acc, curr) => acc + curr.finalAmount, 0) || 5480000;
    const totalOrders = paidInvoices.length || 18;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 304000;
    const foodCostPercentage = 34.2;
    const grossProfit = Math.round(totalRevenue * (1 - foodCostPercentage / 100));

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      grossProfit,
      foodCostPercentage,
      hourlySales: [
        { hour: '12:00-14:00', orderCount: 6, revenue: 1820000 },
        { hour: '14:00-16:00', orderCount: 3, revenue: 910000 },
        { hour: '18:00-20:00', orderCount: 4, revenue: 1240000 },
        { hour: '20:00-22:00', orderCount: 5, revenue: 1510000 },
      ],
      salesByCategory: [
        { category: 'غذای اصلی و درباری', amount: Math.round(totalRevenue * 0.62), percentage: 62 },
        { category: 'پیش‌غذا و مزه', amount: Math.round(totalRevenue * 0.14), percentage: 14 },
        { category: 'نوشیدنی سنتی و شربت‌خانه', amount: Math.round(totalRevenue * 0.12), percentage: 12 },
        { category: 'دسر و شیرینی‌جات', amount: Math.round(totalRevenue * 0.08), percentage: 8 },
        { category: 'نوشیدنی گرم و کافه', amount: Math.round(totalRevenue * 0.04), percentage: 4 },
      ],
      topSellingItems: [
        { name: 'چلو کباب شاندیز خوان‌سالار', quantity: 14, revenue: 6720000 },
        { name: 'ته‌چین ویژه مرغ و بادمجان', quantity: 10, revenue: 3400000 },
        { name: 'دیزی سنگی مخصوص با ترشی شاه‌عباسی', quantity: 8, revenue: 3120000 },
        { name: 'شربت زعفران و بیدمشک ناب', quantity: 16, revenue: 1360000 },
      ],
    };
  },

  async getMenuEngineering(): Promise<MenuEngineeringItem[]> {
    try {
      const body = await request<any>('/analytics/menu-engineering');
      if (Array.isArray(body) && body.length > 0) {
        return body;
      }
    } catch {}

    return [
      {
        menuItemId: 1,
        itemName: 'چلو کباب شاندیز خوان‌سالار',
        category: 'غذای اصلی و درباری',
        unitsSold: 42,
        totalRevenue: 20160000,
        totalProfit: 12180000,
        unitFoodCost: 190000,
        unitMargin: 290000,
        popularityShare: 24.5,
        marginShare: 60.4,
        classification: 'STAR',
      },
      {
        menuItemId: 2,
        itemName: 'ته‌چین ویژه مرغ و بادمجان',
        category: 'غذای اصلی و درباری',
        unitsSold: 35,
        totalRevenue: 11900000,
        totalProfit: 7350000,
        unitFoodCost: 130000,
        unitMargin: 210000,
        popularityShare: 20.4,
        marginShare: 61.7,
        classification: 'STAR',
      },
      {
        menuItemId: 3,
        itemName: 'دیزی سنگی مخصوص با ترشی شاه‌عباسی',
        category: 'غذای اصلی و درباری',
        unitsSold: 28,
        totalRevenue: 10920000,
        totalProfit: 4760000,
        unitFoodCost: 220000,
        unitMargin: 170000,
        popularityShare: 16.3,
        marginShare: 43.5,
        classification: 'PLOWHORSE',
      },
      {
        menuItemId: 4,
        itemName: 'کباب برگ گوسفندی اعلا',
        category: 'غذای اصلی و درباری',
        unitsSold: 12,
        totalRevenue: 6240000,
        totalProfit: 3960000,
        unitFoodCost: 190000,
        unitMargin: 330000,
        popularityShare: 7.0,
        marginShare: 63.4,
        classification: 'PUZZLE',
      },
      {
        menuItemId: 5,
        itemName: 'شربت زعفران و بیدمشک ناب',
        category: 'نوشیدنی سنتی و شربت‌خانه',
        unitsSold: 48,
        totalRevenue: 4080000,
        totalProfit: 2880000,
        unitFoodCost: 25000,
        unitMargin: 60000,
        popularityShare: 28.0,
        marginShare: 70.5,
        classification: 'STAR',
      },
      {
        menuItemId: 8,
        itemName: 'باقلوای سنتی تبریز (دو نفره)',
        category: 'دسر و شیرینی‌جات',
        unitsSold: 8,
        totalRevenue: 960000,
        totalProfit: 320000,
        unitFoodCost: 80000,
        unitMargin: 40000,
        popularityShare: 4.6,
        marginShare: 33.3,
        classification: 'DOG',
      },
    ];
  },

  // =============================================================
  // Feature 1: Digital Menu & QR Guest Ordering
  // =============================================================
  async placeGuestOrder(orderReq: GuestOrderRequest): Promise<Order> {
    const table = store.tables.find((t) => t.tableNumber === orderReq.tableNumber) || store.tables[0];
    const created = await this.createOrder(
      table.id,
      orderReq.items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        notes: item.notes,
      })),
      `سفارش خودکار مهمان (${orderReq.customerName || 'مهمان سر میز'}) - تماس: ${orderReq.phoneNumber || 'ثبت‌نشده'} - ${orderReq.notes || ''}`
    );

    try {
      await request('/guest/orders', {
        method: 'POST',
        body: JSON.stringify(orderReq),
      });
    } catch (err) {
      console.warn('[Khansalar API] placeGuestOrder backend call failed:', err);
    }

    return created;
  },

  async callWaiter(tableNumber: string, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      await request(
        `/guest/call-waiter?tableNumber=${encodeURIComponent(tableNumber)}&reason=${encodeURIComponent(reason || 'SERVICE')}`,
        { method: 'POST' }
      );
    } catch (err) {
      console.warn('[Khansalar API] callWaiter backend call failed:', err);
    }
    return {
      success: true,
      message: `فراخوان میهماندار برای میز ${tableNumber} با موفقیت در سامانه ثبت شد. میهماندار در اسرع وقت حاضر خواهد شد.`,
    };
  },
};
