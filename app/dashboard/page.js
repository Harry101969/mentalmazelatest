'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TowerControl as GameController2, MessageCircle, Heart, Users, Music, BookOpen, Trophy, Clock, Target, TrendingUp, Star, Zap, Calendar, Phone } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserNavbar from '@/components/user-navbar';
import { useAuth } from '@/components/auth-provider';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentMoods, setRecentMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // const fetchDashboardData = async () => {
  //   try {
  //     const response = await fetch('/api/user/dashboard', {
  //       credentials: 'include',
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setStats(data.stats);
  //       setRecentMoods(data.recentMoods || []);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching dashboard data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const fetchDashboardData = async () => {
  try {
    const baseUrl = typeof window !== 'undefined' 
      ? '' 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/user/dashboard`, {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      setStats(data.stats);
      setRecentMoods(data.recentMoods || []);
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    setLoading(false);
  }
};
  const quickActions = [
    {
      title: 'Continue Game',
      description: 'Resume your mental wellness journey',
      icon: GameController2,
      href: '/games',
      gradient: 'from-blue-500 to-cyan-500',
      action: 'Level ' + (stats?.currentLevel || 1)
    },
    {
      title: 'AI Buddy Chat',
      description: 'Talk to your AI companion',
      icon: MessageCircle,
      href: '/ai-chat',
      gradient: 'from-purple-500 to-pink-500',
      action: 'Chat Now'
    },
    {
      title: 'Track Mood',
      description: 'Log your current emotional state',
      icon: Heart,
      href: '/mood-tracker',
      gradient: 'from-red-500 to-orange-500',
      action: 'Add Entry'
    },
    {
      title: 'Find Therapist',
      description: 'Connect with professionals',
      icon: Users,
      href: '/therapists',
      gradient: 'from-green-500 to-emerald-500',
      action: 'Browse'
    },
    {
      title: 'Relaxing Music',
      description: 'Curated playlists for wellness',
      icon: Music,
      href: '/music',
      gradient: 'from-indigo-500 to-blue-500',
      action: 'Listen'
    },
    {
      title: 'Journal',
      description: 'Reflect on your thoughts',
      icon: BookOpen,
      href: '/journal',
      gradient: 'from-amber-500 to-orange-500',
      action: 'Write'
    }
  ];

  const emergencyFeatures = [
    {
      title: 'Call a Friend',
      description: 'Instant access to your support network',
      icon: Phone,
      href: '/call-friend',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Crisis Support',
      description: 'Immediate help when you need it most',
      icon: Heart,
      href: '/crisis-support',
      color: 'bg-red-600 hover:bg-red-700'
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900/30">
      <UserNavbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-blue-100 dark:border-slate-700">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, {user?.nickname || user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300">
                  Let's continue your journey to better mental wellness
                </p>
              </div>
              <div className="hidden md:block">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-blue-500/20 text-blue-600 text-2xl">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-100 dark:border-slate-700">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats?.levelsCompleted || 0}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Levels Complete</div>
                </CardContent>
              </Card>
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-100 dark:border-slate-700">
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{Math.round((stats?.totalTimeSpent || 0) / 60)}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Hours Spent</div>
                </CardContent>
              </Card>
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-100 dark:border-slate-700">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats?.currentStreak || 0}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Day Streak</div>
                </CardContent>
              </Card>
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-100 dark:border-slate-700">
                <CardContent className="p-4 text-center">
                  <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{user?.tokens || 0}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Tokens Earned</div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Emergency Support */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-6">Emergency Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="border-2 border-red-200 dark:border-red-800 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <Button asChild className={`w-full ${feature.color} text-white text-lg py-6`}>
                        <Link href={feature.href} className="flex items-center justify-center">
                          <Icon className="mr-3 h-6 w-6" />
                          <div className="text-left">
                            <div className="font-bold">{feature.title}</div>
                            <div className="text-sm opacity-90">{feature.description}</div>
                          </div>
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-100 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Your Progress Journey
                </CardTitle>
                <CardDescription>
                  You're on level {stats?.currentLevel || 1} of 5. Keep going!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {stats?.levelsCompleted || 0}/5 levels
                    </span>
                  </div>
                  <Progress value={((stats?.levelsCompleted || 0) / 5) * 100} className="h-3" />
                  
                  {user?.subscription === 'free' && (stats?.levelsCompleted || 0) >= 3 && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Unlock Premium Levels</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Complete levels 4 & 5 with advanced therapeutic content
                          </p>
                        </div>
                        <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          <Link href="/subscription">Upgrade</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">What would you like to do?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-100 dark:border-slate-700">
                      <CardContent className="p-6">
                        <Link href={action.href} className="block">
                          <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${action.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-4">
                            {action.description}
                          </p>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            {action.action}
                          </Badge>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity & Mood */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Moods */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-100 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-5 w-5" />
                    Recent Mood Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentMoods.length > 0 ? (
                    <div className="space-y-4">
                      {recentMoods.slice(0, 3).map((mood, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-slate-700/50 rounded-lg">
                          <div>
                            <div className="flex items-center mb-1">
                              {[...Array(mood.mood)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                              ))}
                              <span className="ml-2 text-sm font-medium">{mood.mood}/10</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {mood.notes || 'No notes'}
                            </p>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-500">
                            {new Date(mood.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/mood-tracker">View All Entries</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400 mb-4">No mood entries yet</p>
                      <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        <Link href="/mood-tracker">Track Your Mood</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Today's Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-100 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Today's Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        Morning Mindfulness
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                        Start your day with a 5-minute breathing exercise
                      </p>
                      <Button asChild size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20">
                        <Link href="/meditation">Begin Session</Link>
                      </Button>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        Journal Reflection
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                        Reflect on yesterday's experiences and emotions
                      </p>
                      <Button asChild size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900/20">
                        <Link href="/journal">Start Writing</Link>
                      </Button>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                        Connect with Support
                      </h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                        Chat with your AI companion about your day
                      </p>
                      <Button asChild size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/20">
                        <Link href="/ai-chat">Start Chat</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}