import { Navigate, Route, HashRouter, Routes } from "react-router-dom";
import { BrandingProvider } from "@/branding/BrandingContext";
import { RootLayout } from "@/components/layout/RootLayout";
import { CeoScorecardDashboard } from "@/pages/CeoScorecardDashboard";
import { OrderStatusDashboard } from "@/pages/OrderStatusDashboard";
import { ProductionLineDashboard } from "@/pages/ProductionLineDashboard";
import { MaintenanceDashboard } from "@/pages/MaintenanceDashboard";
import { OperatorDashboard } from "@/pages/OperatorDashboard";
import { QualityDashboard } from "@/pages/QualityDashboard";
import { SafetyDashboard } from "@/pages/SafetyDashboard";
import { MachineHealthDashboard } from "@/pages/MachineHealthDashboard";
import { EnvironmentDashboard } from "@/pages/EnvironmentDashboard";
import { HseDashboard } from "@/pages/HseDashboard";

export default function App() {
  return (
    <BrandingProvider>
      <HashRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Navigate to="/d/overview" replace />} />
            <Route path="/d/overview" element={<CeoScorecardDashboard />} />
            <Route path="/d/orders" element={<OrderStatusDashboard />} />
            <Route path="/d/production-line" element={<ProductionLineDashboard />} />
            <Route path="/d/machine-health" element={<MachineHealthDashboard />} />
            <Route path="/d/operator" element={<OperatorDashboard />} />
            <Route path="/d/safety" element={<SafetyDashboard />} />
            <Route path="/d/environment" element={<EnvironmentDashboard />} />
            <Route path="/d/quality" element={<QualityDashboard />} />
            <Route path="/d/maintenance" element={<MaintenanceDashboard />} />
            <Route path="/d/hse" element={<HseDashboard />} />
            <Route path="*" element={<Navigate to="/d/overview" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </BrandingProvider>
  );
}
