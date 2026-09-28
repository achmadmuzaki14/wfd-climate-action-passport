import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Trees,
  Trophy,
  RotateCcw,
} from 'lucide-react';
import { STATIONS, STATION_ORDER } from '@/lib/stations';
import { getStationIcon } from '@/lib/icons';
import { getColor } from '@/lib/theme';
import type { ProgressMap } from '@/lib/types';
import type { JourneyHook } from '@/lib/useJourney';

interface DashboardProps {
  journey: JourneyHook;
  onSelectStation: (slug: string) => void;
}

export function Dashboard({ journey, onSelectStation }: DashboardProps) {
  const { participant, progress, completedCount, allComplete } = journey;

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to reset your journey? All progress will be lost.'
      )
    ) {
      journey.resetJourney();
    }
  };

  if (allComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </div>

        <div className="relative z-10 max-w-xl w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400 blur-3xl opacity-50" />
              <div className="relative w-28 h-28 bg-gradient-to-br from-amber-300 to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/50">
                <Trophy className="w-14 h-14 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Journey Complete!
          </h1>
          <p className="text-lg text-emerald-100/80 mb-2">
            Congratulations{participant?.display_name ? `, ${participant.display_name}` : ''}!
          </p>
          <p className="text-emerald-200/60 mb-8">
            You have successfully completed all 5 missions of your Climate Action Passport.
          </p>

          <div className="flex justify-center gap-3 mb-8">
            {STATIONS.map((station) => {
              const Icon = getStationIcon(station.iconName);
              const color = getColor(station.color);
              return (
                <div
                  key={station.slug}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              );
            })}
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium rounded-xl border border-white/10 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Start New Journey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
        <div className="max-w-5xl mx-auto px-5 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Trees className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Climate Action Passport</h1>
                <p className="text-xs text-emerald-200/70">
                  {participant?.display_name
                    ? `Welcome, ${participant.display_name}`
                    : 'Interactive Exhibition'}
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-emerald-200/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset journey"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-emerald-100/80 font-medium">
                Progress
              </span>
              <span className="text-sm text-emerald-100 font-bold">
                {completedCount} / {STATION_ORDER.length}
              </span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(completedCount / STATION_ORDER.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Station cards */}
      <main className="max-w-5xl mx-auto px-5 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Climate Action Missions
          </h2>
          <p className="text-sm text-gray-500">
            Complete all five missions in any order. Tap any mission to begin or continue.
          </p>
        </div>

        <div className="space-y-3">
          {STATIONS.map((station, index) => {
            const Icon = getStationIcon(station.iconName);
            const color = getColor(station.color);
            const stationProgress = progress[station.slug];
            const isApproved = stationProgress?.status === 'approved';
            const isSubmitted = stationProgress?.status === 'submitted';
            const isInProgress = stationProgress?.status === 'in_progress';

            return (
              <button
                key={station.slug}
                onClick={() => onSelectStation(station.slug)}
                className="w-full text-left rounded-2xl border-2 border-gray-200 bg-white hover:border-emerald-300 hover:shadow-lg cursor-pointer transition-all duration-300 overflow-hidden group"
              >
                <div className="flex items-center p-4 gap-4">
                  {/* Number / Icon */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                        isApproved
                          ? `bg-gradient-to-br ${color.gradient} shadow-lg ${color.shadow}`
                          : `${color.bgLight} ${color.border} border-2`
                      }`}
                    >
                      {isApproved ? (
                        <Icon className="w-7 h-7 text-white" />
                      ) : (
                        <Icon className={`w-7 h-7 ${color.text}`} />
                      )}
                    </div>
                    {/* Mission number badge */}
                    <div
                      className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center border-2 border-white ${
                        isApproved
                          ? 'bg-emerald-500 text-white'
                          : `${color.bg} text-white`
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-base text-gray-900">
                        {station.name}
                      </h3>
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </span>
                      )}
                      {isSubmitted && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          <Circle className="w-3 h-3 fill-amber-400 text-amber-400" />
                          Ready for review
                        </span>
                      )}
                      {isInProgress && !isSubmitted && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                          In Progress
                        </span>
                      )}
                      {!isApproved && !isSubmitted && !isInProgress && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          Not started
                        </span>
                      )}
                    </div>
                    <p className="text-sm truncate text-gray-500">
                      {station.subtitle}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0">
                    {isApproved ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <ArrowRight
                        className={`w-5 h-5 ${color.text} group-hover:translate-x-1 transition-transform`}
                      />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
