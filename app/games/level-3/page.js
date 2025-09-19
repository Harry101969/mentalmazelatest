// // 'use client';

// // import { useState, useEffect, useRef } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { ArrowLeft, RotateCcw, CheckCircle, Clock, Target, BookOpen, Eye, Shuffle } from 'lucide-react';
// // import Link from 'next/link';
// // import { Button } from '@/components/ui/button';
// // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Progress } from '@/components/ui/progress';
// // import { Textarea } from '@/components/ui/textarea';
// // import { Label } from '@/components/ui/label';
// // import UserNavbar from '@/components/user-navbar';
// // import { toast } from 'sonner';
// // import { getCognitiveDistortions } from '@/lib/game-patterns';

// // export default function Level3Page() {
// //   const [gameState, setGameState] = useState('instructions'); // instructions, playing, journal, completed
// //   const [mirrorPieces, setMirrorPieces] = useState([]);
// //   const [currentDistortion, setCurrentDistortion] = useState(0);
// //   const [completedDistortions, setCompletedDistortions] = useState([]);
// //   const [startTime, setStartTime] = useState(null);
// //   const [timeElapsed, setTimeElapsed] = useState(0);
// //   const [journalEntry, setJournalEntry] = useState('');
// //   const [draggedPiece, setDraggedPiece] = useState(null);
// //   const timerRef = useRef(null);
// //   const [cognitiveDistortions, setCognitiveDistortions] = useState([]);

// //   useEffect(() => {
// //     // Get random cognitive distortions for this session
// //     const distortions = getCognitiveDistortions(3, 'beginner');
// //     setCognitiveDistortions(distortions);
// //   }, []);

// //   useEffect(() => {
// //     initializeGame();
// //     return () => {
// //       if (timerRef.current) {
// //         clearInterval(timerRef.current);
// //       }
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

// //   const initializeGame = () => {
// //     const firstDistortion = cognitiveDistortions[0];
// //     const shuffledPieces = [...firstDistortion.pieces].sort(() => Math.random() - 0.5);
// //     setMirrorPieces(shuffledPieces);
// //     setCurrentDistortion(0);
// //     setCompletedDistortions([]);
// //   };

// //   const startGame = () => {
// //     setGameState('playing');
// //     setStartTime(Date.now());
// //   };

// //   const handleDragStart = (e, piece) => {
// //     setDraggedPiece(piece);
// //     e.dataTransfer.effectAllowed = 'move';
// //   };

// //   const handleDragOver = (e) => {
// //     e.preventDefault();
// //     e.dataTransfer.dropEffect = 'move';
// //   };

// //   const handleDrop = (e, targetPosition) => {
// //     e.preventDefault();

// //     if (!draggedPiece) return;

// //     // Update piece position
// //     setMirrorPieces(prev => prev.map(piece =>
// //       piece.id === draggedPiece.id
// //         ? { ...piece, currentPosition: targetPosition }
// //         : piece
// //     ));

// //     setDraggedPiece(null);
// //     checkCompletion();
// //   };

// //   const checkCompletion = () => {
// //     const currentDistortionData = cognitiveDistortions[currentDistortion];
// //     const allPiecesPlaced = mirrorPieces.every(piece => piece.currentPosition);

// //     if (allPiecesPlaced) {
// //       // Check if pieces are in correct positions
// //       const correctPlacements = mirrorPieces.filter(piece =>
// //         piece.currentPosition === piece.position
// //       ).length;

// //       if (correctPlacements === mirrorPieces.length) {
// //         // Distortion completed correctly
// //         const completedDistortion = {
// //           ...currentDistortionData,
// //           completedAt: Date.now(),
// //           timeSpent: Date.now() - startTime
// //         };

// //         setCompletedDistortions(prev => [...prev, completedDistortion]);
// //         toast.success('Distortion corrected! Well done on reframing that thought.');

// //         // Move to next distortion or complete level
// //         if (currentDistortion + 1 < cognitiveDistortions.length) {
// //           setTimeout(() => {
// //             const nextDistortion = cognitiveDistortions[currentDistortion + 1];
// //             const shuffledPieces = [...nextDistortion.pieces].sort(() => Math.random() - 0.5);
// //             setMirrorPieces(shuffledPieces);
// //             setCurrentDistortion(prev => prev + 1);
// //           }, 2000);
// //         } else {
// //           setTimeout(() => {
// //             setGameState('journal');
// //           }, 2000);
// //         }
// //       } else {
// //         toast.error('Not quite right. Think about how to reframe this thought more positively.');
// //       }
// //     }
// //   };

// //   const shufflePieces = () => {
// //     const currentDistortionData = cognitiveDistortions[currentDistortion];
// //     const shuffledPieces = [...currentDistortionData.pieces].sort(() => Math.random() - 0.5);
// //     setMirrorPieces(shuffledPieces.map(piece => ({ ...piece, currentPosition: null })));
// //   };

// //   const submitJournal = async () => {
// //     try {
// //       const gameData = {
// //         level: 3,
// //         completed: true,
// //         score: Math.round((completedDistortions.length / cognitiveDistortions.length) * 100),
// //         timeSpent: Math.round(timeElapsed / 1000),
// //         distortionsCompleted: completedDistortions.length,
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
// //         toast.success('Level 3 completed! Your cognitive reframing skills are improving.');
// //       } else {
// //         toast.error('Failed to save progress. Please try again.');
// //       }
// //     } catch (error) {
// //       console.error('Error completing level:', error);
// //       toast.error('Something went wrong. Please try again.');
// //     }
// //   };

