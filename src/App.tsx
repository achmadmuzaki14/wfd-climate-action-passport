import { useState } from 'react';
import { useJourney } from '@/lib/useJourney';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { Dashboard } from '@/components/Dashboard';
import { StationDetail } from '@/components/StationDetail';

function App() {
  const journey = useJourney();
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  if (journey.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-emerald-100/80 text-sm">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (journey.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md text-center border border-white/10">
          <p className="text-white font-semibold mb-2">Something went wrong</p>
          <p className="text-emerald-100/70 text-sm mb-4">{journey.error}</p>
          <button
            onClick={() => journey.resetJourney()}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!journey.participant) {
    return (
      <WelcomeScreen
        onStart={async (name) => {
          await journey.createParticipant(name);
        }}
      />
    );
  }

  if (selectedStation) {
    return (
      <StationDetail
        slug={selectedStation}
        journey={journey}
        onBack={() => setSelectedStation(null)}
      />
    );
  }

  return (
    <Dashboard journey={journey} onSelectStation={(slug) => setSelectedStation(slug)} />
  );
}

export default App;
