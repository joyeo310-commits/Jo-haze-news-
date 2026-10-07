import React, { useState } from 'react';
import { X, Bell, CheckCircle2, ShieldAlert, Smartphone, Mail, Send } from 'lucide-react';
import { civicAudio } from '../utils/audio';

interface AlertSubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertSubscribeModal: React.FC<AlertSubscribeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [channel, setChannel] = useState<'sms' | 'telegram' | 'email'>('telegram');
  const [contact, setContact] = useState('');
  const [threshold, setThreshold] = useState<number>(100);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    civicAudio.playNotification('info');
    setSubmitted(true);
    setTimeout(() => {
      // Close after 2 seconds
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-2xl max-w-md w-full overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#0EA5E9]" />
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                Subscribe to National Haze & PSI Alerts
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Immediate broadcast when regional air quality exceeds your threshold
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-[#0F172A]">
                Subscription Activated
              </h4>
              <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                You will receive real-time push dispatches when 24-hr PSI exceeds <strong>{threshold}</strong>.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-[#0F172A] text-white text-xs font-semibold rounded hover:bg-slate-800 transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Channel Selector */}
              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-1.5">
                  Notification Channel:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('telegram')}
                    className={`p-2.5 rounded border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      channel === 'telegram'
                        ? 'border-[#0F172A] bg-slate-50 text-[#0F172A] font-semibold'
                        : 'border-[#CBD5E1] text-[#64748B] hover:bg-slate-50'
                    }`}
                  >
                    <Send className="w-4 h-4 text-sky-500" />
                    <span>Telegram Bot</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    className={`p-2.5 rounded border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      channel === 'sms'
                        ? 'border-[#0F172A] bg-slate-50 text-[#0F172A] font-semibold'
                        : 'border-[#CBD5E1] text-[#64748B] hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    <span>SMS Push</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`p-2.5 rounded border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      channel === 'email'
                        ? 'border-[#0F172A] bg-slate-50 text-[#0F172A] font-semibold'
                        : 'border-[#CBD5E1] text-[#64748B] hover:bg-slate-50'
                    }`}
                  >
                    <Mail className="w-4 h-4 text-indigo-500" />
                    <span>Email Digest</span>
                  </button>
                </div>
              </div>

              {/* Input for handle / phone / email */}
              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-1">
                  {channel === 'telegram'
                    ? 'Telegram Handle / Mobile Number'
                    : channel === 'sms'
                    ? 'Singapore Mobile Number (+65)'
                    : 'Email Address'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    channel === 'telegram'
                      ? '@username or 91234567'
                      : channel === 'sms'
                      ? '9123 4567'
                      : 'citizen@example.gov.sg'
                  }
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded focus:outline-none focus:border-[#0284C7] bg-white text-[#0F172A]"
                />
              </div>

              {/* Alert Trigger Threshold */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#0F172A]">
                    Alert Trigger Threshold (PSI):
                  </label>
                  <span className="text-xs font-bold text-[#0284C7] tabular-nums">
                    PSI &ge; {threshold} ({threshold <= 100 ? 'Moderate+' : threshold <= 200 ? 'Unhealthy+' : 'Very Unhealthy+'})
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="250"
                  step="25"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full accent-[#0F172A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#64748B] mt-1">
                  <span>50 (Moderate)</span>
                  <span>100 (Unhealthy)</span>
                  <span>200 (Very Unhealthy)</span>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[11px] text-[#475569] flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-[#0EA5E9] shrink-0 mt-0.5" />
                <span>
                  Official Government broadcast service. We will never send commercial promotions or spam.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0F172A] text-white text-xs font-bold rounded hover:bg-slate-800 transition-colors shadow-xs"
              >
                Confirm Haze Alert Subscription
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
