import type {
  RestaurantTable,
  MenuItem,
  Order,
  Invoice,
  LedgerEntry,
  DailyClosing,
  KitchenTicket,
  KitchenStation,
  KitchenItemStatus,
  InventoryItem,
  MenuItemRecipeBOM,
  Customer,
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api/v1';

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
  {
    orderId: 103,
    orderNumber: 'KH-1403-103',
    tableNumber: 'T-05',
    tableName: 'تخت سنتی آب‌نما',
    serverName: 'امیرحسین باقری',
    orderTime: '۱۳:۳۵',
    elapsedMinutes: 2,
    priority: 'NORMAL',
    items: [
      {
        id: 1031,
        itemName: 'شربت سکنجبین و خیار سکه‌ای',
        quantity: 2,
        station: 'BAR',
        status: 'RECEIVED',
      },
      {
        id: 1032,
        itemName: 'باقلوای سنتی تبریز (دو نفره)',
        quantity: 1,
        station: 'DESSERT',
        status: 'RECEIVED',
      },
      {
        id: 1033,
        itemName: 'ماست و خیار مجلسی با گل سرخ',
        quantity: 1,
        station: 'COLD',
        status: 'RECEIVED',
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
    minimumThreshold: 8.0, // Alert: Low stock!
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
  {
    id: 5,
    itemCode: 'RAW-YOG-01',
    name: 'ماست چکیده کوزه محلی',
    category: 'DAIRY',
    unit: 'کیلوگرم',
    currentStock: 4.5,
    minimumThreshold: 5.0, // Alert: Low stock!
    reorderPoint: 10.0,
    unitCost: 75000,
    lastRestockedAt: '۱۴۰۳/۰۷/۲۴',
  },
  {
    id: 6,
    itemCode: 'RAW-PIST-01',
    name: 'خلال پسته سبز اکبری',
    category: 'DRY_GOODS',
    unit: 'کیلوگرم',
    currentStock: 3.8,
    minimumThreshold: 2.0,
    reorderPoint: 4.0,
    unitCost: 1200000,
    lastRestockedAt: '۱۴۰۳/۰۷/۱۸',
  },
  {
    id: 7,
    itemCode: 'RAW-DIST-01',
    name: 'گلاب دوآتشه اصل کاشان',
    category: 'BEVERAGE',
    unit: 'لیتر',
    currentStock: 12.0,
    minimumThreshold: 5.0,
    reorderPoint: 8.0,
    unitCost: 180000,
    lastRestockedAt: '۱۴۰۳/۰۷/۲۱',
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
  {
    menuItemId: 2,
    menuItemName: 'ته‌چین ویژه مرغ و بادمجان',
    sellingPrice: 340000,
    foodCost: 138500,
    foodCostPercentage: 40.7,
    profitMargin: 201500,
    ingredients: [
      { id: 4, menuItemId: 2, inventoryItemId: 2, ingredientName: 'فیله مرغ گرم کشتار روز', quantityRequired: 0.28, unit: 'کیلوگرم', unitCost: 195000, totalCost: 54600 },
      { id: 5, menuItemId: 2, inventoryItemId: 4, ingredientName: 'برنج طارم هاشمی دودی اعلا', quantityRequired: 0.22, unit: 'کیلوگرم', unitCost: 145000, totalCost: 31900 },
      { id: 6, menuItemId: 2, inventoryItemId: 5, ingredientName: 'ماست چکیده کوزه محلی', quantityRequired: 0.15, unit: 'کیلوگرم', unitCost: 75000, totalCost: 11250 },
      { id: 7, menuItemId: 2, inventoryItemId: 6, ingredientName: 'خلال پسته سبز اکبری', quantityRequired: 0.02, unit: 'کیلوگرم', unitCost: 1200000, totalCost: 24000 },
      { id: 8, menuItemId: 2, inventoryItemId: 3, ingredientName: 'زعفران سرگل ممتاز قائنات', quantityRequired: 0.15, unit: 'گرم', unitCost: 110000, totalCost: 16500 },
    ],
  },
  {
    menuItemId: 5,
    menuItemName: 'شربت زعفران و بیدمشک ناب',
    sellingPrice: 85000,
    foodCost: 26500,
    foodCostPercentage: 31.1,
    profitMargin: 58500,
    ingredients: [
      { id: 9, menuItemId: 5, inventoryItemId: 7, ingredientName: 'گلاب دوآتشه اصل کاشان', quantityRequired: 0.05, unit: 'لیتر', unitCost: 180000, totalCost: 9000 },
      { id: 10, menuItemId: 5, inventoryItemId: 3, ingredientName: 'زعفران سرگل ممتاز قائنات', quantityRequired: 0.1, unit: 'گرم', unitCost: 110000, totalCost: 11000 },
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
  {
    id: 3,
    fullName: 'امیرحسین پارسا',
    phoneNumber: '09358889900',
    tier: 'SILVER',
    loyaltyPoints: 310,
    walletBalance: 0,
    totalSpent: 4200000,
    totalVisits: 4,
    notes: 'مشتری جلسات کاری نیمه‌وقت',
    lastVisit: '۱۴۰۳/۰۷/۱۸',
  },
  {
    id: 4,
    fullName: 'مریم کمالی',
    phoneNumber: '09194445566',
    tier: 'BRONZE',
    loyaltyPoints: 95,
    walletBalance: 0,
    totalSpent: 1350000,
    totalVisits: 1,
    lastVisit: '۱۴۰۳/۰۷/۲۵',
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

  constructor() {
    const saved = localStorage.getItem('khansalar_local_store_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.tables = parsed.tables || INITIAL_TABLES;
        this.invoices = parsed.invoices || INITIAL_INVOICES;
        this.ledger = parsed.ledger || INITIAL_LEDGER;
        this.kitchenTickets = parsed.kitchenTickets || INITIAL_KITCHEN_TICKETS;
        this.inventory = parsed.inventory || INITIAL_INVENTORY_ITEMS;
        this.recipes = parsed.recipes || INITIAL_RECIPES;
        this.customers = parsed.customers || INITIAL_CUSTOMERS;
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
        invoices: this.invoices,
        ledger: this.ledger,
        kitchenTickets: this.kitchenTickets,
        inventory: this.inventory,
        recipes: this.recipes,
        customers: this.customers,
      })
    );
  }
}

export const store = new KhansalarStore();

export const api = {
  // Tables
  async getTables(): Promise<RestaurantTable[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/tables`);
      if (res.ok) return await res.json();
    } catch {}
    return [...store.tables];
  },

  // Menu
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/menu`);
      if (res.ok) return await res.json();
    } catch {}
    return [...store.menu];
  },

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/invoices`);
      if (res.ok) return await res.json();
    } catch {}
    return [...store.invoices];
  },

  // General Ledger
  async getLedgerEntries(): Promise<LedgerEntry[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/ledger`);
      if (res.ok) return await res.json();
    } catch {}
    return [...store.ledger];
  },

  // Orders creation with real-time KDS, Inventory BOM Deduction & Customer Loyalty
  async createOrder(
    tableId: number,
    items: { menuItemId: number; quantity: number; notes?: string; modifiers?: string[] }[],
    notes?: string,
    customerId?: number
  ): Promise<Order> {
    const table = store.tables.find((t) => t.id === tableId);
    const orderItems = items.map((i) => {
      const menuItem = store.menu.find((m) => m.id === i.menuItemId)!;
      return {
        menuItemId: i.menuItemId,
        itemName: menuItem.name,
        quantity: i.quantity,
        unitPrice: menuItem.price,
        totalPrice: menuItem.price * i.quantity,
        notes: i.notes,
      };
    });

    const totalAmount = orderItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const orderNumber = `KH-1403-${Math.floor(100 + Math.random() * 900)}`;
    const newOrderId = Date.now();

    const newOrder: Order = {
      id: newOrderId,
      orderNumber,
      tableId,
      tableName: table ? table.title : `میز ${tableId}`,
      serverName: 'مهماندار سالن',
      status: 'PENDING',
      totalAmount,
      notes,
      items: orderItems,
      createdAt: new Date().toLocaleTimeString('fa-IR'),
    };

    // Update table
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
    const ticketItems = items.map((item, idx) => {
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
      serverName: 'مهماندار سالن',
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
        const earnedPoints = Math.floor(totalAmount / 10000); // 1 point per 10,000 Tomans
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

    // Call real backend gateway if available
    try {
      fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, items, notes, serverName: 'سالندار', customerId }),
      }).catch(() => {});
    } catch {}

    return newOrder;
  },

  // Pay invoice & balance accounting ledger
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

    // Create balanced Double-Entry Ledger Entry
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

    // Call backend
    try {
      fetch(`${API_BASE_URL}/invoices/${invoiceId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: invoice.finalAmount,
          paymentMethod,
          cashierName: 'صندوقدار مرکزی',
        }),
      }).catch(() => {});
    } catch {}

    return invoice;
  },

  // Daily Closing / Z-Report
  async closeDay(closingDate: string, closedBy: string): Promise<DailyClosing> {
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

  // KDS - Kitchen Display System
  async getKitchenTickets(station?: KitchenStation): Promise<KitchenTicket[]> {
    try {
      const url = station && station !== 'ALL' ? `${API_BASE_URL}/kitchen?station=${station}` : `${API_BASE_URL}/kitchen`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {}

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
    try {
      await fetch(`${API_BASE_URL}/kitchen/${orderId}/items/${itemId}/status?status=${status}`, {
        method: 'PUT',
      });
    } catch {}
  },

  async completeKitchenTicket(orderId: number): Promise<void> {
    const ticket = store.kitchenTickets.find((t) => t.orderId === orderId);
    if (ticket) {
      ticket.items.forEach((i) => (i.status = 'READY'));
      store.kitchenTickets = store.kitchenTickets.filter((t) => t.orderId !== orderId);
      store.save();
    }
    try {
      await fetch(`${API_BASE_URL}/kitchen/${orderId}/complete`, { method: 'POST' });
    } catch {}
  },

  // Inventory & Warehouse
  async getInventoryItems(): Promise<InventoryItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/inventory`);
      if (res.ok) return await res.json();
    } catch {}
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
      await fetch(`${API_BASE_URL}/inventory/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity, unitCost, supplierName }),
      });
    } catch {}

    return item;
  },

  // Recipes / BOM
  async getRecipes(): Promise<MenuItemRecipeBOM[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/inventory/recipes`);
      if (res.ok) return await res.json();
    } catch {}
    return [...store.recipes];
  },

  // Customers CRM & Loyalty
  async getCustomers(query?: string): Promise<Customer[]> {
    try {
      const url = query ? `${API_BASE_URL}/customers?search=${encodeURIComponent(query)}` : `${API_BASE_URL}/customers`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {}

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
      loyaltyPoints: 50, // Welcome gift points
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
      await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });
    } catch {}

    return customer;
  },
};
