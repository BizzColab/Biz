const REFUSAL_MESSAGE =
  "I can only answer questions about your organization's business data and operational insights.";

// ── Snapshot cache: avoids re-querying MongoDB on every message ──
const SNAPSHOT_TTL_MS = 5 * 60 * 1000; // 5 minutes
const snapshotCache = new Map();
const RETRIEVAL_TTL_MS = 2 * 60 * 1000; // 2 minutes
const retrievalCache = new Map();

const nowMs = () => Date.now();

const formatDuration = (startMs) => `${nowMs() - startMs}ms`;

const logInsightTiming = (payload) => {
  console.info('[business-insights]', payload);
};

const getCachedSnapshot = (tenantId) => {
  const entry = snapshotCache.get(tenantId);
  if (entry && Date.now() - entry.ts < SNAPSHOT_TTL_MS) {
    return entry.data;
  }
  snapshotCache.delete(tenantId);
  return null;
};

const setCachedSnapshot = (tenantId, data) => {
  snapshotCache.set(tenantId, { data, ts: Date.now() });
};

const getCachedRetrieval = (cacheKey) => {
  const entry = retrievalCache.get(cacheKey);
  if (entry && nowMs() - entry.ts < RETRIEVAL_TTL_MS) {
    return entry.data;
  }
  retrievalCache.delete(cacheKey);
  return null;
};

const setCachedRetrieval = (cacheKey, data) => {
  retrievalCache.set(cacheKey, { data, ts: nowMs() });
};

const OUT_OF_SCOPE_PATTERNS = [
  /weather|temperature|forecast/i,
  /movie|series|tv show|netflix|song|lyrics|poem|joke/i,
  /football|cricket|nba|fifa|ipl|match score/i,
  /politics|election|president|prime minister/i,
  /medical|diagnosis|symptom|treatment/i,
  /relationship|dating|love advice/i,
  /recipe|cook|bake/i,
  /debug my code|write code|programming|javascript|react|node\.js/i,
  /ignore previous instructions|system prompt|developer message/i,
];

const getGeminiEndpoint = () => {
  const model = process.env.GEMINI_MODEL || 'gemma-3-12b-it';
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
};

const normalizeMessages = (messages = []) => {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message) => message && ['user', 'assistant'].includes(message.role))
    .map((message) => ({
      role: message.role,
      content: String(message.content || '').trim().slice(0, 2000),
    }))
    .filter((message) => message.content)
    .slice(-6);
};

const tokenizeText = (value = '') => {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token && token.length > 2);
};

const uniqueTokens = (value) => [...new Set(tokenizeText(value))];

const hasAnyPattern = (patterns, question) => patterns.some((pattern) => pattern.test(question));

const isGreeting = (question) => hasAnyPattern([/^(hi|hello|hey|good morning|good afternoon|good evening)\b/i], question);

const isThanks = (question) => hasAnyPattern([/\b(thanks|thank you|thx)\b/i], question);

const isObviouslyOutOfScope = (question) => {
  if (!question) {
    return true;
  }

  return OUT_OF_SCOPE_PATTERNS.some((pattern) => pattern.test(question));
};

const formatCurrencyAmount = (amount, currency) => {
  if (amount == null) {
    return '0';
  }

  const numericAmount = Number(amount) || 0;
  return currency ? `${numericAmount} ${currency}` : `${numericAmount}`;
};

