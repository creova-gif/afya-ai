import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Camera, Video, CheckCircle, XCircle, AlertCircle, Play, Pause, RotateCcw } from 'lucide-react';
import { UserProfile } from '../App';
import { toast } from 'sonner@2.0.3';

interface FormCheckProps {
  profile: UserProfile;
  exercise: string;
  onBack: () => void;
}

interface FormFeedback {
  overall: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  corrections: string[];
  reps: number;
  score: number;
}

export function FormCheck({ profile, exercise, onBack }: FormCheckProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const text = profile.language === 'sw' ? {
    title: 'Ukaguzi wa Fomu',
    instruction: 'Weka simu yako ili ikuone mwili wote',
    exercise: 'Zoezi',
    startRecording: 'Anza Kurekodi',
    stopRecording: 'Simamisha',
    analyzing: 'Inachambua fomu yako...',
    feedback: 'Maoni',
    reps: 'Mirudio',
    score: 'Alama',
    corrections: 'Marekebisho',
    excellent: 'Bora Sana!',
    good: 'Vizuri',
    needsImprovement: 'Inahitaji Kuboresha',
    poor: 'Jaribu Tena',
    tryAgain: 'Jaribu Tena',
    tips: {
      squat: [
        'Simama miguu ukiwa upana wa mabega',
        'Goti lisipite kidole cha mguu',
        'Mgongo uwe mnyofu',
        'Shuka hadi viuno viwe sawa na magoti',
      ],
      pushup: [
        'Mikono iwe upana wa mabega',
        'Mwili uwe mnyofu kama ubao',
        'Kifua kifikaribie ardhi',
        'Pumzi vizuri',
      ],
      plank: [
        'Mikono iwe chini ya mabega',
        'Mwili uwe mnyofu',
        'Usiinue kiuno juu sana',
        'Shikilia nafasi',
      ],
    },
  } : {
    title: 'Form Check',
    instruction: 'Position your phone to see your full body',
    exercise: 'Exercise',
    startRecording: 'Start Recording',
    stopRecording: 'Stop',
    analyzing: 'Analyzing your form...',
    feedback: 'Feedback',
    reps: 'Reps',
    score: 'Score',
    corrections: 'Corrections',
    excellent: 'Excellent!',
    good: 'Good',
    needsImprovement: 'Needs Improvement',
    poor: 'Try Again',
    tryAgain: 'Try Again',
    tips: {
      squat: [
        'Stand with feet shoulder-width apart',
        'Knees should not pass toes',
        'Keep back straight',
        'Lower until thighs parallel to ground',
      ],
      pushup: [
        'Hands shoulder-width apart',
        'Body straight like a plank',
        'Lower chest close to ground',
        'Breathe properly',
      ],
      plank: [
        'Hands under shoulders',
        'Body in straight line',
        'Don\'t raise hips too high',
        'Hold position',
      ],
    },
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0) {
      setShowCountdown(false);
      startRecordingVideo();
    }
  }, [countdown, showCountdown]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Failed to start camera:', error);
      toast.error(profile.language === 'sw' ? 'Imeshindwa kufungua kamera' : 'Failed to open camera');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleStartRecording = () => {
    setCountdown(3);
    setShowCountdown(true);
    setFeedback(null);
  };

  const startRecordingVideo = () => {
    setIsRecording(true);
    
    // Simulate recording for 10 seconds then analyze
    setTimeout(() => {
      handleStopRecording();
    }, 10000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    analyzeForm();
  };

  const analyzeForm = () => {
    // Simulate AI analysis
    toast.info(text.analyzing);

    setTimeout(() => {
      // Mock AI feedback
      const mockFeedback: FormFeedback = {
        overall: Math.random() > 0.3 ? 'good' : 'needs_improvement',
        reps: Math.floor(Math.random() * 8) + 5,
        score: Math.floor(Math.random() * 30) + 70,
        corrections: generateCorrections(),
      };

      setFeedback(mockFeedback);
    }, 2000);
  };

  const generateCorrections = (): string[] => {
    const exerciseKey = exercise.toLowerCase().includes('squat') ? 'squat' :
                       exercise.toLowerCase().includes('push') ? 'pushup' : 'plank';
    
    const allTips = text.tips[exerciseKey as keyof typeof text.tips];
    const numCorrections = Math.floor(Math.random() * 2) + 1;
    const corrections: string[] = [];
    
    for (let i = 0; i < numCorrections; i++) {
      corrections.push(allTips[Math.floor(Math.random() * allTips.length)]);
    }
    
    return corrections;
  };

  const getFeedbackColor = (overall: FormFeedback['overall']) => {
    switch (overall) {
      case 'excellent': return 'from-green-500 to-emerald-500';
      case 'good': return 'from-blue-500 to-cyan-500';
      case 'needs_improvement': return 'from-yellow-500 to-orange-500';
      case 'poor': return 'from-red-500 to-pink-500';
    }
  };

  const getFeedbackText = (overall: FormFeedback['overall']) => {
    switch (overall) {
      case 'excellent': return text.excellent;
      case 'good': return text.good;
      case 'needs_improvement': return text.needsImprovement;
      case 'poor': return text.poor;
    }
  };

  const getFeedbackIcon = (overall: FormFeedback['overall']) => {
    switch (overall) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="w-8 h-8" />;
      case 'needs_improvement':
        return <AlertCircle className="w-8 h-8" />;
      case 'poor':
        return <XCircle className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0A1F0F] to-[#000000] text-white">
      {/* Header */}
      <div className="bg-[#0A1F0F]/80 backdrop-blur-md border-b border-[#1EB53A]/20 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{text.title}</h1>
              <p className="text-sm text-white/60">{exercise}</p>
            </div>
            <Camera className="w-8 h-8 text-[#1EB53A]" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Camera View */}
        <div className="relative bg-black rounded-3xl overflow-hidden aspect-[3/4]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Countdown Overlay */}
          {showCountdown && countdown > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50"
            >
              <div className="text-9xl font-bold text-white">{countdown}</div>
            </motion.div>
          )}

          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-semibold">REC</span>
            </div>
          )}

          {/* Skeleton Overlay (simulated) */}
          {isRecording && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Simple skeleton visualization */}
              <svg className="w-full h-full" viewBox="0 0 200 300">
                <circle cx="100" cy="60" r="20" fill="none" stroke="#1EB53A" strokeWidth="2" opacity="0.6" />
                <line x1="100" y1="80" x2="100" y2="150" stroke="#1EB53A" strokeWidth="2" opacity="0.6" />
                <line x1="100" y1="100" x2="70" y2="130" stroke="#1EB53A" strokeWidth="2" opacity="0.6" />
                <line x1="100" y1="100" x2="130" y2="130" stroke="#1EB53A" strokeWidth="2" opacity="0.6" />
                <line x1="100" y1="150" x2="70" y2="220" stroke="#1EB53A" strokeWidth="2" opacity="0.6" />
                <line x1="100" y1="150" x2="130" y2="220" stroke="#1EB53A" strokeWidth="2" opacity="0.6" />
              </svg>
            </div>
          )}

          {/* Instructions */}
          {!isRecording && !feedback && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md rounded-2xl p-4">
              <p className="text-sm text-center text-white">{text.instruction}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        {!feedback && (
          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="px-8 py-4 bg-gradient-to-r from-[#1EB53A] to-emerald-500 text-white rounded-full font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                {text.startRecording}
              </button>
            ) : (
              <button
                onClick={handleStopRecording}
                className="px-8 py-4 bg-red-500 text-white rounded-full font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Pause className="w-5 h-5" />
                {text.stopRecording}
              </button>
            )}
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Overall Score */}
            <div className={`bg-gradient-to-r ${getFeedbackColor(feedback.overall)} p-6 rounded-3xl`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getFeedbackIcon(feedback.overall)}
                  <h2 className="text-2xl font-bold text-white">
                    {getFeedbackText(feedback.overall)}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{feedback.score}%</div>
                  <div className="text-sm text-white/80">{text.score}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-white/90">
                  <div className="text-3xl font-bold">{feedback.reps}</div>
                  <div className="text-sm">{text.reps}</div>
                </div>
              </div>
            </div>

            {/* Corrections */}
            {feedback.corrections.length > 0 && (
              <div className="bg-black/30 border border-white/10 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">{text.corrections}</h3>
                <div className="space-y-3">
                  {feedback.corrections.map((correction, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#1EB53A]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#1EB53A] text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-white/80 text-sm">{correction}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Try Again Button */}
            <button
              onClick={() => {
                setFeedback(null);
                setCountdown(3);
              }}
              className="w-full py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              {text.tryAgain}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
