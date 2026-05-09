import { Express, Request, Response } from "express";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "planificadoc-admin-2026";

/**
 * Serves a full admin dashboard as a single HTML page.
 * Access: /api/admin/panel?key=SECRET
 */
export function registerAdminPanel(app: Express) {
  app.get("/api/admin/panel", (req: Request, res: Response) => {
    const key = req.query.key as string;
    if (key !== ADMIN_SECRET) {
      res.status(401).send("No autorizado. Agrega ?key=TU_CLAVE a la URL.");
      return;
    }

    const html = buildAdminHTML(key);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  });
}

function buildAdminHTML(adminKey: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PlanificaDoc - Panel de Administración</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f1f5f9;
      color: #1e293b;
      min-height: 100vh;
    }
    .header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
      padding: 24px 32px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header h1 { font-size: 24px; font-weight: 700; }
    .header p { font-size: 14px; opacity: 0.8; margin-top: 4px; }
    .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .metric-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
    }
    .metric-card .label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .metric-card .value { font-size: 28px; font-weight: 700; color: #1e293b; margin-top: 4px; }
    .metric-card .sub { font-size: 12px; color: #94a3b8; margin-top: 2px; }
    .metric-card.highlight { border-left: 4px solid #3b82f6; }
    .metric-card.success { border-left: 4px solid #22c55e; }
    .metric-card.warning { border-left: 4px solid #f59e0b; }
    .metric-card.revenue { border-left: 4px solid #8b5cf6; }
    .section { margin-bottom: 32px; }
    .section-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #1e293b; }
    .table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
      overflow-x: auto;
    }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th {
      background: #f8fafc;
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: #475569;
      border-bottom: 1px solid #e2e8f0;
      white-space: nowrap;
    }
    td {
      padding: 10px 16px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    tr:hover td { background: #f8fafc; }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
    }
    .badge-active { background: #dcfce7; color: #166534; }
    .badge-expired { background: #fee2e2; color: #991b1b; }
    .badge-past-due { background: #fef3c7; color: #92400e; }
    .badge-cancelled { background: #f1f5f9; color: #475569; }
    .badge-recurring { background: #ede9fe; color: #5b21b6; }
    .badge-one-time { background: #f0f9ff; color: #0369a1; }
    .loading { text-align: center; padding: 40px; color: #64748b; }
    .refresh-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
    }
    .refresh-btn:hover { background: #2563eb; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .last-updated { font-size: 12px; color: #94a3b8; }
    .search-input {
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 13px;
      width: 250px;
    }
    .tabs { display: flex; gap: 8px; margin-bottom: 24px; }
    .tab {
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      border: 1px solid #e2e8f0;
      background: white;
      color: #475569;
    }
    .tab.active { background: #3b82f6; color: white; border-color: #3b82f6; }
  </style>
</head>
<body>
  <div class="header">
    <h1>PlanificaDoc Ecuador - Panel de Administración</h1>
    <p>Dashboard de métricas, usuarios y transacciones</p>
  </div>

  <div class="container">
    <div class="toolbar">
      <div class="last-updated" id="lastUpdated">Cargando...</div>
      <button class="refresh-btn" onclick="loadAll()">Actualizar datos</button>
    </div>

    <!-- Metrics -->
    <div class="metrics-grid" id="metricsGrid">
      <div class="metric-card"><div class="loading">Cargando...</div></div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <div class="tab active" onclick="switchTab('users')" id="tab-users">Usuarios</div>
      <div class="tab" onclick="switchTab('transactions')" id="tab-transactions">Transacciones</div>
    </div>

    <!-- Users Section -->
    <div class="section" id="section-users">
      <div class="toolbar">
        <div class="section-title">Usuarios Suscritos</div>
        <input type="text" class="search-input" placeholder="Buscar por email, nombre, cédula..." oninput="filterUsers(this.value)" />
      </div>
      <div class="table-container">
        <table id="usersTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Titular</th>
              <th>Email</th>
              <th>Cédula</th>
              <th>Teléfono</th>
              <th>Plan</th>
              <th>Estado</th>
              <th>Recurrente</th>
              <th>Vencimiento</th>
              <th>Total Pagado</th>
              <th>Tarjeta</th>
            </tr>
          </thead>
          <tbody id="usersBody">
            <tr><td colspan="11" class="loading">Cargando...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Transactions Section -->
    <div class="section" id="section-transactions" style="display:none;">
      <div class="section-title">Transacciones Recientes</div>
      <div class="table-container">
        <table id="txnsTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Tarjeta</th>
              <th>Tipo</th>
              <th>Código Auth</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody id="txnsBody">
            <tr><td colspan="8" class="loading">Cargando...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <script>
    const API_KEY = '${adminKey}';
    let allUsers = [];

    async function fetchJSON(endpoint) {
      const res = await fetch(endpoint + (endpoint.includes('?') ? '&' : '?') + 'key=' + API_KEY);
      return res.json();
    }

    async function loadMetrics() {
      try {
        const data = await fetchJSON('/api/admin/dashboard');
        const m = data.metrics;
        document.getElementById('metricsGrid').innerHTML = \`
          <div class="metric-card highlight">
            <div class="label">Suscripciones Activas</div>
            <div class="value">\${m.activeSubscriptions}</div>
            <div class="sub">de \${m.totalSubscriptions} totales</div>
          </div>
          <div class="metric-card success">
            <div class="label">Recurrentes</div>
            <div class="value">\${m.recurringActive}</div>
            <div class="sub">\${m.oneTimeActive} pago único</div>
          </div>
          <div class="metric-card revenue">
            <div class="label">Ingresos del Mes</div>
            <div class="value">$\${(m.monthlyRevenueCents / 100).toFixed(2)}</div>
            <div class="sub">Total: $\${(m.totalRevenueCents / 100).toFixed(2)}</div>
          </div>
          <div class="metric-card warning">
            <div class="label">Pagos Pendientes</div>
            <div class="value">\${m.pastDueSubscriptions}</div>
            <div class="sub">\${m.expiredSubscriptions} expiradas</div>
          </div>
          <div class="metric-card">
            <div class="label">Plan Mensual</div>
            <div class="value">\${m.monthlyPlanActive}</div>
            <div class="sub">activas</div>
          </div>
          <div class="metric-card">
            <div class="label">Plan Anual</div>
            <div class="value">\${m.annualPlanActive}</div>
            <div class="sub">activas</div>
          </div>
          <div class="metric-card">
            <div class="label">Tokens de Tarjeta</div>
            <div class="value">\${m.activeCardTokens}</div>
            <div class="sub">para cobro automático</div>
          </div>
          <div class="metric-card">
            <div class="label">Transacciones Aprobadas</div>
            <div class="value">\${m.totalTransactions}</div>
            <div class="sub">total histórico</div>
          </div>
        \`;
        document.getElementById('lastUpdated').textContent = 'Actualizado: ' + new Date(data.lastUpdated).toLocaleString('es-EC');
      } catch (e) {
        document.getElementById('metricsGrid').innerHTML = '<div class="metric-card"><div class="loading">Error al cargar métricas</div></div>';
      }
    }

    async function loadUsers() {
      try {
        const data = await fetchJSON('/api/admin/users');
        allUsers = data.users;
        renderUsers(allUsers);
      } catch (e) {
        document.getElementById('usersBody').innerHTML = '<tr><td colspan="11" class="loading">Error al cargar usuarios</td></tr>';
      }
    }

    function renderUsers(users) {
      if (users.length === 0) {
        document.getElementById('usersBody').innerHTML = '<tr><td colspan="11" class="loading">No hay usuarios</td></tr>';
        return;
      }
      document.getElementById('usersBody').innerHTML = users.map((u, i) => \`
        <tr>
          <td>\${i + 1}</td>
          <td><strong>\${u.cardHolder || '-'}</strong></td>
          <td>\${u.email}</td>
          <td>\${u.documentId || '-'}</td>
          <td>\${u.phoneNumber || '-'}</td>
          <td>\${u.currentPlan === 'monthly' ? 'Mensual' : 'Anual'}</td>
          <td><span class="badge badge-\${u.currentStatus}">\${getStatusLabel(u.currentStatus)}</span></td>
          <td><span class="badge \${u.isRecurring ? 'badge-recurring' : 'badge-one-time'}">\${u.isRecurring ? 'Sí' : 'No'}</span></td>
          <td>\${formatDate(u.endDate)}</td>
          <td><strong>$\${(u.totalPaid / 100).toFixed(2)}</strong></td>
          <td>\${u.cardBrand ? u.cardBrand + ' ****' + u.lastDigits : '-'}</td>
        </tr>
      \`).join('');
    }

    function filterUsers(query) {
      const q = query.toLowerCase();
      const filtered = allUsers.filter(u =>
        (u.email || '').toLowerCase().includes(q) ||
        (u.cardHolder || '').toLowerCase().includes(q) ||
        (u.documentId || '').includes(q) ||
        (u.phoneNumber || '').includes(q)
      );
      renderUsers(filtered);
    }

    async function loadTransactions() {
      try {
        const data = await fetchJSON('/api/admin/transactions?limit=100');
        const tbody = document.getElementById('txnsBody');
        if (data.transactions.length === 0) {
          tbody.innerHTML = '<tr><td colspan="8" class="loading">No hay transacciones</td></tr>';
          return;
        }
        tbody.innerHTML = data.transactions.map((t, i) => \`
          <tr>
            <td>\${i + 1}</td>
            <td>\${t.email}</td>
            <td><strong>$\${(t.amount / 100).toFixed(2)}</strong></td>
            <td><span class="badge badge-\${t.status === 'approved' ? 'active' : t.status === 'cancelled' ? 'cancelled' : 'expired'}">\${t.status}</span></td>
            <td>\${t.cardBrand ? t.cardBrand + ' ****' + t.lastDigits : '-'}</td>
            <td><span class="badge \${t.isRecurringCharge ? 'badge-recurring' : 'badge-one-time'}">\${t.isRecurringCharge ? 'Recurrente' : 'Manual'}</span></td>
            <td>\${t.authorizationCode || '-'}</td>
            <td>\${formatDate(t.createdAt)}</td>
          </tr>
        \`).join('');
      } catch (e) {
        document.getElementById('txnsBody').innerHTML = '<tr><td colspan="8" class="loading">Error al cargar transacciones</td></tr>';
      }
    }

    function switchTab(tab) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.getElementById('tab-' + tab).classList.add('active');
      document.getElementById('section-users').style.display = tab === 'users' ? 'block' : 'none';
      document.getElementById('section-transactions').style.display = tab === 'transactions' ? 'block' : 'none';
    }

    function getStatusLabel(status) {
      const labels = { active: 'Activa', expired: 'Expirada', cancelled: 'Cancelada', past_due: 'Pendiente' };
      return labels[status] || status;
    }

    function formatDate(dateStr) {
      if (!dateStr) return '-';
      try {
        return new Date(dateStr).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
      } catch { return dateStr; }
    }

    function loadAll() {
      loadMetrics();
      loadUsers();
      loadTransactions();
    }

    loadAll();
  </script>
</body>
</html>`;
}