const buildDirectAnswer = (snapshot, question) => {
  const normalizedQuestion = String(question || '').trim();
  const lowerQuestion = normalizedQuestion.toLowerCase();
  const { organization, kpis, topClients, recentInvoices, recentPayments } = snapshot;

  if (isGreeting(normalizedQuestion)) {
    return `Hello. I can help with ${organization.companyName}'s invoices, payments, collections, clients, and business performance.`;
  }

  if (isThanks(normalizedQuestion)) {
    return `You're welcome. Ask if you want a quick view of ${organization.companyName}'s collections, invoices, clients, or outstanding balances.`;
  }

  const directRules = [
    {
      patterns: [/\bhow many clients\b/i, /\bnumber of clients\b/i, /\btotal clients\b/i, /\bcustomer count\b/i],
      answer: () => `There are ${kpis.clientCount} active clients in ${organization.companyName}.`,
    },
    {
      patterns: [/\bhow many invoices\b/i, /\bnumber of invoices\b/i, /\btotal invoices\b/i],
      answer: () => `There are ${kpis.invoiceCount} invoices in the current tenant snapshot.`,
    },
    {
      patterns: [/\bhow many payments\b/i, /\bnumber of payments\b/i, /\btotal payments\b/i],
      answer: () => `There are ${kpis.paymentCount} payments recorded in the current tenant snapshot.`,
    },
    {
      patterns: [/\bhow many quotes\b/i, /\bnumber of quotes\b/i, /\btotal quotes\b/i],
      answer: () => `There are ${kpis.quoteCount} quotes in the current tenant snapshot, with ${kpis.draftQuoteCount} still in draft.`,
    },
    {
      patterns: [/\boutstanding\b/i, /\bamount due\b/i, /\bopen balance\b/i],
      answer: () => `Outstanding amount is ${formatCurrencyAmount(kpis.outstandingAmount)} across the current tenant snapshot.`,
    },
    {
      patterns: [/\bcollected\b/i, /\bcollections\b/i, /\bpayments collected\b/i],
      answer: () => `Total collected amount is ${formatCurrencyAmount(kpis.totalCollected)}.`,
    },
    {
      patterns: [/\brevenue\b/i, /\btotal invoiced\b/i, /\btotal sales\b/i],
      answer: () => `Total invoiced amount is ${formatCurrencyAmount(kpis.totalInvoiced)}.`,
    },
    {
      patterns: [/\boverdue\b/i, /\boverdue invoices\b/i],
      answer: () => `There are ${kpis.overdueInvoiceCount} overdue invoices in the current tenant snapshot.`,
    },
    {
      patterns: [/\bunpaid\b/i, /\bunpaid invoices\b/i],
      answer: () => `There are ${kpis.unpaidInvoiceCount} unpaid invoices in the current tenant snapshot.`,
    },
    {
      patterns: [/\btop client\b/i, /\bbest client\b/i, /\bbiggest client\b/i],
      answer: () => {
        const topClient = topClients?.[0];
        if (!topClient) {
          return 'No top client data is available in the current snapshot.';
        }

        return `${topClient.name} is the top client in the current snapshot with ${topClient.invoiceCount} invoices and total invoiced amount of ${formatCurrencyAmount(topClient.totalInvoiced)}.`;
      },
    },
    {
      patterns: [/\blatest invoice\b/i, /\bmost recent invoice\b/i],
      answer: () => {
        const invoice = recentInvoices?.[0];
        if (!invoice) {
          return 'There are no recent invoices in the current snapshot.';
        }

        return `The latest invoice is #${invoice.number} for ${invoice.clientName}, amount ${formatCurrencyAmount(invoice.total, invoice.currency)}, status ${invoice.status}, payment status ${invoice.paymentStatus}.`;
      },
    },
    {
      patterns: [/\blatest payment\b/i, /\bmost recent payment\b/i],
      answer: () => {
        const payment = recentPayments?.[0];
        if (!payment) {
          return 'There are no recent payments in the current snapshot.';
        }

        return `The latest payment is #${payment.number} from ${payment.clientName}, amount ${formatCurrencyAmount(payment.amount, payment.currency)}, linked invoice #${payment.invoiceNumber || 'N/A'}.`;
      },
    },
  ];

  for (const rule of directRules) {
    if (hasAnyPattern(rule.patterns, lowerQuestion)) {
      return rule.answer();
    }
  }

  return null;
};

const buildTopClients = async (Invoice, Client, tenantId) => {
  const rows = await Invoice.aggregate([
    {
      $match: {
        removed: false,
        tenantId,
      },
    },
    {
      $group: {
        _id: '$client',
        totalInvoiced: { $sum: { $ifNull: ['$total', 0] } },
        invoiceCount: { $sum: 1 },
      },
    },
    { $sort: { totalInvoiced: -1 } },
    { $limit: 5 },
  ]);

  const clientIds = rows.map((row) => row._id).filter(Boolean);
  const clients = await Client.find({
    _id: { $in: clientIds },
    removed: false,
    tenantId,
  })
    .select('name email phone')
    .lean();

  const clientMap = new Map(clients.map((client) => [String(client._id), client]));

  return rows.map((row) => {
    const client = clientMap.get(String(row._id));

    return {
      clientId: row._id,
      name: client?.name || 'Unknown Client',
      email: client?.email || null,
      phone: client?.phone || null,
      invoiceCount: row.invoiceCount,
      totalInvoiced: row.totalInvoiced,
    };
  });
};

