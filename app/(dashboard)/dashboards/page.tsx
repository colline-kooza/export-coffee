import React from "react";
import DashboardPage from "../components/dash-page";
import WarehouseDashboard from "../components/warehouse/warehouseDash";
import SalesDashboard from "../components/sales/salesDash";
import ProcurementDashboard from "../components/procurement/procurementDash";
import OperationsDashboard from "../components/operations/operationsDash";
import FinanceDashboard from "../components/finance/financeDash";

export default function page() {
  return (
    <div>
      <DashboardPage />
    </div>
  );
}
