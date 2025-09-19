'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Search, Calendar, Heart, Lightbulb, Edit, Trash2, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserNavbar from '@/components/user-navbar';
import { toast } from 'sonner';

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 5,
    tags: [],
    prompt: ''
  });

  const journalPrompts = [
    {
      category: 'Gratitude',
      prompts: [
        'What are three things you\'re grateful for today?',
        'Describe a person who made your day better',
        'What small moment brought you joy recently?',
        'What strength did you discover in yourself today?'
      ]
    },
    {
      category: 'Reflection',
      prompts: [
        'What challenged you today and how did you handle it?',
        'What would you tell your past self about today?',
        'What did you learn about yourself this week?',
        'How have you grown in the past month?'
      ]
    },
    {
      category: 'Emotions',
      prompts: [
        'How are you really feeling right now?',
        'What emotion dominated your day and why?',
        'Describe a time you felt proud of yourself recently',
        'What\'s been weighing on your mind lately?'
      ]
    },
    {
      category: 'Goals & Dreams',
      prompts: [
        'What small step can you take toward your goals tomorrow?',
        'What would your ideal day look like?',
        'What are you excited about in the near future?',
        'What would you do if you knew you couldn\'t fail?'
      ]
    },
    {
      category: 'Self-Care',
      prompts: [
        'How did you take care of yourself today?',
        'What does your body need right now?',
        'What boundaries do you need to set?',
        'How can you be kinder to yourself?'
      ]
    }
  ];

  const commonTags = [
    'gratitude', 'anxiety', 'happiness', 'stress', 'growth', 'relationships',
    'work', 'family', 'goals', 'self-care', 'mindfulness', 'challenges'
  ];

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/journal/entries', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!newEntry.title || !newEntry.content) {
      toast.error('Please fill in title and content');
      return;
    }

    try {
      const url = editingEntry ? `/api/journal/entries/${editingEntry._id}` : '/api/journal/entries';
      const method = editingEntry ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newEntry),
      });

      if (response.ok) {
        toast.success(editingEntry ? 'Entry updated!' : 'Entry saved!');
        setIsDialogOpen(false);
        setEditingEntry(null);
        setNewEntry({ title: '', content: '', mood: 5, tags: [], prompt: '' });
        setSelectedPrompt('');
        fetchEntries();
      } else {
        toast.error('Failed to save entry');
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Something went wrong');
    }
  };

  const deleteEntry = async (entryId) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) return;

    try {
      const response = await fetch(`/api/journal/entries/${entryId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Entry deleted');
        fetchEntries();
      } else {
        toast.error('Failed to delete entry');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Something went wrong');
    }
  };

  const editEntry = (entry) => {
    setEditingEntry(entry);
    setNewEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags || [],
      prompt: entry.prompt || ''
    });
    setIsDialogOpen(true);
  };

  const usePrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setNewEntry(prev => ({ ...prev, prompt, content: prompt + '\n\n' }));
  };

  const toggleTag = (tag) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getMoodEmoji = (mood) => {
    const emojis = {
      1: '😢', 2: '😔', 3: '😐', 4: '🙂', 5: '😊',
      6: '😄', 7: '🤩', 8: '😍', 9: '🥰', 10: '🌟'
    };
    return emojis[mood] || '😊';
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
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Personal Journal</h1>
              <p className="text-muted-foreground">
                Reflect, process, and track your mental wellness journey through writing
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
                  </DialogTitle>
                  <DialogDescription>
                    Express your thoughts, feelings, and reflections in a safe space
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Prompts Section */}
                  {!editingEntry && (
                    <div className="space-y-3">
                      <Label>Need inspiration? Try a writing prompt:</Label>
                      <div className="space-y-3">
                        {journalPrompts.map((category) => (
                          <div key={category.category}>
                            <h4 className="text-sm font-medium mb-2">{category.category}</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {category.prompts.map((prompt, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="justify-start text-left h-auto p-3"
                                  onClick={() => usePrompt(prompt)}
                                >
                                  <Lightbulb className="w-4 h-4 mr-2 flex-shrink-0" />
                                  <span className="text-xs">{prompt}</span>
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Entry Form */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Give your entry a title..."
                        value={newEntry.title}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Your thoughts</Label>
                      <Textarea
                        id="content"
                        placeholder="What's on your mind? Let your thoughts flow..."
                        value={newEntry.content}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                        className="min-h-48"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Current mood (1-10)</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="range"
                          min="1"
                          max="10"
                          value={newEntry.mood}
                          onChange={(e) => setNewEntry(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                          className="flex-1"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getMoodEmoji(newEntry.mood)}</span>
                          <span className="text-sm font-medium">{newEntry.mood}/10</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {commonTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={newEntry.tags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setEditingEntry(null);
                          setNewEntry({ title: '', content: '', mood: 5, tags: [], prompt: '' });
                          setSelectedPrompt('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={saveEntry}>
                        <Save className="w-4 h-4 mr-2" />
                        {editingEntry ? 'Update' : 'Save'} Entry
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Search */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Entries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {filteredEntries.length > 0 ? (
              <div className="grid gap-6">
                {filteredEntries.map((entry) => (
                  <Card key={entry._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                            {entry.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              Mood: {entry.mood}/10
                            </span>
                          </CardDescription>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => editEntry(entry)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => deleteEntry(entry._id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {entry.prompt && (
                        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <Lightbulb className="w-4 h-4 inline mr-1" />
                            Prompt: {entry.prompt}
                          </p>
                        </div>
                      )}
                      
                      <div className="prose prose-sm max-w-none mb-4">
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {entry.content.length > 300 
                            ? `${entry.content.substring(0, 300)}...` 
                            : entry.content
                          }
                        </p>
                      </div>
                      
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'No entries match your search' : 'No journal entries yet'}
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Write Your First Entry
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Benefits */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-4">
                  ✨ Benefits of Journaling
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-700 dark:text-purple-300">
                  <div className="space-y-2">
                    <p>• Reduces stress and anxiety</p>
                    <p>• Improves emotional regulation</p>
                    <p>• Enhances self-awareness</p>
                    <p>• Processes difficult emotions</p>
                  </div>
                  <div className="space-y-2">
                    <p>• Tracks personal growth</p>
                    <p>• Clarifies thoughts and feelings</p>
                    <p>• Boosts mood and gratitude</p>
                    <p>• Improves problem-solving skills</p>
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