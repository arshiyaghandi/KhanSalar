import React, { useEffect, useState, useCallback } from 'react';
import { Navbar, type NavTabType } from './components/Navbar';
import { TableFloorPlan } from './components/TableFloorPlan';
import { OrderPosView } from './components/OrderPosView';
import { InvoiceView } from './components/InvoiceView';
import { AccountingLedgerView } from './components/AccountingLedgerView';
import { KitchenDisplayView } from './components/KitchenDisplayView';
import { InventoryView } from './components/InventoryView';
import { CustomersView } from './components/CustomersView';
import { ReservationView } from './components/ReservationView';
import { AnalyticsBiView } from './components/AnalyticsBiView';
import { api } from './services/api';
import type { RestaurantTable, MenuItem, Invoice, LedgerEntry, DailyClosing } from './types';
import { soundManager } from './utils/soundEffects';
import { ShamsehStar } from './components/GirihOrnament';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTabType>('tables');
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [posTableId, setPosTableId] = useState<number | undefined>(undefined);
  const [invoiceFilterTable, setInvoiceFilterTable] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ERP Badges
  const [kdsCount, setKdsCount] = useState<number>(0);
  const [lowStockCount, setLowStockCount] = useState<number>(0);
  const [reservationCount, setReservationCount] = useState<number>(0);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [t, m, inv, led, tickets, inventory, reservations] = await Promise.all([
        api.getTables(),
        api.getMenuItems(),
        api.getInvoices(),
        api.getLedgerEntries(),
        api.getKitchenTickets(),
        api.getInventoryItems(),
        api.getReservations(),
      ]);
      setTables(t);
      setMenu(m);
      setInvoices(inv);
      setLedgerEntries(led);
      setKdsCount(tickets.length);
      setLowStockCount(inventory.filter((i) => i.currentStock <= i.minimumThreshold).length);
      setReservationCount(reservations.filter((r) => r.status === 'CONFIRMED' || r.status === 'PENDING').length);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Global Keyboard Shortcuts for Fast POS & ERP Operation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        soundManager.playClick();
        setActiveTab('tables');
      } else if (e.key === 'F2') {
        e.preventDefault();
        soundManager.playClick();
        setActiveTab('pos');
      } else if (e.key === 'F3') {
        e.preventDefault();
        soundManager.playClick();
        setActiveTab('invoices');
      } else if (e.key === 'F4') {
        e.preventDefault();
        soundManager.playClick();
        setActiveTab('kds');
      } else if (e.key === 'F5') {
        e.preventDefault();
        soundManager.playClick();
        setActiveTab('inventory');
      } else if (e.key === 'F6') {
        e.preventDefault();
        soundManager.playClick();
        setActiveTab('customers');
      } else if (e.key === 'F7') {
        e.preventDefault();
        soundManager.playClick();
        setActiveTab('ledger');
      } else if (e.key === 'F8') {
        e.preventDefault();
        soundManager.playClick();
        setActiveTab('reservations');
      } else if (e.key === 'F9') {
        e.preventDefault();
        soundManager.playClick();
        setActiveTab('analytics');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTableForOrder = (tableId: number) => {
    setPosTableId(tableId);
    setActiveTab('pos');
  };

  const handleViewInvoiceForTable = (tableName: string) => {
    setInvoiceFilterTable(tableName);
    setActiveTab('invoices');
  };

  const handleOrderCreated = async (
    tableId: number,
    items: { menuItemId: number; quantity: number; notes?: string }[],
    notes?: string,
    customerId?: number
  ) => {
    await api.createOrder(tableId, items, notes, customerId);
    await loadData();
    // Prompt kitchen alert
    soundManager.playKitchenAlert();
    // Switch to KDS or invoices to monitor progress
    setActiveTab('kds');
  };

  const handlePayInvoice = async (invoiceId: number, method: 'CARD_POS' | 'CASH' | 'ONLINE') => {
    await api.payInvoice(invoiceId, method);
    await loadData();
  };

  const handleCloseDay = async (date: string, closedBy: string): Promise<DailyClosing> => {
    const report = await api.closeDay(date, closedBy);
    await loadData();
    return report;
  };

  const unpaidCount = invoices.filter((i) => i.status === 'ISSUED').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#050e1f] text-slate-100 girih-pattern selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unpaidCount={unpaidCount}
        kdsCount={kdsCount}
        lowStockCount={lowStockCount}
        reservationCount={reservationCount}
        isLoading={isLoading}
        onRefresh={() => {
          soundManager.playClick();
          loadData();
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {isLoading && tables.length === 0 ? (
          <div className="py-24 text-center">
            <ShamsehStar size={48} className="mx-auto mb-4 animate-spin text-khansalar-gold" />
            <p className="text-sm text-slate-300 font-bold">در حال بارگذاری اطلاعات سامانه خوان‌سالار...</p>
          </div>
        ) : (
          <div className="page-transition">
            {activeTab === 'tables' && (
              <TableFloorPlan
                tables={tables}
                menu={menu}
                onSelectTableForOrder={handleSelectTableForOrder}
                onViewInvoiceForTable={handleViewInvoiceForTable}
                onOrderPlaced={loadData}
              />
            )}

            {activeTab === 'pos' && (
              <OrderPosView
                tables={tables}
                menu={menu}
                initialTableId={posTableId}
                onOrderCreated={handleOrderCreated}
              />
            )}

            {activeTab === 'invoices' && (
              <InvoiceView
                invoices={invoices}
                selectedTableName={invoiceFilterTable}
                onPayInvoice={handlePayInvoice}
              />
            )}

            {activeTab === 'kds' && <KitchenDisplayView />}

            {activeTab === 'inventory' && <InventoryView />}

            {activeTab === 'customers' && <CustomersView />}

            {activeTab === 'ledger' && (
              <AccountingLedgerView
                ledgerEntries={ledgerEntries}
                onCloseDay={handleCloseDay}
              />
            )}

            {activeTab === 'reservations' && (
              <ReservationView
                tables={tables}
                onReservationUpdated={loadData}
              />
            )}

            {activeTab === 'analytics' && <AnalyticsBiView />}
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-slate-800/50 bg-[#040c1c]/80 py-2.5 px-4 text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-medium text-slate-400">سامانه خوان‌سالار</span>
          <span className="text-slate-500 hidden sm:inline">طراحی بومی ایرانی • نقوش شاه‌عباسی و شمسه</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