const buildSnapshot = async ({ models, tenantId, user }) => {
  const { Client, Invoice, Quote, Payment, PaymentMode, Taxes } = models;

  const [
    clientCount,
    invoiceCount,
    quoteCount,
    paymentCount,
    paymentModeCount,
    taxCount,
    overdueInvoiceCount,
    unpaidInvoiceCount,
    draftQuoteCount,
    invoiceTotals,
    paymentTotals,
    invoiceStatusBreakdown,
    recentInvoices,
    recentPayments,
    topClients,
  ] = await Promise.all([
    Client.countDocuments({ tenantId, removed: false }),
    Invoice.countDocuments({ tenantId, removed: false }),
    Quote.countDocuments({ tenantId, removed: false }),
    Payment.countDocuments({ tenantId, removed: false }),
    PaymentMode.countDocuments({ tenantId, removed: false }),
    Taxes.countDocuments({ tenantId, removed: false }),
    Invoice.countDocuments({ tenantId, removed: false, isOverdue: true }),
    Invoice.countDocuments({ tenantId, removed: false, paymentStatus: { $ne: 'paid' } }),
    Quote.countDocuments({ tenantId, removed: false, status: 'draft' }),
    Invoice.aggregate([
      {
        $match: {
          tenantId,
          removed: false,
        },
      },
      {
        $group: {
          _id: null,
          totalInvoiced: { $sum: { $ifNull: ['$total', 0] } },
          totalCollectedInInvoices: { $sum: { $ifNull: ['$credit', 0] } },
          totalDiscount: { $sum: { $ifNull: ['$discount', 0] } },
        },
      },
    ]),
    Payment.aggregate([
      {
        $match: {
          tenantId,
          removed: false,
        },
      },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: { $ifNull: ['$amount', 0] } },
        },
      },
    ]),
    Invoice.aggregate([
      {
        $match: {
          tenantId,
          removed: false,
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]),
    Invoice.find({ tenantId, removed: false })
      .sort({ date: -1 })
      .limit(5)
      .populate('client', 'name email')
      .lean(),
    Payment.find({ tenantId, removed: false })
      .sort({ date: -1 })
      .limit(5)
      .populate('client', 'name')
      .populate('invoice', 'number')
      .populate('paymentMode', 'name')
      .lean(),
    buildTopClients(Invoice, Client, tenantId),
  ]);

  const totals = invoiceTotals[0] || {};
  const paymentSummary = paymentTotals[0] || {};

  const totalInvoiced = totals.totalInvoiced || 0;
  const totalDiscount = totals.totalDiscount || 0;
  const totalCollected = paymentSummary.totalPayments || totals.totalCollectedInInvoices || 0;
  const outstandingAmount = Math.max(totalInvoiced - totalDiscount - totalCollected, 0);

  return {
    organization: {
      tenantId,
      companyName: user?.companyName || 'Unknown Organization',
      contactEmail: user?.email || null,
      role: user?.role || 'owner',
    },
    kpis: {
      clientCount,
      invoiceCount,
      quoteCount,
      paymentCount,
      paymentModeCount,
      taxCount,
      totalInvoiced,
      totalCollected,
      totalDiscount,
      outstandingAmount,
      overdueInvoiceCount,
      unpaidInvoiceCount,
      draftQuoteCount,
    },
    invoiceStatusBreakdown: invoiceStatusBreakdown.map((item) => ({
      status: item._id || 'unknown',
      count: item.count,
    })),
    recentInvoices: recentInvoices.map((invoice) => ({
      number: invoice.number,
      clientName: invoice.client?.name || 'Unknown Client',
      total: invoice.total,
      currency: invoice.currency,
      status: invoice.status,
      paymentStatus: invoice.paymentStatus,
      date: invoice.date,
      expiredDate: invoice.expiredDate,
    })),
    recentPayments: recentPayments.map((payment) => ({
      number: payment.number,
      clientName: payment.client?.name || 'Unknown Client',
      invoiceNumber: payment.invoice?.number || null,
      paymentMode: payment.paymentMode?.name || null,
      amount: payment.amount,
      currency: payment.currency,
      date: payment.date,
    })),
    topClients,
    generatedAt: new Date().toISOString(),
  };
};

