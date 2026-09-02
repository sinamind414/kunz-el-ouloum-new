import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, BookOpen, AlertCircle, Trash2, HelpCircle, ArrowLeft, BrainCircuit } from 'lucide-react';
import { ChatMessage } from '../types';
import { MASCOT_URL } from '../data';

import { answerTutorQuestion } from '../smartTutorEngine';

interface AITutorViewProps {
  onBackToDashboard?: () => void;
}

export default function AITutorView({ onBackToDashboard }: AITutorViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "مرحباً بك يا بحار المعرفة! أنا المرشد الذكي لـ **كنز العلوم** 🏴‍☠️.\n\nأنا هنا لأبسط لك كل ما يتعلق بعلوم الطبيعة والحياة للبكالوريا. اسألني عن آليات تركيب البروتين، أو بنيته الفراغية وسلوكه الحمقلي، أو آليات الاستجابة المناعية وتفاصيل الذات واللاذات!\n\nما هو موضوع كنزنا اليوم؟",
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let replyText = "";
      // Try local offline Smart Tutor Engine first
      const localResult = answerTutorQuestion(textToSend);
      if (localResult && localResult.text) {
        replyText = localResult.text;
      } else {
        // Fallback to server if needed
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...messages, userMsg] })
        });
        const data = await response.json();
        replyText = data.text;
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "تعذر الحصول على إجابة من المرشد الذكي. يرجى إعادة المحاولة.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm("هل تريد مسح سجل المحادثة والبدء من جديد؟")) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: "مرحباً بك مجدداً يا بحار المعرفة! أنا مستعد لأسئلتك الجديدة حول مقرر العلوم الطبيعية للبكالوريا. ما هو الكنز العلمي الذي تود استكشافه الآن؟",
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setError(null);
    }
  };

  // Quick suggestions based on official high-scoring syllabus keywords
  const suggestions = [
    "اشرح لي آليات عملية الاستنساخ بالتفصيل",
    "ما معنى الخاصية الحمقلية (الأمفوتيرية)؟",
    "لخص دور اللمفاويات LT4 في تنشيط المناعة",
    "ما هي مستويات البنية الفراغية للبروتين؟"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] bg-[#ffffff] border border-[#e2dabf]/60 rounded-3xl shadow-sm overflow-hidden font-sans">
      
      {/* Chat Title bar */}
      <div className="bg-[#fff9ed] border-b border-[#e2dabf]/60 px-5 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#006d37]/10 rounded-full blur-sm" />
            <img 
              src={MASCOT_URL} 
              alt="Mascot Avatar" 
              className="w-10 h-10 rounded-full object-contain border border-[#006d37]/10 relative bg-[#ffffff] p-1"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#006d37] flex items-center gap-1.5">
              <span>المرشد الذكي (الأستاذ كنز العلوم)</span>
              <BrainCircuit className="w-4 h-4 text-[#944a00]" />
            </h3>
            <span className="text-[10px] text-[#506072] font-semibold block">مساعد ذكاء اصطناعي تفاعلي وموجه لمنهج البكالوريا</span>
          </div>
        </div>

        <button 
          onClick={handleClear}
          className="p-2.5 rounded-xl hover:bg-[#ba1a1a]/10 text-[#ba1a1a] transition-all cursor-pointer"
          title="مسح المحادثة"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#fcf3d8]/10">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}
            >
              {/* Avatar on message side */}
              {msg.sender === 'ai' && (
                <div className="shrink-0">
                  <img 
                    src={MASCOT_URL} 
                    alt="AI Avatar" 
                    className="w-8 h-8 rounded-full border border-[#e2dabf]/50 p-0.5 bg-[#ffffff] object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Message Bubble text content */}
              <div className="space-y-1">
                <div 
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-[#006d37] text-[#ffffff] rounded-tl-none font-medium' 
                      : 'bg-[#ffffff] text-[#1f1c0b] border border-[#e2dabf]/60 rounded-tr-none shadow-sm'
                  }`}
                >
                  {/* Handle basic markdown formatting (bullet points, bold texts) */}
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.text.split('\n').map((line, lIdx) => {
                      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                        const content = line.trim().substring(2);
                        return <li key={lIdx} className="list-disc list-inside ml-2">{renderBoldText(content)}</li>;
                      }
                      return <p key={lIdx}>{renderBoldText(line)}</p>;
                    })}
                  </div>
                </div>
                <span className={`text-[9px] text-[#506072] block ${msg.sender === 'user' ? 'text-left' : 'text-right'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex gap-3 max-w-[80%] ml-auto"
          >
            <div className="shrink-0">
              <img 
                src={MASCOT_URL} 
                alt="AI Avatar" 
                className="w-8 h-8 rounded-full border border-[#e2dabf]/50 p-0.5 bg-[#ffffff] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="bg-[#ffffff] border border-[#e2dabf]/60 p-4 rounded-2xl rounded-tr-none shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006d37] animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#006d37] animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#006d37] animate-bounce"></span>
            </div>
          </motion.div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-[#ffdad6] text-[#ba1a1a] rounded-2xl text-xs flex items-center gap-2 border border-[#ba1a1a]/10 max-w-md mx-auto">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips Box */}
      {messages.length === 1 && (
        <div className="p-4 shrink-0 bg-[#fff9ed]/40 border-t border-[#e2dabf]/30">
          <span className="text-xs text-[#506072] font-bold block mb-2.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#944a00]" />
            <span>مواضيع مقترحة للمراجعة السريعة:</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug, sIdx) => (
              <button
                key={sIdx}
                onClick={() => handleSend(sug)}
                className="bg-[#ffffff] hover:bg-[#fed65b]/20 border border-[#e2dabf] px-3 py-1.5 rounded-xl text-xs font-bold text-[#006d37] hover:text-[#00562b] cursor-pointer transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form Footer */}
      <div className="p-4 border-t border-[#e2dabf]/60 shrink-0 bg-[#ffffff]">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل المرشد الذكي عن أي سؤال في مادة العلوم..."
            className="flex-1 px-4 h-12 rounded-xl bg-[#f3f4f5] border border-transparent focus:border-[#006d37] focus:bg-[#ffffff] text-sm focus:outline-none transition-all placeholder:text-[#506072]/60"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-[#006d37] hover:bg-[#00562b] disabled:opacity-40 text-[#ffffff] rounded-xl flex items-center justify-center cursor-pointer transition-colors"
          >
            <Send className="w-5 h-5 rotate-180" />
          </button>
        </form>
      </div>

    </div>
  );
}

// Basic formatter to bold markdown text (**text**)
function renderBoldText(text: string) {
  const parts = text.split('**');
  return parts.map((part, index) => 
    index % 2 === 1 
      ? <strong key={index} className="text-[#006d37] font-extrabold">{part}</strong> 
      : part
  );
}
