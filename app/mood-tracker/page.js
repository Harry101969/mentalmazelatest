'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Heart, Plus, BarChart3, Smile, Frown, Meh, Sun, Cloud, CloudRain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UserNavbar from '@/components/user-navbar';
import { toast } from 'sonner';

export default function MoodTrackerPage() {
  const [moodEntries, setMoodEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    mood: 5,
    notes: '',
    activities: [],
    emotions: []
  });

  const moodEmojis = {
    1: { emoji: '😢', label: 'Very Sad', color: 'text-red-600' },
    2: { emoji: '😔', label: 'Sad', color: 'text-red-500' },
    3: { emoji: '😐', label: 'Neutral', color: 'text-gray-500' },
    4: { emoji: '🙂', label: 'Good', color: 'text-yellow-500' },
    5: { emoji: '😊', label: 'Happy', color: 'text-green-500' },
    6: { emoji: '😄', label: 'Very Happy', color: 'text-green-600' },
    7: { emoji: '🤩', label: 'Excited', color: 'text-blue-500' },
    8: { emoji: '😍', label: 'Joyful', color: 'text-purple-500' },
    9: { emoji: '🥰', label: 'Blissful', color: 'text-pink-500' },
    10: { emoji: '🌟', label: 'Euphoric', color: 'text-yellow-400' }
  };

  const commonActivities = [
    'Exercise', 'Work', 'Social Time', 'Reading', 'Music', 'Meditation',
    'Cooking', 'Walking', 'Gaming', 'Learning', 'Art', 'Sleep'
  ];

  const commonEmotions = [
    'Grateful', 'Anxious', 'Excited', 'Stressed', 'Calm', 'Frustrated',
    'Hopeful', 'Lonely', 'Confident', 'Overwhelmed', 'Peaceful', 'Energetic'
  ];

  useEffect(() => {
    fetchMoodEntries();
  }, []);

  const fetchMoodEntries = async () => {
    try {
      const response = await fetch('/api/mood/entries', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setMoodEntries(data.entries || []);
      }
    } catch (error) {
      console.error('Error fetching mood entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitMoodEntry = async () => {
    try {
      const response = await fetch('/api/mood/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newEntry),
      });

      if (response.ok) {
        toast.success('Mood entry saved successfully!');
        setIsDialogOpen(false);
        setNewEntry({ mood: 5, notes: '', activities: [], emotions: [] });
        fetchMoodEntries();
      } else {
        toast.error('Failed to save mood entry');
      }
    } catch (error) {
      console.error('Error saving mood entry:', error);
      toast.error('Something went wrong');
    }
  };

  const toggleActivity = (activity) => {
    setNewEntry(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  const toggleEmotion = (emotion) => {
    setNewEntry(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / moodEntries.length).toFixed(1);
  };

  const getMoodTrend = () => {
    if (moodEntries.length < 2) return 'stable';
    const recent = moodEntries.slice(0, 3);
    const older = moodEntries.slice(3, 6);
    
    const recentAvg = recent.reduce((acc, entry) => acc + entry.mood, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((acc, entry) => acc + entry.mood, 0) / older.length : recentAvg;
    
    if (recentAvg > olderAvg + 0.5) return 'improving';
    if (recentAvg < olderAvg - 0.5) return 'declining';
    return 'stable';
  };

  const getTrendIcon = () => {
    const trend = getMoodTrend();
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <BarChart3 className="h-4 w-4 text-blue-600" />;
    }
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
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Mood Tracker</h1>
              <p className="text-muted-foreground">
                Track your daily emotions and discover patterns in your mental wellness journey
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>How are you feeling today?</DialogTitle>
                  <DialogDescription>
                    Take a moment to reflect on your current mood and emotions
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Mood Slider */}
                  <div className="space-y-4">
                    <Label>Mood Level</Label>
                    <div className="text-center">
                      <div className={`text-6xl mb-2 ${moodEmojis[newEntry.mood].color}`}>
                        {moodEmojis[newEntry.mood].emoji}
                      </div>
                      <p className="text-lg font-medium">{moodEmojis[newEntry.mood].label}</p>
                    </div>
                    <Slider
                      value={[newEntry.mood]}
                      onValueChange={(value) => setNewEntry(prev => ({ ...prev, mood: value[0] }))}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Very Sad</span>
                      <span>Neutral</span>
                      <span>Euphoric</span>
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="space-y-3">
                    <Label>What did you do today?</Label>
                    <div className="flex flex-wrap gap-2">
                      {commonActivities.map((activity) => (
                        <Badge
                          key={activity}
                          variant={newEntry.activities.includes(activity) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleActivity(activity)}
                        >
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Emotions */}
                  <div className="space-y-3">
                    <Label>How did you feel?</Label>
                    <div className="flex flex-wrap gap-2">
                      {commonEmotions.map((emotion) => (
                        <Badge
                          key={emotion}
                          variant={newEntry.emotions.includes(emotion) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleEmotion(emotion)}
                        >
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="What's on your mind? Any thoughts about your day..."
                      value={newEntry.notes}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                      className="min-h-20"
                    />
                  </div>

                  <Button onClick={submitMoodEntry} className="w-full">
                    Save Entry
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{getAverageMood()}</div>
                <div className="text-sm text-muted-foreground">Average Mood</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{moodEntries.length}</div>
                <div className="text-sm text-muted-foreground">Total Entries</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-2">
                  {getTrendIcon()}
                </div>
                <div className="text-2xl font-bold capitalize">{getMoodTrend()}</div>
                <div className="text-sm text-muted-foreground">Trend</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Entries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
                <CardDescription>
                  Your mood journey over the past few days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {moodEntries.length > 0 ? (
                  <div className="space-y-4">
                    {moodEntries.slice(0, 10).map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="text-center">
                          <div className={`text-2xl ${moodEmojis[entry.mood].color}`}>
                            {moodEmojis[entry.mood].emoji}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {entry.mood}/10
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{moodEmojis[entry.mood].label}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(entry.date).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {entry.notes && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {entry.notes}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-1">
                            {entry.activities?.map((activity, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {activity}
                              </Badge>
                            ))}
                            {entry.emotions?.map((emotion, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {emotion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No mood entries yet</p>
                    <Button onClick={() => setIsDialogOpen(true)}>
                      Add Your First Entry
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Insights */}
          {moodEntries.length > 0 && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Insights & Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getAverageMood() < 4 && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                          💙 We notice you've been feeling down lately
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                          It's okay to have difficult days. Consider trying some of these activities:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Breathing exercises</Badge>
                          <Badge variant="outline">Talk to a friend</Badge>
                          <Badge variant="outline">Go for a walk</Badge>
                          <Badge variant="outline">Practice gratitude</Badge>
                        </div>
                      </div>
                    )}
                    
                    {getMoodTrend() === 'improving' && (
                      <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                          🌟 Your mood is trending upward!
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Great job! Keep doing what you're doing. Your mental wellness journey is showing positive progress.
                        </p>
                      </div>
                    )}
                    
                    <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                        🎯 Personalized Recommendations
                      </h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                        Based on your mood patterns, we recommend:
                      </p>
                      <div className="space-y-2 text-sm">
                        <div>• Try Level 2 (Breathing Exercises) when feeling stressed</div>
                        <div>• Use the AI Buddy for emotional support</div>
                        <div>• Consider journaling during low mood days</div>
                        <div>• Celebrate your progress with self-care activities</div>
                      </div>
                    </div>
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