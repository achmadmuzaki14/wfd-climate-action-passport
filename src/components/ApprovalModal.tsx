import { useState, useEffect } from 'react';
import { X, KeyRound, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useFacilitatorCode } from '@/lib/useFacilitatorCode';
import type { ApprovalType } from '@/lib/types';

interface ApprovalModalProps {
  open: boolean;
  approvalType: ApprovalType;
  stationName: string;
  onClose: () => void;
  onApproved: () => void;
  qrCodeUrl?: string | null;
}

const MODAL_CONFIG: Record<
  ApprovalType,
  { title: string; subtitle: string; codeType: string; inputLabel: string; icon: typeof KeyRound }
> = {
  panel_code: {
    title: 'Enter Panel Code',
    subtitle: 'Enter the code announced by the panel speaker to complete this station.',
    codeType: 'panel',
    inputLabel: 'Panel Code',
    icon: KeyRound,
  },
  wfd_code: {
    title: 'Facilitator Approval Required',
    subtitle: 'Ask the facilitator to enter the WFD approval code to confirm your submission.',
    codeType: 'wfd',
    inputLabel: 'WFD Approval Code',
    icon: ShieldCheck,
  },
  qr_scan: {
    title: 'Scan QR Code',
    subtitle: 'The facilitator will display a private QR code. Scan it to confirm completion.',
    codeType: 'vr',
    inputLabel: 'VR Confirmation Code',
    icon: KeyRound,
  },
};

export function ApprovalModal({
  open,
  approvalType,
  stationName,
  onClose,
  onApproved,
  qrCodeUrl,
}: ApprovalModalProps) {
  const [code, setCode] = useState('');
  const { verifying, error, verifyCode, setError } = useFacilitatorCode();

  useEffect(() => {
    if (open) {
      setCode('');
      setError(null);
    }
  }, [open, setError]);

  if (!open) return null;

  const config = MODAL_CONFIG[approvalType];
  const Icon = config.icon;

  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Please enter a code.');
      return;
    }

    const valid = await verifyCode(code, config.codeType);
    if (valid) {
      onApproved();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4">
          <Icon className="w-7 h-7 text-white" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">{config.title}</h2>
        <p className="text-sm text-gray-500 mb-1">{stationName}</p>
        <p className="text-sm text-gray-600 mb-5">{config.subtitle}</p>

        {approvalType === 'qr_scan' && qrCodeUrl && (
          <div className="mb-5 flex justify-center">
            <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
              <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40" />
            </div>
          </div>
        )}

        {approvalType === 'qr_scan' && !qrCodeUrl && (
          <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-sm text-amber-800">
              Ask the facilitator to display the private QR code, then enter the
              confirmation code below.
            </p>
          </div>
        )}

        {/* Code input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {config.inputLabel}
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !verifying) handleVerify();
            }}
            placeholder="Enter code here..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 font-mono text-lg tracking-wider uppercase placeholder:text-gray-300 placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all"
            disabled={verifying}
            autoFocus
          />

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={verifying || !code.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
          >
            {verifying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Verify & Complete
              </>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Only a facilitator can provide this code
        </p>
      </div>
    </div>
  );
}