const getSystemPrompt = () => {
  return [
    'You are the BizCollab Business Insights Assistant for a single organization.',
    'If the user simply greets you or says thanks (e.g., "Hi", "Hello", "Thanks"), respond politely and ask how you can help them with their business insights.',
    'Otherwise, you must answer only questions related to the organization\'s business data, financial operations, clients, invoices, quotes, payments, taxes, collections, and performance insights.',
    'Use only the provided organization snapshot and conversation context.',
    'Do not invent facts, numbers, dates, trends, or records that are not present in the provided data.',
    'If the user asks a question outside business usage or that clearly cannot be answered by the provided organization data, reply with exactly this sentence and nothing else:',
    REFUSAL_MESSAGE,
    'When answering valid questions, be concise, practical, and data-grounded. Use bullets when useful.',
  ].join(' ');
};

// ── Question-aware section selection ──
// Only include data sections relevant to the user's question
const SECTION_RULES = [
  { key: 'invoices',  pattern: /invoice|bill|overdue|expired|due|status/i },
  { key: 'payments',  pattern: /payment|collect|receiv|paid|unpaid|outstanding|cash/i },
  { key: 'clients',   pattern: /client|customer|top|best|biggest/i },
  { key: 'finance',   pattern: /revenue|total|amount|money|financ|discount|earning|income|profit|loss/i },
];

const detectRelevantSections = (question) => {
  if (!question) return new Set(['invoices', 'payments', 'clients', 'finance']);

  const matched = new Set();
  for (const rule of SECTION_RULES) {
    if (rule.pattern.test(question)) matched.add(rule.key);
  }

  // Broad or greeting questions → include all
  if (matched.size === 0) {
    const isBroad = /overview|summary|everything|dashboard|report|how.*doing|insight|performance|kpi/i.test(question);
    if (isBroad) return new Set(['invoices', 'payments', 'clients', 'finance']);
    // For greetings or very simple questions, just KPIs are enough
    return new Set();
  }

  return matched;
};

const getRetrievalCacheKey = (snapshot, question) => {
  const sectionKey = [...detectRelevantSections(question)].sort().join(',') || 'core';
  const tokenKey = uniqueTokens(question).sort().slice(0, 10).join('|') || 'empty';
  return `${snapshot.organization.tenantId}:${snapshot.generatedAt}:${sectionKey}:${tokenKey}`;
};

const buildKnowledgeDocuments = (snapshot) => {
  const documents = [];
  const { organization, kpis } = snapshot;

  documents.push({
    id: 'organization-overview',
    section: 'overview',
    text: `Organization ${organization.companyName}. Role ${organization.role}. Contact ${organization.contactEmail || 'N/A'}. Clients ${kpis.clientCount}. Invoices ${kpis.invoiceCount}. Quotes ${kpis.quoteCount}. Payments ${kpis.paymentCount}. Taxes ${kpis.taxCount}. Total invoiced ${kpis.totalInvoiced}. Total collected ${kpis.totalCollected}. Discount ${kpis.totalDiscount}. Outstanding ${kpis.outstandingAmount}. Overdue invoices ${kpis.overdueInvoiceCount}. Unpaid invoices ${kpis.unpaidInvoiceCount}. Draft quotes ${kpis.draftQuoteCount}.`,
  });

  snapshot.invoiceStatusBreakdown.forEach((item) => {
    documents.push({
      id: `invoice-status-${item.status}`,
      section: 'invoices',
      text: `Invoice status ${item.status}. Count ${item.count}.`,
    });
  });

  snapshot.recentInvoices.forEach((invoice) => {
    documents.push({
      id: `invoice-${invoice.number}`,
      section: 'invoices',
      text: `Invoice ${invoice.number}. Client ${invoice.clientName}. Amount ${invoice.total} ${invoice.currency || ''}. Status ${invoice.status}. Payment status ${invoice.paymentStatus}. Date ${invoice.date || 'N/A'}. Expiry ${invoice.expiredDate || 'N/A'}.`,
    });
  });

  snapshot.recentPayments.forEach((payment) => {
    documents.push({
      id: `payment-${payment.number}`,
      section: 'payments',
      text: `Payment ${payment.number}. Client ${payment.clientName}. Amount ${payment.amount} ${payment.currency || ''}. Invoice ${payment.invoiceNumber || 'N/A'}. Mode ${payment.paymentMode || 'N/A'}. Date ${payment.date || 'N/A'}.`,
    });
  });

  snapshot.topClients.forEach((client) => {
    documents.push({
      id: `client-${client.clientId}`,
      section: 'clients',
      text: `Client ${client.name}. Email ${client.email || 'N/A'}. Phone ${client.phone || 'N/A'}. Invoice count ${client.invoiceCount}. Total invoiced ${client.totalInvoiced}.`,
    });
  });

  return documents;
};

