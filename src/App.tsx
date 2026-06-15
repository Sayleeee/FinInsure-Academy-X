import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Catalog } from './pages/Catalog';
import { ProductMatrix } from './pages/ProductMatrix';
import { Applications } from './pages/Applications';
import { Switching } from './pages/Switching';
import { CRM } from './pages/CRM';
import { Communication } from './pages/Communication';
import { Calendar } from './pages/Calendar';
import { Customers } from './pages/Customers';
import { SalesCockpitPage } from './pages/SalesCockpitPage';
import { UsersRoles } from './pages/UsersRoles';
import { I18nProvider } from './lib/i18n';
import { NotImplementedProvider } from './lib/NotImplementedContext';
import { CrmProvider } from './lib/CrmContext';

export default function App() {
  return (
    <I18nProvider>
      <NotImplementedProvider>
        <CrmProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="applications" element={<Applications />} />
                <Route path="switching" element={<Switching />} />
                <Route path="crm" element={<CRM />} />
                <Route path="communication" element={<Communication />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="customers" element={<Customers />} />
                <Route path="products" element={<ProductMatrix />} />
                <Route path="sales-cockpit" element={<SalesCockpitPage />} />
                <Route path="catalog" element={<Catalog />} />
                <Route path="users" element={<UsersRoles />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CrmProvider>
      </NotImplementedProvider>
    </I18nProvider>
  );
}

