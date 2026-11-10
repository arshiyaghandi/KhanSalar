package com.khansalar.common.enums;

public enum StockTransactionType {
    PURCHASE,      // ورود کالا و خرید مواد اولیه
    CONSUMPTION,   // کسر خودکار با سفارش غذا (فرمولاسیون / BOM)
    WASTE,         // ضایعات و دورریز
    ADJUSTMENT     // تعدیل انبارگردانی
}
