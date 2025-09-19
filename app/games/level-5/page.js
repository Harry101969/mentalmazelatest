// // 'use client';

// // import { useState, useEffect, useRef } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { ArrowLeft, CheckCircle, Clock, Target, BookOpen, Home, Heart, Sparkles } from 'lucide-react';
// // import Link from 'next/link';
// // import { Button } from '@/components/ui/button';
// // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Progress } from '@/components/ui/progress';
// // import { Textarea } from '@/components/ui/textarea';
// // import { Label } from '@/components/ui/label';
// // import { Badge } from '@/components/ui/badge';
// // import UserNavbar from '@/components/user-navbar';
// // import { toast } from 'sonner';
// // import { getSelfCareTokens } from '@/lib/game-patterns';

// // export default function Level5Page() {
// //   const [gameState, setGameState] = useState('instructions'); // instructions, playing, journal, completed
// //   const [selfCareTokens, setSelfCareTokens] = useState({});
// //   const [selectedTokens, setSelectedTokens] = useState({});
// //   const [sanctuaryLayout, setSanctuaryLayout] = useState([]);
// //   const [startTime, setStartTime] = useState(null);
// //   const [timeElapsed, setTimeElapsed] = useState(0);
// //   const [journalEntry, setJournalEntry] = useState('');
// //   const [draggedToken, setDraggedToken] = useState(null);
// //   const timerRef = useRef(null);

// //   const sanctuaryZones = [
// //     { id: 'rest', name: 'Rest & Relaxation', category: 'physical', color: 'bg-blue-100 dark:bg-blue-900' },
// //     { id: 'emotional', name: 'Emotional Wellness', category: 'emotional', color: 'bg-purple-100 dark:bg-purple-900' },
// //     { id: 'social', name: 'Connection & Community', category: 'social', color: 'bg-green-100 dark:bg-green-900' },
// //     { id: 'creative', name: 'Creative Expression', category: 'creative', color: 'bg-orange-100 dark:bg-orange-900' },
// //     { id: 'intellectual', name: 'Learning & Growth', category: 'intellectual', color: 'bg-indigo-100 dark:bg-indigo-900' },
// //     { id: 'spiritual', name: 'Spiritual Practice', category: 'spiritual', color: 'bg-pink-100 dark:bg-pink-900' }
// //   ];

// //   useEffect(() => {
// //     // Get personalized self-care tokens
// //     const tokens = getSelfCareTokens({
// //       age: 25, // Could get from user context
// //       hobbies: ['reading', 'music', 'exercise'] // Could get from user context
// //     });
// //     setSelfCareTokens(tokens);