// //   const formatTime = (ms) => {
// //     const seconds = Math.floor(ms / 1000);
// //     const minutes = Math.floor(seconds / 60);
// //     return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
// //   };

// //   const getPieceColor = (piece) => {
// //     switch (piece.position) {
// //       case 'correct': return 'bg-green-500 text-white';
// //       case 'distorted': return 'bg-red-500 text-white';
// //       case 'reframe': return 'bg-blue-500 text-white';
// //       default: return 'bg-gray-500 text-white';
// //     }
// //   };

// //   const getDropZoneColor = (position) => {
// //     switch (position) {
// //       case 'correct': return 'border-green-300 bg-green-50 dark:bg-green-950';
// //       case 'distorted': return 'border-red-300 bg-red-50 dark:bg-red-950';
// //       case 'reframe': return 'border-blue-300 bg-blue-50 dark:bg-blue-950';
// //       default: return 'border-gray-300 bg-gray-50 dark:bg-gray-950';
// //     }
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
// //                 <h1 className="text-3xl font-bold">Level 3: Distorted Mirrors</h1>
// //                 <p className="text-muted-foreground">Correct cognitive distortions through puzzle solving</p>
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
// //                   <span>{completedDistortions.length}/{cognitiveDistortions.length}</span>
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
// //                       <Eye className="h-5 w-5" />
// //                       Welcome to the Distorted Mirrors
// //                     </CardTitle>
// //                   </CardHeader>
// //                   <CardContent className="space-y-6">
// //                     <div className="prose prose-sm max-w-none">
// //                       <p className="text-lg leading-relaxed">
// //                         Cognitive distortions are negative thought patterns that can worsen anxiety and depression.
// //                         In this level, you'll practice <strong>cognitive restructuring</strong> by rearranging
// //                         distorted thoughts into more balanced, realistic perspectives.
// //                       </p>
// //                     </div>

// //                     <div className="grid md:grid-cols-2 gap-6">
// //                       <div>
// //                         <h3 className="font-semibold mb-3">How to Play:</h3>
// //                         <ul className="space-y-2 text-sm">
// //                           <li className="flex items-start gap-2">
// //                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
// //                             Drag mirror pieces from the collection area
// //                           </li>
// //                           <li className="flex items-start gap-2">
// //                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
// //                             Drop them into the correct mirror sections
// //                           </li>
// //                           <li className="flex items-start gap-2">
// //                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
// //                             Green = Facts, Red = Distortions, Blue = Reframes
// //                           </li>
// //                           <li className="flex items-start gap-2">
// //                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
// //                             Complete all distortions to unlock reflection
// //                           </li>
// //                         </ul>
// //                       </div>

// //                       <div>
// //                         <h3 className="font-semibold mb-3">Common Distortions:</h3>
// //                         <ul className="space-y-2 text-sm">
// //                           <li className="flex items-start gap-2">
// //                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
// //                             All-or-Nothing Thinking
// //                           </li>
// //                           <li className="flex items-start gap-2">
// //                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
// //                             Mind Reading
// //                           </li>
// //                           <li className="flex items-start gap-2">
// //                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
// //                             Catastrophizing
// //                           </li>
// //                           <li className="flex items-start gap-2">
// //                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
// //                             Emotional Reasoning
// //                           </li>
// //                         </ul>
// //                       </div>
// //                     </div>

// //                     <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
// //                       <p className="text-sm text-purple-800 dark:text-purple-200">
// //                         <strong>Remember:</strong> The goal isn't to eliminate all negative thoughts,
// //                         but to recognize when they're distorted and practice more balanced thinking.
// //                       </p>
// //                     </div>

// //                     <div className="flex justify-center pt-4">
// //                       <Button onClick={startGame} size="lg" className="px-8">
// //                         Enter the Mirror Hall
// //                       </Button>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               </motion.div>
// //             )}

// //             {/* Mirror Puzzle Game */}
// //             {gameState === 'playing' && (
// //               <motion.div
// //                 key="mirrors"
// //                 initial={{ opacity: 0 }}
// //                 animate={{ opacity: 1 }}
// //                 exit={{ opacity: 0 }}
// //                 className="space-y-6"
// //               >
// //                 {/* Progress */}
// //                 <div className="mb-6">
// //                   <div className="flex items-center justify-between mb-2">
// //                     <span className="text-sm font-medium">Distortion Progress</span>
// //                     <span className="text-sm text-muted-foreground">
// //                       {completedDistortions.length}/{cognitiveDistortions.length} completed
// //                     </span>
// //                   </div>
// //                   <Progress value={(completedDistortions.length / cognitiveDistortions.length) * 100} className="h-2" />
// //                 </div>

// //                 {/* Current Distortion */}
// //                 <Card className="border-2 border-purple-200 dark:border-purple-700">
// //                   <CardHeader>
// //                     <CardTitle className="flex items-center justify-between">
// //                       <span>Distortion {currentDistortion + 1}: {cognitiveDistortions[currentDistortion]?.type}</span>
// //                       <Button onClick={shufflePieces} variant="outline" size="sm">
// //                         <Shuffle className="w-4 h-4 mr-1" />
// //                         Shuffle
// //                       </Button>
// //                     </CardTitle>
// //                   </CardHeader>
// //                   <CardContent className="space-y-6">
// //                     {/* Original Distorted Thought */}
// //                     <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-700">
// //                       <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">Distorted Thought:</h3>
// //                       <p className="text-red-700 dark:text-red-300 italic">
// //                         "{cognitiveDistortions[currentDistortion]?.distorted}"
// //                       </p>
// //                     </div>

