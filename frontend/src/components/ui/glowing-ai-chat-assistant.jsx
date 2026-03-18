import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Code2,
  ExternalLink,
  Info,
  Link as LinkIcon,
  Mic,
  Paperclip,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { useSelector } from 'react-redux';

import { request } from '@/request';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

const MAX_CHARS = 2000;

const STARTER_PROMPTS = [
  'Summarize this organization\'s revenue and collections right now.',
  'Which invoices are overdue or at collection risk?',
  'What operational issues should the owner review first?',
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
            width: 7,
            height: 7,
            borderRadius: '999px',
            background: 'currentColor',
            opacity: 0.28,
            animation: `chat-dot-blink 1.2s ${index * 0.18}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
};

const chatbotVars = {
  panel: 'var(--panel-elevated)',
  panelAlt: 'var(--panel-secondary)',
  assistantBubble: 'var(--panel-assistant-bubble)',
  userBubble: 'var(--panel-user-bubble)',
  textMain: 'var(--text-main)',
  textSubtle: 'var(--panel-text-subtle)',
  textMuted: 'var(--text-muted)',
  textFaint: 'var(--panel-text-faint)',
  borderSoft: 'var(--panel-border-soft)',
  borderMuted: 'var(--panel-border-muted)',
  borderAccent: 'var(--panel-border-accent)',
  tagBg: 'var(--panel-tag-bg)',
  tagText: 'var(--panel-tag-text)',
  accent: 'var(--primary-color)',
  accentHover: 'var(--primary-hover)',
  success: 'var(--success-color)',
  accentGlow: 'var(--panel-blue-glow)',
  accentGlowStrong: 'var(--panel-blue-glow-strong)',
  deepShadow: 'var(--panel-shadow-deep)',
};

const MessageRow = ({ role, content }) => {
  const isAssistant = role === 'assistant';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isAssistant ? 'flex-start' : 'flex-end',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          maxWidth: '88%',
          borderRadius: 18,
          padding: '13px 15px',
          color: chatbotVars.textMain,
          background: isAssistant ? chatbotVars.assistantBubble : chatbotVars.userBubble,
          border: isAssistant
            ? '1px solid rgba(148,163,184,0.18)'
            : `1px solid ${chatbotVars.borderAccent}`,
          boxShadow: isAssistant
            ? '0 14px 30px rgba(15,23,42,0.30)'
            : chatbotVars.accentGlow,
          whiteSpace: 'pre-wrap',
          lineHeight: 1.6,
          fontSize: 13,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 8,
            color: isAssistant ? chatbotVars.textSubtle : 'rgba(255,255,255,0.82)',
          }}
        >
          {isAssistant ? 'Business Insight' : 'You'}
        </div>
        {content}
      </div>
    </div>
  );
};

export function FloatingAiAssistant() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const companyName = currentAdmin?.companyName || 'your organization';
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `I can only answer questions about ${companyName}'s business data, including invoices, payments, collections, customers, quotes, and operational insights.`,
    },
  ]);

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `I can only answer questions about ${companyName}'s business data, including invoices, payments, collections, customers, quotes, and operational insights.`,
      },
    ]);
  }, [companyName]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!chatRef.current || chatRef.current.contains(event.target)) {
        return;
      }

      if (!event.target.closest('.floating-ai-button')) {
        setIsChatOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleInputChange = (event) => {
    const value = event.target.value.slice(0, MAX_CHARS);
    setMessage(value);
    setCharCount(value.length);
  };

  const submitQuestion = async (seedQuestion) => {
    const nextQuestion = (seedQuestion ?? message).trim();

    if (!nextQuestion || isSending) {
      return;
    }

    const nextMessages = [...messages, { role: 'user', content: nextQuestion }];
    setMessages(nextMessages);
    setMessage('');
    setCharCount(0);
    setIsSending(true);

    try {
      const data = await request.post({
        entity: 'business-insights/chat',
        jsonData: {
          question: nextQuestion,
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
    } catch (error) {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: 'Unable to generate business insights right now.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitQuestion();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: 28,
        bottom: 'max(54px, env(safe-area-inset-bottom, 0px) + 30px)',
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 12,
      }}
    >
      <a
        href="https://mind-flow-inky.vercel.app"
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          borderRadius: 999,
          textDecoration: 'none',
          color: chatbotVars.textMain,
          background: chatbotVars.panelAlt,
          border: `1px solid ${chatbotVars.borderSoft}`,
          boxShadow: chatbotVars.accentGlow,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          backdropFilter: 'blur(16px)',
        }}
      >
        <span>mindflow</span>
        <ExternalLink size={14} />
      </a>

      <button
        className="floating-ai-button"
        onClick={() => setIsChatOpen((open) => !open)}
        style={{
          position: 'relative',
          width: 66,
          height: 66,
          borderRadius: '999px',
          border: `1px solid ${chatbotVars.borderSoft}`,
          background: 'var(--panel-accent)',
          boxShadow: '0 0 24px rgba(59,130,246,0.22), 0 0 48px rgba(37,99,235,0.18), 0 16px 40px rgba(2,6,23,0.42)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: chatbotVars.textMain,
          cursor: 'pointer',
          transition: 'transform 300ms ease, box-shadow 300ms ease',
          transform: isChatOpen ? 'rotate(90deg)' : 'rotate(0deg)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '999px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 55%)',
            opacity: 0.35,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '999px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.24) 0%, rgba(37,99,235,0) 65%)',
            animation: 'floating-ai-pulse 2.4s ease-in-out infinite',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>
          {isChatOpen ? <X size={28} /> : <Bot size={30} />}
        </div>
      </button>

      {isChatOpen ? (
        <div
          ref={chatRef}
          style={{
            position: 'absolute',
            right: 0,
            bottom: 88,
            width: 'min(520px, calc(100vw - 32px))',
            maxHeight: 'min(760px, calc(100vh - 180px))',
            animation: 'floating-ai-pop-in 260ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            transformOrigin: 'bottom right',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 28,
              overflow: 'hidden',
              background: chatbotVars.panel,
              border: `1px solid ${chatbotVars.borderSoft}`,
              backdropFilter: 'blur(22px)',
              boxShadow: chatbotVars.deepShadow,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px 10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '999px', background: chatbotVars.accent, boxShadow: '0 0 12px rgba(59,130,246,0.65)' }} />
                <span style={{ color: chatbotVars.textMuted, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Business AI Assistant</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ padding: '5px 10px', borderRadius: 999, background: chatbotVars.tagBg, color: chatbotVars.tagText, border: `1px solid ${chatbotVars.borderAccent}`, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Biz Intelligence
                </span>
                <span style={{ padding: '5px 10px', borderRadius: 999, background: 'rgba(16,185,129,0.12)', color: chatbotVars.success, border: '1px solid rgba(16,185,129,0.18)', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Tenant Scoped
                </span>
                <button
                  onClick={() => setIsChatOpen(false)}
                  style={{
                    width: 30,
                    height: 30,
                    display: 'grid',
                    placeItems: 'center',
                    border: 'none',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.06)',
                    color: chatbotVars.tagText,
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div style={{ padding: '0 22px 14px', color: chatbotVars.textSubtle, fontSize: 13, lineHeight: 1.6, letterSpacing: '-0.01em' }}>
              Ask only about {companyName}'s business data. The assistant will reject non-business or non-tenant questions.
            </div>

            <div style={{ padding: '0 18px', overflowY: 'auto', maxHeight: 240 }}>
              {messages.map((entry, index) => (
                <MessageRow key={`${entry.role}-${index}` } role={entry.role} content={entry.content} />
              ))}
              {isSending ? <MessageRow role="assistant" content={<LoadingDots />} /> : null}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ display: 'flex', gap: 8, padding: '12px 18px 0', flexWrap: 'wrap' }}>
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => submitQuestion(prompt)}
                  disabled={isSending}
                  style={{
                    border: `1px solid ${chatbotVars.borderAccent}`,
                    background: chatbotVars.panelAlt,
                    color: chatbotVars.tagText,
                    borderRadius: 999,
                    padding: '9px 13px',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    cursor: 'pointer',
                  }}
                >
                  <Sparkles size={12} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
                  {prompt}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', overflow: 'hidden', paddingTop: 12 }}>
              <textarea
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={4}
                placeholder="Ask about revenue, collections, clients, invoices, quotes, payments, taxes, or business performance."
                style={{
                  width: '100%',
                  minHeight: 126,
                  resize: 'none',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: chatbotVars.textMain,
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.6,
                  padding: '16px 22px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(39,39,42,0.08), transparent)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            <div style={{ padding: '0 18px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: 6,
                      borderRadius: 16,
                      background: 'rgba(15,23,42,0.55)',
                      border: `1px solid ${chatbotVars.borderMuted}`,
                    }}
                  >
                    {[Paperclip, LinkIcon, Code2].map((Icon, index) => (
                      <button
                        key={index}
                        type="button"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 12,
                          border: 'none',
                          background: 'transparent',
                          color: chatbotVars.textMuted,
                          cursor: 'not-allowed',
                        }}
                        title="Reserved for future business attachments"
                      >
                        <Icon size={16} />
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      border: `1px solid ${chatbotVars.borderMuted}`,
                      background: 'rgba(15,23,42,0.55)',
                      color: chatbotVars.textMuted,
                      cursor: 'not-allowed',
                    }}
                    title="Voice input is not enabled yet"
                  >
                    <Mic size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ color: chatbotVars.textFaint, fontSize: 12, fontWeight: 600 }}>
                    <span>{charCount}</span>/<span style={{ color: chatbotVars.textMuted }}>{MAX_CHARS}</span>
                  </div>
                  <button
                    onClick={() => submitQuestion()}
                    disabled={!message.trim() || isSending}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 16,
                      border: 'none',
                      background: !message.trim() || isSending
                        ? 'linear-gradient(135deg, rgba(120,113,108,0.6) 0%, rgba(82,82,91,0.6) 100%)'
                        : 'var(--panel-user-bubble)',
                      color: chatbotVars.textMain,
                      cursor: !message.trim() || isSending ? 'not-allowed' : 'pointer',
                      boxShadow: !message.trim() || isSending
                        ? 'none'
                        : chatbotVars.accentGlowStrong,
                    }}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: `1px solid ${chatbotVars.borderMuted}`,
                  color: chatbotVars.textFaint,
                  fontSize: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Info size={13} />
                  <span>Press Shift + Enter for a new line</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '999px', background: chatbotVars.accent }} />
                  <span>Business mode active</span>
                </div>
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'linear-gradient(135deg, rgba(59,130,246,0.08), transparent 45%, rgba(14,165,233,0.06))',
              }}
            />
          </div>
        </div>
      ) : null}

      <style>{`
        @keyframes floating-ai-pop-in {
          0% {
            opacity: 0;
            transform: scale(0.84) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes floating-ai-pulse {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.08);
          }
        }

        @keyframes chat-dot-blink {
          0%, 80%, 100% {
            opacity: 0.28;
            transform: translateY(0) scale(0.92);
          }
          40% {
            opacity: 1;
            transform: translateY(-2px) scale(1);
          }
        }

        .floating-ai-button:hover {
          transform: scale(1.06) rotate(4deg);
          box-shadow: 0 0 30px rgba(59,130,246,0.34), 0 0 56px rgba(37,99,235,0.26), 0 18px 44px rgba(15,23,42,0.48);
        }

        @media (max-width: 768px) {
          .floating-ai-button:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

export default FloatingAiAssistant;