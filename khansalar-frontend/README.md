# Khansalar Frontend (خوان‌سالار)

Modern, high-performance Single Page Application (SPA) for the Khansalar Enterprise Restaurant ERP & POS System.

## Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS with authentic Persian royal theme palette
- **Icons:** Lucide React & custom SVG Persian cultural symbols (Shamseh, Boteh Jegheh, Shah Abbasi)
- **Audio:** Web Audio API synthesized cashier sound effects (zero external audio files)
- **State & Data:** Unified REST API client with full offline `localStorage` fallback

## Available Functional Modules (Hotkeys)
- **F1 - Floor Plan (نقشه سالن):** Live tables, status badges, stay duration timer, and QR digital menu stand generator.
- **F2 - POS & Cashier (سفارش‌گیری):** Rapid menu item selection, modifier notes, and cart management.
- **F3 - Invoices (صندوق و فاکتورها):** Check settlement, payment processing (Card POS / Cash / Online), split-bill calculator, and thermal receipts.
- **F4 - Kitchen Display System - KDS (آشپزخانه):** Real-time ticket dispatching to Grill, Hot Kitchen, Traditional Syrups & Bar, and Dessert stations.
- **F5 - Inventory & Recipe BOM (انبارداری):** Raw material inventory, recipe formulations (BOM), and purchase orders.
- **F6 - CRM & Loyalty Club (باشگاه مشتریان):** 4-tier customer loyalty program (Bronze, Silver, Gold, Platinum) with points and digital wallet.
- **F7 - General Ledger (دفتر کل مالی):** GAAP-compliant double-entry accounting and daily cashier closing (Z-report).
- **F8 - Reservations (رزرواسیون):** VIP and table booking engine, occasion tagging (Birthday, Business, Anniversary, VIP), and deposit management.
- **F9 - Business Intelligence (هوش تجاری):** BCG / Kasavana & Smith menu engineering matrix, hourly traffic heatmap, and gross margin analysis.

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
