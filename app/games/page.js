'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Lock, CheckCircle, Star, Clock, Trophy, Brain, Heart, Eye, Flower, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import UserNavbar from '@/components/user-navbar';
import { useAuth } from '@/components/auth-provider';
import { toast } from 'sonner';

export default function GamesPage() {
  const [gameProgress, setGameProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const gameLevels = [
    {
      id: 1,
      title: "The Foggy Entrance",
      description: "Navigate through anxiety with memory card matching. Match anxious thoughts to realistic reframed counterparts.",
      theme: "Anxiety Management",
      difficulty: "Beginner",
      estimatedTime: "10-15 minutes",
      icon: Brain,
      gradient: "from-blue-500 to-cyan-500",
      isPremium: false,
      mechanics: "Memory card matching game with progressive fog clearing",
      benefits: ["Cognitive reframing", "Anxiety reduction", "Mindful awareness"]
    },
    {
      id: 2,
      title: "The Ticking Hallways",
      description: "Master breathing techniques with an animated orb. Follow inhale/exhale patterns to unlock doors.",
      theme: "Breathing & Relaxation",
      difficulty: "Beginner",
      estimatedTime: "5-10 minutes",
      icon: Heart,
      gradient: "from-green-500 to-emerald-500",
      isPremium: false,
      mechanics: "Breathing rhythm game with visual feedback",
      benefits: ["Stress reduction", "Breathing control", "Emotional regulation"]
    },
    {
      id: 3,
      title: "Distorted Mirrors",
      description: "Rearrange mirror pieces to correct cognitive distortions. Transform negative thoughts into balanced perspectives.",
      theme: "Cognitive Restructuring",
      difficulty: "Intermediate",
      estimatedTime: "15-20 minutes",
      icon: Eye,
      gradient: "from-purple-500 to-pink-500",
      isPremium: false,
      mechanics: "Puzzle game with drag-and-drop mirror pieces",
      benefits: ["Cognitive flexibility", "Self-awareness", "Positive thinking"]
    },
    {
      id: 4,
      title: "Mindful Garden",
      description: "Engage in observation challenges in a serene garden. Count petals, identify colors, and follow visual cues.",
      theme: "Mindfulness & Awareness",
      difficulty: "Intermediate",
      estimatedTime: "20-25 minutes",
      icon: Flower,
      gradient: "from-amber-500 to-orange-500",
      isPremium: false,
      mechanics: "Observation and attention-based challenges",
      benefits: ["Mindful awareness", "Present moment focus", "Attention training"]
    },
    {
      id: 5,
      title: "The Safe Haven",
      description: "Create your personal self-care sanctuary. Arrange self-care tokens and build your wellness toolkit.",
      theme: "Self-Care & Wellness",
      difficulty: "Advanced",
      estimatedTime: "25-30 minutes",
      icon: Home,
      gradient: "from-indigo-500 to-blue-500",
      isPremium: false,
      mechanics: "Drag-and-drop self-care planning interface",
      benefits: ["Self-care planning", "Personal growth", "Wellness habits"]
    }
  ];

  useEffect(() => {
    fetchGameProgress();
  }, []);

  const fetchGameProgress = async () => {
    try {
      const response = await fetch('/api/games/progress', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setGameProgress(data.progress);
      }
    } catch (error) {
      console.error('Error fetching game progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const canPlayLevel = (level) => {
    if (!gameProgress) return level.id === 1;
    
    // Premium levels require subscription
    if (level.isPremium && user?.subscription !== 'premium') {
      return false;
    }
    
    // Must complete previous levels
    return level.id <= (gameProgress.currentLevel || 1);
  };

  const getLevelStatus = (level) => {
    if (!gameProgress) return level.id === 1 ? 'available' : null;
    
    if (gameProgress.levelsCompleted.includes(level.id)) {
      return 'completed';
    } else if (canPlayLevel(level)) {
      return 'available';
    } else {
      return 'locked';
    }
  };

  const getLevelScore = (levelId) => {
    if (!gameProgress?.levelScores) return null;
    return gameProgress.levelScores.find(score => score.level === levelId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <UserNavbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Mental Wellness Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Navigate through 5 therapeutic levels designed to build resilience, manage anxiety, and promote mental wellness through interactive experiences.
            </p>
            
            {/* Progress Overview */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {gameProgress?.levelsCompleted?.length || 0}/5 levels completed
                </span>
              </div>
              <Progress 
                value={((gameProgress?.levelsCompleted?.length || 0) / 5) * 100} 
                className="h-3 mb-6" 
              />
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{gameProgress?.levelsCompleted?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{Math.round((gameProgress?.totalTimeSpent || 0) / 60)}</div>
                  <div className="text-sm text-muted-foreground">Minutes Played</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{user?.tokens || 0}</div>
                  <div className="text-sm text-muted-foreground">Tokens Earned</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Game Levels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {gameLevels.map((level, index) => {
              const Icon = level.icon;
              const status = getLevelStatus(level);
              const score = getLevelScore(level.id);
              
              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className={`group hover:shadow-xl transition-all duration-300 ${
                    status === 'locked' ? 'opacity-60' : 'hover:scale-105'
                  } ${status === 'completed' ? 'border-green-500/50' : ''}`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${level.gradient} mb-4`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {level.isPremium && (
                            <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                              Premium
                            </Badge>
                          )}
                          {status === 'completed' && (
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                          {status === 'locked' && (
                            <Badge variant="outline">
                              <Lock className="w-3 h-3 mr-1" />
                              Locked
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <CardTitle className="text-xl mb-2">{level.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {level.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Level Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Trophy className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{level.theme}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{level.estimatedTime}</span>
                        </div>
                      </div>

                      {/* Score Display */}
                      {score && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <span>Best Score:</span>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 mr-1" />
                              <span className="font-medium">{score.score}%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm mt-1">
                            <span>Time:</span>
                            <span>{Math.round(score.timeSpent / 60)} minutes</span>
                          </div>
                        </div>
                      )}

                      {/* Benefits */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Benefits:</h4>
                        <div className="flex flex-wrap gap-1">
                          {level.benefits.map((benefit, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        {status === 'locked' ? (
                          level.isPremium && user?.subscription !== 'premium' ? (
                            <Button asChild className="w-full">
                              <Link href="/subscription">
                                <Lock className="w-4 h-4 mr-2" />
                                Upgrade to Premium
                              </Link>
                            </Button>
                          ) : (
                            <Button disabled className="w-full">
                              <Lock className="w-4 h-4 mr-2" />
                              Complete Previous Level
                            </Button>
                          )
                        ) : (
                          <Button asChild className="w-full group-hover:shadow-lg transition-shadow">
                            <Link href={`/games/level-${level.id}`}>
                              <Play className="w-4 h-4 mr-2" />
                              {status === 'completed' ? 'Play Again' : 'Start Level'}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Upgrade Prompt for Free Users */}
          {user?.subscription === 'free' && (
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="p-8 text-center">
                  <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Unlock Your Full Potential</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Access advanced levels 4 & 5 with premium therapeutic content, personalized insights, 
                    and exclusive wellness tools designed by mental health professionals.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                      <Link href="/subscription">
                        Upgrade to Premium
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/referrals">
                        Earn Free Tokens
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}