'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, Target, BookOpen, Flower, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import UserNavbar from '@/components/user-navbar';
import { toast } from 'sonner';
import { getMindfulnessActivities } from '@/lib/game-patterns';

export default function Level4Page() {
  const [gameState, setGameState] = useState('instructions'); // instructions, playing, journal, completed
  const [activities, setActivities] = useState([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [activityStartTime, setActivityStartTime] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [observationComplete, setObservationComplete] = useState(false);
  const timerRef = useRef(null);
  const activityTimerRef = useRef(null);

  useEffect(() => {
    // Get random mindfulness activities for this session
    const sessionActivities = getMindfulnessActivities(5, 'beginner', ['count', 'identify', 'observe', 'sensory']);
    setActivities(sessionActivities);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (activityTimerRef.current) clearInterval(activityTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && startTime) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(Date.now() - startTime);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [gameState, startTime]);

  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    startCurrentActivity();
  };

  const startCurrentActivity = () => {
    setActivityStartTime(Date.now());
    setUserAnswer('');
    setSelectedOptions([]);
    setObservationComplete(false);
    
    const currentActivity = activities[currentActivityIndex];
    if (currentActivity && currentActivity.type === 'observe') {
      // Start observation timer
      activityTimerRef.current = setTimeout(() => {
        setObservationComplete(true);
      }, currentActivity.duration * 1000);
    }
  };

  const submitActivity = () => {
    const currentActivity = activities[currentActivityIndex];
    const timeSpent = Date.now() - activityStartTime;
    let isCorrect = false;
    let score = 0;

    switch (currentActivity.type) {
      case 'count':
        const userCount = parseInt(userAnswer);
        isCorrect = userCount === currentActivity.correctCount;
        score = isCorrect ? 100 : Math.max(0, 100 - Math.abs(userCount - currentActivity.correctCount) * 10);
        break;
        
      case 'identify':
        isCorrect = selectedOptions.length === currentActivity.correctAnswers.length &&
                   selectedOptions.every(option => currentActivity.correctAnswers.includes(option));
        score = (selectedOptions.filter(option => currentActivity.correctAnswers.includes(option)).length / 
                currentActivity.correctAnswers.length) * 100;
        break;
        
      case 'observe':
      case 'sensory':
        isCorrect = observationComplete;
        score = observationComplete ? 100 : 50;
        break;
        
      default:
        isCorrect = true;
        score = 75;
    }

    const activityResult = {
      ...currentActivity,
      completed: true,
      correct: isCorrect,
      score,
      timeSpent: Math.round(timeSpent / 1000),
      userAnswer: currentActivity.type === 'count' ? userAnswer : selectedOptions
    };

    setCompletedActivities(prev => [...prev, activityResult]);

    if (isCorrect) {
      toast.success('Excellent mindful observation!');
    } else {
      toast.success('Good effort! Mindfulness is about the practice, not perfection.');
    }

    // Move to next activity or complete level
    if (currentActivityIndex + 1 < activities.length) {
      setTimeout(() => {
        setCurrentActivityIndex(prev => prev + 1);
        startCurrentActivity();
      }, 2000);
    } else {
      setTimeout(() => {
        setGameState('journal');
      }, 2000);
    }
  };

  const toggleOption = (option) => {
    setSelectedOptions(prev => 
      prev.includes(option)
        ? prev.filter(opt => opt !== option)
        : [...prev, option]
    );
  };

  const submitJournal = async () => {
    try {
      const gameData = {
        level: 4,
        completed: true,
        score: Math.round(completedActivities.reduce((acc, activity) => acc + activity.score, 0) / completedActivities.length),
        timeSpent: Math.round(timeElapsed / 1000),
        activitiesCompleted: completedActivities.length,
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
        setGameState('completed');
        toast.success('Level 4 completed! Your mindfulness skills are blossoming.');
      } else {
        toast.error('Failed to save progress. Please try again.');
      }
    } catch (error) {
      console.error('Error completing level:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const currentActivity = activities[currentActivityIndex];

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
                <h1 className="text-3xl font-bold">Level 4: Mindful Garden</h1>
                <p className="text-muted-foreground">Cultivate awareness through mindful observation</p>
              </div>
            </div>
            
            {gameState === 'playing' && (
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(timeElapsed)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>{completedActivities.length}/{activities.length}</span>
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
                      <Flower className="h-5 w-5" />
                      Welcome to the Mindful Garden
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-lg leading-relaxed">
                        Step into a serene garden where you'll practice <strong>mindful awareness</strong> - 
                        the art of paying attention to the present moment with curiosity and acceptance.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Mindfulness Activities:</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <Eye className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Counting:</strong> Count specific elements in the garden</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Identifying:</strong> Recognize colors, shapes, and patterns</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Flower className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Observing:</strong> Watch movement and change over time</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Target className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Sensing:</strong> Notice textures, scents, and sounds</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-3">Benefits:</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Reduces anxiety and stress
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Improves focus and attention
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Enhances emotional regulation
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Increases self-awareness
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Promotes inner peace
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Remember:</strong> There are no wrong answers in mindfulness. 
                        The goal is simply to notice and be present with whatever you observe.
                      </p>
                    </div>

                    <div className="flex justify-center pt-4">
                      <Button onClick={startGame} size="lg" className="px-8">
                        Enter the Garden
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Mindfulness Activities */}
            {gameState === 'playing' && currentActivity && (
              <motion.div
                key="mindfulness"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Garden Journey Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {completedActivities.length}/{activities.length} activities completed
                    </span>
                  </div>
                  <Progress value={(completedActivities.length / activities.length) * 100} className="h-2" />
                </div>

                {/* Current Activity */}
                <Card className="border-2 border-green-200 dark:border-green-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Activity {currentActivityIndex + 1}: {currentActivity.title}</span>
                      <Badge variant="outline" className="capitalize">
                        {currentActivity.type}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Activity Description */}
                    <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-700">
                      <Flower className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                        {currentActivity.description}
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {currentActivity.instructions}
                      </p>
                      {currentActivity.timeLimit && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                          Time limit: {currentActivity.timeLimit} seconds
                        </p>
                      )}
                    </div>

                    {/* Garden Visualization */}
                    <div className="relative h-64 bg-gradient-to-b from-sky-200 to-green-200 dark:from-sky-800 dark:to-green-800 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-green-300/50 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-400/60 to-transparent"></div>
                      
                      {/* Garden Elements */}
                      <div className="absolute bottom-4 left-4 text-4xl">🌹</div>
                      <div className="absolute bottom-8 right-8 text-3xl">🦋</div>
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-2xl">☀️</div>
                      <div className="absolute bottom-12 left-1/3 text-2xl">🌸</div>
                      <div className="absolute bottom-6 right-1/3 text-2xl">🌿</div>
                      <div className="absolute top-16 right-4 text-xl">☁️</div>
                      
                      {/* Activity-specific elements */}
                      {currentActivity.type === 'count' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-white bg-black/50 px-4 py-2 rounded-lg">
                              Look carefully and count: {currentActivity.target}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Activity Interface */}
                    {currentActivity.type === 'count' && (
                      <div className="space-y-4">
                        <Label htmlFor="count-answer">How many {currentActivity.target} do you see?</Label>
                        <Input
                          id="count-answer"
                          type="number"
                          placeholder="Enter your count"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          className="text-center text-lg"
                        />
                        <Button onClick={submitActivity} className="w-full" disabled={!userAnswer}>
                          Submit Count
                        </Button>
                      </div>
                    )}

                    {currentActivity.type === 'identify' && (
                      <div className="space-y-4">
                        <Label>Select all that you can identify:</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {currentActivity.options.map((option) => (
                            <Button
                              key={option}
                              variant={selectedOptions.includes(option) ? "default" : "outline"}
                              onClick={() => toggleOption(option)}
                              className="justify-start"
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                        <Button 
                          onClick={submitActivity} 
                          className="w-full" 
                          disabled={selectedOptions.length === 0}
                        >
                          Submit Selection
                        </Button>
                      </div>
                    )}

                    {(currentActivity.type === 'observe' || currentActivity.type === 'sensory') && (
                      <div className="space-y-4 text-center">
                        <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <Clock className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                          <p className="text-blue-800 dark:text-blue-200 mb-2">
                            Take your time to observe mindfully
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Duration: {currentActivity.duration} seconds
                          </p>
                        </div>
                        
                        {observationComplete ? (
                          <Button onClick={submitActivity} className="w-full" size="lg">
                            Complete Observation
                          </Button>
                        ) : (
                          <div className="text-muted-foreground">
                            Continue observing... Time remaining: {Math.max(0, currentActivity.duration - Math.floor((Date.now() - activityStartTime) / 1000))}s
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Journal Section */}
            {gameState === 'journal' && (
              <motion.div
                key="journal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Mindfulness Reflection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                      <p className="text-green-800 dark:text-green-200 text-center">
                        🌸 Beautiful work! You've completed your mindful garden journey!
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{formatTime(timeElapsed)}</div>
                        <div className="text-sm text-muted-foreground">Time in Garden</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">{completedActivities.length}</div>
                        <div className="text-sm text-muted-foreground">Activities Completed</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(completedActivities.reduce((acc, activity) => acc + activity.score, 0) / completedActivities.length)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Mindfulness Score</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="journal" className="text-base font-medium">
                        Reflect on your mindful garden experience:
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        What did you notice during your time in the garden? How did it feel to slow down 
                        and pay attention to the present moment?
                      </p>
                      <Textarea
                        id="journal"
                        placeholder="Write about your mindfulness experience and what you discovered..."
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                        className="min-h-32"
                      />
                    </div>

                    <div className="flex justify-center">
                      <Button onClick={submitJournal} size="lg" className="px-8">
                        Complete Level 4
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Completion */}
            {gameState === 'completed' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-2xl mx-auto text-center"
              >
                <Card className="border-green-500/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                  <CardContent className="p-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <h2 className="text-3xl font-bold mb-4">Level 4 Complete!</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      You've cultivated mindful awareness in the garden. Your ability to be present 
                      and observe without judgment has grown stronger.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild size="lg">
                        <Link href="/games/level-5">
                          Continue to Level 5
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg">
                        <Link href="/games">
                          Back to Levels
                        </Link>
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