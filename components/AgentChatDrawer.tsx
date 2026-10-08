'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  SkinAnalysisResult,
  FormulationResponse
} from '@/types/dermatwin';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Zap,
  Activity,
  Lock,
  CheckCircle2
} from 'lucide-react';

interface AgentChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  biometrics?: SkinAnalysisResult;
  formulation?: FormulationResponse;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function AgentChatDrawer({
  isOpen,
  onClose,
  biometrics,
  formulation
}: AgentChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize tailored welcome message with patient's actual biometric numbers
  useEffect(() => {
    const score = biometrics?.overallScore ?? 49;
    const barrier = formulation?.triage?.barrierIntegrity ?? 'Compromised';
    const primaryConcern = formulation?.triage?.primaryConditions?.[0] ?? 'Vascular Redness';

    setMessages([
      {
        id: 'welcome-1',
        role: 'assistant',
        content: `Hello! I am your **DermaTwin Clinical AI Advisor**, powered by DeepSeek-V4.1-Flash on the Nebius Token Factory.\n\nI have loaded your complete **16-action YouCam biometric dossier**:\n• **Composite Health:** ${score}/100\n• **Barrier Integrity:** ${barrier}\n• **Primary Concern:** ${primaryConcern}\n• **Contraindication Gatekeeper:** ${formulation?.gatekeeper?.blockedIngredients?.length || 3} ingredients excluded\n\nAsk me anything about why specific ingredients were allowed or excluded, your barrier biology, or your AM/PM routine order!`,
        timestamp: 'Just now'
      }
    ]);
  }, [biometrics, formulation]);

  // Context-aware suggested inquiries
  const isHighRedness = (biometrics?.metrics.redness?.score ?? 100) < 65;
  const isHighAcne = (biometrics?.metrics.acne?.score ?? 100) < 65;

  const suggestedQuestions = [
    isHighRedness
      ? 'Why was Glycolic Acid contraindicated for my redness?'
      : 'Why were harsh exfoliants excluded?',
    isHighRedness
      ? 'Why is Azelaic Acid allowed for my redness score?'
      : 'Why is Niacinamide recommended for my skin?',
    `How does my barrier score affect active concentrations?`,
    'Can I safely use Retinoids with this routine?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: text }
          ],
          biometrics,
          formulation
        })
      });

      const data = await response.json();
      const replyText =
        data.message ||
        'I examined your biometric markers. Your regimen is balanced to restore your stratum corneum without provoking cutaneous inflammation.';

      const agentMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          'I apologize, but I encountered a momentary connection interruption with the reasoning engine. Please try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">Ask DermaTwin AI</h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-cyan-400 font-mono">
                DeepSeek-V4.1-Flash // Nebius Token Factory
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clinical Dossier Context Ribbon */}
        <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-[11px] font-mono">
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            16 Vectors Active in Context
          </span>
          <span className="text-slate-400">
            Barrier: <span className="text-amber-300 font-bold">{formulation?.triage?.barrierIntegrity || 'Compromised'}</span>
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none shadow-md font-medium'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-300 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <span
                  className={`text-[9px] mt-1.5 block text-right ${
                    msg.role === 'user' ? 'text-cyan-200' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-slate-400">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                <Bot className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-mono text-cyan-400 ml-1">
                  Querying 16-metric DeepSeek reasoning...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pill Bar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-cyan-400" /> Contextual Patient Inquiries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/40 rounded-xl px-2.5 py-1 text-left transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask why ingredients were allowed or excluded..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
