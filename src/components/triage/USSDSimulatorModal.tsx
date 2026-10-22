import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Phone, PhoneCall, PhoneOff, RotateCcw, Signal, Battery, Radio } from 'lucide-react';
import { SMSUssdService } from '../../services/smsUssdService';
import { USSDSessionState } from '../../types/smsUssd';
import { toast } from 'sonner';

interface USSDSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const USSDSimulatorModal: React.FC<USSDSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [session, setSession] = useState<USSDSessionState>(() =>
    SMSUssdService.initUSSDSession()
  );
  const [inputBuffer, setInputBuffer] = useState('');

  const handleKeyPress = (char: string) => {
    if (session.isTerminal) return;
    setInputBuffer((prev) => (prev.length < 5 ? prev + char : prev));
  };

  const handleSend = () => {
    if (!inputBuffer.trim()) return;
    const result = SMSUssdService.processUSSDInput(session, inputBuffer);
    setSession(result.state);
    setInputBuffer('');

    if (result.actionTriggered === 'emergency_call') {
      toast.error('Namba ya Dharura 112 imechaguliwa!');
    } else if (result.actionTriggered) {
      toast.success('Taarifa ya USSD imetumwa kwa mafanikio!');
    }
  };

  const handleClear = () => {
    setInputBuffer('');
  };

  const handleReset = () => {
    setSession(SMSUssdService.initUSSDSession());
    setInputBuffer('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-4 sm:p-6 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
              <Radio className="w-3 h-3 mr-1 animate-pulse" />
              2G / GSM Feature Phone Bridge
            </Badge>
            <span className="text-[11px] font-mono text-muted-foreground">Shortcode: *152*05*23#</span>
          </div>
          <DialogTitle className="text-lg font-bold text-white">
            USSD Health Simulator (Boma Bridge)
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Mfumo wa dharura wa simu za kawaida (Kitochi) vijijini bila intaneti.
          </DialogDescription>
        </DialogHeader>

        {/* Feature Phone Device Chassis */}
        <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 shadow-inner space-y-4">
          {/* LCD Screen Header (Signal & Battery) */}
          <div className="flex items-center justify-between px-2 text-[10px] text-emerald-400/80 font-mono">
            <div className="flex items-center gap-1">
              <Signal className="w-3 h-3 text-emerald-400" />
              <span>AIRTEL TZ | EDGE</span>
            </div>
            <div className="flex items-center gap-1">
              <span>94%</span>
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* Monochrome Green LCD Display */}
          <div className="bg-[#051c0d] border border-emerald-600/40 rounded-2xl p-4 text-emerald-400 font-mono text-xs shadow-inner min-h-[170px] flex flex-col justify-between select-none">
            <div className="whitespace-pre-wrap leading-relaxed tracking-tight">
              {session.screenText}
            </div>

            {/* Input prompt area */}
            <div className="pt-2 border-t border-emerald-800/60 mt-2 flex items-center justify-between text-xs">
              <span className="text-emerald-500/80">
                {session.isTerminal ? '[Kikao Kimekamilika]' : 'Ingiza chaguo:'}
              </span>
              <span className="font-bold text-white bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700/60 min-w-[32px] text-center">
                {inputBuffer || '_'}
              </span>
            </div>
          </div>

          {/* Action Call Banner if Terminal Emergency */}
          {session.isTerminal && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-2xl flex items-center justify-between text-xs">
              <div className="text-red-300 font-medium">
                Piga simu ya bure ya uokoaji:
              </div>
              <Button
                size="sm"
                onClick={() => window.open('tel:112')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold h-7 rounded-xl text-xs gap-1"
              >
                <PhoneCall className="w-3 h-3" />
                Piga 112
              </Button>
            </div>
          )}

          {/* Feature Phone Keypad */}
          <div className="space-y-2 pt-1">
            {/* Soft Function Keys: Send / Back */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSend}
                disabled={session.isTerminal || !inputBuffer}
                className="h-10 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1 shadow transition-all active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                TUMA (SEND)
              </button>
              <button
                type="button"
                onClick={session.isTerminal ? handleReset : handleClear}
                className="h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 border border-slate-700 transition-all active:scale-95"
              >
                {session.isTerminal ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    ANZISHA UPYA
                  </>
                ) : (
                  <>
                    <PhoneOff className="w-3.5 h-3.5" />
                    FUTA (CLR)
                  </>
                )}
              </button>
            </div>

            {/* Numeric 3x4 Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { num: '1', sub: '.,' },
                { num: '2', sub: 'ABC' },
                { num: '3', sub: 'DEF' },
                { num: '4', sub: 'GHI' },
                { num: '5', sub: 'JKL' },
                { num: '6', sub: 'MNO' },
                { num: '7', sub: 'PQRS' },
                { num: '8', sub: 'TUV' },
                { num: '9', sub: 'WXYZ' },
                { num: '*', sub: 'APP' },
                { num: '0', sub: 'RUDI' },
                { num: '#', sub: 'END' },
              ].map((k) => (
                <button
                  key={k.num}
                  type="button"
                  onClick={() => handleKeyPress(k.num)}
                  disabled={session.isTerminal}
                  className="h-11 rounded-2xl bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 border border-slate-700/60 flex flex-col items-center justify-center text-slate-100 transition-all active:scale-95 disabled:opacity-50"
                >
                  <span className="font-bold text-sm leading-none">{k.num}</span>
                  <span className="text-[9px] text-slate-400 font-mono tracking-tighter">
                    {k.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-white gap-1 h-8"
          >
            <RotateCcw className="w-3 h-3" />
            Rejesha USSD
          </Button>
          <Button
            size="sm"
            onClick={onClose}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white"
          >
            Funga
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
