// ── Rich mock datasets for dashboard generation testing ───────────────────────
// Programmatically generated to give realistic distributions and volume.

// Deterministic pseudo-random (seeded) so data is consistent across restarts
function mkRng(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
function between(rng, lo, hi) { return +(lo + rng() * (hi - lo)).toFixed(2); }
function betweenInt(rng, lo, hi) { return Math.floor(lo + rng() * (hi - lo + 1)); }
function dateMinus(days) {
  const d = new Date("2026-03-21"); d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

// ── 1. Transactions (500 rows) ───────────────────────────────────────────────
function genTransactions() {
  const rng = mkRng(42);
  const customers = [
    "Aaliya Khan","Ben Carter","Carlos Mendez","Diana Zhao","Ethan Patel",
    "Fatima Al-Rashid","George Simmons","Hannah Schmidt","Ivan Petrov","Julia Novak",
    "Kevin Brooks","Layla Hassan","Marcus Webb","Nina Torres","Omar Farooq",
    "Priya Nair","Quinn Reyes","Rachel Thompson","Samuel Osei","Tara Singh",
    "Uma Sharma","Victor Lane","Wendy Cross","Xander Bell","Yuki Tanaka","Zoe Flynn",
  ];
  const categories = ["Electronics","Apparel","Home","Beauty","Sports","Books","Food","Tools","Toys","Outdoor"];
  const products = {
    Electronics: ["Wireless Earbuds","Mechanical Keyboard","USB-C Hub","Smart Watch","Webcam 4K","Laptop Stand","LED Desk Lamp","Portable SSD"],
    Apparel:     ["Merino Sweater","Linen Blazer","Running Shorts","Wool Socks","Puffer Jacket","Cotton Tee","Chino Pants","Fleece Hoodie"],
    Home:        ["Dutch Oven","French Press","Throw Blanket","Candle Set","Picture Frame","Bamboo Cutting Board","Soap Dispenser","Towel Set"],
    Beauty:      ["Vitamin C Serum","Moisturiser SPF50","Hair Mask","Face Roller","Lip Balm 3-pack","Sunscreen SPF30","Eye Cream","Toner"],
    Sports:      ["Foam Roller","Resistance Bands","Jump Rope","Yoga Mat","Water Bottle","Gym Gloves","Protein Shaker","Knee Sleeve"],
    Books:       ["Systems Thinking","Deep Work","Atomic Habits","The Manager's Path","Designing Data-Intensive Apps","LOTR Box Set","Sapiens","Dune"],
    Food:        ["Cold Brew Pack","Matcha Powder","Protein Bars 12pk","Olive Oil Extra Virgin","Hot Sauce Set","Granola Mix","Kombucha Case","Trail Mix"],
    Tools:       ["Drill Set","Level Laser","Stud Finder","Hex Key Set","Tape Measure 25ft","Safety Glasses","Work Gloves","Clamp Set"],
    Toys:        ["LEGO City Set","Nerf Blaster","Card Game","Puzzle 1000pc","RC Car","Magnetic Tiles","Play-Doh Pack","Slime Kit"],
    Outdoor:     ["Hydro Flask","Headlamp","Trekking Poles","Carabiner Set","First Aid Kit","Dry Bag","Tent Stakes","Compass"],
  };
  const channels = ["web","mobile","app","in-store"];
  const payments = ["Visa","MasterCard","AmEx","PayPal","Apple Pay","Stripe","Cash"];
  const statuses = ["completed","completed","completed","completed","refunded","returned","pending"];
  const rows = [];
  for (let i = 0; i < 500; i++) {
    const cat = pick(rng, categories);
    const product = pick(rng, products[cat]);
    const unitPrice = between(rng, 8, 480);
    const qty = betweenInt(rng, 1, 4);
    const discountPct = pick(rng, [0,0,0,5,10,15,20]);
    const subtotal = +(unitPrice * qty * (1 - discountPct/100)).toFixed(2);
    const tax = +(subtotal * between(rng, 0.05, 0.12)).toFixed(2);
    const shipping = discountPct > 0 || subtotal > 75 ? 0 : between(rng, 3.99, 12.99);
    rows.push({
      txn_id:      `TXN-${10000 + i}`,
      date:        dateMinus(betweenInt(rng, 0, 364)),
      customer:    pick(rng, customers),
      category:    cat,
      product,
      channel:     pick(rng, channels),
      qty,
      unit_price:  unitPrice,
      discount_pct:discountPct,
      subtotal,
      shipping:    +shipping.toFixed(2),
      tax,
      total:       +(subtotal + shipping + tax).toFixed(2),
      payment:     pick(rng, payments),
      status:      pick(rng, statuses),
      return_reason: null,
    });
  }
  return rows;
}

// ── 2. Daily Stock OHLCV — 6 tickers × 252 trading days ─────────────────────
function genStockHistory() {
  const rng = mkRng(99);
  const tickers = [
    { ticker:"AAPL", name:"Apple Inc.",       start:171.20, vol_base:55e6,  sector:"Technology"    },
    { ticker:"MSFT", name:"Microsoft Corp.",  start:375.10, vol_base:22e6,  sector:"Technology"    },
    { ticker:"NVDA", name:"NVIDIA Corp.",     start:490.20, vol_base:40e6,  sector:"Semiconductors"},
    { ticker:"JPM",  name:"JPMorgan Chase",   start:168.40, vol_base:10e6,  sector:"Financials"    },
    { ticker:"AMZN", name:"Amazon.com Inc.",  start:155.80, vol_base:35e6,  sector:"Consumer Disc."},
    { ticker:"XOM",  name:"Exxon Mobil Corp.",start:101.40, vol_base:16e6,  sector:"Energy"        },
  ];
  const rows = [];
  for (const t of tickers) {
    let price = t.start;
    for (let d = 251; d >= 0; d--) {
      const date = dateMinus(d * 1.4 | 0); // ~1.4 calendar days per trading day
      const drift = (rng() - 0.48) * 0.025;
      const open = +(price * (1 + (rng()-0.5)*0.008)).toFixed(2);
      const close = +(open * (1 + drift)).toFixed(2);
      const high = +(Math.max(open, close) * (1 + rng()*0.012)).toFixed(2);
      const low  = +(Math.min(open, close) * (1 - rng()*0.012)).toFixed(2);
      const volume = Math.floor(t.vol_base * between(rng, 0.5, 2.1));
      rows.push({ ticker:t.ticker, name:t.name, sector:t.sector, date, open, high, low, close, volume,
        pct_change: +(((close - open)/open)*100).toFixed(3) });
      price = close;
    }
  }
  return rows;
}

// ── 3. SaaS Customer Accounts (150 rows) ────────────────────────────────────
function genCustomerAccounts() {
  const rng = mkRng(7);
  const segments = ["Enterprise","Enterprise","Mid-Market","Mid-Market","Mid-Market","SMB","SMB","SMB","SMB","Startup"];
  const industries = ["Technology","Finance","Healthcare","Retail","Manufacturing","Media","Education","Legal","Energy","Logistics"];
  const plans = { Enterprise:["Enterprise Plus","Enterprise"], "Mid-Market":["Growth","Growth Plus"], SMB:["Starter","Pro"], Startup:["Free","Starter"] };
  const csms = ["Alex Tran","Brianna Cole","Chris Wu","Diana Osei","Ethan Patel","Fatima Shah"];
  const statuses = ["healthy","healthy","healthy","at-risk","churned","expanding"];
  const rows = [];
  const companies = [
    "Acme Corp","Globex","Initech","Umbrella Ltd","Soylent Co","Pied Piper","Hooli","Dunder Mifflin",
    "Vandelay Industries","Oceanic Airlines","Cyberdyne","Stark Industries","Wayne Enterprises",
    "Oscorp","LexCorp","Wonka Industries","Sterling Cooper","Pearson Specter","Dundler Mifflin Int.",
    "Prestige Worldwide","Paper Street Soap","Initech UK","Buy More","Bluth Company","Schrute Farms",
    "Planet Express","Sabre Corp","Weyland-Yutani","Virtucon","Omni Consumer Products",
  ];
  for (let i = 0; i < 150; i++) {
    const seg = pick(rng, segments);
    const plan = pick(rng, plans[seg]);
    const mrrMap = { "Enterprise Plus":18000,"Enterprise":9500,"Growth Plus":2800,"Growth":1400,"Pro":380,"Starter":120,"Free":0 };
    const mrr = mrrMap[plan] * between(rng, 0.8, 1.4);
    const health = pick(rng, statuses);
    rows.push({
      account_id:   `ACC-${2000+i}`,
      company:      companies[i % companies.length] + (i >= companies.length ? ` ${Math.floor(i/companies.length)+1}` : ""),
      segment:      seg,
      industry:     pick(rng, industries),
      plan,
      mrr:          +mrr.toFixed(0),
      arr:          +(mrr*12).toFixed(0),
      seats:        betweenInt(rng, seg==="Enterprise"?50:seg==="Mid-Market"?10:1, seg==="Enterprise"?500:seg==="Mid-Market"?60:15),
      health_score: betweenInt(rng, health==="churned"?10:health==="at-risk"?20:60, health==="churned"?35:health==="at-risk"?55:100),
      status:       health,
      nps:          health==="churned" ? betweenInt(rng,-50,20) : betweenInt(rng, health==="at-risk"?0:40, 100),
      days_since_login: health==="churned" ? betweenInt(rng,60,180) : health==="at-risk" ? betweenInt(rng,14,45) : betweenInt(rng,0,7),
      contract_start: dateMinus(betweenInt(rng, 90, 1200)),
      renewal_date:   dateMinus(betweenInt(rng, -180, 90)),
      csm:          pick(rng, csms),
      country:      pick(rng, ["US","US","US","GB","DE","FR","CA","AU","SG","JP"]),
      feature_usage_pct: betweenInt(rng, health==="churned"?5:health==="at-risk"?15:40, health==="churned"?20:health==="at-risk"?45:100),
    });
  }
  return rows;
}

// ── 4. Hourly Web Traffic — 30 days × 24 hours ───────────────────────────────
function genHourlyTraffic() {
  const rng = mkRng(13);
  const rows = [];
  const sources = ["organic","paid_search","direct","social","email","referral"];
  for (let day = 29; day >= 0; day--) {
    const date = dateMinus(day);
    const isWeekend = [0,6].includes(new Date(date).getDay());
    for (let hour = 0; hour < 24; hour++) {
      const baseTraffic = isWeekend ? 2200 : 3800;
      const hourMultiplier = hour < 6 ? 0.1 : hour < 9 ? 0.4 : hour < 12 ? 1.0 : hour < 14 ? 1.2 : hour < 17 ? 1.1 : hour < 20 ? 0.9 : hour < 22 ? 0.6 : 0.3;
      const sessions = Math.floor(baseTraffic * hourMultiplier * between(rng, 0.75, 1.35));
      const bounce_rate = between(rng, 38, 72);
      const avg_session_sec = betweenInt(rng, 55, 280);
      rows.push({
        date, hour,
        datetime: `${date}T${String(hour).padStart(2,"0")}:00:00Z`,
        sessions,
        pageviews:     Math.floor(sessions * between(rng, 1.8, 4.2)),
        new_visitors:  Math.floor(sessions * between(rng, 0.38, 0.65)),
        bounce_rate_pct: bounce_rate,
        avg_session_sec,
        conversions:   Math.floor(sessions * between(rng, 0.008, 0.028)),
        top_source:    pick(rng, sources),
        server_errors: betweenInt(rng, 0, hour===3&&rng()<0.05?45:3),
      });
    }
  }
  return rows;
}

// ── 5. HR Survey — 120 employees, 14 Likert questions ────────────────────────
function genHrSurvey() {
  const rng = mkRng(21);
  const depts = ["Engineering","Marketing","Sales","Design","HR","Finance","DevOps","Executive"];
  const tenures = ["<1yr","1-2yr","2-4yr","4-7yr","7+yr"];
  const levels  = ["IC1","IC2","IC3","Senior","Staff","Manager","Director","VP","C-Suite"];
  const locs    = ["NYC","LA","Chicago","Remote","Austin","London","Toronto","Sydney"];
  const questions = [
    "I understand the company's strategy",
    "My manager supports my growth",
    "I have the tools I need to do my job",
    "I feel recognised for my contributions",
    "Communication from leadership is clear",
    "My workload is manageable",
    "I trust senior leadership",
    "I see a clear career path here",
    "My team collaborates well",
    "I feel psychologically safe to speak up",
    "My compensation is fair",
    "I'm proud to work here",
    "I would recommend this company to a friend",
    "I plan to still be here in 12 months",
  ];
  const rows = [];
  for (let i = 0; i < 120; i++) {
    const dept = pick(rng, depts);
    const level = pick(rng, levels);
    const tenure = pick(rng, tenures);
    const baseSentiment = dept==="Executive"?4.2:dept==="DevOps"?3.6:dept==="Sales"?3.2:3.8;
    const row = {
      respondent_id: `EMP-${i+100}`,
      dept, level, tenure,
      location: pick(rng, locs),
      gender: pick(rng, ["M","F","M","F","Non-binary","Prefer not to say"]),
      age_band: pick(rng, ["22-27","28-34","35-44","45-54","55+"]),
      submitted: dateMinus(betweenInt(rng, 0, 14)),
    };
    for (const q of questions) {
      const score = Math.min(5, Math.max(1, Math.round(baseSentiment + (rng()-0.5)*2.4)));
      row[q] = score;
    }
    row.enps = row["I would recommend this company to a friend"] >= 4 ? "promoter" :
               row["I would recommend this company to a friend"] <= 2 ? "detractor" : "passive";
    row.overall_avg = +(questions.reduce((s,q)=>s+row[q],0)/questions.length).toFixed(2);
    rows.push(row);
  }
  return rows;
}

// ── 6. Logistics Shipments (200 rows) ────────────────────────────────────────
function genShipments() {
  const rng = mkRng(33);
  const origins = ["Chicago IL","Los Angeles CA","Newark NJ","Dallas TX","Atlanta GA","Seattle WA","Miami FL","Phoenix AZ"];
  const destinations = [
    "New York NY","London UK","Toronto CA","Sydney AU","Frankfurt DE","Singapore SG",
    "Tokyo JP","São Paulo BR","Dubai AE","Mumbai IN","Seoul KR","Amsterdam NL",
    "Paris FR","Mexico City MX","Jakarta ID","Nairobi KE",
  ];
  const carriers = ["FedEx","UPS","DHL","USPS","Amazon Logistics","Maersk","DB Schenker"];
  const modes = ["air","air","ground","ground","ground","ocean","rail"];
  const statuses = ["delivered","delivered","delivered","in-transit","in-transit","delayed","exception","cancelled"];
  const products = ["Electronics","Auto Parts","Pharma","Consumer Goods","Industrial Equipment","Apparel","Food & Bev","Raw Materials"];
  const rows = [];
  for (let i = 0; i < 200; i++) {
    const mode = pick(rng, modes);
    const sla_days = mode==="air"?3:mode==="ocean"?28:mode==="rail"?8:5;
    const actual_days = sla_days + betweenInt(rng, -1, 5);
    const weight_kg = between(rng, 0.5, 1200);
    const status = pick(rng, statuses);
    rows.push({
      shipment_id:    `SHP-${30000+i}`,
      created_date:   dateMinus(betweenInt(rng, 0, 90)),
      origin:         pick(rng, origins),
      destination:    pick(rng, destinations),
      carrier:        pick(rng, carriers),
      mode,
      product_type:   pick(rng, products),
      weight_kg:      +weight_kg.toFixed(1),
      volume_m3:      +(weight_kg * between(rng, 0.002, 0.008)).toFixed(3),
      declared_value: +between(rng, 50, 85000).toFixed(0),
      freight_cost:   +(weight_kg * (mode==="air"?8.5:mode==="ocean"?1.2:3.2) * between(rng,0.8,1.3)).toFixed(2),
      sla_days,
      actual_days:    status==="delivered"?actual_days:null,
      on_time:        status==="delivered"?actual_days<=sla_days:null,
      status,
      exception_code: status==="exception"?pick(rng,["DAMAGED","ADDRESS_ERROR","CUSTOMS_HOLD","REFUSED"]):null,
      customs_cleared:mode!=="ground",
      tracking_events: betweenInt(rng, 2, 12),
    });
  }
  return rows;
}

// ── 7. Marketing Attribution (A/B tests + channel data, 300 rows) ────────────
function genMarketingAttribution() {
  const rng = mkRng(55);
  const campaigns = [
    { name:"Spring Sale Email Blast",       channel:"email",       budget:4200  },
    { name:"LinkedIn Enterprise ABM Q1",    channel:"paid_social", budget:32000 },
    { name:"Google Brand Search",           channel:"sem",         budget:18500 },
    { name:"Content: AI in Finance Blog",   channel:"content",     budget:2800  },
    { name:"G2 Review Incentive",           channel:"review",      budget:5500  },
    { name:"Cold SDR Outbound",             channel:"outbound",    budget:62000 },
    { name:"Partner Referral Q1",           channel:"partner",     budget:15000 },
    { name:"Retargeting Display",           channel:"display",     budget:9800  },
    { name:"YouTube Pre-roll: Demo",        channel:"video",       budget:14000 },
    { name:"Webinar: Data Security",        channel:"webinar",     budget:6200  },
    { name:"Podcast: The SaaS Playbook",    channel:"podcast",     budget:8800  },
    { name:"Twitter/X Awareness",          channel:"paid_social", budget:5200  },
  ];
  const segments = ["Enterprise","Mid-Market","SMB","Startup"];
  const rows = [];
  for (let i = 0; i < 300; i++) {
    const c = pick(rng, campaigns);
    const seg = pick(rng, segments);
    const clicks = betweenInt(rng, 20, 8000);
    const impressions = Math.floor(clicks * between(rng, 8, 120));
    const leads = Math.floor(clicks * between(rng, 0.02, 0.18));
    const opps = Math.floor(leads * between(rng, 0.12, 0.35));
    const closed = Math.floor(opps * between(rng, 0.1, 0.5));
    const revenue = closed * between(rng, 800, 120000);
    rows.push({
      record_id:    `MKT-${5000+i}`,
      week:         dateMinus(betweenInt(rng,0,52)*7),
      campaign:     c.name,
      channel:      c.channel,
      segment:      seg,
      impressions,
      clicks,
      ctr_pct:      +((clicks/impressions)*100).toFixed(3),
      spend:        +(c.budget * between(rng, 0.02, 0.22)).toFixed(0),
      leads,
      mqls:         Math.floor(leads * between(rng, 0.3, 0.7)),
      opps,
      closed_won:   closed,
      revenue:      +revenue.toFixed(0),
      roi_pct:      closed>0 ? +(((revenue - c.budget)/c.budget)*100).toFixed(1) : -100,
      avg_deal_size:closed>0 ? +(revenue/closed).toFixed(0) : 0,
      cost_per_lead: leads>0 ? +(c.budget/leads).toFixed(2) : null,
    });
  }
  return rows;
}

// ── 8. Hospital ED Visit Records (100 rows) ──────────────────────────────────
function genEdVisits() {
  const rng = mkRng(71);
  const chiefComplaints = [
    "Chest pain","Shortness of breath","Abdominal pain","Head injury","Laceration",
    "Fever","Back pain","Fracture","Allergic reaction","Stroke symptoms",
    "Seizure","Urinary tract infection","Nausea/vomiting","Dizziness","Syncope",
    "Hypertensive urgency","Asthma exacerbation","Anxiety/panic attack","Cellulitis","Overdose",
  ];
  const dispositions = ["discharged","admitted","transferred","left AMA","deceased"];
  const dispositionWeights = [0.62,0.28,0.06,0.03,0.01];
  const insurances = ["Medicare","Medicaid","Blue Cross","Aetna","UnitedHealth","Cigna","Self-pay","Tricare"];
  const rows = [];
  let r = rng;
  function weightedPick(arr, weights) {
    const x = r(); let cum = 0;
    for (let i=0;i<arr.length;i++) { cum+=weights[i]; if(x<cum) return arr[i]; }
    return arr[arr.length-1];
  }
  for (let i = 0; i < 100; i++) {
    const acuity = betweenInt(rng, 1, 5); // 1=most critical
    const los_min = acuity===1?betweenInt(rng,180,720):acuity===2?betweenInt(rng,90,360):betweenInt(rng,30,240);
    const disp = weightedPick(dispositions, dispositionWeights);
    rows.push({
      visit_id:         `ED-${20000+i}`,
      arrival_date:     dateMinus(betweenInt(rng,0,90)),
      arrival_time:     `${String(betweenInt(rng,0,23)).padStart(2,"0")}:${pick(rng,["00","15","30","45"])}`,
      age:              betweenInt(rng,1,94),
      sex:              pick(rng,["M","F","M","F","Other"]),
      chief_complaint:  pick(rng,chiefComplaints),
      acuity_level:     acuity,
      triage_to_provider_min: betweenInt(rng, acuity<3?2:10, acuity<3?18:85),
      los_minutes:      los_min,
      insurance:        pick(rng,insurances),
      disposition:      disp,
      admitted_to_icu:  disp==="admitted"&&rng()<0.2,
      labs_ordered:     rng()<0.7,
      imaging_ordered:  rng()<0.55,
      consult_requested:rng()<0.3,
      pain_score_arrival: betweenInt(rng,0,10),
      pain_score_discharge: disp==="discharged"?betweenInt(rng,0,5):null,
      readmit_30day:    rng()<0.08,
      left_without_seen:rng()<0.04,
    });
  }
  return rows;
}

// ── 9. Energy / Utility Readings — daily for 365 days ────────────────────────
function genEnergyReadings() {
  const rng = mkRng(88);
  const buildings = [
    { id:"HQ-TOWER",   type:"Office",     floors:22, sqft:210000, solar:true  },
    { id:"WAREHOUSE-A",type:"Warehouse",  floors:1,  sqft:85000,  solar:false },
    { id:"DATA-CENTER",type:"Data Center",floors:2,  sqft:12000,  solar:true  },
    { id:"RETAIL-01",  type:"Retail",     floors:2,  sqft:18000,  solar:false },
  ];
  const rows = [];
  for (let day = 364; day >= 0; day--) {
    const date = dateMinus(day);
    const month = new Date(date).getMonth();
    const isWeekend = [0,6].includes(new Date(date).getDay());
    const tempC = between(rng, month<2||month>10?-8:month<5||month>8?8:18, month<2||month>10?5:month<5||month>8?22:34);
    for (const b of buildings) {
      const baseKwh = b.type==="Data Center"?4200:b.type==="Office"?1800*(isWeekend?0.3:1):b.type==="Warehouse"?620:340;
      const hvac_factor = Math.abs(tempC-20)/10 * 0.4 + 1;
      const consumption = +(baseKwh * hvac_factor * between(rng,0.88,1.14)).toFixed(1);
      const solar_gen = b.solar ? +(between(rng, month>=4&&month<=8?180:40, month>=4&&month<=8?420:140)).toFixed(1) : 0;
      rows.push({
        date, building_id:b.id, building_type:b.type,
        temp_c:           +tempC.toFixed(1),
        is_weekend:       isWeekend,
        consumption_kwh:  consumption,
        solar_gen_kwh:    solar_gen,
        net_kwh:          +(consumption - solar_gen).toFixed(1),
        cost_usd:         +(consumption * 0.112).toFixed(2),
        carbon_kg:        +(consumption * 0.000415).toFixed(3),
        peak_demand_kw:   +(consumption / (isWeekend?6:9) * between(rng,1.1,1.6)).toFixed(1),
        water_gallons:    b.type==="Office"?betweenInt(rng,isWeekend?200:800,isWeekend?400:1800):betweenInt(rng,50,300),
      });
    }
  }
  return rows;
}

// ── 10. A/B Test User-level Data (400 rows) ──────────────────────────────────
function genAbTestData() {
  const rng = mkRng(101);
  const experiments = [
    { name:"Checkout CTA Colour",    variants:["control_blue","treatment_green"], metric:"checkout_rate",    baseRate:0.062 },
    { name:"Onboarding Flow v2",     variants:["control","new_flow"],             metric:"activation_rate",  baseRate:0.41  },
    { name:"Pricing Page Layout",    variants:["3-col","2-col-hero"],             metric:"trial_signup_rate",baseRate:0.034 },
    { name:"Email Subject Line",     variants:["feature_focus","social_proof"],   metric:"open_rate",        baseRate:0.228 },
  ];
  const devices = ["desktop","desktop","mobile","tablet"];
  const countries = ["US","US","US","GB","DE","CA","AU","FR"];
  const rows = [];
  for (let i = 0; i < 400; i++) {
    const exp = pick(rng, experiments);
    const variant = pick(rng, exp.variants);
    const lift = variant.includes("control")||variant.includes("blue")||variant==="3-col"||variant==="feature_focus" ? 0 : between(rng,-0.05,0.18);
    const converted = rng() < exp.baseRate * (1+lift);
    rows.push({
      user_id:        `USR-${80000+i}`,
      experiment:     exp.name,
      variant,
      is_control:     variant.includes("control") || variant==="control_blue" || variant==="3-col" || variant==="feature_focus",
      assigned_date:  dateMinus(betweenInt(rng,0,30)),
      device:         pick(rng,devices),
      country:        pick(rng,countries),
      sessions:       betweenInt(rng,1,12),
      pages_viewed:   betweenInt(rng,1,28),
      time_on_site_sec: betweenInt(rng,12,1800),
      [exp.metric]:   converted,
      revenue:        converted ? between(rng,0,850) : 0,
      bounced:        rng()<0.42,
      new_user:       rng()<0.58,
    });
  }
  return rows;
}

// ── 11. Crypto Market Data — 8 coins × 180 days ──────────────────────────────
function genCryptoHistory() {
  const rng = mkRng(117);
  const coins = [
    { symbol:"BTC", name:"Bitcoin",       start:42800,  vol_base:28e9  },
    { symbol:"ETH", name:"Ethereum",      start:2240,   vol_base:12e9  },
    { symbol:"BNB", name:"BNB",           start:312,    vol_base:1.8e9 },
    { symbol:"SOL", name:"Solana",        start:98,     vol_base:2.4e9 },
    { symbol:"ADA", name:"Cardano",       start:0.52,   vol_base:0.6e9 },
    { symbol:"XRP", name:"XRP",           start:0.62,   vol_base:1.1e9 },
    { symbol:"DOGE",name:"Dogecoin",      start:0.088,  vol_base:0.9e9 },
    { symbol:"LINK",name:"Chainlink",     start:14.20,  vol_base:0.5e9 },
  ];
  const rows = [];
  for (const c of coins) {
    let price = c.start;
    let market_cap = price * (c.symbol==="BTC"?19.7e6:c.symbol==="ETH"?120e6:c.symbol==="BNB"?150e6:c.symbol==="SOL"?440e6:c.symbol==="ADA"?35e9:c.symbol==="XRP"?52e9:c.symbol==="DOGE"?140e9:590e6);
    for (let d = 179; d >= 0; d--) {
      const date = dateMinus(d);
      const drift = (rng() - 0.46) * 0.06;
      const open = price;
      const dp = c.start>100?2:c.start>1?4:6;
      const close = +(open * (1+drift)).toFixed(dp);
      const high = +(Math.max(open,close)*(1+rng()*0.04)).toFixed(dp);
      const low  = +(Math.min(open,close)*(1-rng()*0.04)).toFixed(dp);
      const volume_usd = +(c.vol_base * between(rng,0.4,2.8)).toFixed(0);
      market_cap = +(market_cap * (close/open)).toFixed(0);
      rows.push({ symbol:c.symbol, name:c.name, date, open, high, low, close, volume_usd, market_cap,
        pct_change:+(((close-open)/open)*100).toFixed(3),
        dominance_pct: c.symbol==="BTC"?+between(rng,42,55).toFixed(1):c.symbol==="ETH"?+between(rng,16,22).toFixed(1):+between(rng,0.5,4).toFixed(2),
      });
      price = close;
    }
  }
  return rows;
}

// ── 12. Recruitment Pipeline (180 rows) ──────────────────────────────────────
function genRecruitment() {
  const rng = mkRng(143);
  const roles = [
    { title:"Senior Backend Engineer", dept:"Engineering", level:"Senior", salary_min:145000, salary_max:185000 },
    { title:"Product Manager",         dept:"Product",     level:"Manager",salary_min:135000, salary_max:170000 },
    { title:"Data Scientist",          dept:"Engineering", level:"Senior", salary_min:148000, salary_max:190000 },
    { title:"UX Designer",             dept:"Design",      level:"Mid",    salary_min:105000, salary_max:135000 },
    { title:"Account Executive",       dept:"Sales",       level:"Senior", salary_min:80000,  salary_max:180000 },
    { title:"DevOps Engineer",         dept:"Engineering", level:"Senior", salary_min:138000, salary_max:175000 },
    { title:"Content Marketing Mgr",   dept:"Marketing",   level:"Manager",salary_min:98000,  salary_max:128000 },
    { title:"Customer Success Mgr",    dept:"CS",          level:"Senior", salary_min:88000,  salary_max:118000 },
    { title:"Junior Frontend Dev",     dept:"Engineering", level:"Junior", salary_min:85000,  salary_max:110000 },
    { title:"Finance Analyst",         dept:"Finance",     level:"Mid",    salary_min:92000,  salary_max:120000 },
  ];
  const stages = ["applied","phone_screen","technical","onsite","offer","hired","rejected","withdrawn"];
  const stageWeights = [0.30,0.20,0.15,0.10,0.08,0.06,0.08,0.03];
  const sources = ["LinkedIn","Referral","Indeed","Company Website","Recruiter","AngelList","GitHub","Glassdoor"];
  const countries = ["US","US","US","US","GB","CA","DE","IN","AU","BR"];
  const rows = [];
  let r = rng;
  function wpick(arr, w) { const x=r(); let c=0; for(let i=0;i<arr.length;i++){c+=w[i];if(x<c)return arr[i];} return arr[arr.length-1]; }
  for (let i = 0; i < 180; i++) {
    const role = pick(rng, roles);
    const stage = wpick(stages, stageWeights);
    const applied = dateMinus(betweenInt(rng,0,120));
    rows.push({
      candidate_id:    `CAND-${4000+i}`,
      role:            role.title,
      dept:            role.dept,
      level:           role.level,
      source:          pick(rng,sources),
      applied_date:    applied,
      stage,
      days_in_pipeline:betweenInt(rng,1,stage==="hired"?60:45),
      country:         pick(rng,countries),
      yoe:             betweenInt(rng,role.level==="Junior"?0:role.level==="Mid"?2:5, role.level==="Junior"?3:role.level==="Mid"?6:15),
      salary_expectation: betweenInt(rng, role.salary_min, role.salary_max),
      offered_salary:  stage==="offer"||stage==="hired" ? betweenInt(rng, role.salary_min, role.salary_max) : null,
      interview_score: stage!=="applied"&&stage!=="phone_screen" ? between(rng,1,5) : null,
      diversity_flag:  rng()<0.42,
      rejected_reason: stage==="rejected"?pick(rng,["underqualified","salary_mismatch","cultural_fit","offer_declined","withdrew","position_filled"]):null,
      recruiter:       pick(rng,["Rachel Thompson","Emma Singh","David Park","Yara Moss"]),
    });
  }
  return rows;
}

module.exports = {
  transactions:         genTransactions(),
  stock_history:        genStockHistory(),
  customer_accounts:    genCustomerAccounts(),
  hourly_web_traffic:   genHourlyTraffic(),
  hr_survey:            genHrSurvey(),
  shipments:            genShipments(),
  marketing_attribution:genMarketingAttribution(),
  ed_visits:            genEdVisits(),
  energy_readings:      genEnergyReadings(),
  ab_test_results:      genAbTestData(),
  crypto_history:       genCryptoHistory(),
  recruitment_pipeline: genRecruitment(),
};
