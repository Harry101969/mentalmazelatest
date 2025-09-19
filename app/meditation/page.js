'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Headphones, Heart, Brain, Flower, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import UserNavbar from '@/components/user-navbar';
import { toast } from 'sonner';

export default function MeditationPage() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const meditationSessions = [
    {
      id: 1,
      title: "Morning Mindfulness",
      description: "Start your day with clarity and intention through gentle breathing and body awareness.",
      duration: "10 minutes",
      category: "Mindfulness",
      difficulty: "Beginner",
      benefits: ["Mental clarity", "Positive start", "Energy boost"],
      icon: Sun,
      color: "from-yellow-400 to-orange-400",
      audioUrl: "/audio/morning-mindfulness.mp3", // Placeholder - would be real audio files
      script: [
        "Welcome to your morning mindfulness practice. Find a comfortable seated position.",
        "Close your eyes gently and take three deep breaths, letting go of any tension.",
        "Notice how your body feels right now, without trying to change anything.",
        "Bring your attention to your breath, feeling the natural rhythm of inhaling and exhaling.",
        "If your mind wanders, that's perfectly normal. Gently return your focus to your breath.",
        "Set an intention for your day - how do you want to show up in the world?",
        "Take a moment to appreciate this time you've given yourself.",
        "When you're ready, slowly open your eyes and carry this mindfulness into your day."
      ]
    },
    {
      id: 2,
      title: "Anxiety Relief",
      description: "Calm your nervous system with guided breathing and progressive muscle relaxation.",
      duration: "15 minutes",
      category: "Stress Relief",
      difficulty: "Beginner",
      benefits: ["Reduced anxiety", "Muscle relaxation", "Emotional calm"],
      icon: Heart,
      color: "from-blue-400 to-cyan-400",
      audioUrl: "/audio/anxiety-relief.mp3",
      script: [
        "This practice is designed to help you find calm in moments of anxiety.",
        "Sit or lie down comfortably, allowing your body to be fully supported.",
        "Begin with slow, deep breathing - in for 4 counts, hold for 4, out for 6.",
        "Notice any areas of tension in your body, starting from your toes.",
        "Tense and then release each muscle group, moving up through your body.",
        "With each exhale, imagine releasing worry and tension.",
        "Place one hand on your chest, one on your belly, and feel your breath.",
        "Remember: this feeling will pass. You are safe in this moment.",
        "Continue breathing slowly until you feel a sense of calm returning."
      ]
    },
    {
      id: 3,
      title: "Focus & Concentration",
      description: "Enhance your mental clarity and concentration through single-pointed attention.",
      duration: "12 minutes",
      category: "Focus",
      difficulty: "Intermediate",
      benefits: ["Improved focus", "Mental clarity", "Productivity"],
      icon: Brain,
      color: "from-purple-400 to-pink-400",
      audioUrl: "/audio/focus-concentration.mp3",
      script: [
        "This meditation will help sharpen your focus and concentration.",
        "Sit upright with your spine straight but not rigid.",
        "Choose a single point of focus - your breath, a word, or a visualization.",
        "When your mind wanders, notice it without judgment and return to your focus point.",
        "Imagine your attention like a muscle that gets stronger with practice.",
        "If you notice mental chatter, acknowledge it and let it pass like clouds.",
        "With each return to focus, you're building your concentration skills.",
        "Feel the clarity that comes from a focused, present mind."
      ]
    },
    {
      id: 4,
      title: "Sleep Preparation",
      description: "Wind down with gentle body scanning and breathing to prepare for restful sleep.",
      duration: "20 minutes",
      category: "Sleep",
      difficulty: "Beginner",
      benefits: ["Better sleep", "Relaxation", "Stress release"],
      icon: Flower,
      color: "from-indigo-400 to-purple-400",
      audioUrl: "/audio/sleep-preparation.mp3",
      script: [
        "This practice will help prepare your body and mind for restful sleep.",
        "Lie down comfortably in your bed, allowing your body to sink into the mattress.",
        "Take several slow, deep breaths, letting go of the day's activities.",
        "Starting with your toes, consciously relax each part of your body.",
        "Release any tension you're holding in your shoulders, jaw, and face.",
        "Let your breathing become slower and more natural.",
        "If thoughts about tomorrow arise, acknowledge them and let them go.",
        "Imagine yourself surrounded by peace and safety.",
        "Allow yourself to drift into natural, restorative sleep."
      ]
    },
    {
      id: 5,
      title: "Loving Kindness",
      description: "Cultivate compassion for yourself and others through heart-centered meditation.",
      duration: "18 minutes",
      category: "Compassion",
      difficulty: "Intermediate",
      benefits: ["Self-compassion", "Emotional healing", "Connection"],
      icon: Heart,
      color: "from-pink-400 to-rose-400",
      audioUrl: "/audio/loving-kindness.mp3",
      script: [
        "This practice will help you cultivate loving kindness for yourself and others.",
        "Sit comfortably and place your hand on your heart.",
        "Begin by sending loving kindness to yourself: 'May I be happy, may I be healthy.'",
        "Feel the warmth of compassion in your heart center.",
        "Now bring to mind someone you love and send them the same wishes.",
        "Extend these feelings to a neutral person - someone you neither love nor dislike.",
        "Challenge yourself to send loving kindness to someone difficult in your life.",
        "Finally, extend these wishes to all beings everywhere.",
        "Rest in the feeling of universal love and connection."
      ]
    }
  ];

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startSession = (session) => {
    setSelectedSession(session);
    setCurrentTime(0);
    setDuration(getDurationInSeconds(session.duration));
    setIsPlaying(true);
    
    // Start timer
    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= getDurationInSeconds(session.duration)) {
          completeSession();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    toast.success(`Starting ${session.title} meditation`);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            completeSession();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const resetSession = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const completeSession = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    toast.success('Meditation session completed! Well done on taking time for yourself.');
    
    // Log completion (could save to database)
    logMeditationSession();
  };

  const logMeditationSession = async () => {
    try {
      await fetch('/api/meditation/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          sessionId: selectedSession.id,
          sessionTitle: selectedSession.title,
          duration: currentTime,
          completedAt: new Date()
        }),
      });
    } catch (error) {
      console.error('Error logging meditation session:', error);
    }
  };

  const getDurationInSeconds = (durationStr) => {
    const minutes = parseInt(durationStr.split(' ')[0]);
    return minutes * 60;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentScript = () => {
    if (!selectedSession) return '';
    
    const progress = currentTime / duration;
    const scriptIndex = Math.floor(progress * selectedSession.script.length);
    return selectedSession.script[Math.min(scriptIndex, selectedSession.script.length - 1)];
  };

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full">
                <Headphones className="h-12 w-12 text-purple-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Guided Meditation</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find peace and clarity through guided meditation sessions designed to reduce stress, 
              improve focus, and promote overall mental wellness.
            </p>
          </motion.div>

          {!selectedSession ? (
            /* Session Selection */
            <motion.div
              className="grid gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {meditationSessions.map((session, index) => {
                const Icon = session.icon;
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                          <div className={`p-4 rounded-2xl bg-gradient-to-r ${session.color} flex-shrink-0`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold mb-2">{session.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                  {session.description}
                                </p>
                              </div>
                              <Badge variant="outline" className="ml-4">
                                {session.duration}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-4">
                              <Badge variant="secondary">{session.category}</Badge>
                              <Badge variant="outline">{session.difficulty}</Badge>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {session.duration}
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2">Benefits:</h4>
                              <div className="flex flex-wrap gap-2">
                                {session.benefits.map((benefit, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <Button 
                              onClick={() => startSession(session)}
                              className="group-hover:shadow-lg transition-shadow"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Start Session
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Active Session */
            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-2xl">
                <CardHeader className="text-center pb-6">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${selectedSession.color} mb-4`}>
                    <selectedSession.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{selectedSession.title}</CardTitle>
                  <CardDescription className="text-base">
                    {selectedSession.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-8">
                  {/* Progress */}
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Current Script */}
                  <div className="text-center p-6 bg-muted/50 rounded-lg min-h-24 flex items-center justify-center">
                    <p className="text-lg leading-relaxed italic">
                      {getCurrentScript()}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={resetSession}
                      variant="outline"
                      size="icon"
                      className="h-12 w-12"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      onClick={togglePlayPause}
                      size="lg"
                      className="h-16 w-16 rounded-full"
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6 ml-1" />
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => setIsMuted(!isMuted)}
                      variant="outline"
                      size="icon"
                      className="h-12 w-12"
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </Button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-4">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={[volume]}
                      onValueChange={(value) => setVolume(value[0])}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-8">{volume}%</span>
                  </div>

                  {/* Back Button */}
                  <div className="text-center">
                    <Button
                      onClick={() => {
                        setSelectedSession(null);
                        resetSession();
                      }}
                      variant="outline"
                    >
                      Choose Different Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Benefits */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-4">
                  🧘‍♀️ Benefits of Regular Meditation
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div className="space-y-2">
                    <h4 className="font-medium">Mental Health</h4>
                    <p>• Reduces anxiety and depression</p>
                    <p>• Improves emotional regulation</p>
                    <p>• Increases self-awareness</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Cognitive Benefits</h4>
                    <p>• Enhances focus and concentration</p>
                    <p>• Improves memory and learning</p>
                    <p>• Boosts creativity and problem-solving</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Physical Health</h4>
                    <p>• Lowers blood pressure</p>
                    <p>• Improves sleep quality</p>
                    <p>• Strengthens immune system</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}