const retrieveRelevantDocuments = (snapshot, question, limit = 6) => {
  const cacheKey = getRetrievalCacheKey(snapshot, question);
  const cachedDocs = getCachedRetrieval(cacheKey);
  if (cachedDocs) {
    return {
      docs: cachedDocs,
      cacheHit: true,
    };
  }

  const docs = buildKnowledgeDocuments(snapshot);
  const queryTokens = uniqueTokens(question);
  const sectionHints = detectRelevantSections(question);

  const scoredDocs = docs
    .map((doc) => {
      const docTokens = uniqueTokens(doc.text);
      const overlap = queryTokens.filter((token) => docTokens.includes(token)).length;
      const sectionBonus = sectionHints.has(doc.section) ? 3 : 0;
      const overviewBonus = doc.section === 'overview' ? 2 : 0;
      const numericBonus = /\d/.test(question) && /\d/.test(doc.text) ? 1 : 0;
      const score = overlap + sectionBonus + overviewBonus + numericBonus;

      return { ...doc, score };
    })
    .filter((doc) => doc.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);

  const selectedDocs = scoredDocs.length ? scoredDocs : docs.slice(0, 3);
  setCachedRetrieval(cacheKey, selectedDocs);

  return {
    docs: selectedDocs,
    cacheHit: false,
  };
};

const getRetrievedContextPrompt = (snapshot, question) => {
  const retrievalResult = retrieveRelevantDocuments(snapshot, question);
  const lines = retrievalResult.docs.map((doc, index) => `Doc ${index + 1} [${doc.section}] ${doc.text}`);
  lines.push(`Snapshot generated at ${snapshot.generatedAt}.`);
  return {
    context: lines.join('\n'),
    docCount: retrievalResult.docs.length,
    cacheHit: retrievalResult.cacheHit,
  };
};

const getSnapshotPrompt = (snapshot, question) => {
  const s = snapshot;
  const k = s.kpis;
  const org = s.organization;
  const sections = detectRelevantSections(question);

  // Tier 1: Always included — ultra-compact KPIs
  const lines = [
    `[Org] ${org.companyName} | ${org.contactEmail || 'N/A'} | role=${org.role}`,
    `[KPIs] clients=${k.clientCount} invoices=${k.invoiceCount} quotes=${k.quoteCount} payments=${k.paymentCount} taxes=${k.taxCount}`,
    `[Finance] invoiced=${k.totalInvoiced} collected=${k.totalCollected} discount=${k.totalDiscount} outstanding=${k.outstandingAmount}`,
    `[Alerts] overdue=${k.overdueInvoiceCount} unpaid=${k.unpaidInvoiceCount} draftQuotes=${k.draftQuoteCount}`,
  ];

  // Tier 2: Only include detailed sections when question needs them
  if (sections.has('invoices') && s.invoiceStatusBreakdown?.length) {
    lines.push(`[InvStatus] ${s.invoiceStatusBreakdown.map(i => `${i.status}=${i.count}`).join(' ')}`);
  }

  if (sections.has('invoices') && s.recentInvoices?.length) {
    lines.push('[RecentInv]');
    s.recentInvoices.forEach(i => {
      lines.push(`  #${i.number} ${i.clientName} ${i.total}${i.currency||''} ${i.status}/${i.paymentStatus} ${i.date ? new Date(i.date).toLocaleDateString() : ''}`);
    });
  }

  if (sections.has('payments') && s.recentPayments?.length) {
    lines.push('[RecentPay]');
    s.recentPayments.forEach(p => {
      lines.push(`  #${p.number} ${p.clientName} ${p.amount}${p.currency||''} via=${p.paymentMode||'N/A'} inv=#${p.invoiceNumber||'N/A'} ${p.date ? new Date(p.date).toLocaleDateString() : ''}`);
    });
  }

  if (sections.has('clients') && s.topClients?.length) {
    lines.push('[TopClients]');
    s.topClients.forEach(c => {
      lines.push(`  ${c.name} invoices=${c.invoiceCount} total=${c.totalInvoiced}`);
    });
  }

  lines.push(`[Snapshot] ${s.generatedAt}`);

  return lines.join('\n');
};