// //                     {/* Mirror Assembly Area */}
// //                     <div className="grid grid-cols-3 gap-4">
// //                       {/* Facts/Reality */}
// //                       <div
// //                         className={`min-h-32 p-4 border-2 border-dashed rounded-lg ${getDropZoneColor('correct')}`}
// //                         onDragOver={handleDragOver}
// //                         onDrop={(e) => handleDrop(e, 'correct')}
// //                       >
// //                         <h4 className="font-medium text-green-800 dark:text-green-200 mb-3 text-center">
// //                           Facts/Reality
// //                         </h4>
// //                         <div className="space-y-2">
// //                           {mirrorPieces
// //                             .filter(piece => piece.currentPosition === 'correct')
// //                             .map((piece) => (
// //                               <div
// //                                 key={piece.id}
// //                                 className="p-2 bg-green-500 text-white rounded text-sm text-center"
// //                               >
// //                                 {piece.text}
// //                               </div>
// //                             ))}
// //                         </div>
// //                       </div>

// //                       {/* Distorted Thoughts */}
// //                       <div
// //                         className={`min-h-32 p-4 border-2 border-dashed rounded-lg ${getDropZoneColor('distorted')}`}
// //                         onDragOver={handleDragOver}
// //                         onDrop={(e) => handleDrop(e, 'distorted')}
// //                       >
// //                         <h4 className="font-medium text-red-800 dark:text-red-200 mb-3 text-center">
// //                           Distorted Thinking
// //                         </h4>
// //                         <div className="space-y-2">
// //                           {mirrorPieces
// //                             .filter(piece => piece.currentPosition === 'distorted')
// //                             .map((piece) => (
// //                               <div
// //                                 key={piece.id}
// //                                 className="p-2 bg-red-500 text-white rounded text-sm text-center"
// //                               >
// //                                 {piece.text}
// //                               </div>
// //                             ))}
// //                         </div>
// //                       </div>

// //                       {/* Reframed Thoughts */}
// //                       <div
// //                         className={`min-h-32 p-4 border-2 border-dashed rounded-lg ${getDropZoneColor('reframe')}`}
// //                         onDragOver={handleDragOver}
// //                         onDrop={(e) => handleDrop(e, 'reframe')}
// //                       >
// //                         <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3 text-center">
// //                           Balanced Reframe
// //                         </h4>
// //                         <div className="space-y-2">
// //                           {mirrorPieces
// //                             .filter(piece => piece.currentPosition === 'reframe')
// //                             .map((piece) => (
// //                               <div
// //                                 key={piece.id}
// //                                 className="p-2 bg-blue-500 text-white rounded text-sm text-center"
// //                               >
// //                                 {piece.text}
// //                               </div>
// //                             ))}
// //                         </div>
// //                       </div>
// //                     </div>

// //                     {/* Available Pieces */}
// //                     <div className="p-4 bg-muted/50 rounded-lg">
// //                       <h4 className="font-medium mb-3 text-center">Mirror Pieces</h4>
// //                       <div className="flex flex-wrap gap-2 justify-center">
// //                         {mirrorPieces
// //                           .filter(piece => !piece.currentPosition)
// //                           .map((piece) => (
// //                             <div
// //                               key={piece.id}
// //                               draggable
// //                               onDragStart={(e) => handleDragStart(e, piece)}
// //                               className={`p-3 ${getPieceColor(piece)} rounded-lg cursor-move hover:shadow-lg transition-all transform hover:scale-105 text-sm font-medium`}
// //                             >
// //                               {piece.text}
// //                             </div>
// //                           ))}
// //                       </div>
// //                     </div>

// //                     {/* Target Reframed Thought */}
// //                     <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-700">
// //                       <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Target Reframe:</h3>
// //                       <p className="text-blue-700 dark:text-blue-300 italic">
// //                         "{cognitiveDistortions[currentDistortion]?.reframed}"
// //                       </p>
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
// //                       Cognitive Restructuring Reflection
// //                     </CardTitle>
// //                   </CardHeader>
// //                   <CardContent className="space-y-6">
// //                     <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
// //                       <p className="text-purple-800 dark:text-purple-200 text-center">
// //                         🎯 Excellent work! You've successfully corrected {completedDistortions.length} cognitive distortions!
// //                       </p>
// //                     </div>

// //                     <div className="grid grid-cols-3 gap-4 text-center">
// //                       <div className="p-4 bg-muted/50 rounded-lg">
// //                         <div className="text-2xl font-bold text-primary">{formatTime(timeElapsed)}</div>
// //                         <div className="text-sm text-muted-foreground">Time Taken</div>
// //                       </div>
// //                       <div className="p-4 bg-muted/50 rounded-lg">
// //                         <div className="text-2xl font-bold text-secondary">{completedDistortions.length}</div>
// //                         <div className="text-sm text-muted-foreground">Distortions Corrected</div>
// //                       </div>
// //                       <div className="p-4 bg-muted/50 rounded-lg">
// //                         <div className="text-2xl font-bold text-green-600">
// //                           {Math.round((completedDistortions.length / cognitiveDistortions.length) * 100)}%
// //                         </div>
// //                         <div className="text-sm text-muted-foreground">Accuracy</div>
// //                       </div>
// //                     </div>

// //                     <div className="space-y-4">
// //                       <Label htmlFor="journal" className="text-base font-medium">
// //                         Reflect on your cognitive patterns:
// //                       </Label>
// //                       <p className="text-sm text-muted-foreground">
// //                         Think about your own thought patterns. Can you identify any cognitive distortions
// //                         you experience? How might you reframe them using what you've learned?
// //                       </p>
// //                       <Textarea
// //                         id="journal"
// //                         placeholder="Write about any distorted thoughts you've noticed in your own thinking and how you might reframe them..."
// //                         value={journalEntry}
// //                         onChange={(e) => setJournalEntry(e.target.value)}
// //                         className="min-h-32"
// //                       />
// //                     </div>

