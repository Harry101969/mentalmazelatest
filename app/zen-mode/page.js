'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flower, Plus, Minus, Shuffle, CheckCircle, Lightbulb, Palette, Scissors, Book } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import UserNavbar from '@/components/user-navbar';

export default function ZenModePage() {
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const availableMaterials = [
    { id: 'paper', name: 'Paper', icon: '📄' },
    { id: 'pens', name: 'Pens/Pencils', icon: '✏️' },
    { id: 'colors', name: 'Colored Pencils/Markers', icon: '🖍️' },
    { id: 'notebook', name: 'Notebook/Journal', icon: '📓' },
    { id: 'candles', name: 'Candles', icon: '🕯️' },
    { id: 'plants', name: 'Plants/Flowers', icon: '🌱' },
    { id: 'music', name: 'Music Player', icon: '🎵' },
    { id: 'cushions', name: 'Cushions/Pillows', icon: '🛏️' },
    { id: 'books', name: 'Books', icon: '📚' },
    { id: 'tea', name: 'Tea/Coffee', icon: '☕' },
    { id: 'yarn', name: 'Yarn/Thread', icon: '🧶' },
    { id: 'clay', name: 'Clay/Play-Doh', icon: '🏺' },
    { id: 'stones', name: 'Stones/Crystals', icon: '💎' },
    { id: 'fabric', name: 'Fabric/Cloth', icon: '🧵' },
    { id: 'scissors', name: 'Scissors', icon: '✂️' },
    { id: 'glue', name: 'Glue/Tape', icon: '📎' }
  ];

  const activityDatabase = {
    // Paper-based activities
    paper: [
      {
        title: "Mindful Origami",
        description: "Fold simple origami shapes while focusing on each crease and fold. Start with a paper crane or lotus flower.",
        duration: "15-30 minutes",
        benefits: ["Focus", "Patience", "Hand-eye coordination"],
        instructions: [
          "Choose a simple origami design",
          "Follow each fold slowly and deliberately",
          "Focus on the texture of the paper",
          "Notice how the shape transforms with each fold"
        ]
      },
      {
        title: "Gratitude Paper Chain",
        description: "Write one thing you're grateful for on each paper strip, then link them together.",
        duration: "20-40 minutes",
        benefits: ["Gratitude", "Reflection", "Creativity"],
        instructions: [
          "Cut paper into strips",
          "Write one gratitude on each strip",
          "Link the strips into a chain",
          "Hang it somewhere visible as a reminder"
        ]
      }
    ],
    
    // Drawing/coloring activities
    colors: [
      {
        title: "Emotion Color Mapping",
        description: "Draw abstract shapes and fill them with colors that represent your current emotions.",
        duration: "20-45 minutes",
        benefits: ["Emotional awareness", "Self-expression", "Stress relief"],
        instructions: [
          "Draw flowing, abstract shapes on paper",
          "Choose colors that match your feelings",
          "Fill each shape mindfully",
          "Reflect on what the colors mean to you"
        ]
      },
      {
        title: "Mandala Creation",
        description: "Draw repetitive patterns in a circular format to promote focus and calm.",
        duration: "30-60 minutes",
        benefits: ["Meditation", "Focus", "Creativity"],
        instructions: [
          "Start with a circle in the center",
          "Add patterns radiating outward",
          "Focus on symmetry and repetition",
          "Let your mind quiet as you draw"
        ]
      }
    ],

    // Writing activities
    pens: [
      {
        title: "Stream of Consciousness Writing",
        description: "Write continuously for 10 minutes without stopping or editing.",
        duration: "10-20 minutes",
        benefits: ["Mental clarity", "Stress release", "Self-discovery"],
        instructions: [
          "Set a timer for 10 minutes",
          "Write whatever comes to mind",
          "Don't stop or edit",
          "Let thoughts flow freely onto paper"
        ]
      },
      {
        title: "Letter to Future Self",
        description: "Write an encouraging letter to yourself to read in the future.",
        duration: "15-30 minutes",
        benefits: ["Self-compassion", "Goal setting", "Motivation"],
        instructions: [
          "Date the letter for 6 months from now",
          "Share your current hopes and dreams",
          "Offer yourself encouragement",
          "Seal it to open later"
        ]
      }
    ],

    // Mindfulness activities
    candles: [
      {
        title: "Candle Gazing Meditation",
        description: "Focus on a candle flame to practice concentration and mindfulness.",
        duration: "10-20 minutes",
        benefits: ["Focus", "Meditation", "Calm"],
        instructions: [
          "Light a candle in a dark room",
          "Sit comfortably 3 feet away",
          "Gaze softly at the flame",
          "When mind wanders, return to the flame"
        ]
      }
    ],

    // Nature activities
    plants: [
      {
        title: "Plant Meditation",
        description: "Spend time observing and connecting with a plant or flower.",
        duration: "15-25 minutes",
        benefits: ["Nature connection", "Mindfulness", "Peace"],
        instructions: [
          "Choose a plant to observe",
          "Notice its colors, textures, and shapes",
          "Breathe deeply and feel connected to nature",
          "Thank the plant for its beauty"
        ]
      }
    ],

    // Craft activities
    yarn: [
      {
        title: "Mindful Finger Knitting",
        description: "Create a simple cord using just your fingers and yarn.",
        duration: "20-40 minutes",
        benefits: ["Focus", "Repetitive motion", "Accomplishment"],
        instructions: [
          "Loop yarn around your fingers",
          "Pull loops over each other rhythmically",
          "Focus on the repetitive motion",
          "Create a cord of any length you like"
        ]
      }
    ],

    // Multi-material activities
    multiple: [
      {
        title: "Gratitude Collage",
        description: "Create a visual representation of things you're grateful for.",
        duration: "30-60 minutes",
        benefits: ["Gratitude", "Creativity", "Positive focus"],
        materials: ["paper", "colors", "scissors", "glue"],
        instructions: [
          "Gather images or draw things you're grateful for",
          "Arrange them on paper in a pleasing way",
          "Glue or tape them down",
          "Add colors and decorative elements"
        ]
      },
      {
        title: "Mindful Tea Ceremony",
        description: "Create a personal tea ritual focused on mindfulness and presence.",
        duration: "20-30 minutes",
        benefits: ["Mindfulness", "Ritual", "Calm"],
        materials: ["tea", "candles", "cushions"],
        instructions: [
          "Set up a quiet space with cushions",
          "Light a candle for ambiance",
          "Prepare tea slowly and mindfully",
          "Sip slowly, focusing on taste and warmth"
        ]
      }
    ]
  };

  const toggleMaterial = (materialId) => {
    setSelectedMaterials(prev => 
      prev.includes(materialId)
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const generateSuggestions = () => {
    if (selectedMaterials.length === 0) {
      setSuggestions([]);
      setShowSuggestions(true);
      return;
    }

    let allSuggestions = [];

    // Add specific material activities
    selectedMaterials.forEach(materialId => {
      if (activityDatabase[materialId]) {
        allSuggestions.push(...activityDatabase[materialId]);
      }
    });

    // Add multi-material activities if user has the required materials
    activityDatabase.multiple.forEach(activity => {
      if (activity.materials && activity.materials.every(mat => selectedMaterials.includes(mat))) {
        allSuggestions.push(activity);
      }
    });

    // Remove duplicates and shuffle
    const uniqueSuggestions = allSuggestions.filter((activity, index, self) => 
      index === self.findIndex(a => a.title === activity.title)
    );

    // Shuffle and take up to 6 suggestions
    const shuffled = uniqueSuggestions.sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 6));
    setShowSuggestions(true);
  };

  const getRandomSuggestion = () => {
    const allActivities = Object.values(activityDatabase).flat();
    const randomActivity = allActivities[Math.floor(Math.random() * allActivities.length)];
    setSuggestions([randomActivity]);
    setShowSuggestions(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full">
                <Flower className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Zen Mode</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Disconnect from screens and reconnect with yourself through mindful offline activities. 
              Tell us what materials you have, and we'll suggest calming activities to help you find peace.
            </p>
          </motion.div>

          {/* Material Selection */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  What materials do you have available?
                </CardTitle>
                <CardDescription>
                  Select the items you have around you. We'll suggest activities based on your available materials.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableMaterials.map((material) => (
                    <div
                      key={material.id}
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedMaterials.includes(material.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-muted hover:border-primary/50'
                      }`}
                      onClick={() => toggleMaterial(material.id)}
                    >
                      <Checkbox
                        checked={selectedMaterials.includes(material.id)}
                        onChange={() => toggleMaterial(material.id)}
                      />
                      <span className="text-lg">{material.icon}</span>
                      <span className="text-sm font-medium">{material.name}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button 
                    onClick={generateSuggestions}
                    className="flex items-center gap-2"
                    disabled={selectedMaterials.length === 0}
                  >
                    <Lightbulb className="h-4 w-4" />
                    Get Personalized Suggestions
                  </Button>
                  <Button 
                    onClick={getRandomSuggestion}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Shuffle className="h-4 w-4" />
                    Surprise Me!
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Suggestions */}
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Mindful Activities for You
                  </CardTitle>
                  <CardDescription>
                    {suggestions.length === 0 
                      ? "Select some materials above to get personalized suggestions"
                      : `Here are ${suggestions.length} calming activities based on your available materials`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {suggestions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Flower className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Choose your available materials to see personalized activity suggestions</p>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {suggestions.map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold">{activity.title}</h3>
                            <Badge variant="outline">{activity.duration}</Badge>
                          </div>
                          
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {activity.description}
                          </p>

                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Benefits:</h4>
                            <div className="flex flex-wrap gap-2">
                              {activity.benefits.map((benefit, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Instructions:</h4>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                              {activity.instructions.map((instruction, i) => (
                                <li key={i}>{instruction}</li>
                              ))}
                            </ol>
                          </div>

                          {activity.materials && (
                            <div>
                              <h4 className="font-medium mb-2">Required materials:</h4>
                              <div className="flex flex-wrap gap-2">
                                {activity.materials.map((materialId, i) => {
                                  const material = availableMaterials.find(m => m.id === materialId);
                                  return material ? (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {material.icon} {material.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Tips */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-4">
                  🌿 Tips for Mindful Offline Activities
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700 dark:text-green-300">
                  <div className="space-y-2">
                    <p>• Put away all electronic devices</p>
                    <p>• Find a quiet, comfortable space</p>
                    <p>• Focus on the present moment</p>
                    <p>• Don't worry about perfection</p>
                  </div>
                  <div className="space-y-2">
                    <p>• Take deep breaths throughout</p>
                    <p>• Notice textures, colors, and sensations</p>
                    <p>• Let your mind wander naturally</p>
                    <p>• Enjoy the process, not just the result</p>
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