const generateWithGemini = async ({ snapshot, messages }) => {
  const llmStartMs = nowMs();
  // Extract latest question for question-aware snapshot pruning
  const latestMsg = messages[messages.length - 1];
  const currentQuestion = latestMsg?.role === 'user' ? latestMsg.content : '';
  const snapshotText = getSnapshotPrompt(snapshot, currentQuestion);
  const retrievalStartMs = nowMs();
  const retrievedContext = getRetrievedContextPrompt(snapshot, currentQuestion);
  const retrievalDurationMs = nowMs() - retrievalStartMs;
  const systemText = `${getSystemPrompt()}\nCompact snapshot:\n${snapshotText}\n\nRetrieved business context:\n${retrievedContext.context}`;

  // Only send the latest user question + last 2 assistant turns for context
  // The snapshot is injected once as the first user turn
  const contents = [
    { role: 'user', parts: [{ text: systemText }] },
    { role: 'model', parts: [{ text: 'Understood. I will only answer business questions using the organization data above.' }] },
  ];

  // Append conversation history
  for (const msg of messages) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    });
  }

  const response = await fetch(getGeminiEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.05,
        maxOutputTokens: 280,
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Gemini request failed.');
  }

  const answer = (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .join('\n')
      .trim() || REFUSAL_MESSAGE
  );

  return {
    answer,
    metrics: {
      provider: 'gemini',
      llmDurationMs: nowMs() - llmStartMs,
      retrievalDurationMs,
      retrievalDocCount: retrievedContext.docCount,
      retrievalCacheHit: retrievedContext.cacheHit,
      promptMessageCount: contents.length,
    },
  };
};

const generateBusinessInsight = async ({ tenantId, user, models, messages, question }) => {
  const totalStartMs = nowMs();
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('No LLM provider is configured. Set GEMINI_API_KEY in the environment variables to use Business Insights.');
  }

  const normalizedMessages = normalizeMessages(messages);
  const latestQuestion = question || normalizedMessages[normalizedMessages.length - 1]?.content || '';

  if (!latestQuestion) {
    return {
      answer: REFUSAL_MESSAGE,
      restricted: true,
      snapshot: null,
    };
  }

  if (isObviouslyOutOfScope(latestQuestion)) {
    return {
      answer: REFUSAL_MESSAGE,
      restricted: true,
      snapshot: null,
    };
  }

  // Use cached snapshot if available (avoids re-querying DB on every message)
  const snapshotStartMs = nowMs();
  let snapshot = getCachedSnapshot(tenantId);
  let snapshotCacheHit = true;
  if (!snapshot) {
    snapshotCacheHit = false;
    snapshot = await buildSnapshot({ models, tenantId, user });
    setCachedSnapshot(tenantId, snapshot);
  }

  const directStartMs = nowMs();
  const directAnswer = buildDirectAnswer(snapshot, latestQuestion);
  if (directAnswer) {
    logInsightTiming({
      provider: 'direct',
      tenantId,
      snapshotCacheHit,
      snapshotDurationMs: nowMs() - snapshotStartMs,
      directDurationMs: nowMs() - directStartMs,
      totalDurationMs: nowMs() - totalStartMs,
      question: latestQuestion.slice(0, 120),
    });

    return {
      answer: directAnswer,
      restricted: false,
      snapshot,
      provider: 'direct',
    };
  }

  const llmResult = await generateWithGemini({ snapshot, messages: normalizedMessages });
  const restricted = llmResult.answer === REFUSAL_MESSAGE;

  logInsightTiming({
    provider: 'gemini',
    tenantId,
    snapshotCacheHit,
    snapshotDurationMs: nowMs() - snapshotStartMs,
    retrievalDurationMs: llmResult.metrics.retrievalDurationMs,
    retrievalDocCount: llmResult.metrics.retrievalDocCount,
    retrievalCacheHit: llmResult.metrics.retrievalCacheHit,
    llmDurationMs: llmResult.metrics.llmDurationMs,
    promptMessageCount: llmResult.metrics.promptMessageCount,
    totalDurationMs: nowMs() - totalStartMs,
    question: latestQuestion.slice(0, 120),
  });

  return {
    answer: llmResult.answer,
    restricted,
    snapshot,
    provider: 'gemini',
  };
};

module.exports = {
  REFUSAL_MESSAGE,
  generateBusinessInsight,
};