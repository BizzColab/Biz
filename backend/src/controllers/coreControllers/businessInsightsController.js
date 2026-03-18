const {
  REFUSAL_MESSAGE,
  generateBusinessInsight,
} = require('../../services/businessInsightsService');

exports.chat = async (req, res) => {
  const { messages = [], question = '' } = req.body || {};

  if (!question && !Array.isArray(messages)) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'A business question is required.',
    });
  }

  try {
    const result = await generateBusinessInsight({
      tenantId: req.tenantId,
      user: req.user || req.admin,
      models: req.models,
      messages,
      question: String(question || '').trim(),
    });

    return res.status(200).json({
      success: true,
      result: {
        answer: result.answer,
        restricted: result.restricted,
        scope: 'business-only',
        generatedAt: result.snapshot?.generatedAt || new Date().toISOString(),
        companyName: result.snapshot?.organization?.companyName || null,
      },
      message: result.restricted
        ? REFUSAL_MESSAGE
        : 'Business insight generated successfully.',
    });
  } catch (error) {
    const status = /GEMINI_API_KEY|LLM provider/i.test(error.message) ? 503 : 500;

    return res.status(status).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};