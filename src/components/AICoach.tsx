import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, Zap, Heart, Activity } from 'lucide-react';
import { UserProfile } from '../App';

interface AICoachProps {
  profile: UserProfile;
  onBack: () => void;
  onStartWorkout: (workout: any) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  suggestions?: string[];
}

export function AICoach({ profile, onBack, onStartWorkout }: AICoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: profile.language === 'sw' 
        ? `Habari ${profile.name}! 👋 Mimi ni AI Coach wako. Niambie, unahitaji msaada gani leo?`
        : `Hello ${profile.name}! 👋 I'm your AI Coach. How can I help you today?`,
      sender: 'coach',
      timestamp: new Date(),
      suggestions: profile.language === 'sw' 
        ? ['Nipendelee mazoezi', 'Nina shida kupunguza uzito', 'Ninajisikiaje leo?', 'Chakula bora ni kipi?']
        : ['Suggest workout', 'Weight loss tips', 'How am I doing?', 'Nutrition advice']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'coach',
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
      };
      setMessages(prev => [...prev, coachMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userText: string) => {
    const lower = userText.toLowerCase();
    const isSw = profile.language === 'sw';

    if (lower.includes('workout') || lower.includes('mazoezi') || lower.includes('pendelee')) {
      return {
        text: isSw 
          ? `Vizuri! Kulingana na lengo lako la "${profile.goals[0]}", ninakupendelea:\n\n💪 HIIT Training - Dakika 20\n🏃 Mbio za Interval - Dakika 15\n🧘 Yoga ya Asubuhi - Dakika 30\n\nUnapendelea upi?`
          : `Great! Based on your goal of "${profile.goals[0]}", I recommend:\n\n💪 HIIT Training - 20 min\n🏃 Interval Running - 15 min\n🧘 Morning Yoga - 30 min\n\nWhich one would you like?`,
        suggestions: isSw ? ['HIIT Training', 'Mbio', 'Yoga', 'Nionyeshe zote'] : ['HIIT Training', 'Running', 'Yoga', 'Show all']
      };
    }

    if (lower.includes('uzito') || lower.includes('weight') || lower.includes('lose')) {
      return {
        text: isSw
          ? `Kupunguza uzito kunategemea vitu viwili vikubwa:\n\n1️⃣ Deficit ya kalori (kula chini ya ${profile.dailyCalorieTarget || 2000} cal)\n2️⃣ Mazoezi mara 4-5 kwa wiki\n3️⃣ Kulala saa 7-8 kwa siku\n\nUnataka nisaidie na nini zaidi?`
          : `Weight loss depends on two main things:\n\n1️⃣ Calorie deficit (eat below ${profile.dailyCalorieTarget || 2000} cal)\n2️⃣ Exercise 4-5 times per week\n3️⃣ Sleep 7-8 hours per night\n\nWhat would you like help with?`,
        suggestions: isSw ? ['Mpango wa mlo', 'Mazoezi', 'Ufuatiliaji'] : ['Meal plan', 'Workouts', 'Tracking']
      };
    }

    if (lower.includes('chakula') || lower.includes('food') || lower.includes('nutrition')) {
      return {
        text: isSw
          ? `Kwa malengo yako, ninakupendekeza:\n\n🥘 Ugali + Dagaa + Mboga\n🍚 Wali + Maharage + Nyanya\n🥚 Mayai + Mkate + Ndizi\n\nMalighafi: 40%, Protini: 30%, Mafuta: 30%`
          : `For your goals, I recommend:\n\n🥘 Ugali + Fish + Vegetables\n🍚 Rice + Beans + Tomatoes\n🥚 Eggs + Bread + Banana\n\nCarbs: 40%, Protein: 30%, Fats: 30%`,
        suggestions: isSw ? ['Chakula cha asubuhi', 'Mchana', 'Jioni'] : ['Breakfast', 'Lunch', 'Dinner']
      };
    }

    return {
      text: isSw
        ? `Ninakusikia! 😊 Niambie zaidi juu ya unachotaka kujua. Ninaweza kusaidia na:\n\n• Mapendekezo ya mazoezi\n• Mipango ya mlo\n• Ushauri wa afya\n• Ufuatiliaji wa maendeleo`
        : `I hear you! 😊 Tell me more about what you'd like to know. I can help with:\n\n• Workout suggestions\n• Meal plans\n• Health advice\n• Progress tracking`,
      suggestions: isSw ? ['Mazoezi', 'Chakula', 'Maendeleo', 'Msaada'] : ['Workouts', 'Nutrition', 'Progress', 'Help']
    };
  };

  const text = profile.language === 'sw' ? {
    coach: 'AI Coach',
    typing: 'Anaandika...',
    placeholder: 'Andika ujumbe...',
  } : {
    coach: 'AI Coach',
    typing: 'Typing...',
    placeholder: 'Type a message...',
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-xl border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            {/* Coach Avatar */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg text-white" style={{ fontWeight: 700 }}>
                  {text.coach}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1EB53A] rounded-full animate-pulse"></div>
                  <span className="text-xs text-white/60" style={{ fontWeight: 500 }}>Active now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages - iMessage style */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            {message.sender === 'coach' ? (
              // Coach message (left side - gray bubble)
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 max-w-[75%]">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl rounded-tl-sm px-5 py-3">
                    <p className="text-white text-base leading-relaxed whitespace-pre-line" style={{ fontWeight: 500 }}>
                      {message.text}
                    </p>
                  </div>
                  
                  {/* Quick reply suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-sm text-white transition-all active:scale-95"
                          style={{ fontWeight: 600 }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-white/40 mt-2 ml-1" style={{ fontWeight: 500 }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ) : (
              // User message (right side - green bubble)
              <div className="flex items-end justify-end mb-4">
                <div className="max-w-[75%]">
                  <div className="bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] rounded-3xl rounded-br-sm px-5 py-3 shadow-lg">
                    <p className="text-white text-base leading-relaxed" style={{ fontWeight: 500 }}>
                      {message.text}
                    </p>
                  </div>
                  <p className="text-xs text-white/40 mt-2 mr-1 text-right" style={{ fontWeight: 500 }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl rounded-tl-sm px-5 py-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => handleSendMessage(profile.language === 'sw' ? 'Nipendelee mazoezi' : 'Suggest workout')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1EB53A]/20 to-[#0F7A28]/10 border border-[#1EB53A]/30 rounded-full whitespace-nowrap hover:bg-[#1EB53A]/30 transition-all"
          >
            <Activity className="w-4 h-4 text-[#1EB53A]" />
            <span className="text-sm text-white" style={{ fontWeight: 600 }}>Workout</span>
          </button>
          <button
            onClick={() => handleSendMessage(profile.language === 'sw' ? 'Chakula bora?' : 'Nutrition tips')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B35]/20 to-[#E85A2A]/10 border border-[#FF6B35]/30 rounded-full whitespace-nowrap hover:bg-[#FF6B35]/30 transition-all"
          >
            <Heart className="w-4 h-4 text-[#FF6B35]" />
            <span className="text-sm text-white" style={{ fontWeight: 600 }}>Nutrition</span>
          </button>
          <button
            onClick={() => handleSendMessage(profile.language === 'sw' ? 'Ninajisikiaje?' : 'How am I doing?')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00A3DD]/20 to-[#0077A3]/10 border border-[#00A3DD]/30 rounded-full whitespace-nowrap hover:bg-[#00A3DD]/30 transition-all"
          >
            <Zap className="w-4 h-4 text-[#00A3DD]" />
            <span className="text-sm text-white" style={{ fontWeight: 600 }}>Progress</span>
          </button>
        </div>
      </div>

      {/* Input - iMessage style */}
      <div className="sticky bottom-0 bg-[#000000]/90 backdrop-blur-xl border-t border-white/10 px-6 py-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 bg-white/10 border border-white/20 rounded-3xl px-5 py-3 focus-within:border-[#1EB53A] transition-colors">
            <input
              type="text"
              placeholder={text.placeholder}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none text-base"
              style={{ fontWeight: 500 }}
            />
          </div>
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <Send className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