// //                     <div className="flex justify-center">
// //                       <Button onClick={submitJournal} size="lg" className="px-8">
// //                         Complete Level 3
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
// //                       className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
// //                     >
// //                       <CheckCircle className="w-10 h-10 text-white" />
// //                     </motion.div>

// //                     <h2 className="text-3xl font-bold mb-4">Level 3 Complete!</h2>
// //                     <p className="text-lg text-muted-foreground mb-8">
// //                       You've mastered cognitive restructuring! The mirrors now reflect
// //                       balanced, realistic thoughts instead of distorted perceptions.
// //                     </p>

// //                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
// //                       <Button asChild size="lg">
// //                         <Link href="/games/level-4">
// //                           Continue to Level 4
// //                         </Link>
// //                       </Button>
// //                       <Button asChild variant="outline" size="lg">
// //                         <Link href="/games">
// //                           Back to Levels
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
// import { ArrowLeft, RotateCcw, CheckCircle, Clock, Target, BookOpen, Eye, Shuffle } from 'lucide-react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import UserNavbar from '@/components/user-navbar';
// import { toast } from 'sonner';
// import { getCognitiveDistortions } from '@/lib/game-patterns';

// export default function Level3Page() {
//   const [gameState, setGameState] = useState('instructions'); // instructions, playing, journal, completed
//   const [mirrorPieces, setMirrorPieces] = useState([]);
//   const [currentDistortion, setCurrentDistortion] = useState(0);
//   const [completedDistortions, setCompletedDistortions] = useState([]);
//   const [startTime, setStartTime] = useState(null);
//   const [timeElapsed, setTimeElapsed] = useState(0);
//   const [journalEntry, setJournalEntry] = useState('');
//   const [draggedPiece, setDraggedPiece] = useState(null);
//   const timerRef = useRef(null);
//   const [cognitiveDistortions, setCognitiveDistortions] = useState([]);

//   useEffect(() => {
//     // Get random cognitive distortions for this session
//     const distortions = getCognitiveDistortions(3, 'beginner');
//     setCognitiveDistortions(distortions);
//   }, []);

//   useEffect(() => {
//     initializeGame();
//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
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

//   const initializeGame = () => {
//     const firstDistortion = cognitiveDistortions[0];
//     const shuffledPieces = [...firstDistortion.pieces].sort(() => Math.random() - 0.5);
//     setMirrorPieces(shuffledPieces);
//     setCurrentDistortion(0);
//     setCompletedDistortions([]);
//   };

//   const startGame = () => {
//     setGameState('playing');
//     setStartTime(Date.now());
//   };

//   const handleDragStart = (e, piece) => {
//     setDraggedPiece(piece);
//     e.dataTransfer.effectAllowed = 'move';
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = 'move';
//   };

//   const handleDrop = (e, targetPosition) => {
//     e.preventDefault();

//     if (!draggedPiece) return;

//     // Update piece position
//     setMirrorPieces(prev => prev.map(piece =>
//       piece.id === draggedPiece.id
//         ? { ...piece, currentPosition: targetPosition }
//         : piece
//     ));

//     setDraggedPiece(null);
//     checkCompletion();
//   };

//   const checkCompletion = () => {
//     const currentDistortionData = cognitiveDistortions[currentDistortion];
//     const allPiecesPlaced = mirrorPieces.every(piece => piece.currentPosition);

//     if (allPiecesPlaced) {
//       // Check if pieces are in correct positions
//       const correctPlacements = mirrorPieces.filter(piece =>
//         piece.currentPosition === piece.position
//       ).length;

//       if (correctPlacements === mirrorPieces.length) {
//         // Distortion completed correctly
//         const completedDistortion = {
//           ...currentDistortionData,
//           completedAt: Date.now(),
//           timeSpent: Date.now() - startTime
//         };

//         setCompletedDistortions(prev => [...prev, completedDistortion]);
//         toast.success('Distortion corrected! Well done on reframing that thought.');

//         // Move to next distortion or complete level
//         if (currentDistortion + 1 < cognitiveDistortions.length) {
//           setTimeout(() => {
//             const nextDistortion = cognitiveDistortions[currentDistortion + 1];
//             const shuffledPieces = [...nextDistortion.pieces].sort(() => Math.random() - 0.5);
//             setMirrorPieces(shuffledPieces);
//             setCurrentDistortion(prev => prev + 1);
//           }, 2000);
//         } else {
//           setTimeout(() => {
//             setGameState('journal');
//           }, 2000);
//         }
//       } else {
//         toast.error('Not quite right. Think about how to reframe this thought more positively.');
//       }
//     }
//   };

//   const shufflePieces = () => {
//     const currentDistortionData = cognitiveDistortions[currentDistortion];
//     const shuffledPieces = [...currentDistortionData.pieces].sort(() => Math.random() - 0.5);
//     setMirrorPieces(shuffledPieces.map(piece => ({ ...piece, currentPosition: null })));
//   };

//   const submitJournal = async () => {
//     try {
//       const gameData = {
//         level: 3,
//         completed: true,
//         score: Math.round((completedDistortions.length / cognitiveDistortions.length) * 100),
//         timeSpent: Math.round(timeElapsed / 1000),
//         distortionsCompleted: completedDistortions.length,
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
//         toast.success('Level 3 completed! Your cognitive reframing skills are improving.');
//       } else {
//         toast.error('Failed to save progress. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error completing level:', error);
//       toast.error('Something went wrong. Please try again.');
//     }
//   };

