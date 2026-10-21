/**
 * Consumo Enterprise FMCG / Manufacturing Decision Suite
 * Data Science & Demand Intelligence Engine
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. DATA MODEL: 3 YEARS HISTORICAL FMCG DATA + 2026 FORECAST HORIZON
  // =========================================================================

  const SKU_DATABASE = {
    'SKU-BEV-01': {
      id: 'SKU-BEV-01',
      name: 'Citrus Spark Energy Drink 500ml',
      category: 'Beverages',
      dc: 'North Metro DC',
      unitPrice: 2.85,
      costPrice: 1.42,
      baseMonthlyVol: 185000,
      elasticity: -1.34,
      seasonalityType: 'summer-peak', // High in Q2 & Q3 (May - Aug)
      shapBreakdown: {
        baseline: 1420000,
        seasonality: 480000,
        promotions: 620000,
        priceEffect: -95000,
        weatherMacro: 215000,
        crossHalo: 80000,
        total: 2720000
      },
      kpis: {
        forecastVolume: '2,720,000',
        forecastYoY: '+14.2%',
        wmape: '94.2%',
        wmapeDelta: '+22.7% FVA',
        bias: '+1.8%',
        biasStatus: 'In Control',
        promoUnits: '+620K',
        promoShare: '22.8% Vol',
        priceImpact: '-95K',
        elasticityVal: '-1.34'
      }
    },
    'SKU-PC-02': {
      id: 'SKU-PC-02',
      name: 'Radiance Keratin Shampoo 350ml',
      category: 'Personal Care',
      dc: 'West Regional DC',
      unitPrice: 6.40,
      costPrice: 2.80,
      baseMonthlyVol: 120000,
      elasticity: -0.92,
      seasonalityType: 'q4-holiday', // Steady baseline, surge in Nov - Dec
      shapBreakdown: {
        baseline: 1150000,
        seasonality: 210000,
        promotions: 390000,
        priceEffect: -42000,
        weatherMacro: 65000,
        crossHalo: 45000,
        total: 1818000
      },
      kpis: {
        forecastVolume: '1,818,000',
        forecastYoY: '+9.6%',
        wmape: '95.1%',
        wmapeDelta: '+18.4% FVA',
        bias: '-0.6%',
        biasStatus: 'Balanced',
        promoUnits: '+390K',
        promoShare: '21.4% Vol',
        priceImpact: '-42K',
        elasticityVal: '-0.92'
      }
    },
    'SKU-FOOD-03': {
      id: 'SKU-FOOD-03',
      name: 'NutriCrunch Whole Grain Biscuits 200g',
      category: 'Packaged Foods',
      dc: 'National Consolidated',
      unitPrice: 1.95,
      costPrice: 0.98,
      baseMonthlyVol: 310000,
      elasticity: -1.68,
      seasonalityType: 'back-to-school', // Surge in Aug - Oct & Festive
      shapBreakdown: {
        baseline: 2850000,
        seasonality: 420000,
        promotions: 780000,
        priceEffect: -160000,
        weatherMacro: 110000,
        crossHalo: 95000,
        total: 4095000
      },
      kpis: {
        forecastVolume: '4,095,000',
        forecastYoY: '+16.8%',
        wmape: '93.6%',
        wmapeDelta: '+24.1% FVA',
        bias: '+2.1%',
        biasStatus: 'In Control',
        promoUnits: '+780K',
        promoShare: '19.0% Vol',
        priceImpact: '-160K',
        elasticityVal: '-1.68'
      }
    }
  };

  // Generate 48 months: 36 Historical Months (2023-01 to 2025-12) + 12 Forecast Months (2026-01 to 2026-12)
  function generateTimeSeriesData(skuId) {
    const sku = SKU_DATABASE[skuId] || SKU_DATABASE['SKU-BEV-01'];
    const months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Seasonal multiplier curves
    const getSeasonalIndex = (mIdx, type) => {
      if (type === 'summer-peak') {
        // High May - Aug
        const curve = [0.85, 0.88, 0.95, 1.15, 1.35, 1.48, 1.52, 1.42, 1.10, 0.92, 0.84, 0.90];
        return curve[mIdx];
      } else if (type === 'q4-holiday') {
        // High Oct - Dec
        const curve = [0.92, 0.94, 0.95, 0.96, 0.98, 1.00, 1.02, 1.05, 1.08, 1.25, 1.38, 1.45];
        return curve[mIdx];
      } else {
        // Back to school & Festive (Aug - Oct)
        const curve = [0.90, 0.92, 0.95, 0.98, 1.00, 1.05, 1.10, 1.32, 1.38, 1.28, 1.15, 1.20];
        return curve[mIdx];
      }
    };

    let idx = 0;
    const years = [2023, 2024, 2025, 2026];

    years.forEach(year => {
      const isHistorical = year <= 2025;
      const yearGrowth = 1 + (year - 2023) * 0.085; // Organic 8.5% YoY trend growth

      monthNames.forEach((mName, mIdx) => {
        const seasonalMult = getSeasonalIndex(mIdx, sku.seasonalityType);
        const baseline = Math.round(sku.baseMonthlyVol * yearGrowth * seasonalMult);

        // Promotional calendar schedule
        let isPromo = false;
        let promoLift = 0;
        let promoName = '';
        
        // Typical FMCG promo calendar
        if (mIdx === 4 || mIdx === 6 || mIdx === 10) { // May, July, Nov
          isPromo = true;
          promoLift = Math.round(baseline * (0.28 + (mIdx % 2) * 0.12));
          promoName = mIdx === 4 ? 'Spring Push (15% TPR)' : mIdx === 6 ? 'Mid-Year Feature Display' : 'Festive Super Sale (25% TPR)';
        }

        // Price index trajectory
        let priceIndex = 100;
        if (year === 2024 && mIdx >= 6) priceIndex = 104; // 4% price increase in mid-2024
        if (year === 2025) priceIndex = 106;
        if (year === 2026) priceIndex = 108;

        const priceEffect = Math.round(baseline * ((priceIndex - 100) / 100) * sku.elasticity);

        // Calendar event flags
        let calendarEvent = '';
        if (mIdx === 10) calendarEvent = 'Festive / Black Friday Surge';
        if (mIdx === 6 && sku.seasonalityType === 'summer-peak') calendarEvent = 'Heatwave Demand Spike';
        if (mIdx === 8 && sku.seasonalityType === 'back-to-school') calendarEvent = 'Back to School Peak';

        let actual = null;
        let forecast = null;
        let p10 = null;
        let p90 = null;

        if (isHistorical) {
          // Add slight realistic historical noise (±3.5%)
          const noise = 1 + (Math.sin(idx * 1.7) * 0.035);
          actual = Math.round((baseline + promoLift + priceEffect) * noise);
          // 2 unrecorded stockout dips in past
          if (year === 2024 && mIdx === 7) {
            actual = Math.round(actual * 0.74); // Stockout constraint dip
            calendarEvent = 'ERP Stock-Out (OOS)';
          }
        } else {
          // 2026 Forecast generated by Data Science Model
          forecast = Math.round(baseline + promoLift + priceEffect);
          const variance = forecast * 0.065; // 95% confidence interval margin
          p10 = Math.round(forecast - variance);
          p90 = Math.round(forecast + variance);
        }

        months.push({
          index: idx,
          label: `${mName} '${String(year).slice(2)}`,
          year: year,
          month: mName,
          baseline: baseline,
          actual: actual,
          forecast: forecast,
          p10: p10,
          p90: p90,
          isPromo: isPromo,
          promoLift: promoLift,
          promoName: promoName,
          priceIndex: priceIndex,
          calendarEvent: calendarEvent,
          isHistorical: isHistorical
        });

        idx++;
      });
    });

    return months;
  }

  // =========================================================================
  // 2. APPLICATION STATE
  // =========================================================================
  const state = {
    isAuthenticated: false,
    currentUser: null,
    activeModule: 'demand-pulse', // 'demand-pulse' or 'inventory-flow'
    activeSkuId: 'SKU-BEV-01',
    activeHorizon: '12w', // '4w', '12w', '52w'
    scenarioPromo: 15,    // default 15% discount
    scenarioPrice: 0,     // default 0% price change
    layerVisibility: {
      actuals: true,
      forecast: true,
      ciBand: true,
      seasonality: true,
      promotions: true,
      pricing: false
    }
  };

  // =========================================================================
  // 3. AUTHENTICATION & LOGIN HANDLERS
  // =========================================================================
  function initAuth() {
    const authOverlay = document.getElementById('auth-overlay');
    const authForm = document.getElementById('auth-form');
    const demoLoginBtn = document.getElementById('btn-demo-login');
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');
    const logoutBtn = document.getElementById('btn-logout');

    // Check stored session
    const savedUser = sessionStorage.getItem('consumo_auth_user');
    if (savedUser) {
      state.isAuthenticated = true;
      state.currentUser = JSON.parse(savedUser);
      authOverlay.classList.add('is-hidden');
      updateUserProfile();
      renderDashboard();
    }

    // Demo One-Click Login
    if (demoLoginBtn) {
      demoLoginBtn.addEventListener('click', function () {
        emailInput.value = 'planner@consumo.ai';
        passwordInput.value = 'consumo2026';
        performLogin('planner@consumo.ai', 'Sarah Jenkins');
      });
    }

    // Form Submit Login
    if (authForm) {
      authForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
          alert('Please enter your User ID and Password.');
          return;
        }

        performLogin(email, email.split('@')[0]);
      });
    }

    // Logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        sessionStorage.removeItem('consumo_auth_user');
        state.isAuthenticated = false;
        state.currentUser = null;
        authOverlay.classList.remove('is-hidden');
      });
    }
  }

  function performLogin(email, name) {
    const authOverlay = document.getElementById('auth-overlay');
    state.isAuthenticated = true;
    state.currentUser = {
      email: email,
      name: name.includes('planner') ? 'Sarah Jenkins' : name,
      role: 'Lead Demand Planner — FMCG'
    };

    sessionStorage.setItem('consumo_auth_user', JSON.stringify(state.currentUser));
    authOverlay.classList.add('is-hidden');
    updateUserProfile();
    renderDashboard();
  }

  function updateUserProfile() {
    if (!state.currentUser) return;
    const nameEl = document.getElementById('header-user-name');
    const roleEl = document.getElementById('header-user-role');
    const avatarEl = document.getElementById('header-user-avatar');

    if (nameEl) nameEl.textContent = state.currentUser.name;
    if (roleEl) roleEl.textContent = state.currentUser.role;
    if (avatarEl) avatarEl.textContent = state.currentUser.name.charAt(0);
  }

  // =========================================================================
  // 4. MODULE NAVIGATION & SWITCHER
  // =========================================================================
  function initModuleSwitcher() {
    const tabDemand = document.getElementById('tab-demand-pulse');
    const tabInventory = document.getElementById('tab-inventory-flow');
    const viewDemand = document.getElementById('view-demand-pulse');
    const viewInventory = document.getElementById('view-inventory-flow');

    if (tabDemand && tabInventory) {
      tabDemand.addEventListener('click', function () {
        state.activeModule = 'demand-pulse';
        tabDemand.classList.add('is-active');
        tabInventory.classList.remove('is-active');
        viewDemand.classList.add('is-visible');
        viewInventory.classList.remove('is-visible');
      });

      tabInventory.addEventListener('click', function () {
        state.activeModule = 'inventory-flow';
        tabInventory.classList.add('is-active');
        tabDemand.classList.remove('is-active');
        viewInventory.classList.add('is-visible');
        viewDemand.classList.remove('is-visible');
      });
    }
  }

  // =========================================================================
  // 5. FMCG HIERARCHY CONTROLS & EVENT LISTENERS
  // =========================================================================
  function initFilters() {
    const skuSelect = document.getElementById('select-sku');
    const categorySelect = document.getElementById('select-category');
    const dcSelect = document.getElementById('select-dc');
    const horizonBtns = document.querySelectorAll('.horizon-btn');

    if (skuSelect) {
      skuSelect.addEventListener('change', function () {
        state.activeSkuId = this.value;
        const currentSku = SKU_DATABASE[this.value];
        if (currentSku && categorySelect) {
          categorySelect.value = currentSku.category;
        }
        renderDashboard();
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener('change', function () {
        const cat = this.value;
        const matchingSku = Object.values(SKU_DATABASE).find(s => s.category === cat);
        if (matchingSku && skuSelect) {
          skuSelect.value = matchingSku.id;
          state.activeSkuId = matchingSku.id;
          renderDashboard();
        }
      });
    }

    horizonBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        horizonBtns.forEach(b => b.classList.remove('is-active'));
        this.classList.add('is-active');
        state.activeHorizon = this.getAttribute('data-horizon');
        renderDashboard();
      });
    });

    // Layer Toggles
    const layerChips = document.querySelectorAll('.layer-chip');
    layerChips.forEach(chip => {
      chip.addEventListener('click', function () {
        const layer = this.getAttribute('data-layer');
        state.layerVisibility[layer] = !state.layerVisibility[layer];
        this.classList.toggle('is-active', state.layerVisibility[layer]);
        renderTimeSeriesChart();
      });
    });

    // Scenario Sliders
    const promoSlider = document.getElementById('slider-promo-depth');
    const promoVal = document.getElementById('val-promo-depth');
    const priceSlider = document.getElementById('slider-price-change');
    const priceVal = document.getElementById('val-price-change');

    if (promoSlider && promoVal) {
      promoSlider.addEventListener('input', function () {
        state.scenarioPromo = parseInt(this.value, 10);
        promoVal.textContent = `${state.scenarioPromo}%`;
        updateScenarioImpacts();
      });
    }

    if (priceSlider && priceVal) {
      priceSlider.addEventListener('input', function () {
        state.scenarioPrice = parseInt(this.value, 10);
        const prefix = state.scenarioPrice > 0 ? '+' : '';
        priceVal.textContent = `${prefix}${state.scenarioPrice}%`;
        updateScenarioImpacts();
      });
    }
  }

  // =========================================================================
  // 6. DASHBOARD RENDERING PIPELINE
  // =========================================================================
  function renderDashboard() {
    renderKPIs();
    renderTimeSeriesChart();
    renderShapWaterfall();
    updateScenarioImpacts();
    renderLedgerTable();
  }

  // 6.1 Render KPI Ribbon
  function renderKPIs() {
    const sku = SKU_DATABASE[state.activeSkuId];
    if (!sku) return;

    document.getElementById('kpi-forecast-val').textContent = `${sku.kpis.forecastVolume} Units`;
    document.getElementById('kpi-forecast-delta').textContent = sku.kpis.forecastYoY;
    document.getElementById('kpi-wmape-val').textContent = sku.kpis.wmape;
    document.getElementById('kpi-wmape-delta').textContent = sku.kpis.wmapeDelta;
    document.getElementById('kpi-bias-val').textContent = sku.kpis.bias;
    document.getElementById('kpi-bias-status').textContent = sku.kpis.biasStatus;
    document.getElementById('kpi-promo-val').textContent = sku.kpis.promoUnits;
    document.getElementById('kpi-promo-share').textContent = sku.kpis.promoShare;
    document.getElementById('kpi-price-val').textContent = sku.kpis.priceImpact;
    document.getElementById('kpi-price-elasticity').textContent = `Elast: ${sku.kpis.elasticityVal}`;
  }

  // 6.2 Render Primary Interactive 3-Year Time-Series Chart (SVG)
  function renderTimeSeriesChart() {
    const container = document.getElementById('chart-timeseries-container');
    if (!container) return;

    const data = generateTimeSeriesData(state.activeSkuId);
    const width = 1000;
    const height = 340;
    const padL = 70;
    const padR = 40;
    const padT = 30;
    const padB = 45;

    const chartW = width - padL - padR;
    const chartH = height - padT - padB;

    // Find max value across actuals, forecast, and p90
    const maxVal = Math.max(
      ...data.map(d => Math.max(d.actual || 0, d.forecast || 0, d.p90 || 0, d.baseline || 0))
    ) * 1.12;

    const getX = idx => padL + (idx / (data.length - 1)) * chartW;
    const getY = val => padT + chartH - (val / maxVal) * chartH;

    // Split historical (0..35) and future forecast (35..47)
    const histData = data.filter(d => d.isHistorical);
    const forecastData = data.filter(d => !d.isHistorical);
    // Connect point: last historical to first forecast
    const bridgeData = [histData[histData.length - 1], ...forecastData];

    let svg = `<svg class="timeseries-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">`;
    
    // Gradients & Defs
    svg += `
      <defs>
        <linearGradient id="ci-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.32" />
          <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.05" />
        </linearGradient>
        <linearGradient id="hist-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.00" />
        </linearGradient>
      </defs>
    `;

    // Horizontal Y Grid lines & labels (5 levels)
    for (let i = 0; i <= 5; i++) {
      const yVal = Math.round((maxVal / 5) * i);
      const yPos = getY(yVal);
      svg += `
        <line x1="${padL}" y1="${yPos}" x2="${width - padR}" y2="${yPos}" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3,3" />
        <text x="${padL - 12}" y="${yPos + 4}" font-size="10" fill="#94a3b8" text-anchor="end" font-family="monospace">${(yVal / 1000).toFixed(0)}k</text>
      `;
    }

    // Historical vs Future Horizon Partition Shading
    const splitX = getX(histData.length - 1);
    svg += `
      <rect x="${splitX}" y="${padT}" width="${width - padR - splitX}" height="${chartH}" fill="#ecfeff" opacity="0.6" />
      <line x1="${splitX}" y1="${padT - 10}" x2="${splitX}" y2="${padT + chartH}" stroke="#4f46e5" stroke-width="1.5" stroke-dasharray="4,4" />
      <rect x="${splitX - 60}" y="${padT - 22}" width="120" height="18" rx="3" fill="#080d1a" />
      <text x="${splitX}" y="${padT - 10}" font-size="8.5" fill="#06b6d4" font-weight="700" text-anchor="middle">S&OP FORECAST HORIZON</text>
    `;

    // X Axis tick labels (Show every 3 months for clarity)
    data.forEach((d, i) => {
      if (i % 3 === 0 || i === data.length - 1) {
        const x = getX(i);
        svg += `
          <line x1="${x}" y1="${padT + chartH}" x2="${x}" y2="${padT + chartH + 5}" stroke="#cbd5e1" stroke-width="1" />
          <text x="${x}" y="${padT + chartH + 18}" font-size="9.5" fill="#64748b" text-anchor="middle" font-weight="${d.year === 2026 ? '700' : '500'}">${d.label}</text>
        `;
      }
    });

    // 1. Promotional Surges Layer (Bars)
    if (state.layerVisibility.promotions) {
      data.forEach(d => {
        if (d.isPromo) {
          const x = getX(d.index);
          const barH = (d.promoLift / maxVal) * chartH;
          const y = padT + chartH - barH;
          svg += `
            <rect x="${x - 7}" y="${y}" width="14" height="${barH}" rx="2" fill="#f59e0b" opacity="0.45" />
            <circle cx="${x}" cy="${y - 4}" r="3" fill="#d97706" />
          `;
        }
      });
    }

    // 2. Statistical Baseline Layer (Dashed slate line)
    if (state.layerVisibility.seasonality) {
      let baselinePath = `M ${getX(0)} ${getY(data[0].baseline)}`;
      for (let i = 1; i < data.length; i++) {
        baselinePath += ` L ${getX(i)} ${getY(data[i].baseline)}`;
      }
      svg += `<path d="${baselinePath}" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4" />`;
    }

    // 3. 95% Confidence Interval Band (P10 - P90)
    if (state.layerVisibility.ciBand) {
      let bandPath = `M ${getX(bridgeData[0].index)} ${getY(bridgeData[0].actual || bridgeData[0].forecast)}`;
      // Upper bound (P90)
      bridgeData.forEach(d => {
        const val = d.p90 || d.actual;
        bandPath += ` L ${getX(d.index)} ${getY(val)}`;
      });
      // Lower bound (P10) in reverse
      for (let i = bridgeData.length - 1; i >= 0; i--) {
        const d = bridgeData[i];
        const val = d.p10 || d.actual;
        bandPath += ` L ${getX(d.index)} ${getY(val)}`;
      }
      bandPath += ' Z';
      svg += `<path d="${bandPath}" fill="url(#ci-grad)" />`;
    }

    // 4. Actual Demand History Line (2023 - 2025)
    if (state.layerVisibility.actuals) {
      let actualPath = `M ${getX(0)} ${getY(histData[0].actual)}`;
      for (let i = 1; i < histData.length; i++) {
        actualPath += ` L ${getX(i)} ${getY(histData[i].actual)}`;
      }
      svg += `
        <path d="${actualPath}" fill="none" stroke="#1e293b" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" />
      `;

      // Historical actual dots
      histData.forEach((d, i) => {
        if (i % 2 === 0 || d.calendarEvent) {
          const x = getX(d.index);
          const y = getY(d.actual);
          const isAnomaly = d.calendarEvent.includes('OOS');
          svg += `
            <circle cx="${x}" cy="${y}" r="${isAnomaly ? 4.5 : 3}" fill="${isAnomaly ? '#ef4444' : '#1e293b'}" stroke="#ffffff" stroke-width="1.5" />
          `;
        }
      });
    }

    // 5. Consumo AI Sensed Forecast Line (2026)
    if (state.layerVisibility.forecast) {
      let forecastPath = `M ${getX(bridgeData[0].index)} ${getY(bridgeData[0].actual || bridgeData[0].forecast)}`;
      for (let i = 1; i < bridgeData.length; i++) {
        forecastPath += ` L ${getX(bridgeData[i].index)} ${getY(bridgeData[i].forecast)}`;
      }
      svg += `
        <path d="${forecastPath}" fill="none" stroke="#4f46e5" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round" filter="drop-shadow(0 2px 6px rgba(79, 70, 229, 0.4))" />
      `;

      // Forecast points
      forecastData.forEach(d => {
        const x = getX(d.index);
        const y = getY(d.forecast);
        svg += `
          <circle cx="${x}" cy="${y}" r="3.5" fill="#06b6d4" stroke="#4f46e5" stroke-width="2" />
        `;
      });
    }

    svg += '</svg>';
    container.innerHTML = svg;

    // Attach interactive hover listener
    attachChartTooltip(container, data, getX, getY, padL, padR, chartW);
  }

  function attachChartTooltip(container, data, getX, getY, padL, padR, chartW) {
    const tooltip = document.getElementById('chart-tooltip');
    if (!tooltip) return;

    container.onmousemove = function (e) {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      
      // Calculate closest data index
      const ratio = (mouseX - padL) / chartW;
      const index = Math.round(ratio * (data.length - 1));

      if (index >= 0 && index < data.length) {
        const d = data[index];
        const pointX = getX(d.index);
        
        tooltip.style.display = 'block';
        tooltip.style.left = `${Math.min(pointX + 15, rect.width - 220)}px`;
        tooltip.style.top = '40px';

        let html = `
          <div class="tt-header">${d.label} ${d.isHistorical ? '(Historical Actuals)' : '(ML Sensed Forecast)'}</div>
          <div class="tt-row"><span class="tt-label">Baseline Demand:</span><span class="tt-val">${d.baseline.toLocaleString()}</span></div>
        `;

        if (d.isHistorical) {
          html += `<div class="tt-row"><span class="tt-label">Actual Shipped:</span><span class="tt-val" style="color:#ffffff;">${d.actual.toLocaleString()}</span></div>`;
        } else {
          html += `
            <div class="tt-row"><span class="tt-label">AI Forecast (P50):</span><span class="tt-val" style="color:#06b6d4;">${d.forecast.toLocaleString()}</span></div>
            <div class="tt-row"><span class="tt-label">95% Conf (P10-P90):</span><span class="tt-val">${d.p10.toLocaleString()} - ${d.p90.toLocaleString()}</span></div>
          `;
        }

        if (d.isPromo) {
          html += `<div class="tt-row"><span class="tt-label">Promo Campaign:</span><span class="tt-val" style="color:#f59e0b;">+${d.promoLift.toLocaleString()} (${d.promoName})</span></div>`;
        }

        if (d.calendarEvent) {
          html += `<div class="tt-row"><span class="tt-label">Signal Driver:</span><span class="tt-val" style="color:#38bdf8;">${d.calendarEvent}</span></div>`;
        }

        tooltip.innerHTML = html;
      }
    };

    container.onmouseleave = function () {
      tooltip.style.display = 'none';
    };
  }

  // 6.3 Render SHAP Waterfall (Feature Attribution)
  function renderShapWaterfall() {
    const list = document.getElementById('shap-waterfall-list');
    if (!list) return;

    const sku = SKU_DATABASE[state.activeSkuId];
    const shap = sku.shapBreakdown;
    const maxVal = shap.total * 1.05;

    const items = [
      { label: 'Organic Baseline Demand', icon: '🏛️', val: shap.baseline, type: 'baseline', text: `${(shap.baseline / 1000).toFixed(0)}k units` },
      { label: 'Seasonal & Calendar Index', icon: '📅', val: shap.seasonality, type: 'positive', text: `+${(shap.seasonality / 1000).toFixed(0)}k units` },
      { label: 'Planned Trade Promotions', icon: '🏷️', val: shap.promotions, type: 'positive', text: `+${(shap.promotions / 1000).toFixed(0)}k units` },
      { label: 'Price Elasticity Effect', icon: '💲', val: shap.priceEffect, type: 'negative', text: `${(shap.priceEffect / 1000).toFixed(0)}k units` },
      { label: 'Weather & Macro Signals', icon: '☀️', val: shap.weatherMacro, type: 'positive', text: `+${(shap.weatherMacro / 1000).toFixed(0)}k units` },
      { label: 'Cross-Category Halo Effect', icon: '🔗', val: shap.crossHalo, type: 'positive', text: `+${(shap.crossHalo / 1000).toFixed(0)}k units` },
      { label: 'Consensus Sensed Forecast', icon: '🎯', val: shap.total, type: 'total', text: `${(shap.total / 1000).toFixed(0)}k units` }
    ];

    let html = '';
    items.forEach(it => {
      const pct = Math.min(100, Math.max(5, (Math.abs(it.val) / maxVal) * 100));
      html += `
        <div class="shap-item">
          <div class="shap-driver-label">
            <span class="shap-driver-icon">${it.icon}</span>
            <span>${it.label}</span>
          </div>
          <div class="shap-bar-track">
            <div class="shap-bar-fill ${it.type}" style="width: ${pct}%;"></div>
          </div>
          <div class="shap-value-badge ${it.type}">${it.text}</div>
        </div>
      `;
    });

    list.innerHTML = html;
  }

  // 6.4 Real-time What-If Scenario Calculation
  function updateScenarioImpacts() {
    const sku = SKU_DATABASE[state.activeSkuId];
    if (!sku) return;

    const baseForecast = sku.shapBreakdown.total;
    // Calculate promo lift change: baseline calibrated at 15% promo depth
    const promoDeltaPct = (state.scenarioPromo - 15) / 100;
    const promoLiftUnits = Math.round(baseForecast * 0.18 * promoDeltaPct);

    // Calculate price elasticity change:
    const priceDeltaPct = state.scenarioPrice / 100;
    const priceEffectUnits = Math.round(baseForecast * priceDeltaPct * sku.elasticity);

    const adjustedForecast = baseForecast + promoLiftUnits + priceEffectUnits;
    const volumeDelta = adjustedForecast - baseForecast;

    // Financial calculations
    const revenueImpact = (adjustedForecast * (sku.unitPrice * (1 + priceDeltaPct) * (1 - state.scenarioPromo / 100))) -
      (baseForecast * (sku.unitPrice * 0.85));

    const marginImpact = revenueImpact - ((adjustedForecast - baseForecast) * sku.costPrice);

    // Update UI elements
    const volEl = document.getElementById('impact-vol-val');
    const revEl = document.getElementById('impact-rev-val');
    const marginEl = document.getElementById('impact-margin-val');

    if (volEl) {
      const volPrefix = volumeDelta >= 0 ? '+' : '';
      volEl.textContent = `${volPrefix}${(volumeDelta / 1000).toFixed(0)}k`;
      volEl.className = `impact-val ${volumeDelta >= 0 ? 'pos' : 'neg'}`;
    }

    if (revEl) {
      const revPrefix = revenueImpact >= 0 ? '+$' : '-$';
      revEl.textContent = `${revPrefix}${Math.abs(Math.round(revenueImpact / 1000))}k`;
      revEl.className = `impact-val ${revenueImpact >= 0 ? 'pos' : 'neg'}`;
    }

    if (marginEl) {
      const marPrefix = marginImpact >= 0 ? '+$' : '-$';
      marginEl.textContent = `${marPrefix}${Math.abs(Math.round(marginImpact / 1000))}k`;
      marginEl.className = `impact-val ${marginImpact >= 0 ? 'pos' : 'neg'}`;
    }
  }

  // 6.5 Render Granular Channel & SKU Planning Ledger Table
  function renderLedgerTable() {
    const tbody = document.getElementById('ledger-table-body');
    if (!tbody) return;

    const sku = SKU_DATABASE[state.activeSkuId];
    const total = sku.shapBreakdown.total;

    const channels = [
      { name: 'Modern Trade (Supermarkets & Hypermarkets)', share: 0.45, wmape: '95.4%', bias: '+0.8%', status: 'Approved' },
      { name: 'General Trade (Traditional Grocers & Kiranas)', share: 0.30, wmape: '93.2%', bias: '+2.1%', status: 'Approved' },
      { name: 'E-Commerce & Quick Commerce (10-Min Delivery)', share: 0.18, wmape: '92.1%', bias: '-1.4%', status: 'In Review' },
      { name: 'Wholesale & B2B Institutional', share: 0.07, wmape: '96.2%', bias: '+0.3%', status: 'Approved' }
    ];

    let html = '';
    channels.forEach(ch => {
      const forecastUnits = Math.round(total * ch.share);
      const baselineUnits = Math.round(forecastUnits * 0.76);
      const promoUnits = Math.round(forecastUnits * 0.22);
      const isApproved = ch.status === 'Approved';

      html += `
        <tr>
          <td style="font-weight:700; color:#0f172a;">${ch.name}</td>
          <td>${(ch.share * 100).toFixed(0)}%</td>
          <td style="font-family:var(--font-mono); font-weight:600;">${baselineUnits.toLocaleString()}</td>
          <td style="font-family:var(--font-mono); color:#d97706; font-weight:600;">+${promoUnits.toLocaleString()}</td>
          <td style="font-family:var(--font-mono); font-weight:800; color:#4f46e5;">${forecastUnits.toLocaleString()}</td>
          <td><span style="color:#059669; font-weight:700;">${ch.wmape}</span></td>
          <td><span style="font-family:var(--font-mono);">${ch.bias}</span></td>
          <td>
            <span class="status-badge ${isApproved ? 'approved' : 'review'}">
              ${isApproved ? '✓ ' : '⏳ '}${ch.status}
            </span>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  // =========================================================================
  // 7. INITIALIZATION ON DOM READY
  // =========================================================================
  document.addEventListener('DOMContentLoaded', function () {
    initAuth();
    initModuleSwitcher();
    initFilters();
    renderDashboard();
  });

})();
