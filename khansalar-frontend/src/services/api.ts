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
  Reservation,
  ReservationStatus,
  OccasionType,
  BiAnalyticsSummary,
  HourlySalesPoint,
  CategorySalesPoint,
  TopSellingItemPoint,
  MenuEngineeringItem,
  GuestOrderRequest,
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
  {
    id: 3,
    reservationNumber: 'RES-1403-103',
    customerName: 'جناب مهندس کیانی (شرکت فناوری پارس)',
    phoneNumber: '09125556677',
    partySize: 12,
    tableId: 3,
    tableNumber: 'T-03',
    reservationTime: '1403/08/21 13:00',
    status: 'PENDING',
    occasion: 'BUSINESS',
    depositAmount: 0,
    depositPaid: false,
    specialRequests: 'جلسه ناهار کاری، نیاز به فضای آرام و سالن مجزا',
    notes: 'پیش‌فاکتور ارسال شده و منتظر تایید واریز بیعانه',
    createdAt: '1403/08/20 09:15',
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

  // Map hourlySales from array or from hourlyOrderDensity Map
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

  // Map salesByCategory from array
  let salesByCategory: CategorySalesPoint[] = [];
  if (Array.isArray(raw.salesByCategory) && raw.salesByCategory.length > 0) {
    salesByCategory = raw.salesByCategory.map((c: any) => ({
      category: String(c?.category || ''),
      amount: Number(c?.amount) || 0,
      percentage: Number(c?.percentage) || 0,
    }));
  }

  // Map topSellingItems from topSellingItems or topStars
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

  // -------------------------------------------------------------
  // Feature 2: Advanced Reservations & VIP Events
  // -------------------------------------------------------------
  async getReservations(): Promise<Reservation[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/reservations`);
      if (res.ok) {
        const body = await res.json();
        const list = Array.isArray(body) ? body : (body?.data || []);
        if (Array.isArray(list) && list.length > 0) {
          return list.map(mapBackendReservationToFrontend);
        }
      }
    } catch (err) {
      console.warn('Could not fetch reservations from backend API, using local store:', err);
    }
    return [...store.reservations];
  },

  async createReservation(resData: Partial<Reservation>): Promise<Reservation> {
    const newId = Date.now();
    const reservationNumber = `RES-1403-${Math.floor(100 + Math.random() * 900)}`;
    const table = store.tables.find((t) => t.id === resData.tableId);

    const reservation: Reservation = {
      id: newId,
      reservationNumber,
      customerName: resData.customerName || 'مهمان خوان‌سالار',
      phoneNumber: resData.phoneNumber || '',
      partySize: resData.partySize || 2,
      tableId: resData.tableId,
      tableNumber: resData.tableNumber || (table ? table.tableNumber : undefined),
      reservationTime: resData.reservationTime || '1403/08/20 20:00',
      status: resData.status || 'CONFIRMED',
      occasion: resData.occasion || 'NORMAL',
      depositAmount: resData.depositAmount || 0,
      depositPaid: resData.depositPaid ?? (resData.depositAmount ? true : false),
      specialRequests: resData.specialRequests,
      notes: resData.notes,
      createdAt: new Date().toISOString(),
    };

    // Extract reservationDate and timeSlot from reservationTime
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

    // Strictly map to backend ReservationDto contract
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

    const res = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendPayload),
    });

    if (!res.ok) {
      let errorMessage = `Failed to create reservation (HTTP ${res.status}: ${res.statusText})`;
      try {
        const errorData = await res.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch {}
      console.error('Reservation creation rejected by backend:', errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const body = await res.json();
      const savedDto = body?.data || body;
      if (savedDto && savedDto.id) {
        reservation.id = savedDto.id;
      }
    } catch {}

    store.reservations.unshift(reservation);
    if (table && reservation.status === 'CONFIRMED') {
      table.status = 'RESERVED';
    }
    store.save();

    return reservation;
  },

  async updateReservationStatus(id: number, status: ReservationStatus): Promise<Reservation | null> {
    const res = store.reservations.find((r) => r.id === id);
    if (!res) return null;
    res.status = status;

    if (res.tableId) {
      const table = store.tables.find((t) => t.id === res.tableId);
      if (table) {
        if (status === 'SEATED') {
          table.status = 'OCCUPIED';
        } else if (status === 'CANCELLED' || status === 'NO_SHOW') {
          table.status = 'EMPTY';
        } else if (status === 'CONFIRMED') {
          table.status = 'RESERVED';
        }
      }
    }
    store.save();

    try {
      const resp = await fetch(`${API_BASE_URL}/reservations/${id}/status?status=${status}`, {
        method: 'PATCH',
      });
      if (!resp.ok) {
        console.error(`Failed to update reservation status: HTTP ${resp.status}`);
      }
    } catch (err) {
      console.warn('Could not sync reservation status to backend:', err);
    }

    return res;
  },

  // -------------------------------------------------------------
  // Feature 4: BI Executive Dashboard & Menu Engineering Matrix
  // -------------------------------------------------------------
  async getBiSummary(): Promise<BiAnalyticsSummary> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/summary`);
      if (res.ok) {
        const body = await res.json();
        const raw = body?.data || body;
        if (raw && typeof raw === 'object') {
          return mapBackendBiSummaryToFrontend(raw);
        }
      }
    } catch (err) {
      console.warn('Could not fetch BI summary from backend API, using local fallback:', err);
    }

    const paidInvoices = store.invoices.filter((i) => i.status === 'PAID');
    const totalRevenue = paidInvoices.reduce((acc, curr) => acc + curr.finalAmount, 0) || 5480000;
    const totalOrders = paidInvoices.length || 12;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const totalFoodCost = Math.round(totalRevenue * 0.324);
    const grossProfit = totalRevenue - totalFoodCost;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: avgOrderValue,
      grossProfit,
      foodCostPercentage: 32.4,
      hourlySales: [
        { hour: '۱۲:۰۰', orderCount: 2, revenue: 840000 },
        { hour: '۱۳:۰۰', orderCount: 5, revenue: 2150000 },
        { hour: '۱۴:۰۰', orderCount: 4, revenue: 1680000 },
        { hour: '۱۵:۰۰', orderCount: 1, revenue: 390000 },
        { hour: '۱۹:۰۰', orderCount: 3, revenue: 1250000 },
        { hour: '۲۰:۰۰', orderCount: 7, revenue: 3420000 },
        { hour: '۲۱:۰۰', orderCount: 8, revenue: 4180000 },
        { hour: '۲۲:۰۰', orderCount: 4, revenue: 1950000 },
      ],
      salesByCategory: [
        { category: 'غذای اصلی و درباری', amount: 9800000, percentage: 62 },
        { category: 'پیش‌غذا و مزه', amount: 2100000, percentage: 14 },
        { category: 'نوشیدنی سنتی و شربت‌خانه', amount: 1850000, percentage: 12 },
        { category: 'دسر و شیرینی‌جات', amount: 1200000, percentage: 8 },
        { category: 'نوشیدنی گرم و کافه', amount: 650000, percentage: 4 },
      ],
      topSellingItems: [
        { name: 'چلو کباب شاندیز خوان‌سالار', quantity: 18, revenue: 8640000 },
        { name: 'ته‌چین ویژه مرغ و بادمجان', quantity: 14, revenue: 4760000 },
        { name: 'کباب برگ گوسفندی اعلا', quantity: 11, revenue: 5720000 },
        { name: 'دیزی سنگی مخصوص با ترشی', quantity: 9, revenue: 3510000 },
        { name: 'شربت زعفران و بیدمشک ناب', quantity: 24, revenue: 2040000 },
      ],
    };
  },

  async getMenuEngineering(): Promise<MenuEngineeringItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/menu-engineering`);
      if (res.ok) {
        const body = await res.json();
        return body.data || body;
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
      {
        menuItemId: 9,
        itemName: 'ماست و خیار مجلسی با گل سرخ',
        category: 'پیش‌غذا و مزه',
        unitsSold: 30,
        totalRevenue: 1950000,
        totalProfit: 1200000,
        unitFoodCost: 25000,
        unitMargin: 40000,
        popularityShare: 17.5,
        marginShare: 61.5,
        classification: 'PLOWHORSE',
      },
    ];
  },

  // -------------------------------------------------------------
  // Feature 1: Digital Menu & QR Guest Ordering
  // -------------------------------------------------------------
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
      await fetch(`${API_BASE_URL}/guest/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderReq),
      });
    } catch {}

    return created;
  },

  async callWaiter(tableNumber: string, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      await fetch(`${API_BASE_URL}/guest/call-waiter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber, reason }),
      });
    } catch {}
    return {
      success: true,
      message: `فراخوان میهماندار برای میز ${tableNumber} با موفقیت در سامانه ثبت شد. میهماندار در اسرع وقت حاضر خواهد شد.`,
    };
  },
};
