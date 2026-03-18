import { useMemo, useState } from 'react';
import { Button, Card, Input, Space, Tag, Typography } from 'antd';
import {
  BulbOutlined,
  RiseOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';

import FloatingAiAssistant from '@/components/ui/glowing-ai-chat-assistant';
import { request } from '@/request';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const STARTER_QUESTIONS = [
  'What are the biggest revenue and collection insights for this organization right now?',
  'Which invoices appear overdue or at risk based on the current data?',
  'Give me a short business summary for this month using our invoice and payment data.',
  'What should the owner pay attention to first from clients, payments, and outstanding balances?',
];

const LoadingDots = () => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        minHeight: 16,
      }}
      aria-label="Loading"
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: '999px',
            background: 'currentColor',
            opacity: 0.28,
            animation: `business-insights-dot-blink 1.2s ${index * 0.18}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
};

const chatbotVars = {
  panel: 'var(--panel-elevated)',
  panelAlt: 'var(--panel-secondary)',
  accent: 'var(--primary-color)',
  accentHover: 'var(--primary-hover)',
  success: 'var(--success-color)',
  assistantBubble: 'var(--panel-assistant-bubble)',
  userBubble: 'var(--panel-user-bubble)',
  borderSoft: 'var(--panel-border-soft)',
  borderMuted: 'var(--panel-border-muted)',
  borderAccent: 'var(--panel-border-accent)',
  tagBg: 'var(--panel-tag-bg)',
  tagText: 'var(--panel-tag-text)',
  textMain: 'var(--text-main)',
  textSubtle: 'var(--panel-text-subtle)',
  textFaint: 'var(--panel-text-faint)',
  blueGlow: 'var(--panel-blue-glow)',
};

const MessageBubble = ({ role, content }) => {
  const isAssistant = role === 'assistant';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isAssistant ? 'flex-start' : 'flex-end',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          padding: '15px 18px',
          borderRadius: 18,
          background: isAssistant
            ? chatbotVars.assistantBubble
            : chatbotVars.userBubble,
          color: chatbotVars.textMain,
          border: isAssistant
            ? `1px solid ${chatbotVars.borderMuted}`
            : `1px solid ${chatbotVars.borderAccent}`,
          boxShadow: isAssistant
            ? '0 18px 32px rgba(0, 0, 0, 0.28)'
            : chatbotVars.blueGlow,
          whiteSpace: 'pre-wrap',
          lineHeight: 1.6,
        }}
      >
        <Text
          style={{
            display: 'block',
            color: isAssistant ? chatbotVars.textSubtle : 'rgba(255,255,255,0.82)',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {isAssistant ? 'Business Insights AI' : 'You'}
        </Text>
        <div>{content}</div>
      </div>
    </div>
  );
};

export default function BusinessInsightsChat({ variant = 'widget' }) {
  const isWidget = variant === 'widget';

  if (isWidget) {
    return <FloatingAiAssistant />;
  }

  const currentAdmin = useSelector(selectCurrentAdmin);
  const companyName = currentAdmin?.companyName || 'Your Organization';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        `I am restricted to ${companyName}'s business data only. Ask about revenue, collections, clients, invoices, quotes, payments, taxes, or operational insights grounded in your organization's data.`,
    },
  ]);

  const capabilityTags = useMemo(
    () => ['Revenue', 'Collections', 'Outstanding', 'Invoices', 'Payments', 'Clients', 'Quotes', 'Taxes'],
    []
  );

  const sendMessage = async (seedQuestion) => {
    const question = (seedQuestion ?? input).trim();
    if (!question || loading) {
      return;
    }

    const nextMessages = [...messages, { role: 'user', content: question }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    const data = await request.post({
      entity: 'business-insights/chat',
      jsonData: {
        question,
        messages: nextMessages,
      },
    });

    setMessages([
      ...nextMessages,
      {
        role: 'assistant',
        content:
          data?.result?.answer ||
          data?.message ||
          'Unable to generate business insights right now.',
      },
    ]);
    setLoading(false);
  };

  const panel = (
    <Card
      bordered={false}
      style={{
        background: chatbotVars.panel,
        borderRadius: 28,
        border: `1px solid ${chatbotVars.borderSoft}`,
        minHeight: 720,
        boxShadow: 'none',
      }}
      bodyStyle={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'var(--panel-accent)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: chatbotVars.blueGlow,
              flexShrink: 0,
            }}
          >
            <BulbOutlined style={{ fontSize: 24, color: chatbotVars.textMain }} />
          </div>
          <div>
            <Text style={{ color: chatbotVars.textMain, fontWeight: 700, fontSize: 15, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
              Business Insights AI
            </Text>
            <Paragraph style={{ color: chatbotVars.textSubtle, margin: '6px 0 0', fontSize: 14, lineHeight: 1.6, letterSpacing: '-0.01em' }}>
              {`Ask questions about ${companyName}'s operational data only.`}
            </Paragraph>
          </div>
        </div>
      </div>

      <Space wrap size={[8, 12]} style={{ marginBottom: 16 }}>
        {capabilityTags.map((tag) => (
          <Tag
            key={tag}
            style={{
              background: chatbotVars.tagBg,
              color: chatbotVars.tagText,
              border: `1px solid ${chatbotVars.borderAccent}`,
              padding: '4px 10px',
              borderRadius: 999,
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            {tag}
          </Tag>
        ))}
      </Space>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: 4,
          marginBottom: 16,
          minHeight: 420,
        }}
      >
        {messages.map((message, index) => (
          <MessageBubble key={`${message.role}-${index}`} role={message.role} content={message.content} />
        ))}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 8 }}>
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${chatbotVars.borderMuted}`,
                color: chatbotVars.tagText,
              }}
            >
              <LoadingDots />
            </div>
          </div>
        ) : null}
      </div>

      <div style={{ display: 'grid', gap: 16, marginBottom: 18 }}>
        <Card
          bordered={false}
          style={{
            background: chatbotVars.panelAlt,
            borderRadius: 24,
            border: `1px solid ${chatbotVars.borderSoft}`,
          }}
          bodyStyle={{ padding: 20 }}
        >
          <Space align="start" size={12}>
            <RiseOutlined style={{ color: chatbotVars.accent, fontSize: 20, marginTop: 4 }} />
            <div>
              <Text style={{ color: chatbotVars.textMain, fontWeight: 700, display: 'block', marginBottom: 8, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Suggested prompts
              </Text>
              <Space direction="vertical" size={10} style={{ width: '100%' }}>
                {STARTER_QUESTIONS.map((starter) => (
                  <Button
                    key={starter}
                    block
                    onClick={() => sendMessage(starter)}
                    disabled={loading}
                    style={{
                      textAlign: 'left',
                      whiteSpace: 'normal',
                      height: 'auto',
                      padding: '12px 14px',
                      borderRadius: 14,
                      background: 'rgba(255,255,255,0.03)',
                      color: chatbotVars.textMain,
                      border: `1px solid ${chatbotVars.borderMuted}`,
                      lineHeight: 1.55,
                      fontWeight: 500,
                    }}
                  >
                    {starter}
                  </Button>
                ))}
              </Space>
            </div>
          </Space>
        </Card>

        <Card
          bordered={false}
          style={{
            background: chatbotVars.panelAlt,
            borderRadius: 24,
            border: `1px solid ${chatbotVars.borderSoft}`,
          }}
          bodyStyle={{ padding: 20 }}
        >
          <Space align="start" size={12}>
            <SafetyCertificateOutlined style={{ color: chatbotVars.success, fontSize: 20, marginTop: 4 }} />
            <div>
              <Text style={{ color: chatbotVars.textMain, fontWeight: 700, display: 'block', marginBottom: 8, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Usage guardrails
              </Text>
              <Paragraph style={{ color: chatbotVars.textSubtle, marginBottom: 0, lineHeight: 1.65 }}>
                The assistant is restricted to tenant-scoped organizational data. It should answer only
                business questions tied to invoices, payments, customers, quotes, taxes, collections,
                and operational performance.
              </Paragraph>
            </div>
          </Space>
        </Card>
      </div>

      <div
        style={{
          borderTop: `1px solid ${chatbotVars.borderMuted}`,
          paddingTop: 16,
        }}
      >
        <TextArea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoSize={{ minRows: 3, maxRows: 6 }}
          placeholder="Ask about revenue, overdue invoices, client trends, payment collections, or other organization-specific business insights."
          disabled={loading}
          onPressEnter={(event) => {
            if (!event.shiftKey) {
              event.preventDefault();
              sendMessage();
            }
          }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${chatbotVars.borderSoft}`,
            color: chatbotVars.textMain,
            borderRadius: 16,
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            marginTop: 14,
          }}
        >
          <Text style={{ color: chatbotVars.textFaint, fontSize: 12, letterSpacing: '-0.01em' }}>
            Non-business questions are intentionally rejected.
          </Text>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => sendMessage()}
            disabled={loading}
            style={{
              height: 42,
              paddingInline: 18,
              borderRadius: 14,
              background: 'var(--panel-user-bubble)',
              border: 'none',
              boxShadow: chatbotVars.blueGlow,
            }}
          >
            Ask AI
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0 48px' }}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: 32,
          marginBottom: 28,
          background:
            'radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 35%), linear-gradient(180deg, rgba(2,6,23,0.96) 0%, rgba(0,0,0,0.98) 100%)',
          border: `1px solid ${chatbotVars.borderSoft}`,
          boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
        }}
      >
        <Space align="start" size={18} style={{ width: '100%' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: 'var(--panel-accent)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: chatbotVars.blueGlow,
              flexShrink: 0,
            }}
          >
            <BulbOutlined style={{ fontSize: 28, color: chatbotVars.textMain }} />
          </div>
          <div style={{ flex: 1 }}>
            <Title level={2} style={{ margin: 0, color: chatbotVars.textMain, letterSpacing: '-0.04em' }}>
              Business Insights Chat
            </Title>
            <Paragraph style={{ color: chatbotVars.textSubtle, fontSize: 16, marginTop: 8, maxWidth: 820, lineHeight: 1.65, letterSpacing: '-0.015em' }}>
              Ask questions about {companyName}'s operational data only. This assistant is scoped to
              your tenant data and is designed for business insight workflows, not general chat.
            </Paragraph>
          </div>
        </Space>
      </div>
      {panel}
      <style>{`
        @keyframes business-insights-dot-blink {
          0%, 80%, 100% {
            opacity: 0.28;
            transform: translateY(0) scale(0.92);
          }
          40% {
            opacity: 1;
            transform: translateY(-2px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}