import { useState } from 'react';
import { Trees, ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [starting, setStarting] = useState(false);

  const handleStart = async () => {
    setStarting(true);
    onStart(name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Logo / Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-50" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/50">
              <Trees className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-emerald-200 text-sm font-medium mb-6 border border-white/10">
            <Sparkles className="w-4 h-4" />
            Interactive Exhibition Experience
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
            Climate Action Passport
          </h1>
          <p className="text-lg text-emerald-100/80 max-w-lg mx-auto leading-relaxed">
            Complete five interactive missions in any order. Attend a panel,
            explore a VR forest, discover forest products, and more — your
            passport, your path.
          </p>
        </div>

        {/* Station preview pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 mt-8">
          {[
            'Join a Panel Session',
            "Download Let's Read",
            'Experience the Forest',
            'Discover a Forest Product',
            'Discover a Photo Story',
          ].map((label, i) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
            >
              <span className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-bold flex items-center justify-center">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-emerald-100/90 text-sm font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Name input + start */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
          <label className="block text-sm font-medium text-emerald-100/80 mb-2">
            Your name (optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !starting) handleStart();
            }}
            placeholder="Enter your name to personalize your journey"
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent transition-all"
            disabled={starting}
          />
          <button
            onClick={handleStart}
            disabled={starting}
            className="w-full mt-4 px-6 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30"
          >
            {starting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Starting...
              </>
            ) : (
              <>
                Start Your Passport
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        <p className="text-center text-emerald-200/40 text-xs mt-6">
          Your progress is saved automatically on this device
        </p>
      </div>
    </div>
  );
}