// //     return () => {
// //       if (timerRef.current) clearInterval(timerRef.current);
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (gameState === 'playing' && startTime) {
// //       timerRef.current = setInterval(() => {
// //         setTimeElapsed(Date.now() - startTime);
// //       }, 1000);
// //     } else {
// //       if (timerRef.current) {
// //         clearInterval(timerRef.current);
// //       }
// //     }
// //   }, [gameState, startTime]);

// //   const startGame = () => {
// //     setGameState('playing');
// //     setStartTime(Date.now());
// //   };

// //   const handleDragStart = (e, token, category) => {
// //     setDraggedToken({ ...token, category });
// //     e.dataTransfer.effectAllowed = 'move';
// //   };

// //   const handleDragOver = (e) => {
// //     e.preventDefault();
// //     e.dataTransfer.dropEffect = 'move';
// //   };

// //   const handleDrop = (e, zoneId) => {
// //     e.preventDefault();

// //     if (!draggedToken) return;

// //     const zone = sanctuaryZones.find(z => z.id === zoneId);
// //     if (!zone) return;

// //     // Add token to selected tokens for this zone
// //     setSelectedTokens(prev => ({
// //       ...prev,
// //       [zoneId]: [...(prev[zoneId] || []), draggedToken]
// //     }));

// //     setDraggedToken(null);
// //     checkCompletion();
// //   };

// //   const removeToken = (zoneId, tokenIndex) => {
// //     setSelectedTokens(prev => ({
// //       ...prev,
// //       [zoneId]: prev[zoneId].filter((_, index) => index !== tokenIndex)
// //     }));
// //   };

// //   const checkCompletion = () => {
// //     const totalTokensPlaced = Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0);
// //     const zonesWithTokens = Object.keys(selectedTokens).filter(zoneId => selectedTokens[zoneId]?.length > 0).length;

// //     // Complete when user has placed tokens in at least 4 zones with minimum 2 tokens each
// //     if (zonesWithTokens >= 4 && totalTokensPlaced >= 12) {
// //       setTimeout(() => {
// //         setGameState('journal');
// //       }, 1000);
// //     }
// //   };

// //   const submitJournal = async () => {
// //     try {
// //       const gameData = {
// //         level: 5,
// //         completed: true,
// //         score: calculateSelfCareScore(),
// //         timeSpent: Math.round(timeElapsed / 1000),
// //         tokensPlaced: Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0),
// //         categoriesUsed: Object.keys(selectedTokens).filter(zoneId => selectedTokens[zoneId]?.length > 0).length,
// //         journalEntry
// //       };

// //       const response = await fetch('/api/games/complete-level', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         credentials: 'include',
// //         body: JSON.stringify(gameData),
// //       });

// //       if (response.ok) {
// //         setGameState('completed');
// //         toast.success('Level 5 completed! You\'ve created your personal self-care sanctuary.');
// //       } else {
// //         toast.error('Failed to save progress. Please try again.');
// //       }
// //     } catch (error) {
// //       console.error('Error completing level:', error);
// //       toast.error('Something went wrong. Please try again.');
// //     }
// //   };

// //   const calculateSelfCareScore = () => {
// //     const totalTokensPlaced = Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0);
// //     const zonesWithTokens = Object.keys(selectedTokens).filter(zoneId => selectedTokens[zoneId]?.length > 0).length;

// //     const completionScore = (zonesWithTokens / 6) * 60; // 60 points for zone completion
// //     const tokenScore = Math.min(40, totalTokensPlaced * 2); // Up to 40 points for tokens

// //     return Math.round(completionScore + tokenScore);
// //   };

// //   const formatTime = (ms) => {
// //     const seconds = Math.floor(ms / 1000);
// //     const minutes = Math.floor(seconds / 60);
// //     return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
// //   };

// //   return (
// //     <div className="min-h-screen bg-background">
// //       <UserNavbar />

// //       <main className="pt-20 pb-12">
// //         <div className="container mx-auto px-4 max-w-6xl">
// //           {/* Header */}
// //           <div className="flex items-center justify-between mb-8">
// //             <div className="flex items-center gap-4">
// //               <Button asChild variant="outline" size="icon">
// //                 <Link href="/games">
// //                   <ArrowLeft className="h-4 w-4" />
// //                 </Link>
// //               </Button>
// //               <div>
// //                 <h1 className="text-3xl font-bold">Level 5: The Safe Haven</h1>
// //                 <p className="text-muted-foreground">Create your personal self-care sanctuary</p>
// //               </div>
// //             </div>

// //             {gameState === 'playing' && (
// //               <div className="flex items-center gap-6 text-sm">
// //                 <div className="flex items-center gap-2">
// //                   <Clock className="h-4 w-4" />
// //                   <span>{formatTime(timeElapsed)}</span>
// //                 </div>
// //                 <div className="flex items-center gap-2">
// //                   <Target className="h-4 w-4" />
// //                   <span>{Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0)} tokens placed</span>
// //                 </div>
// //               </div>
// //             )}
// //           </div>

// //           <AnimatePresence mode="wait">
// //             {/* Instructions */}
// //             {gameState === 'instructions' && (
// //               <motion.div
// //                 key="instructions"
// //                 initial={{ opacity: 0, y: 20 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 exit={{ opacity: 0, y: -20 }}
// //               >
// //                 <Card className="mb-8">
// //                   <CardHeader>
// //                     <CardTitle className="flex items-center gap-2">
// //                       <Home className="h-5 w-5" />
// //                       Welcome to Your Safe Haven
// //                     </CardTitle>
// //                   </CardHeader>
// //                   <CardContent className="space-y-6">
// //                     <div className="prose prose-sm max-w-none">
// //                       <p className="text-lg leading-relaxed">
// //                         In this final level, you'll create your personal <strong>self-care sanctuary</strong> - 
// //                         a comprehensive wellness toolkit tailored to your unique needs and preferences.
// //                       </p>
// //                     </div>

// //                     <div className="grid md:grid-cols-2 gap-6">
// //                       <div>
// //                         <h3 className="font-semibold mb-3">How to Build Your Sanctuary:</h3>
// //                         <ul className="space-y-2 text-sm">
// //                           <li className="flex items-start gap-2">
// //                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
// //                             Drag self-care tokens from the collection
// //                           </li>
// //                           <li className="flex items-start gap-2">
// //                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
// //                             Drop them into appropriate sanctuary zones
// //                           </li>
// //                           <li className="flex items-start gap-2">
// //                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
// //                             Create a balanced wellness plan
// //                           </li>
// //                           <li className="flex items-start gap-2">
// //                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
// //                             Place tokens in at least 4 different zones
// //                           </li>
// //                         </ul>
// //                       </div>

// //                       <div>
// //                         <h3 className="font-semibold mb-3">Sanctuary Zones:</h3>
// //                         <ul className="space-y-2 text-sm">
// //                           <li className="flex items-start gap-2">
// //                             <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
// //                             <span><strong>Physical:</strong> Body care and movement</span>
// //                           </li>
// //                           <li className="flex items-start gap-2">
// //                             <div className="w-3 h-3 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>
// //                             <span><strong>Emotional:</strong> Feelings and mental health</span>
// //                           </li>
// //                           <li className="flex items-start gap-2">
// //                             <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
// //                             <span><strong>Social:</strong> Relationships and community</span>
// //                           </li>
// //                           <li className="flex items-start gap-2">
// //                             <div className="w-3 h-3 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
// //                             <span><strong>Creative:</strong> Art and self-expression</span>
// //                           </li>
// //                           <li className="flex items-start gap-2">
// //                             <div className="w-3 h-3 bg-indigo-500 rounded-full mt-1 flex-shrink-0"></div>
// //                             <span><strong>Intellectual:</strong> Learning and growth</span>
// //                           </li>
// //                           <li className="flex items-start gap-2">
// //                             <div className="w-3 h-3 bg-pink-500 rounded-full mt-1 flex-shrink-0"></div>
// //                             <span><strong>Spiritual:</strong> Meaning and purpose</span>
// //                           </li>
// //                         </ul>
// //                       </div>
// //                     </div>

// //                     <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
// //                       <p className="text-sm text-amber-800 dark:text-amber-200">
// //                         <strong>Goal:</strong> Create a balanced self-care plan by placing at least 2 tokens 
// //                         in 4 different zones. Think about what activities truly nourish your well-being.
// //                       </p>
// //                     </div>

// //                     <div className="flex justify-center pt-4">
// //                       <Button onClick={startGame} size="lg" className="px-8">
// //                         Build Your Sanctuary
// //                       </Button>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               </motion.div>
// //             )}

// //             {/* Self-Care Sanctuary Builder */}
// //             {gameState === 'playing' && (
// //               <motion.div
// //                 key="sanctuary"
// //                 initial={{ opacity: 0 }}
// //                 animate={{ opacity: 1 }}
// //                 exit={{ opacity: 0 }}
// //                 className="space-y-6"
// //               >
// //                 {/* Progress */}
// //                 <div className="mb-6">
// //                   <div className="flex items-center justify-between mb-2">
// //                     <span className="text-sm font-medium">Sanctuary Progress</span>
// //                     <span className="text-sm text-muted-foreground">
// //                       {Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0)} tokens placed
// //                     </span>
// //                   </div>
// //                   <Progress value={Math.min(100, (Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0) / 12) * 100)} className="h-2" />
// //                 </div>

// //                 {/* Sanctuary Zones */}
// //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
// //                   {sanctuaryZones.map((zone) => (
// //                     <div
// //                       key={zone.id}
// //                       className={`min-h-32 p-4 border-2 border-dashed rounded-lg ${zone.color} transition-all`}
// //                       onDragOver={handleDragOver}
// //                       onDrop={(e) => handleDrop(e, zone.id)}
// //                     >
// //                       <h3 className="font-medium text-center mb-3">{zone.name}</h3>
// //                       <div className="space-y-2">
// //                         {(selectedTokens[zone.id] || []).map((token, index) => (
// //                           <div
// //                             key={index}
// //                             className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded shadow-sm"
// //                           >
// //                             <div className="flex items-center gap-2">
// //                               <span className="text-lg">{token.icon}</span>
// //                               <span className="text-sm font-medium">{token.name}</span>
// //                             </div>
// //                             <Button
// //                               onClick={() => removeToken(zone.id, index)}
// //                               variant="ghost"
// //                               size="sm"
// //                               className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
// //                             >
// //                               ×
// //                             </Button>
// //                           </div>
// //                         ))}
// //                         {(selectedTokens[zone.id] || []).length === 0 && (
// //                           <p className="text-center text-muted-foreground text-sm">
// //                             Drop self-care tokens here
// //                           </p>
// //                         )}
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>

// //                 {/* Available Tokens */}
// //                 <Card>
// //                   <CardHeader>
// //                     <CardTitle className="flex items-center gap-2">
// //                       <Sparkles className="h-5 w-5" />
// //                       Self-Care Token Collection
// //                     </CardTitle>
// //                   </CardHeader>
// //                   <CardContent>
// //                     {Object.entries(selfCareTokens).map(([category, tokens]) => (
// //                       <div key={category} className="mb-6">
// //                         <h4 className="font-medium mb-3 capitalize">{category} Wellness</h4>
// //                         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
// //                           {tokens.map((token) => {
// //                             const isUsed = Object.values(selectedTokens).flat().some(t => t.id === token.id);
// //                             return (
// //                               <div
// //                                 key={token.id}
// //                                 draggable={!isUsed}
// //                                 onDragStart={(e) => handleDragStart(e, token, category)}
// //                                 className={`p-3 border rounded-lg text-center cursor-move transition-all ${
// //                                   isUsed 
// //                                     ? 'opacity-50 cursor-not-allowed' 
// //                                     : 'hover:shadow-md hover:scale-105 bg-white dark:bg-slate-800'
// //                                 }`}
// //                               >
// //                                 <div className="text-2xl mb-1">{token.icon}</div>
// //                                 <div className="text-xs font-medium">{token.name}</div>
// //                               </div>
// //                             );
// //                           })}
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </CardContent>
// //                 </Card>

// //                 {/* Completion Status */}
// //                 <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
// //                   <CardContent className="p-4">
// //                     <div className="flex items-center justify-between">
// //                       <div>
// //                         <h4 className="font-medium text-green-800 dark:text-green-200">Sanctuary Status</h4>
// //                         <p className="text-sm text-green-700 dark:text-green-300">
// //                           {Object.keys(selectedTokens).filter(zoneId => selectedTokens[zoneId]?.length > 0).length}/4 zones active, 
// //                           {Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0)}/12 tokens placed
// //                         </p>
// //                       </div>
// //                       {Object.keys(selectedTokens).filter(zoneId => selectedTokens[zoneId]?.length > 0).length >= 4 && 
// //                        Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0) >= 12 && (
// //                         <Badge className="bg-green-600 text-white">
// //                           <CheckCircle className="w-3 h-3 mr-1" />
// //                           Complete!
// //                         </Badge>
// //                       )}
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               </motion.div>
// //             )}

// //             {/* Journal Section */}
// //             {gameState === 'journal' && (
// //               <motion.div
// //                 key="journal"
// //                 initial={{ opacity: 0, y: 20 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 exit={{ opacity: 0, y: -20 }}
// //                 className="max-w-4xl mx-auto"
// //               >
// //                 <Card>
// //                   <CardHeader>
// //                     <CardTitle className="flex items-center gap-2">
// //                       <BookOpen className="h-5 w-5" />
// //                       Self-Care Sanctuary Reflection
// //                     </CardTitle>
// //                   </CardHeader>
// //                   <CardContent className="space-y-6">
// //                     <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg">
// //                       <p className="text-purple-800 dark:text-purple-200 text-center">
// //                         🏡 Wonderful! You've created your personal self-care sanctuary!
// //                       </p>
// //                     </div>

// //                     <div className="grid grid-cols-3 gap-4 text-center">
// //                       <div className="p-4 bg-muted/50 rounded-lg">
// //                         <div className="text-2xl font-bold text-primary">{formatTime(timeElapsed)}</div>
// //                         <div className="text-sm text-muted-foreground">Planning Time</div>
// //                       </div>
// //                       <div className="p-4 bg-muted/50 rounded-lg">
// //                         <div className="text-2xl font-bold text-secondary">
// //                           {Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0)}
// //                         </div>
// //                         <div className="text-sm text-muted-foreground">Tokens Placed</div>
// //                       </div>
// //                       <div className="p-4 bg-muted/50 rounded-lg">
// //                         <div className="text-2xl font-bold text-green-600">{calculateSelfCareScore()}%</div>
// //                         <div className="text-sm text-muted-foreground">Wellness Score</div>
// //                       </div>
// //                     </div>

// //                     {/* Sanctuary Summary */}
// //                     <div className="space-y-4">
// //                       <h4 className="font-medium">Your Self-Care Sanctuary:</h4>
// //                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                         {Object.entries(selectedTokens).map(([zoneId, tokens]) => {
// //                           const zone = sanctuaryZones.find(z => z.id === zoneId);
// //                           return tokens.length > 0 ? (
// //                             <div key={zoneId} className="p-3 border rounded-lg">
// //                               <h5 className="font-medium mb-2">{zone.name}</h5>
// //                               <div className="flex flex-wrap gap-1">
// //                                 {tokens.map((token, index) => (
// //                                   <Badge key={index} variant="outline" className="text-xs">
// //                                     {token.icon} {token.name}
// //                                   </Badge>
// //                                 ))}
// //                               </div>
// //                             </div>
// //                           ) : null;
// //                         })}
// //                       </div>
// //                     </div>

// //                     <div className="space-y-4">
// //                       <Label htmlFor="journal" className="text-base font-medium">
// //                         Reflect on your self-care sanctuary:
// //                       </Label>
// //                       <p className="text-sm text-muted-foreground">
// //                         How will you use this sanctuary in your daily life? What self-care practices 
// //                         resonate most with you, and how will you make time for them?
// //                       </p>
// //                       <Textarea
// //                         id="journal"
// //                         placeholder="Write about your self-care plan and how you'll nurture your well-being..."
// //                         value={journalEntry}
// //                         onChange={(e) => setJournalEntry(e.target.value)}
// //                         className="min-h-32"
// //                       />
// //                     </div>

// //                     <div className="flex justify-center">
// //                       <Button onClick={submitJournal} size="lg" className="px-8">
// //                         Complete Level 5
// //                       </Button>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               </motion.div>
// //             )}

// //             {/* Completion */}
// //             {gameState === 'completed' && (
// //               <motion.div
// //                 key="completed"
// //                 initial={{ opacity: 0, scale: 0.9 }}
// //                 animate={{ opacity: 1, scale: 1 }}
// //                 exit={{ opacity: 0, scale: 0.9 }}
// //                 className="max-w-2xl mx-auto text-center"
// //               >
// //                 <Card className="border-purple-500/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
// //                   <CardContent className="p-8">
// //                     <motion.div
// //                       initial={{ scale: 0 }}
// //                       animate={{ scale: 1 }}
// //                       transition={{ delay: 0.2, type: "spring" }}
// //                       className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
// //                     >
// //                       <CheckCircle className="w-10 h-10 text-white" />
// //                     </motion.div>

// //                     <h2 className="text-3xl font-bold mb-4">🎉 Journey Complete!</h2>
// //                     <p className="text-lg text-muted-foreground mb-8">
// //                       Congratulations! You've completed all 5 levels of your mental wellness journey. 
// //                       You now have a complete toolkit for managing anxiety, stress, and promoting well-being.
// //                     </p>

// //                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
// //                       <Button asChild size="lg">
// //                         <Link href="/dashboard">
// //                           Return to Dashboard
// //                         </Link>
// //                       </Button>
// //                       <Button asChild variant="outline" size="lg">
// //                         <Link href="/games">
// //                           Replay Levels
// //                         </Link>
// //                       </Button>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               </motion.div>
// //             )}
// //           </AnimatePresence>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ArrowLeft, CheckCircle, Clock, Target, BookOpen, Home, Heart, Sparkles } from 'lucide-react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
// import UserNavbar from '@/components/user-navbar';
// import { toast } from 'sonner';
// import { getSelfCareTokens } from '@/lib/game-patterns';

// export default function Level5Page() {
//   const [gameState, setGameState] = useState('instructions'); // instructions, playing, journal, completed
//   const [selfCareTokens, setSelfCareTokens] = useState({});
//   const [selectedTokens, setSelectedTokens] = useState({});
//   const [sanctuaryLayout, setSanctuaryLayout] = useState([]);
//   const [startTime, setStartTime] = useState(null);
//   const [timeElapsed, setTimeElapsed] = useState(0);
//   const [journalEntry, setJournalEntry] = useState('');
//   const [draggedToken, setDraggedToken] = useState(null);
//   const timerRef = useRef(null);

//   const sanctuaryZones = [
//     { id: 'rest', name: 'Rest & Relaxation', category: 'physical', color: 'bg-blue-100 dark:bg-blue-900' },
//     { id: 'emotional', name: 'Emotional Wellness', category: 'emotional', color: 'bg-purple-100 dark:bg-purple-900' },
//     { id: 'social', name: 'Connection & Community', category: 'social', color: 'bg-green-100 dark:bg-green-900' },
//     { id: 'creative', name: 'Creative Expression', category: 'creative', color: 'bg-orange-100 dark:bg-orange-900' },
//     { id: 'intellectual', name: 'Learning & Growth', category: 'intellectual', color: 'bg-indigo-100 dark:bg-indigo-900' },
//     { id: 'spiritual', name: 'Spiritual Practice', category: 'spiritual', color: 'bg-pink-100 dark:bg-pink-900' }
//   ];

//   useEffect(() => {
//     // Get personalized self-care tokens
//     const tokens = getSelfCareTokens({
//       age: 25, // Could get from user context
//       hobbies: ['reading', 'music', 'exercise'] // Could get from user context
//     });
//     setSelfCareTokens(tokens);

//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     if (gameState === 'playing' && startTime) {
//       timerRef.current = setInterval(() => {
//         setTimeElapsed(Date.now() - startTime);
//       }, 1000);
//     } else {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     }
//   }, [gameState, startTime]);

//   const startGame = () => {
//     setGameState('playing');
//     setStartTime(Date.now());
//   };

//   const handleDragStart = (e, token, category) => {
//     setDraggedToken({ ...token, category });
//     e.dataTransfer.effectAllowed = 'move';
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = 'move';
//   };

//   const handleDrop = (e, zoneId) => {
//     e.preventDefault();

//     if (!draggedToken) return;

//     const zone = sanctuaryZones.find(z => z.id === zoneId);
//     if (!zone) return;

//     // Add token to selected tokens for this zone
//     setSelectedTokens(prev => ({
//       ...prev,
//       [zoneId]: [...(prev[zoneId] || []), draggedToken]
//     }));

//     setDraggedToken(null);
//     checkCompletion();
//   };

//   const removeToken = (zoneId, tokenIndex) => {
//     setSelectedTokens(prev => ({
//       ...prev,
//       [zoneId]: prev[zoneId].filter((_, index) => index !== tokenIndex)
//     }));
//   };

//   const checkCompletion = () => {
//     const totalTokensPlaced = Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0);
//     const zonesWithTokens = Object.keys(selectedTokens).filter(zoneId => selectedTokens[zoneId]?.length > 0).length;

//     // Complete when user has placed tokens in at least 4 zones with minimum 2 tokens each
//     if (zonesWithTokens >= 4 && totalTokensPlaced >= 12) {
//       setTimeout(() => {
//         setGameState('journal');
//       }, 1000);
//     }
//   };

//   const submitJournal = async () => {
//     try {
//       const gameData = {
//         level: 5,
//         completed: true,
//         score: calculateSelfCareScore(),
//         timeSpent: Math.round(timeElapsed / 1000),
//         tokensPlaced: Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0),
//         categoriesUsed: Object.keys(selectedTokens).filter(zoneId => selectedTokens[zoneId]?.length > 0).length,
//         journalEntry
//       };

//       const response = await fetch('/api/games/complete-level', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(gameData),
//       });

//       if (response.ok) {
//         setGameState('completed');
//         toast.success('Level 5 completed! You\'ve created your personal self-care sanctuary.');
//       } else {
//         toast.error('Failed to save progress. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error completing level:', error);
//       toast.error('Something went wrong. Please try again.');
//     }
//   };

//   const calculateSelfCareScore = () => {
//     const totalTokensPlaced = Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0);
//     const zonesWithTokens = Object.keys(selectedTokens).filter(zoneId => selectedTokens[zoneId]?.length > 0).length;

//     const completionScore = (zonesWithTokens / 6) * 60; // 60 points for zone completion
//     const tokenScore = Math.min(40, totalTokensPlaced * 2); // Up to 40 points for tokens

//     return Math.round(completionScore + tokenScore);
//   };

//   const formatTime = (ms) => {
//     const seconds = Math.floor(ms / 1000);
//     const minutes = Math.floor(seconds / 60);
//     return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <UserNavbar />

//       <main className="pt-20 pb-12">
//         <div className="container mx-auto px-4 max-w-6xl">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-4">
//               <Button asChild variant="outline" size="icon">
//                 <Link href="/games">
//                   <ArrowLeft className="h-4 w-4" />
//                 </Link>
//               </Button>
//               <div>
//                 <h1 className="text-3xl font-bold">Level 5: The Safe Haven</h1>
//                 <p className="text-muted-foreground">Create your personal self-care sanctuary</p>
//               </div>
//             </div>

//             {gameState === 'playing' && (
//               <div className="flex items-center gap-6 text-sm">
//                 <div className="flex items-center gap-2">
//                   <Clock className="h-4 w-4" />
//                   <span>{formatTime(timeElapsed)}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Target className="h-4 w-4" />
//                   <span>{Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0)} tokens placed</span>
//                 </div>
//               </div>
//             )}
//           </div>

//           <AnimatePresence mode="wait">
//             {/* Instructions */}
//             {gameState === 'instructions' && (
//               <motion.div
//                 key="instructions"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//               >
//                 <Card className="mb-8">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Home className="h-5 w-5" />
//                       Welcome to Your Safe Haven
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div className="prose prose-sm max-w-none">
//                       <p className="text-lg leading-relaxed">
//                         In this final level, you'll create your personal <strong>self-care sanctuary</strong> -
//                         a comprehensive wellness toolkit tailored to your unique needs and preferences.
//                       </p>
//                     </div>

//                     <div className="grid md:grid-cols-2 gap-6">
//                       <div>
//                         <h3 className="font-semibold mb-3">How to Build Your Sanctuary:</h3>
//                         <ul className="space-y-2 text-sm">
//                           <li className="flex items-start gap-2">
//                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
//                             Drag self-care tokens from the collection
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
//                             Drop them into appropriate sanctuary zones
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
//                             Create a balanced wellness plan
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
//                             Place tokens in at least 4 different zones
//                           </li>
//                         </ul>
//                       </div>

//                       <div>
//                         <h3 className="font-semibold mb-3">Sanctuary Zones:</h3>
//                         <ul className="space-y-2 text-sm">
//                           <li className="flex items-start gap-2">
//                             <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
//                             <span><strong>Physical:</strong> Body care and movement</span>
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <div className="w-3 h-3 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>
//                             <span><strong>Emotional:</strong> Feelings and mental health</span>
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
//                             <span><strong>Social:</strong> Relationships and community</span>
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <div className="w-3 h-3 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
//                             <span><strong>Creative:</strong> Art and self-expression</span>
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <div className="w-3 h-3 bg-indigo-500 rounded-full mt-1 flex-shrink-0"></div>
//                             <span><strong>Intellectual:</strong> Learning and growth</span>
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <div className="w-3 h-3 bg-pink-500 rounded-full mt-1 flex-shrink-0"></div>
//                             <span><strong>Spiritual:</strong> Meaning and purpose</span>
//                           </li>
//                         </ul>
//                       </div>
//                     </div>

//                     <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
//                       <p className="text-sm text-amber-800 dark:text-amber-200">
//                         <strong>Goal:</strong> Create a balanced self-care plan by placing at least 2 tokens
//                         in 4 different zones. Think about what activities truly nourish your well-being.
//                       </p>
//                     </div>

//                     <div className="flex justify-center pt-4">
//                       <Button onClick={startGame} size="lg" className="px-8">
//                         Build Your Sanctuary
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             )}