//   const formatTime = (ms) => {
//     const seconds = Math.floor(ms / 1000);
//     const minutes = Math.floor(seconds / 60);
//     return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
//   };

//   const getPieceColor = (piece) => {
//     switch (piece.position) {
//       case 'correct': return 'bg-green-500 text-white';
//       case 'distorted': return 'bg-red-500 text-white';
//       case 'reframe': return 'bg-blue-500 text-white';
//       default: return 'bg-gray-500 text-white';
//     }
//   };

//   const getDropZoneColor = (position) => {
//     switch (position) {
//       case 'correct': return 'border-green-300 bg-green-50 dark:bg-green-950';
//       case 'distorted': return 'border-red-300 bg-red-50 dark:bg-red-950';
//       case 'reframe': return 'border-blue-300 bg-blue-50 dark:bg-blue-950';
//       default: return 'border-gray-300 bg-gray-50 dark:bg-gray-950';
//     }
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
//                 <h1 className="text-3xl font-bold">Level 3: Distorted Mirrors</h1>
//                 <p className="text-muted-foreground">Correct cognitive distortions through puzzle solving</p>
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
//                   <span>{completedDistortions.length}/{cognitiveDistortions.length}</span>
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
//                       <Eye className="h-5 w-5" />
//                       Welcome to the Distorted Mirrors
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div className="prose prose-sm max-w-none">
//                       <p className="text-lg leading-relaxed">
//                         Cognitive distortions are negative thought patterns that can worsen anxiety and depression.
//                         In this level, you'll practice <strong>cognitive restructuring</strong> by rearranging
//                         distorted thoughts into more balanced, realistic perspectives.
//                       </p>
//                     </div>

//                     <div className="grid md:grid-cols-2 gap-6">
//                       <div>
//                         <h3 className="font-semibold mb-3">How to Play:</h3>
//                         <ul className="space-y-2 text-sm">
//                           <li className="flex items-start gap-2">
//                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
//                             Drag mirror pieces from the collection area
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
//                             Drop them into the correct mirror sections
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
//                             Green = Facts, Red = Distortions, Blue = Reframes
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
//                             Complete all distortions to unlock reflection
//                           </li>
//                         </ul>
//                       </div>

//                       <div>
//                         <h3 className="font-semibold mb-3">Common Distortions:</h3>
//                         <ul className="space-y-2 text-sm">
//                           <li className="flex items-start gap-2">
//                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
//                             All-or-Nothing Thinking
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
//                             Mind Reading
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
//                             Catastrophizing
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
//                             Emotional Reasoning
//                           </li>
//                         </ul>
//                       </div>
//                     </div>

//                     <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
//                       <p className="text-sm text-purple-800 dark:text-purple-200">
//                         <strong>Remember:</strong> The goal isn't to eliminate all negative thoughts,
//                         but to recognize when they're distorted and practice more balanced thinking.
//                       </p>
//                     </div>

//                     <div className="flex justify-center pt-4">
//                       <Button onClick={startGame} size="lg" className="px-8">
//                         Enter the Mirror Hall
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             )}

//             {/* Mirror Puzzle Game */}
//             {gameState === 'playing' && (
//               <motion.div
//                 key="mirrors"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="space-y-6"
//               >
//                 {/* Progress */}
//                 <div className="mb-6">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium">Distortion Progress</span>
//                     <span className="text-sm text-muted-foreground">
//                       {completedDistortions.length}/{cognitiveDistortions.length} completed
//                     </span>
//                   </div>
//                   <Progress value={(completedDistortions.length / cognitiveDistortions.length) * 100} className="h-2" />
//                 </div>

//                 {/* Current Distortion */}
//                 <Card className="border-2 border-purple-200 dark:border-purple-700">
//                   <CardHeader>
//                     <CardTitle className="flex items-center justify-between">
//                       <span>Distortion {currentDistortion + 1}: {cognitiveDistortions[currentDistortion]?.type}</span>
//                       <Button onClick={shufflePieces} variant="outline" size="sm">
//                         <Shuffle className="w-4 h-4 mr-1" />
//                         Shuffle
//                       </Button>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     {/* Original Distorted Thought */}
//                     <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-700">
//                       <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">Distorted Thought:</h3>
//                       <p className="text-red-700 dark:text-red-300 italic">
//                         "{cognitiveDistortions[currentDistortion]?.distorted}"
//                       </p>
//                     </div>

//                     {/* Mirror Assembly Area */}
//                     <div className="grid grid-cols-3 gap-4">
//                       {/* Facts/Reality */}
//                       <div
//                         className={`min-h-32 p-4 border-2 border-dashed rounded-lg ${getDropZoneColor('correct')}`}
//                         onDragOver={handleDragOver}
//                         onDrop={(e) => handleDrop(e, 'correct')}
//                       >
//                         <h4 className="font-medium text-green-800 dark:text-green-200 mb-3 text-center">
//                           Facts/Reality
//                         </h4>
//                         <div className="space-y-2">
//                           {mirrorPieces
//                             .filter(piece => piece.currentPosition === 'correct')
//                             .map((piece) => (
//                               <div
//                                 key={piece.id}
//                                 className="p-2 bg-green-500 text-white rounded text-sm text-center"
//                               >
//                                 {piece.text}
//                               </div>
//                             ))}
//                         </div>
//                       </div>

