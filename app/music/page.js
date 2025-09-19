'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Heart, Headphones, Radio, Disc } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import UserNavbar from '@/components/user-navbar';

export default function MusicPage() {
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(70);

  const therapeuticPlaylists = [
    {
      id: 1,
      title: "Anxiety Relief",
      description: "Calming melodies to ease anxious thoughts",
      mood: "Calming",
      duration: "45 minutes",
      trackCount: 12,
      color: "from-blue-400 to-cyan-400",
      icon: Heart,
      tracks: [
        "Peaceful Waters - Nature Sounds",
        "Gentle Breeze - Ambient",
        "Calm Mind - Meditation Music",
        "Soft Rain - Nature Sounds",
        "Healing Light - Instrumental"
      ]
    },
    {
      id: 2,
      title: "Focus & Concentration",
      description: "Instrumental music to enhance mental clarity",
      mood: "Focused",
      duration: "60 minutes",
      trackCount: 15,
      color: "from-purple-400 to-pink-400",
      icon: Headphones,
      tracks: [
        "Deep Focus - Lo-fi Beats",
        "Study Session - Ambient",
        "Clear Mind - Instrumental",
        "Concentration Flow - Classical",
        "Mental Clarity - Binaural"
      ]
    },
    {
      id: 3,
      title: "Mood Boost",
      description: "Uplifting tunes to brighten your day",
      mood: "Uplifting",
      duration: "35 minutes",
      trackCount: 10,
      color: "from-yellow-400 to-orange-400",
      icon: Radio,
      tracks: [
        "Sunshine Day - Upbeat",
        "Happy Thoughts - Positive",
        "Energy Flow - Motivational",
        "Bright Future - Inspiring",
        "Joy Rising - Uplifting"
      ]
    },
    {
      id: 4,
      title: "Sleep & Relaxation",
      description: "Soothing sounds for rest and recovery",
      mood: "Sleepy",
      duration: "90 minutes",
      trackCount: 18,
      color: "from-indigo-400 to-purple-400",
      icon: Disc,
      tracks: [
        "Moonlight Lullaby - Soft Piano",
        "Ocean Waves - Nature Sounds",
        "Starry Night - Ambient",
        "Peaceful Dreams - Meditation",
        "Deep Rest - Sleep Music"
      ]
    },
    {
      id: 5,
      title: "Mindfulness & Meditation",
      description: "Ambient soundscapes for mindful practice",
      mood: "Mindful",
      duration: "50 minutes",
      trackCount: 8,
      color: "from-green-400 to-emerald-400",
      icon: Music,
      tracks: [
        "Present Moment - Meditation",
        "Mindful Breathing - Guided",
        "Inner Peace - Tibetan Bowls",
        "Awareness - Nature Sounds",
        "Centered Being - Ambient"
      ]
    },
    {
      id: 6,
      title: "Emotional Release",
      description: "Music for processing and releasing emotions",
      mood: "Cathartic",
      duration: "40 minutes",
      trackCount: 11,
      color: "from-red-400 to-pink-400",
      icon: Heart,
      tracks: [
        "Let It Go - Emotional",
        "Healing Tears - Gentle",
        "Release & Renew - Therapeutic",
        "Emotional Flow - Expressive",
        "Heart Opening - Healing"
      ]
    }
  ];

  const playPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentTrack(0);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (currentPlaylist) {
      setCurrentTrack((prev) => 
        prev < currentPlaylist.tracks.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevTrack = () => {
    if (currentPlaylist) {
      setCurrentTrack((prev) => 
        prev > 0 ? prev - 1 : currentPlaylist.tracks.length - 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full">
                <Music className="h-12 w-12 text-purple-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Therapeutic Music</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Curated playlists designed to support your mental wellness journey. 
              Music therapy can reduce stress, improve mood, and enhance emotional regulation.
            </p>
          </motion.div>

          {/* Current Player */}
          {currentPlaylist && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-lg bg-gradient-to-r ${currentPlaylist.color} flex items-center justify-center`}>
                      <currentPlaylist.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{currentPlaylist.title}</h3>
                      <p className="text-muted-foreground mb-2">
                        Now Playing: {currentPlaylist.tracks[currentTrack]}
                      </p>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{currentPlaylist.mood}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Track {currentTrack + 1} of {currentPlaylist.tracks.length}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button onClick={prevTrack} variant="outline" size="icon">
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button onClick={togglePlayPause} size="icon" className="w-12 h-12">
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                      </Button>
                      <Button onClick={nextTrack} variant="outline" size="icon">
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <Slider
                      value={[volume]}
                      onValueChange={(value) => setVolume(value[0])}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-8">{volume}%</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Playlists Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {therapeuticPlaylists.map((playlist, index) => {
              const Icon = playlist.icon;
              return (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className={`w-full h-32 rounded-lg bg-gradient-to-r ${playlist.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                        <Icon className="w-12 h-12 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">{playlist.title}</h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {playlist.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">{playlist.mood}</Badge>
                        <div className="text-sm text-muted-foreground">
                          {playlist.trackCount} tracks • {playlist.duration}
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => playPlaylist(playlist)}
                        className="w-full group-hover:shadow-lg transition-shadow"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play Playlist
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Music Therapy Benefits */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-4">
                  🎵 Benefits of Music Therapy
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-purple-700 dark:text-purple-300">
                  <div className="space-y-2">
                    <h4 className="font-medium">Emotional Benefits</h4>
                    <p>• Reduces anxiety and depression</p>
                    <p>• Improves mood regulation</p>
                    <p>• Enhances emotional expression</p>
                    <p>• Provides comfort and support</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Cognitive Benefits</h4>
                    <p>• Improves focus and attention</p>
                    <p>• Enhances memory function</p>
                    <p>• Stimulates creativity</p>
                    <p>• Supports learning processes</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Physical Benefits</h4>
                    <p>• Lowers blood pressure</p>
                    <p>• Reduces stress hormones</p>
                    <p>• Improves sleep quality</p>
                    <p>• Boosts immune function</p>
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