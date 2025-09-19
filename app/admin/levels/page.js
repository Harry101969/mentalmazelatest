'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TowerControl as GameController2,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Play,
  Copy,
  MoreVertical,
  Clock,
  Users,
  Star,
  Crown,
  Settings,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import AdminNavbar from '@/components/admin-navbar';

export default function AdminLevelsPage() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [newLevelData, setNewLevelData] = useState({
    levelNumber: '',
    title: '',
    description: '',
    gameType: '',
    isPremium: false,
    instructions: '',
    completionMessage: '',
    journalPrompts: '',
    gameConfig: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  const gameTypes = [
    { value: 'memory', label: 'Memory Game', description: 'Card matching with cognitive reframing' },
    { value: 'breathing', label: 'Breathing Exercise', description: 'Guided breathing with visual feedback' },
    { value: 'puzzle', label: 'Puzzle Game', description: 'Drag & drop cognitive restructuring' },
    { value: 'mindfulness', label: 'Mindfulness', description: 'Observation and awareness challenges' },
    { value: 'selfcare', label: 'Self-Care', description: 'Personal wellness planning' },
    { value: 'custom', label: 'Custom Game', description: 'Custom mechanics and interactions' }
  ];

  const gameTemplates = {
    memory: {
      instructions: 'Match anxious thoughts with their reframed counterparts. Click cards to flip them and find pairs.',
      completionMessage: 'Excellent work! You\'ve successfully practiced cognitive reframing.',
      journalPrompts: 'What anxious thoughts have you been having lately? How might you reframe them?',
      gameConfig: JSON.stringify({
        cardPairs: [
          {
            anxious: "I'm going to fail this presentation",
            reframed: "I'm prepared and will do my best"
          },
          {
            anxious: "Everyone will judge me",
            reframed: "Most people are focused on themselves"
          }
        ],
        timeLimit: 300,
        maxMoves: 20,
        fogEffect: true
      }, null, 2)
    },
    breathing: {
      instructions: 'Follow the breathing orb to practice the 4-4-4-4 technique. Inhale, hold, exhale, and pause.',
      completionMessage: 'Well done! You\'ve completed your mindful breathing practice.',
      journalPrompts: 'How do you feel after this breathing exercise? What changes do you notice in your body?',
      gameConfig: JSON.stringify({
        pattern: {
          inhale: 4000,
          hold: 4000,
          exhale: 4000,
          pause: 4000
        },
        duration: 60,
        minCycles: 3
      }, null, 2)
    },
    puzzle: {
      instructions: 'Drag mirror pieces to correct cognitive distortions. Separate facts from distorted thoughts.',
      completionMessage: 'Fantastic! You\'ve mastered cognitive restructuring.',
      journalPrompts: 'Can you identify any cognitive distortions in your own thinking? How might you reframe them?',
      gameConfig: JSON.stringify({
        distortions: [
          {
            distorted: "I failed one test, so I am a complete failure",
            reframed: "One test doesn't define my abilities or worth",
            type: "All-or-Nothing Thinking"
          }
        ],
        timeLimit: 600
      }, null, 2)
    },
    mindfulness: {
      instructions: 'Observe the garden carefully and complete mindfulness challenges. Count, identify, and notice details.',
      completionMessage: 'Beautiful! You\'ve cultivated mindful awareness.',
      journalPrompts: 'What did you notice during the mindfulness exercises? How can you bring this awareness to daily life?',
      gameConfig: JSON.stringify({
        challenges: [
          { type: 'count', target: 'flowers', count: 12 },
          { type: 'identify', target: 'colors', options: ['red', 'blue', 'yellow'] },
          { type: 'observe', target: 'movement', duration: 30 }
        ],
        timeLimit: 900
      }, null, 2)
    },
    selfcare: {
      instructions: 'Arrange self-care tokens to create your personal wellness toolkit. Drag items to organize your safe haven.',
      completionMessage: 'Perfect! You\'ve created your personal self-care sanctuary.',
      journalPrompts: 'What self-care activities resonate most with you? How will you incorporate them into your routine?',
      gameConfig: JSON.stringify({
        categories: {
          physical: ['Exercise', 'Sleep', 'Nutrition', 'Relaxation'],
          emotional: ['Journaling', 'Meditation', 'Gratitude', 'Affirmations'],
          social: ['Friends', 'Family', 'Support Groups', 'Therapy'],
          creative: ['Art', 'Music', 'Writing', 'Crafts']
        },
        minTokensPerCategory: 2
      }, null, 2)
    },
    custom: {
      instructions: 'Custom game instructions go here.',
      completionMessage: 'Congratulations on completing this custom level!',
      journalPrompts: 'Reflect on your experience with this activity.',
      gameConfig: JSON.stringify({
        customMechanics: {},
        settings: {},
        content: {}
      }, null, 2)
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await fetch('/api/admin/levels', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setLevels(data.levels || []);
      } else {
        toast.error('Failed to fetch game levels');
      }
    } catch (error) {
      console.error('Error fetching levels:', error);
      toast.error('Error loading game levels');
    } finally {
      setLoading(false);
    }
  };

  const saveLevel = async (e) => {
    e.preventDefault();

    if (!newLevelData.levelNumber || !newLevelData.title || !newLevelData.description || !newLevelData.gameType) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate JSON config
    try {
      if (newLevelData.gameConfig) {
        JSON.parse(newLevelData.gameConfig);
      }
    } catch (error) {
      toast.error('Invalid JSON in game configuration');
      return;
    }

    setIsCreating(true);

    try {
      const url = editingLevel ? `/api/admin/levels/${editingLevel._id}` : '/api/admin/levels';
      const method = editingLevel ? 'PUT' : 'POST';

      const levelData = {
        ...newLevelData,
        levelNumber: parseInt(newLevelData.levelNumber),
        journalPrompts: newLevelData.journalPrompts.split('\n').filter(p => p.trim()),
        gameConfig: newLevelData.gameConfig ? JSON.parse(newLevelData.gameConfig) : {}
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(levelData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editingLevel ? 'Game level updated successfully!' : 'Game level created successfully!');
        setIsDialogOpen(false);
        setEditingLevel(null);
        resetForm();
        fetchLevels();
      } else {
        toast.error(data.message || 'Failed to save game level');
      }
    } catch (error) {
      console.error('Error saving level:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setNewLevelData({
      levelNumber: '',
      title: '',
      description: '',
      gameType: '',
      isPremium: false,
      instructions: '',
      completionMessage: '',
      journalPrompts: '',
      gameConfig: ''
    });
  };

  const editLevel = (level) => {
    setEditingLevel(level);
    setNewLevelData({
      levelNumber: level.levelNumber.toString(),
      title: level.title,
      description: level.description,
      gameType: level.gameType,
      isPremium: level.isPremium,
      instructions: level.content?.instructions || '',
      completionMessage: level.content?.completionMessage || '',
      journalPrompts: level.content?.journalPrompts?.join('\n') || '',
      gameConfig: JSON.stringify(level.content?.gameConfig || {}, null, 2)
    });
    setIsDialogOpen(true);
  };

  const duplicateLevel = (level) => {
    setEditingLevel(null);
    setNewLevelData({
      levelNumber: (Math.max(...levels.map(l => l.levelNumber)) + 1).toString(),
      title: `${level.title} (Copy)`,
      description: level.description,
      gameType: level.gameType,
      isPremium: level.isPremium,
      instructions: level.content?.instructions || '',
      completionMessage: level.content?.completionMessage || '',
      journalPrompts: level.content?.journalPrompts?.join('\n') || '',
      gameConfig: JSON.stringify(level.content?.gameConfig || {}, null, 2)
    });
    setIsDialogOpen(true);
  };

  const useTemplate = (gameType) => {
    const template = gameTemplates[gameType];
    if (template) {
      setNewLevelData(prev => ({
        ...prev,
        instructions: template.instructions,
        completionMessage: template.completionMessage,
        journalPrompts: template.journalPrompts,
        gameConfig: template.gameConfig
      }));
    }
  };

  const toggleLevelStatus = async (levelId, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/levels/${levelId}/toggle-status`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success(`Level ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        fetchLevels();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update level status');
      }
    } catch (error) {
      console.error('Error toggling level status:', error);
      toast.error('Something went wrong');
    }
  };

  const deleteLevel = async (levelId, levelTitle) => {
    if (!confirm(`Are you sure you want to delete "${levelTitle}"? This action cannot be undone.`)) return;

    try {
      const response = await fetch(`/api/admin/levels/${levelId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Game level deleted successfully');
        fetchLevels();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete level');
      }
    } catch (error) {
      console.error('Error deleting level:', error);
      toast.error('Something went wrong');
    }
  };

  const filteredLevels = levels.filter(level =>
    level.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    level.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    level.gameType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

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
              <h1 className="text-3xl font-bold mb-2">Game Level Management</h1>
              <p className="text-muted-foreground">
                Create and manage therapeutic game levels for mental wellness.
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create New Level
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingLevel ? 'Edit Game Level' : 'Create New Game Level'}
                  </DialogTitle>
                  <DialogDescription>
                    Design a therapeutic game level with custom mechanics and content.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="config">Game Config</TabsTrigger>
                  </TabsList>
                  
                  <form onSubmit={saveLevel}>
                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="levelNumber">Level Number *</Label>
                          <Input
                            id="levelNumber"
                            type="number"
                            placeholder="1"
                            value={newLevelData.levelNumber}
                            onChange={(e) => setNewLevelData(prev => ({ ...prev, levelNumber: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gameType">Game Type *</Label>
                          <Select
                            value={newLevelData.gameType}
                            onValueChange={(value) => {
                              setNewLevelData(prev => ({ ...prev, gameType: value }));
                              useTemplate(value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select game type" />
                            </SelectTrigger>
                            <SelectContent>
                              {gameTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div>
                                    <div className="font-medium">{type.label}</div>
                                    <div className="text-xs text-muted-foreground">{type.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Level Title *</Label>
                        <Input
                          id="title"
                          placeholder="The Foggy Entrance"
                          value={newLevelData.title}
                          onChange={(e) => setNewLevelData(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Navigate through anxiety with memory card matching..."
                          value={newLevelData.description}
                          onChange={(e) => setNewLevelData(prev => ({ ...prev, description: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isPremium"
                          checked={newLevelData.isPremium}
                          onCheckedChange={(checked) => setNewLevelData(prev => ({ ...prev, isPremium: checked }))}
                        />
                        <Label htmlFor="isPremium">Premium Level</Label>
                        <Crown className="w-4 h-4 text-amber-500" />
                      </div>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="instructions">Game Instructions</Label>
                        <Textarea
                          id="instructions"
                          placeholder="How to play this level..."
                          value={newLevelData.instructions}
                          onChange={(e) => setNewLevelData(prev => ({ ...prev, instructions: e.target.value }))}
                          className="min-h-24"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="completionMessage">Completion Message</Label>
                        <Textarea
                          id="completionMessage"
                          placeholder="Congratulations message..."
                          value={newLevelData.completionMessage}
                          onChange={(e) => setNewLevelData(prev => ({ ...prev, completionMessage: e.target.value }))}
                          className="min-h-20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="journalPrompts">Journal Prompts (one per line)</Label>
                        <Textarea
                          id="journalPrompts"
                          placeholder="What anxious thoughts have you been having?&#10;How might you reframe them?"
                          value={newLevelData.journalPrompts}
                          onChange={(e) => setNewLevelData(prev => ({ ...prev, journalPrompts: e.target.value }))}
                          className="min-h-24"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="config" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="gameConfig">Game Configuration (JSON)</Label>
                        <Textarea
                          id="gameConfig"
                          placeholder="Game-specific configuration in JSON format..."
                          value={newLevelData.gameConfig}
                          onChange={(e) => setNewLevelData(prev => ({ ...prev, gameConfig: e.target.value }))}
                          className="min-h-48 font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          Define game mechanics, content, and settings in JSON format
                        </p>
                      </div>

                      {newLevelData.gameType && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <h4 className="font-medium mb-2">Template Applied for {gameTypes.find(t => t.value === newLevelData.gameType)?.label}</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            The configuration above has been pre-filled with a template for this game type. 
                            You can customize it as needed.
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <DialogFooter className="mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setEditingLevel(null);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isCreating}>
                        {isCreating ? 'Saving...' : editingLevel ? 'Update Level' : 'Create Level'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Tabs>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <GameController2 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{levels.length}</div>
                <div className="text-sm text-muted-foreground">Total Levels</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{levels.filter(l => l.isActive).length}</div>
                <div className="text-sm text-muted-foreground">Active Levels</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Crown className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{levels.filter(l => l.isPremium).length}</div>
                <div className="text-sm text-muted-foreground">Premium Levels</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{levels.filter(l => !l.isPremium).length}</div>
                <div className="text-sm text-muted-foreground">Free Levels</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search game levels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Levels List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid gap-6">
              {filteredLevels.length > 0 ? (
                filteredLevels.map((level) => (
                  <Card key={level._id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                              <span className="text-xl font-bold text-blue-600">{level.levelNumber}</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold mb-1">{level.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="capitalize">
                                  {level.gameType}
                                </Badge>
                                {level.isPremium && (
                                  <Badge className="bg-amber-500 text-white">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Premium
                                  </Badge>
                                )}
                                <Badge variant={level.isActive ? 'default' : 'secondary'}>
                                  {level.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {level.description}
                          </p>

                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Created:</span> {new Date(level.createdAt).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Created by:</span> {level.createdBy?.name || 'System'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {level.isActive ? (
                            <Eye className="w-5 h-5 text-green-600" />
                          ) : (
                            <EyeOff className="w-5 h-5 text-red-600" />
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => editLevel(level)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Level
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => duplicateLevel(level)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleLevelStatus(level._id, level.isActive)}
                              >
                                {level.isActive ? (
                                  <>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteLevel(level._id, level.title)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <GameController2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {searchTerm ? 'No levels match your search' : 'No game levels created yet'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchTerm 
                        ? 'Try adjusting your search criteria.'
                        : 'Create your first therapeutic game level to get started.'
                      }
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)} size="lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Level
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}