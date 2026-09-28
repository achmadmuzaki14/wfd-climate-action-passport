import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  KeyRound,
  ShieldCheck,
  QrCode,
  Send,
  Loader2,
  Check,
  ListChecks,
} from 'lucide-react';
import { getStation, getStationIndex, STATION_ORDER, getCompletedCount } from '@/lib/stations';
import { getStationIcon } from '@/lib/icons';
import { getColor } from '@/lib/theme';
import type { JourneyHook } from '@/lib/useJourney';
import type { ApprovalType } from '@/lib/types';
import { ApprovalModal } from './ApprovalModal';

interface StationDetailProps {
  slug: string;
  journey: JourneyHook;
  onBack: () => void;
}

export function StationDetail({ slug, journey, onBack }: StationDetailProps) {
  const station = getStation(slug);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const index = getStationIndex(slug);
  const stationProgress = journey.progress[slug];
  const status = stationProgress?.status ?? 'not_started';
  const isApproved = status === 'approved';
  const isSubmitted = status === 'submitted';

  useEffect(() => {
    if (stationProgress?.answers) {
      setAnswers(stationProgress.answers as Record<string, string>);
    }
  }, [stationProgress?.answers]);

  if (!station) return null;

  const Icon = getStationIcon(station.iconName);
  const color = getColor(station.color);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setSaveSuccess(false);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    await journey.saveAnswers(slug as typeof STATION_ORDER[number], answers);
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSubmitForReview = async () => {
    if (station.questions) {
      const allAnswered = station.questions.every(
        (q) => answers[q.id]?.trim().length > 0
      );
      if (!allAnswered) return;
    }
    setSubmitting(true);
    if (station.questions) {
      await journey.saveAnswers(slug as typeof STATION_ORDER[number], answers);
    }
    await journey.setStationStatus(slug as typeof STATION_ORDER[number], 'submitted');
    setSubmitting(false);
    setShowApproval(true);
  };

  const handleRequestApproval = () => {
    setShowApproval(true);
  };

  const handleApproved = async () => {
    setShowApproval(false);
    await journey.setStationStatus(slug as typeof STATION_ORDER[number], 'approved');

    if (journey.completedCount + 1 >= STATION_ORDER.length) {
      await journey.markCompleted();
    }

    onBack();
  };

  const allQuestionsAnswered = station.questions
    ? station.questions.every((q) => answers[q.id]?.trim().length > 0)
    : true;

  // Approval type label for button
  const approvalLabel: Record<ApprovalType, string> = {
    panel_code: 'Enter Panel Code',
    wfd_code: 'Get Facilitator Approval',
    qr_scan: 'Scan QR Code',
  };
  const ApprovalIcon: Record<ApprovalType, typeof KeyRound> = {
    panel_code: KeyRound,
    wfd_code: ShieldCheck,
    qr_scan: QrCode,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Station header */}
      <div className={`bg-gradient-to-br ${color.gradientSolid} text-white relative overflow-hidden`}>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

        <div className="max-w-3xl mx-auto px-5 py-6 relative z-10">
          {/* Back button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Passport
          </button>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
                  Mission {String(index + 1).padStart(2, '0')}
                </span>
                {isApproved && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </span>
                )}
                {isSubmitted && !isApproved && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    Pending Review
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold mb-1">{station.name}</h1>
              <p className="text-white/80 text-sm">{station.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
          <p className="text-gray-700 leading-relaxed">{station.description}</p>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="w-5 h-5 text-gray-400" />
            <h2 className="font-bold text-gray-900">Instructions</h2>
          </div>
          <ol className="space-y-3">
            {station.instructions.map((instruction, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full ${color.bgLight} ${color.text} text-xs font-bold flex items-center justify-center mt-0.5`}
                >
                  {i + 1}
                </span>
                <span className="text-gray-700 text-sm leading-relaxed">
                  {instruction}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Questions (if applicable) */}
        {station.questions && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Reflection Questions</h2>
              <span className="text-xs text-gray-400">
                {Object.keys(answers).filter((k) => answers[k]?.trim()).length} /{' '}
                {station.questions.length} answered
              </span>
            </div>

            <div className="space-y-5">
              {station.questions.map((q, i) => (
                <div key={q.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className={`${color.text} font-bold mr-1.5`}>
                      {i + 1}.
                    </span>
                    {q.prompt}
                  </label>
                  <textarea
                    value={answers[q.id] ?? ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    rows={3}
                    disabled={isApproved || isSubmitted}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-300 transition-all resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              ))}
            </div>

            {/* Save draft */}
            {!isApproved && !isSubmitted && (
              <button
                onClick={handleSaveDraft}
                disabled={saving || Object.keys(answers).length === 0}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-40 transition-colors"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    Saved
                  </>
                ) : (
                  <>Save draft</>
                )}
              </button>
            )}
          </div>
        )}

        {/* Action area */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {isApproved ? (
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Mission Completed</p>
                <p className="text-sm text-gray-500">
                  Return to the passport to choose your next mission.
                </p>
              </div>
              <button
                onClick={onBack}
                className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${color.gradientSolid} text-white font-semibold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Passport
              </button>
            </div>
          ) : isSubmitted ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <p className="font-semibold text-gray-900 mb-1">
                Submitted for Review
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Your answers have been submitted. Ask the facilitator to review
                and enter the approval code.
              </p>
              <button
                onClick={handleRequestApproval}
                className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${color.gradientSolid} text-white font-semibold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all`}
              >
                <ShieldCheck className="w-5 h-5" />
                Enter Approval Code
              </button>
            </div>
          ) : station.questions ? (
            <div className="space-y-3">
              <button
                onClick={handleSubmitForReview}
                disabled={!allQuestionsAnswered || submitting}
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r ${color.gradientSolid} text-white font-semibold rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit for Review
                  </>
                )}
              </button>
              {!allQuestionsAnswered && (
                <p className="text-center text-sm text-gray-400">
                  Answer all questions to submit for review
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={handleRequestApproval}
              className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r ${color.gradientSolid} text-white font-semibold rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all`}
            >
              {(() => {
                const ApprovalIconForStation = ApprovalIcon[station.approvalType];
                return <ApprovalIconForStation className="w-5 h-5" />;
              })()}
              {approvalLabel[station.approvalType]}
            </button>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      <ApprovalModal
        open={showApproval}
        approvalType={station.approvalType}
        stationName={station.name}
        onClose={() => setShowApproval(false)}
        onApproved={handleApproved}
      />
    </div>
  );
}