//                       {/* Distorted Thoughts */}
//                       <div
//                         className={`min-h-32 p-4 border-2 border-dashed rounded-lg ${getDropZoneColor('distorted')}`}
//                         onDragOver={handleDragOver}
//                         onDrop={(e) => handleDrop(e, 'distorted')}
//                       >
//                         <h4 className="font-medium text-red-800 dark:text-red-200 mb-3 text-center">
//                           Distorted Thinking
//                         </h4>
//                         <div className="space-y-2">
//                           {mirrorPieces
//                             .filter(piece => piece.currentPosition === 'distorted')
//                             .map((piece) => (
//                               <div
//                                 key={piece.id}
//                                 className="p-2 bg-red-500 text-white rounded text-sm text-center"
//                               >
//                                 {piece.text}
//                               </div>
//                             ))}
//                         </div>
//                       </div>

//                       {/* Reframed Thoughts */}
//                       <div
//                         className={`min-h-32 p-4 border-2 border-dashed rounded-lg ${getDropZoneColor('reframe')}`}
//                         onDragOver={handleDragOver}
//                         onDrop={(e) => handleDrop(e, 'reframe')}
//                       >
//                         <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3 text-center">
//                           Balanced Reframe
//                         </h4>
//                         <div className="space-y-2">
//                           {mirrorPieces
//                             .filter(piece => piece.currentPosition === 'reframe')
//                             .map((piece) => (
//                               <div
//                                 key={piece.id}
//                                 className="p-2 bg-blue-500 text-white rounded text-sm text-center"
//                               >
//                                 {piece.text}
//                               </div>
//                             ))}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Available Pieces */}
//                     <div className="p-4 bg-muted/50 rounded-lg">
//                       <h4 className="font-medium mb-3 text-center">Mirror Pieces</h4>
//                       <div className="flex flex-wrap gap-2 justify-center">
//                         {mirrorPieces
//                           .filter(piece => !piece.currentPosition)
//                           .map((piece) => (
//                             <div
//                               key={piece.id}
//                               draggable
//                               onDragStart={(e) => handleDragStart(e, piece)}
//                               className={`p-3 ${getPieceColor(piece)} rounded-lg cursor-move hover:shadow-lg transition-all transform hover:scale-105 text-sm font-medium`}
//                             >
//                               {piece.text}
//                             </div>
//                           ))}
//                       </div>
//                     </div>

//                     {/* Target Reframed Thought */}
//                     <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-700">
//                       <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Target Reframe:</h3>
//                       <p className="text-blue-700 dark:text-blue-300 italic">
//                         "{cognitiveDistortions[currentDistortion]?.reframed}"
//                       </p>
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
//                       Cognitive Restructuring Reflection
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
//                       <p className="text-purple-800 dark:text-purple-200 text-center">
//                         🎯 Excellent work! You've successfully corrected {completedDistortions.length} cognitive distortions!
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 text-center">
//                       <div className="p-4 bg-muted/50 rounded-lg">
//                         <div className="text-2xl font-bold text-primary">{formatTime(timeElapsed)}</div>
//                         <div className="text-sm text-muted-foreground">Time Taken</div>
//                       </div>
//                       <div className="p-4 bg-muted/50 rounded-lg">
//                         <div className="text-2xl font-bold text-secondary">{completedDistortions.length}</div>
//                         <div className="text-sm text-muted-foreground">Distortions Corrected</div>
//                       </div>
//                       <div className="p-4 bg-muted/50 rounded-lg">
//                         <div className="text-2xl font-bold text-green-600">
//                           {Math.round((completedDistortions.length / cognitiveDistortions.length) * 100)}%
//                         </div>
//                         <div className="text-sm text-muted-foreground">Accuracy</div>
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <Label htmlFor="journal" className="text-base font-medium">
//                         Reflect on your cognitive patterns:
//                       </Label>
//                       <p className="text-sm text-muted-foreground">
//                         Think about your own thought patterns. Can you identify any cognitive distortions
//                         you experience? How might you reframe them using what you've learned?
//                       </p>
//                       <Textarea
//                         id="journal"
//                         placeholder="Write about any distorted thoughts you've noticed in your own thinking and how you might reframe them..."
//                         value={journalEntry}
//                         onChange={(e) => setJournalEntry(e.target.value)}
//                         className="min-h-32"
//                       />
//                     </div>

//                     <div className="flex justify-center">
//                       <Button onClick={submitJournal} size="lg" className="px-8">
//                         Complete Level 3
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
//                       className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
//                     >
//                       <CheckCircle className="w-10 h-10 text-white" />
//                     </motion.div>

//                     <h2 className="text-3xl font-bold mb-4">Level 3 Complete!</h2>
//                     <p className="text-lg text-muted-foreground mb-8">
//                       You've mastered cognitive restructuring! The mirrors now reflect
//                       balanced, realistic thoughts instead of distorted perceptions.
//                     </p>