//             {/* Self-Care Sanctuary Builder */}
//             {gameState === 'playing' && (
//               <motion.div
//                 key="sanctuary"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="space-y-6"
//               >
//                 {/* Progress */}
//                 <div className="mb-6">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium">Sanctuary Progress</span>
//                     <span className="text-sm text-muted-foreground">
//                       {Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0)} tokens placed
//                     </span>
//                   </div>
//                   <Progress value={Math.min(100, (Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0) / 12) * 100)} className="h-2" />
//                 </div>

//                 {/* Sanctuary Zones */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//                   {sanctuaryZones.map((zone) => (
//                     <div
//                       key={zone.id}
//                       className={`min-h-32 p-4 border-2 border-dashed rounded-lg ${zone.color} transition-all`}
//                       onDragOver={handleDragOver}
//                       onDrop={(e) => handleDrop(e, zone.id)}
//                     >
//                       <h3 className="font-medium text-center mb-3">{zone.name}</h3>
//                       <div className="space-y-2">
//                         {(selectedTokens[zone.id] || []).map((token, index) => (
//                           <div
//                             key={index}
//                             className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded shadow-sm"
//                           >
//                             <div className="flex items-center gap-2">
//                               <span className="text-lg">{token.icon}</span>
//                               <span className="text-sm font-medium">{token.name}</span>
//                             </div>
//                             <Button
//                               onClick={() => removeToken(zone.id, index)}
//                               variant="ghost"
//                               size="sm"
//                               className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
//                             >
//                               ×
//                             </Button>
//                           </div>
//                         ))}
//                         {(selectedTokens[zone.id] || []).length === 0 && (
//                           <p className="text-center text-muted-foreground text-sm">
//                             Drop self-care tokens here
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Available Tokens */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Sparkles className="h-5 w-5" />
//                       Self-Care Token Collection
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {Object.entries(selfCareTokens).map(([category, tokens]) => (
//                       <div key={category} className="mb-6">
//                         <h4 className="font-medium mb-3 capitalize">{category} Wellness</h4>
//                         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
//                           {tokens.map((token) => {
//                             const isUsed = Object.values(selectedTokens).flat().some(t => t.id === token.id);
//                             return (
//                               <div
//                                 key={token.id}
//                                 draggable={!isUsed}
//                                 onDragStart={(e) => handleDragStart(e, token, category)}
//                                 className={`p-3 border rounded-lg text-center cursor-move transition-all ${isUsed
//                                   ? 'opacity-50 cursor-not-allowed'
//                                   : 'hover:shadow-md hover:scale-105 bg-white dark:bg-slate-800'
//                                   }`}
//                               >
//                                 <div className="text-2xl mb-1">{token.icon}</div>
//                                 <div className="text-xs font-medium">{token.name}</div>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     ))}
//                   </CardContent>
//                 </Card>

//                 {/* Completion Status */}
//                 <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
//                   <CardContent className="p-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h4 className="font-medium text-green-800 dark:text-green-200">Sanctuary Status</h4>
//                         <p className="text-sm text-green-700 dark:text-green-300">
//                           {Object.keys(selectedTokens).filter(zoneId => selectedTokens[zoneId]?.length > 0).length}/4 zones active,
//                           {Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0)}/12 tokens placed
//                         </p>
//                       </div>
//                       {Object.keys(selectedTokens).filter(zoneId => selectedTokens[zoneId]?.length > 0).length >= 4 &&
//                         Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0) >= 12 && (
//                           <Badge className="bg-green-600 text-white">
//                             <CheckCircle className="w-3 h-3 mr-1" />
//                             Complete!
//                           </Badge>
//                         )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             )}

//             {/* Journal Section */}
//             {gameState === 'journal' && (
//               <motion.div
//                 key="journal"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className="max-w-4xl mx-auto"
//               >
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <BookOpen className="h-5 w-5" />
//                       Self-Care Sanctuary Reflection
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg">
//                       <p className="text-purple-800 dark:text-purple-200 text-center">
//                         🏡 Wonderful! You've created your personal self-care sanctuary!
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 text-center">
//                       <div className="p-4 bg-muted/50 rounded-lg">
//                         <div className="text-2xl font-bold text-primary">{formatTime(timeElapsed)}</div>
//                         <div className="text-sm text-muted-foreground">Planning Time</div>
//                       </div>
//                       <div className="p-4 bg-muted/50 rounded-lg">
//                         <div className="text-2xl font-bold text-secondary">
//                           {Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0)}
//                         </div>
//                         <div className="text-sm text-muted-foreground">Tokens Placed</div>
//                       </div>
//                       <div className="p-4 bg-muted/50 rounded-lg">
//                         <div className="text-2xl font-bold text-green-600">{calculateSelfCareScore()}%</div>
//                         <div className="text-sm text-muted-foreground">Wellness Score</div>
//                       </div>
//                     </div>

//                     {/* Sanctuary Summary */}
//                     <div className="space-y-4">
//                       <h4 className="font-medium">Your Self-Care Sanctuary:</h4>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {Object.entries(selectedTokens).map(([zoneId, tokens]) => {
//                           const zone = sanctuaryZones.find(z => z.id === zoneId);
//                           return tokens.length > 0 ? (
//                             <div key={zoneId} className="p-3 border rounded-lg">
//                               <h5 className="font-medium mb-2">{zone.name}</h5>
//                               <div className="flex flex-wrap gap-1">
//                                 {tokens.map((token, index) => (
//                                   <Badge key={index} variant="outline" className="text-xs">
//                                     {token.icon} {token.name}
//                                   </Badge>
//                                 ))}
//                               </div>
//                             </div>
//                           ) : null;
//                         })}
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <Label htmlFor="journal" className="text-base font-medium">
//                         Reflect on your self-care sanctuary:
//                       </Label>
//                       <p className="text-sm text-muted-foreground">
//                         How will you use this sanctuary in your daily life? What self-care practices
//                         resonate most with you, and how will you make time for them?
//                       </p>
//                       <Textarea
//                         id="journal"
//                         placeholder="Write about your self-care plan and how you'll nurture your well-being..."
//                         value={journalEntry}
//                         onChange={(e) => setJournalEntry(e.target.value)}
//                         className="min-h-32"
//                       />
//                     </div>

//                     <div className="flex justify-center">
//                       <Button onClick={submitJournal} size="lg" className="px-8">
//                         Complete Level 5
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             )}

//             {/* Completion */}
//             {gameState === 'completed' && (
//               <motion.div
//                 key="completed"
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="max-w-2xl mx-auto text-center"
//               >
//                 <Card className="border-purple-500/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
//                   <CardContent className="p-8">
//                     <motion.div
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       transition={{ delay: 0.2, type: "spring" }}
//                       className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
//                     >
//                       <CheckCircle className="w-10 h-10 text-white" />
//                     </motion.div>

//                     <h2 className="text-3xl font-bold mb-4">🎉 Journey Complete!</h2>
//                     <p className="text-lg text-muted-foreground mb-8">
//                       Congratulations! You've completed all 5 levels of your mental wellness journey.
//                       You now have a complete toolkit for managing anxiety, stress, and promoting well-being.
//                     </p>

//                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                       <Button asChild size="lg">
//                         <Link href="/dashboard">
//                           Return to Dashboard
//                         </Link>
//                       </Button>
//                       <Button asChild variant="outline" size="lg">
//                         <Link href="/games">
//                           Replay Levels
//                         </Link>
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </main>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, Target, BookOpen, Home, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import UserNavbar from '@/components/user-navbar';
import { toast } from 'sonner';
import { getSelfCareTokens } from '@/lib/game-patterns';

export default function Level5Page() {
  const [gameState, setGameState] = useState('instructions'); // instructions, playing, journal, completed
  const [selfCareTokens, setSelfCareTokens] = useState({});
  const [selectedTokens, setSelectedTokens] = useState({});
  const [sanctuaryLayout, setSanctuaryLayout] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [draggedToken, setDraggedToken] = useState(null);
  const timerRef = useRef(null);

  const sanctuaryZones = [
    { id: 'rest', name: 'Rest & Relaxation', category: 'physical', color: 'bg-blue-100 dark:bg-blue-900' },
    { id: 'emotional', name: 'Emotional Wellness', category: 'emotional', color: 'bg-purple-100 dark:bg-purple-900' },
    { id: 'social', name: 'Connection & Community', category: 'social', color: 'bg-green-100 dark:bg-green-900' },
    { id: 'creative', name: 'Creative Expression', category: 'creative', color: 'bg-orange-100 dark:bg-orange-900' },
    { id: 'intellectual', name: 'Learning & Growth', category: 'intellectual', color: 'bg-indigo-100 dark:bg-indigo-900' },
    { id: 'spiritual', name: 'Spiritual Practice', category: 'spiritual', color: 'bg-pink-100 dark:bg-pink-900' }
  ];

  useEffect(() => {
    // Get personalized self-care tokens
    const tokens = getSelfCareTokens({
      age: 25, // Could get from user context
      hobbies: ['reading', 'music', 'exercise'] // Could get from user context
    });
    setSelfCareTokens(tokens);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
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
  };

  const handleDragStart = (e, token, category) => {
    setDraggedToken({ ...token, category });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();

    if (!draggedToken) return;

    const zone = sanctuaryZones.find(z => z.id === zoneId);
    if (!zone) return;

    // Add token to selected tokens for this zone
    setSelectedTokens(prev => ({
      ...prev,
      [zoneId]: [...(prev[zoneId] || []), draggedToken]
    }));

    setDraggedToken(null);
    checkCompletion();
  };

  const removeToken = (zoneId, tokenIndex) => {
    setSelectedTokens(prev => ({
      ...prev,
      [zoneId]: prev[zoneId].filter((_, index) => index !== tokenIndex)
    }));
  };

  const checkCompletion = () => {
    const totalTokensPlaced = Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0);
    const zonesWithTokens = Object.keys(selectedTokens).filter(zoneId => selectedTokens[zoneId]?.length > 0).length;

    // Complete when user has placed tokens in at least 4 zones with minimum 2 tokens each
    if (zonesWithTokens >= 4 && totalTokensPlaced >= 12) {
      setTimeout(() => {
        setGameState('journal');
      }, 1000);
    }
  };

  const submitJournal = async () => {
    // Mock success - no actual API call
    setTimeout(() => {
      setGameState('completed');
      toast.success('Level 5 completed! You\'ve created your personal self-care sanctuary.');
    }, 1000);
  };

  const calculateSelfCareScore = () => {
    const totalTokensPlaced = Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0);
    const zonesWithTokens = Object.keys(selectedTokens).filter(zoneId => selectedTokens[zoneId]?.length > 0).length;

    const completionScore = (zonesWithTokens / 6) * 60; // 60 points for zone completion
    const tokenScore = Math.min(40, totalTokensPlaced * 2); // Up to 40 points for tokens

    return Math.round(completionScore + tokenScore);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  // Safe progress value calculation
  const totalTokensPlaced = Object.values(selectedTokens).reduce((acc, tokens) => acc + tokens.length, 0);
  const progressValue = Math.min(100, (totalTokensPlaced / 12) * 100);

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="icon">
                <Link href="/games">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Level 5: The Safe Haven</h1>
                <p className="text-muted-foreground">Create your personal self-care sanctuary</p>
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
                  <span>{totalTokensPlaced} tokens placed</span>
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
                      <Home className="h-5 w-5" />
                      Welcome to Your Safe Haven
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-lg leading-relaxed">
                        In this final level, you'll create your personal <strong>self-care sanctuary</strong> -
                        a comprehensive wellness toolkit tailored to your unique needs and preferences.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">How to Build Your Sanctuary:</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            Drag self-care tokens from the collection
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            Drop them into appropriate sanctuary zones
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            Create a balanced wellness plan
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            Place tokens in at least 4 different zones
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Sanctuary Zones:</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                            <span><strong>Physical:</strong> Body care and movement</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>
                            <span><strong>Emotional:</strong> Feelings and mental health</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                            <span><strong>Social:</strong> Relationships and community</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                            <span><strong>Creative:</strong> Art and self-expression</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-3 h-3 bg-indigo-500 rounded-full mt-1 flex-shrink-0"></div>
                            <span><strong>Intellectual:</strong> Learning and growth</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-3 h-3 bg-pink-500 rounded-full mt-1 flex-shrink-0"></div>
                            <span><strong>Spiritual:</strong> Meaning and purpose</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Goal:</strong> Create a balanced self-care plan by placing at least 2 tokens
                        in 4 different zones. Think about what activities truly nourish your well-being.
                      </p>
                    </div>

                    <div className="flex justify-center pt-4">
                      <Button onClick={startGame} size="lg" className="px-8">
                        Build Your Sanctuary
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Self-Care Sanctuary Builder */}
            {gameState === 'playing' && (
              <motion.div
                key="sanctuary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Sanctuary Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {totalTokensPlaced} tokens placed
                    </span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>

                {/* Sanctuary Zones */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {sanctuaryZones.map((zone) => (
                    <div
                      key={zone.id}
                      className={`min-h-32 p-4 border-2 border-dashed rounded-lg ${zone.color} transition-all`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, zone.id)}
                    >
                      <h3 className="font-medium text-center mb-3">{zone.name}</h3>
                      <div className="space-y-2">
                        {(selectedTokens[zone.id] || []).map((token, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded shadow-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{token.icon}</span>
                              <span className="text-sm font-medium">{token.name}</span>
                            </div>
                            <Button
                              onClick={() => removeToken(zone.id, index)}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        {(selectedTokens[zone.id] || []).length === 0 && (
                          <p className="text-center text-muted-foreground text-sm">
                            Drop self-care tokens here
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Available Tokens */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Self-Care Token Collection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(selfCareTokens).map(([category, tokens]) => (
                      <div key={category} className="mb-6">
                        <h4 className="font-medium mb-3 capitalize">{category} Wellness</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                          {tokens.map((token) => {
                            const isUsed = Object.values(selectedTokens).flat().some(t => t.id === token.id);
                            return (
                              <div
                                key={token.id}
                                draggable={!isUsed}
                                onDragStart={(e) => handleDragStart(e, token, category)}
                                className={`p-3 border rounded-lg text-center cursor-move transition-all ${isUsed
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'hover:shadow-md hover:scale-105 bg-white dark:bg-slate-800'
                                  }`}
                              >
                                <div className="text-2xl mb-1">{token.icon}</div>
                                <div className="text-xs font-medium">{token.name}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Completion Status */}
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-green-800 dark:text-green-200">Sanctuary Status</h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {Object.keys(selectedTokens).filter(zoneId => selectedTokens[zoneId]?.length > 0).length}/4 zones active,
                          {totalTokensPlaced}/12 tokens placed
                        </p>
                      </div>
                      {Object.keys(selectedTokens).filter(zoneId => selectedTokens[zoneId]?.length > 0).length >= 4 &&
                        totalTokensPlaced >= 12 && (
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete!
                          </Badge>
                        )}
                    </div>
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
                      Self-Care Sanctuary Reflection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg">
                      <p className="text-purple-800 dark:text-purple-200 text-center">
                        🏡 Wonderful! You've created your personal self-care sanctuary!
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{formatTime(timeElapsed)}</div>
                        <div className="text-sm text-muted-foreground">Planning Time</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">
                          {totalTokensPlaced}
                        </div>
                        <div className="text-sm text-muted-foreground">Tokens Placed</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{calculateSelfCareScore()}%</div>
                        <div className="text-sm text-muted-foreground">Wellness Score</div>
                      </div>
                    </div>

                    {/* Sanctuary Summary */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Your Self-Care Sanctuary:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(selectedTokens).map(([zoneId, tokens]) => {
                          const zone = sanctuaryZones.find(z => z.id === zoneId);
                          return tokens.length > 0 ? (
                            <div key={zoneId} className="p-3 border rounded-lg">
                              <h5 className="font-medium mb-2">{zone.name}</h5>
                              <div className="flex flex-wrap gap-1">
                                {tokens.map((token, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {token.icon} {token.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="journal" className="text-base font-medium">
                        Reflect on your self-care sanctuary:
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        How will you use this sanctuary in your daily life? What self-care practices
                        resonate most with you, and how will you make time for them?
                      </p>
                      <Textarea
                        id="journal"
                        placeholder="Write about your self-care plan and how you'll nurture your well-being..."
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                        className="min-h-32"
                      />
                    </div>

                    <div className="flex justify-center">
                      <Button onClick={submitJournal} size="lg" className="px-8">
                        Complete Level 5
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
                <Card className="border-purple-500/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                  <CardContent className="p-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>

                    <h2 className="text-3xl font-bold mb-4">🎉 Journey Complete!</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      Congratulations! You've completed all 5 levels of your mental wellness journey.
                      You now have a complete toolkit for managing anxiety, stress, and promoting well-being.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild size="lg">
                        <Link href="/dashboard">
                          Return to Dashboard
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg">
                        <Link href="/games">
                          Replay Levels
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