'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle, Clock, Heart, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import UserNavbar from '@/components/user-navbar';
import { toast } from 'sonner';
import { getBreathingPattern } from '@/lib/game-patterns';

export default function Level2Page() {
  const [gameState, setGameState] = useState('instructions'); // instructions, playing, completed
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold, exhale, pause
  const [cycleCount, setCycleCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [startTime, setStartTime] = useState(null);
  const [orbScale, setOrbScale] = useState(1);
  const [consistency, setConsistency] = useState(100);
  const [journalEntry, setJournalEntry] = useState('');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(null);

  const timerRef = useRef(null);
  const phaseTimerRef = useRef(null);
  const consistencyRef = useRef(100);

  useEffect(() => {
    // Get a random breathing pattern for this session
    const pattern = getBreathingPattern('beginner', 60, 'general');
    setSelectedPattern(pattern);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    };
  }, []);

  const startBreathing = () => {
    setGameState('playing');
    setIsActive(true);
    setStartTime(Date.now());
    setTimeRemaining(60);
    setCycleCount(0);
    setConsistency(100);
    consistencyRef.current = 100;

    // Start main timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          completeBreathing();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start breathing cycle
    startBreathingCycle();
  };

  const startBreathingCycle = () => {
    if (!selectedPattern) return;

    const phases = ['inhale', 'hold', 'exhale', 'pause'];
    let currentPhaseIndex = 0;

    const nextPhase = () => {
      const phase = phases[currentPhaseIndex];
      setBreathingPhase(phase);
      setPhaseProgress(0);

      // Animate orb based on phase
      if (phase === 'inhale') {
        setOrbScale(1.5);
      } else if (phase === 'exhale') {
        setOrbScale(0.7);
      } else {
        setOrbScale(phase === 'hold' ? 1.5 : 0.7);
      }

      // Progress animation for current phase
      const duration = selectedPattern.pattern[phase];
      const interval = 50;
      let elapsed = 0;

      const progressTimer = setInterval(() => {
        elapsed += interval;
        const progress = (elapsed / duration) * 100;
        setPhaseProgress(Math.min(progress, 100));

        if (elapsed >= duration) {
          clearInterval(progressTimer);
          currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;

          if (currentPhaseIndex === 0) {
            setCycleCount(prev => prev + 1);
          }

          if (isActive) {
            nextPhase();
          }
        }
      }, interval);

      phaseTimerRef.current = progressTimer;
    };

    nextPhase();
  };

  const pauseBreathing = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
  };

  const resumeBreathing = () => {
    setIsActive(true);

    // Resume main timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          completeBreathing();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Resume breathing cycle
    startBreathingCycle();
  };

  const resetBreathing = () => {
    setIsActive(false);
    setTimeRemaining(60);
    setCycleCount(0);
    setBreathingPhase('inhale');
    setOrbScale(1);
    setPhaseProgress(0);
    setConsistency(100);
    consistencyRef.current = 100;

    if (timerRef.current) clearInterval(timerRef.current);
    if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
  };

  const completeBreathing = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);

    // Calculate final score
    const timeBonus = timeRemaining > 0 ? 0 : 20; // Bonus for completing full minute
    const cycleBonus = Math.min(cycleCount * 5, 30); // Up to 30 points for cycles
    const consistencyScore = Math.round(consistencyRef.current);

    toast.success('Breathing session completed! Well done on your mindful practice.');
    setGameState('completed');
  };

  const submitCompletion = async () => {
    try {
      const gameData = {
        level: 2,
        completed: true,
        score: Math.round(consistencyRef.current),
        timeSpent: 60 - timeRemaining,
        cycles: cycleCount,
        journalEntry
      };

      const response = await fetch('/api/games/complete-level', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(gameData),
      });

      if (response.ok) {
        toast.success('Level 2 completed! Your breathing skills are improving.');
      } else {
        toast.error('Failed to save progress. Please try again.');
      }
    } catch (error) {
      console.error('Error completing level:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const getPhaseInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe In Slowly';
      case 'hold': return 'Hold Your Breath';
      case 'exhale': return 'Breathe Out Slowly';
      case 'pause': return 'Pause and Rest';
      default: return 'Follow the Rhythm';
    }
  };

  const getPhaseColor = () => {
    switch (breathingPhase) {
      case 'inhale': return 'from-blue-400 to-cyan-400';
      case 'hold': return 'from-purple-400 to-blue-400';
      case 'exhale': return 'from-green-400 to-emerald-400';
      case 'pause': return 'from-gray-400 to-slate-400';
      default: return 'from-blue-400 to-cyan-400';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="icon">
                <Link href="/games">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Level 2: The Ticking Hallways</h1>
                <p className="text-muted-foreground">Master breathing techniques for stress relief</p>
              </div>
            </div>

            {gameState === 'playing' && (
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{timeRemaining}s</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{cycleCount} cycles</span>
                </div>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {/* Instructions */}
            {gameState === 'instructions' && (
              <motion.div
                key="instructions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Welcome to The Ticking Hallways
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-lg leading-relaxed">
                        In this level, you'll learn the <strong>4-4-4-4 breathing technique</strong> -
                        a powerful method to activate your body's relaxation response and reduce stress and anxiety.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Breathing Pattern:</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm"><strong>Inhale</strong> for 4 seconds</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-sm"><strong>Hold</strong> for 4 seconds</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm"><strong>Exhale</strong> for 4 seconds</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            <span className="text-sm"><strong>Pause</strong> for 4 seconds</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Benefits:</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Activates the parasympathetic nervous system
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Reduces stress hormones like cortisol
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Lowers heart rate and blood pressure
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Improves focus and mental clarity
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Promotes feelings of calm and relaxation
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Tip:</strong> Find a comfortable position, close your eyes if you'd like,
                        and focus on the breathing orb. Let it guide your rhythm naturally.
                      </p>
                    </div>

                    <div className="flex justify-center pt-4">
                      <Button onClick={startBreathing} size="lg" className="px-8">
                        Start Breathing Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Breathing Game */}
            {gameState === 'playing' && (
              <motion.div
                key="breathing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Session Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {60 - timeRemaining}/60 seconds
                    </span>
                  </div>
                  <Progress value={((60 - timeRemaining) / 60) * 100} className="h-2" />
                </div>

                {/* Breathing Orb */}
                <div className="relative mb-8">
                  <motion.div
                    className={`w-64 h-64 mx-auto rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl`}
                    animate={{
                      scale: orbScale,
                      boxShadow: `0 0 ${orbScale * 50}px rgba(59, 130, 246, 0.3)`
                    }}
                    transition={{
                      duration: breathingPattern[breathingPhase] / 1000,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Phase Progress Ring */}
                  <div className="absolute inset-0 w-64 h-64 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - phaseProgress / 100)}`}
                        className="transition-all duration-75"
                      />
                    </svg>
                  </div>
                </div>

                {/* Instructions */}
                <motion.div
                  key={breathingPhase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h2 className="text-3xl font-bold mb-2">{getPhaseInstruction()}</h2>
                  <p className="text-muted-foreground">
                    {breathingPhase === 'inhale' && "Fill your lungs slowly and deeply"}
                    {breathingPhase === 'hold' && "Keep the air in your lungs gently"}
                    {breathingPhase === 'exhale' && "Release the air slowly and completely"}
                    {breathingPhase === 'pause' && "Rest before the next breath"}
                  </p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{timeRemaining}</div>
                    <div className="text-xs text-muted-foreground">Seconds Left</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{cycleCount}</div>
                    <div className="text-xs text-muted-foreground">Cycles</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{Math.round(consistencyRef.current)}%</div>
                    <div className="text-xs text-muted-foreground">Consistency</div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={isActive ? pauseBreathing : resumeBreathing}
                    variant="outline"
                    size="lg"
                  >
                    {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isActive ? 'Pause' : 'Resume'}
                  </Button>
                  <Button onClick={resetBreathing} variant="outline" size="lg">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Completion */}
            {gameState === 'completed' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Breathing Session Complete!
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg text-center">
                      <p className="text-green-800 dark:text-green-200">
                        🌟 Excellent work! You've completed your mindful breathing practice.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{60 - timeRemaining}s</div>
                        <div className="text-sm text-muted-foreground">Time Practiced</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">{cycleCount}</div>
                        <div className="text-sm text-muted-foreground">Breath Cycles</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{Math.round(consistencyRef.current)}%</div>
                        <div className="text-sm text-muted-foreground">Consistency</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="journal" className="text-base font-medium">
                        How do you feel after this breathing practice?
                      </Label>
                      <Textarea
                        id="journal"
                        placeholder="Reflect on how your body and mind feel after the breathing exercise..."
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                        className="min-h-24"
                      />
                    </div>

                    <div className="flex justify-center">
                      <Button onClick={submitCompletion} size="lg" className="px-8">
                        Complete Level 2
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}