//                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                       <Button asChild size="lg">
//                         <Link href="/games/level-4">
//                           Continue to Level 4
//                         </Link>
//                       </Button>
//                       <Button asChild variant="outline" size="lg">
//                         <Link href="/games">
//                           Back to Levels
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
import { ArrowLeft, RotateCcw, CheckCircle, Clock, Target, BookOpen, Eye, Shuffle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import UserNavbar from '@/components/user-navbar';
import { toast } from 'sonner';
import { getCognitiveDistortions } from '@/lib/game-patterns';

export default function Level3Page() {
  const [gameState, setGameState] = useState('instructions'); // instructions, playing, journal, completed
  const [mirrorPieces, setMirrorPieces] = useState([]);
  const [currentDistortion, setCurrentDistortion] = useState(0);
  const [completedDistortions, setCompletedDistortions] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [cognitiveDistortions, setCognitiveDistortions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    // Initialize cognitive distortions
    const distortions = getCognitiveDistortions(3, 'beginner');
    setCognitiveDistortions(distortions);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && cognitiveDistortions.length > 0) {
      initializeGame();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLoading, cognitiveDistortions]);

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

  const initializeGame = () => {
    if (cognitiveDistortions.length === 0) return;

    const firstDistortion = cognitiveDistortions[0];
    if (firstDistortion && firstDistortion.pieces) {
      const shuffledPieces = [...firstDistortion.pieces].sort(() => Math.random() - 0.5);
      setMirrorPieces(shuffledPieces);
      setCurrentDistortion(0);
      setCompletedDistortions([]);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
  };

  const handleDragStart = (e, piece) => {
    setDraggedPiece(piece);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetPosition) => {
    e.preventDefault();

    if (!draggedPiece) return;

    // Update piece position
    setMirrorPieces(prev => prev.map(piece =>
      piece.id === draggedPiece.id
        ? { ...piece, currentPosition: targetPosition }
        : piece
    ));

    setDraggedPiece(null);
    checkCompletion();
  };

  const checkCompletion = () => {
    if (cognitiveDistortions.length === 0 || currentDistortion >= cognitiveDistortions.length) return;

    const currentDistortionData = cognitiveDistortions[currentDistortion];
    const allPiecesPlaced = mirrorPieces.every(piece => piece.currentPosition);

    if (allPiecesPlaced) {
      // Check if pieces are in correct positions
      const correctPlacements = mirrorPieces.filter(piece =>
        piece.currentPosition === piece.position
      ).length;

      if (correctPlacements === mirrorPieces.length) {
        // Distortion completed correctly
        const completedDistortion = {
          ...currentDistortionData,
          completedAt: Date.now(),
          timeSpent: Date.now() - startTime
        };

        setCompletedDistortions(prev => [...prev, completedDistortion]);
        toast.success('Distortion corrected! Well done on reframing that thought.');

        // Move to next distortion or complete level
        if (currentDistortion + 1 < cognitiveDistortions.length) {
          setTimeout(() => {
            const nextDistortion = cognitiveDistortions[currentDistortion + 1];
            if (nextDistortion && nextDistortion.pieces) {
              const shuffledPieces = [...nextDistortion.pieces].sort(() => Math.random() - 0.5);
              setMirrorPieces(shuffledPieces);
              setCurrentDistortion(prev => prev + 1);
            }
          }, 2000);
        } else {
          setTimeout(() => {
            setGameState('journal');
          }, 2000);
        }
      } else {
        toast.error('Not quite right. Think about how to reframe this thought more positively.');
      }
    }
  };

  const shufflePieces = () => {
    if (cognitiveDistortions.length === 0 || currentDistortion >= cognitiveDistortions.length) return;

    const currentDistortionData = cognitiveDistortions[currentDistortion];
    if (currentDistortionData && currentDistortionData.pieces) {
      const shuffledPieces = [...currentDistortionData.pieces].sort(() => Math.random() - 0.5);
      setMirrorPieces(shuffledPieces.map(piece => ({ ...piece, currentPosition: null })));
    }
  };

  const submitJournal = async () => {
    try {
      const gameData = {
        level: 3,
        completed: true,
        score: Math.round((completedDistortions.length / cognitiveDistortions.length) * 100),
        timeSpent: Math.round(timeElapsed / 1000),
        distortionsCompleted: completedDistortions.length,
        journalEntry
      };

      // Mock API call - replace with actual API when ready
      console.log('Game data to save:', gameData);

      // Simulate API success
      setTimeout(() => {
        setGameState('completed');
        toast.success('Level 3 completed! Your cognitive reframing skills are improving.');
      }, 1000);

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

  const getPieceColor = (piece) => {
    switch (piece.position) {
      case 'correct': return 'bg-green-500 text-white';
      case 'distorted': return 'bg-red-500 text-white';
      case 'reframe': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDropZoneColor = (position) => {
    switch (position) {
      case 'correct': return 'border-green-300 bg-green-50 dark:bg-green-950';
      case 'distorted': return 'border-red-300 bg-red-50 dark:bg-red-950';
      case 'reframe': return 'border-blue-300 bg-blue-50 dark:bg-blue-950';
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-950';
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <UserNavbar />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state if no distortions loaded
  if (cognitiveDistortions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <UserNavbar />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-center min-h-screen">
              <Card className="max-w-md">
                <CardContent className="p-6 text-center">
                  <h2 className="text-xl font-bold mb-4">Unable to Load Game</h2>
                  <p className="text-muted-foreground mb-4">
                    There was an issue loading the cognitive distortions. Please try again.
                  </p>
                  <Button asChild>
                    <Link href="/games">Back to Games</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentDistortionData = cognitiveDistortions[currentDistortion];

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
                <h1 className="text-3xl font-bold">Level 3: Distorted Mirrors</h1>
                <p className="text-muted-foreground">Correct cognitive distortions through puzzle solving</p>
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
                  <span>{completedDistortions.length}/{cognitiveDistortions.length}</span>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          {gameState === 'instructions' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-600">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Welcome to the Distorted Mirrors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-lg leading-relaxed">
                      Cognitive distortions are negative thought patterns that can worsen anxiety and depression.
                      In this level, you&apos;ll practice <strong>cognitive restructuring</strong> by rearranging
                      distorted thoughts into more balanced, realistic perspectives.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">How to Play:</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          Drag mirror pieces from the collection area
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          Drop them into the correct mirror sections
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          Green = Facts, Red = Distortions, Blue = Reframes
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          Complete all distortions to unlock reflection
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Common Distortions:</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          All-or-Nothing Thinking
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Mind Reading
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Catastrophizing
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Emotional Reasoning
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      <strong>Remember:</strong> The goal isn&apos;t to eliminate all negative thoughts,
                      but to recognize when they&apos;re distorted and practice more balanced thinking.
                    </p>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button onClick={startGame} size="lg" className="px-8">
                      Enter the Mirror Hall
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mirror Puzzle Game */}
          {gameState === 'playing' && currentDistortionData && (
            <div className="space-y-6 animate-in fade-in duration-600">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Distortion Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {completedDistortions.length}/{cognitiveDistortions.length} completed
                  </span>
                </div>
                <Progress value={(completedDistortions.length / cognitiveDistortions.length) * 100} className="h-2" />
              </div>

              {/* Current Distortion */}
              <Card className="border-2 border-purple-200 dark:border-purple-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Distortion {currentDistortion + 1}: {currentDistortionData.type}</span>
                    <Button onClick={shufflePieces} variant="outline" size="sm">
                      <Shuffle className="w-4 h-4 mr-1" />
                      Shuffle
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Original Distorted Thought */}
                  <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-700">
                    <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">Distorted Thought:</h3>
                    <p className="text-red-700 dark:text-red-300 italic">
                      &quot;{currentDistortionData.distorted}&quot;
                    </p>
                  </div>

                  {/* Mirror Assembly Area */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Facts/Reality */}
                    <div
                      className={`min-h-32 p-4 border-2 border-dashed rounded-lg ${getDropZoneColor('correct')}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'correct')}
                    >
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-3 text-center">
                        Facts/Reality
                      </h4>
                      <div className="space-y-2">
                        {mirrorPieces
                          .filter(piece => piece.currentPosition === 'correct')
                          .map((piece) => (
                            <div
                              key={piece.id}
                              className="p-2 bg-green-500 text-white rounded text-sm text-center"
                            >
                              {piece.text}
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Distorted Thoughts */}
                    <div
                      className={`min-h-32 p-4 border-2 border-dashed rounded-lg ${getDropZoneColor('distorted')}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'distorted')}
                    >
                      <h4 className="font-medium text-red-800 dark:text-red-200 mb-3 text-center">
                        Distorted Thinking
                      </h4>
                      <div className="space-y-2">
                        {mirrorPieces
                          .filter(piece => piece.currentPosition === 'distorted')
                          .map((piece) => (
                            <div
                              key={piece.id}
                              className="p-2 bg-red-500 text-white rounded text-sm text-center"
                            >
                              {piece.text}
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Reframed Thoughts */}
                    <div
                      className={`min-h-32 p-4 border-2 border-dashed rounded-lg ${getDropZoneColor('reframe')}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'reframe')}
                    >
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3 text-center">
                        Balanced Reframe
                      </h4>
                      <div className="space-y-2">
                        {mirrorPieces
                          .filter(piece => piece.currentPosition === 'reframe')
                          .map((piece) => (
                            <div
                              key={piece.id}
                              className="p-2 bg-blue-500 text-white rounded text-sm text-center"
                            >
                              {piece.text}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Available Pieces */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-3 text-center">Mirror Pieces</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {mirrorPieces?.filter(piece => !piece.currentPosition)
                        .map((piece) => (
                          <div
                            key={piece.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, piece)}
                            className={`p-3 ${getPieceColor(piece)} rounded-lg cursor-move hover:shadow-lg transition-all transform hover:scale-105 text-sm font-medium`}
                          >
                            {piece.text}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Target Reframed Thought */}
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-700">
                    <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Target Reframe:</h3>
                    <p className="text-blue-700 dark:text-blue-300 italic">
                      &quot;{currentDistortionData.reframed}&quot;
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Journal Section */}
          {gameState === 'journal' && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-600">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Cognitive Restructuring Reflection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <p className="text-purple-800 dark:text-purple-200 text-center">
                      🎯 Excellent work! You&apos;ve successfully corrected {completedDistortions.length} cognitive distortions!
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{formatTime(timeElapsed)}</div>
                      <div className="text-sm text-muted-foreground">Time Taken</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">{completedDistortions.length}</div>
                      <div className="text-sm text-muted-foreground">Distortions Corrected</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((completedDistortions.length / cognitiveDistortions.length) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Accuracy</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="journal" className="text-base font-medium">
                      Reflect on your cognitive patterns:
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Think about your own thought patterns. Can you identify any cognitive distortions
                      you experience? How might you reframe them using what you&apos;ve learned?
                    </p>
                    <Textarea
                      id="journal"
                      placeholder="Write about any distorted thoughts you've noticed in your own thinking and how you might reframe them..."
                      value={journalEntry}
                      onChange={(e) => setJournalEntry(e.target.value)}
                      className="min-h-32"
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button onClick={submitJournal} size="lg" className="px-8">
                      Complete Level 3
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Completion */}
          {gameState === 'completed' && (
            <div className="max-w-2xl mx-auto text-center animate-in fade-in scale-in-95 duration-600">
              <Card className="border-purple-500/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in scale-in-0 duration-600 delay-200">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>

                  <h2 className="text-3xl font-bold mb-4">Level 3 Complete!</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    You&apos;ve mastered cognitive restructuring! The mirrors now reflect
                    balanced, realistic thoughts instead of distorted perceptions.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                      <Link href="/games/level-4">
                        Continue to Level 4
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
  //
}