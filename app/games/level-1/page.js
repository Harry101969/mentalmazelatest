// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ArrowLeft, RotateCcw, CheckCircle, Clock, Target, BookOpen } from 'lucide-react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import UserNavbar from '@/components/user-navbar';
// import { toast } from 'sonner';
// import { getRandomMemoryPairs } from '@/lib/game-patterns';

// export default function Level1Page() {
//   const [gameState, setGameState] = useState('instructions'); // instructions, playing, journal, completed
//   const [cards, setCards] = useState([]);
//   const [flippedCards, setFlippedCards] = useState([]);
//   const [matchedPairs, setMatchedPairs] = useState([]);
//   const [moves, setMoves] = useState(0);
//   const [startTime, setStartTime] = useState(null);
//   const [timeElapsed, setTimeElapsed] = useState(0);
//   const [journalEntry, setJournalEntry] = useState('');
//   const [fogOpacity, setFogOpacity] = useState(0.8);
//   const timerRef = useRef(null);
//   const [cardPairs, setCardPairs] = useState([]);

//   useEffect(() => {
//     // Get random card pairs for this session
//     const pairs = getRandomMemoryPairs(6, 'beginner', {
//       age: 25, // Could get from user context
//       hobbies: ['reading', 'music'] // Could get from user context
//     });
//     setCardPairs(pairs);
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

//   // Update fog opacity based on progress
//   useEffect(() => {
//     const progress = matchedPairs.length / cardPairs.length;
//     setFogOpacity(0.8 - (progress * 0.7)); // Fog clears as matches are made
//   }, [matchedPairs]);

//   const initializeGame = () => {
//     const gameCards = [];
//     cardPairs.forEach(pair => {
//       gameCards.push(
//         { id: `${pair.id}-anxious`, pairId: pair.id, type: 'anxious', text: pair.anxious, isFlipped: false, isMatched: false },
//         { id: `${pair.id}-reframed`, pairId: pair.id, type: 'reframed', text: pair.reframed, isFlipped: false, isMatched: false }
//       );
//     });

//     // Shuffle cards
//     const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
//     setCards(shuffledCards);
//     setFlippedCards([]);
//     setMatchedPairs([]);
//     setMoves(0);
//     setTimeElapsed(0);
//   };

//   const startGame = () => {
//     setGameState('playing');
//     setStartTime(Date.now());
//   };

//   const flipCard = (cardId) => {
//     if (flippedCards.length >= 2) return;

//     const card = cards.find(c => c.id === cardId);
//     if (card.isFlipped || card.isMatched) return;

//     const newFlippedCards = [...flippedCards, cardId];
//     setFlippedCards(newFlippedCards);

//     // Update card state
//     setCards(prev => prev.map(c =>
//       c.id === cardId ? { ...c, isFlipped: true } : c
//     ));

//     if (newFlippedCards.length === 2) {
//       setMoves(prev => prev + 1);
//       checkForMatch(newFlippedCards);
//     }
//   };

//   const checkForMatch = (flippedCardIds) => {
//     const [card1Id, card2Id] = flippedCardIds;
//     const card1 = cards.find(c => c.id === card1Id);
//     const card2 = cards.find(c => c.id === card2Id);

//     setTimeout(() => {
//       if (card1.pairId === card2.pairId) {
//         // Match found!
//         setCards(prev => prev.map(c =>
//           flippedCardIds.includes(c.id) ? { ...c, isMatched: true } : c
//         ));
//         setMatchedPairs(prev => [...prev, card1.pairId]);
//         setFlippedCards([]);

//         // Check if game is complete
//         if (matchedPairs.length + 1 === cardPairs.length) {
//           setTimeout(() => {
//             setGameState('journal');
//           }, 1000);
//         }
//       } else {
//         // No match, flip cards back
//         setCards(prev => prev.map(c =>
//           flippedCardIds.includes(c.id) ? { ...c, isFlipped: false } : c
//         ));
//         setFlippedCards([]);
//       }
//     }, 1000);
//   };

//   const submitJournal = async () => {
//     try {
//       const gameData = {
//         level: 1,
//         completed: true,
//         score: Math.max(0, 100 - (moves - cardPairs.length) * 5), // Score based on efficiency
//         timeSpent: Math.round(timeElapsed / 1000),
//         moves,
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
//         toast.success('Level 1 completed! Well done on your anxiety management journey.');
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

//   const getScoreColor = (score) => {
//     if (score >= 90) return 'text-green-600';
//     if (score >= 70) return 'text-yellow-600';
//     return 'text-orange-600';
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
//                 <h1 className="text-3xl font-bold">Level 1: The Foggy Entrance</h1>
//                 <p className="text-muted-foreground">Navigate through anxiety with memory and reframing</p>
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
//                   <span>{moves} moves</span>
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
//                 className="max-w-4xl mx-auto"
//               >
//                 <Card className="mb-8">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <BookOpen className="h-5 w-5" />
//                       Welcome to The Foggy Entrance
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div className="prose prose-sm max-w-none">
//                       <p className="text-lg leading-relaxed">
//                         Anxiety often clouds our thinking with negative thoughts. In this level, you'll practice
//                         <strong> cognitive reframing</strong> - a powerful technique to transform anxious thoughts
//                         into more balanced, realistic perspectives.
//                       </p>
//                     </div>

//                     <div className="grid md:grid-cols-2 gap-6">
//                       <div>
//                         <h3 className="font-semibold mb-3">How to Play:</h3>
//                         <ul className="space-y-2 text-sm">
//                           <li className="flex items-start gap-2">
//                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
//                             Click cards to flip them and reveal the text
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
//                             Match anxious thoughts with their reframed counterparts
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
//                             Watch the fog clear as you make successful matches
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
//                             Complete all pairs to unlock the journal reflection
//                           </li>
//                         </ul>
//                       </div>

//                       <div>
//                         <h3 className="font-semibold mb-3">Learning Goals:</h3>
//                         <ul className="space-y-2 text-sm">
//                           <li className="flex items-start gap-2">
//                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
//                             Recognize common anxious thought patterns
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
//                             Practice cognitive reframing techniques
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
//                             Build awareness of thought-emotion connections
//                           </li>
//                           <li className="flex items-start gap-2">
//                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
//                             Develop tools for managing anxiety
//                           </li>
//                         </ul>
//                       </div>
//                     </div>

//                     <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
//                       <p className="text-sm text-blue-800 dark:text-blue-200">
//                         <strong>Remember:</strong> This is a safe space to explore your thoughts.
//                         Take your time and be gentle with yourself as you practice these new skills.
//                       </p>
//                     </div>

//                     <div className="flex justify-center pt-4">
//                       <Button onClick={startGame} size="lg" className="px-8">
//                         Begin Your Journey
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             )}

//             {/* Game Board */}
//             {gameState === 'playing' && (
//               <motion.div
//                 key="game"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="relative"
//               >
//                 {/* Fog Overlay */}
//                 <div
//                   className="fixed inset-0 bg-gradient-to-b from-gray-400/20 to-gray-600/30 pointer-events-none transition-opacity duration-1000 z-10"
//                   style={{ opacity: fogOpacity }}
//                 />

//                 {/* Progress Bar */}
//                 <div className="mb-6">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium">Progress</span>
//                     <span className="text-sm text-muted-foreground">
//                       {matchedPairs.length}/{cardPairs.length} pairs matched
//                     </span>
//                   </div>
//                   {/* <Progress value={(matchedPairs.length / cardPairs.length) * 100} className="h-2" /> */}

//                   <Progress
//                     value={cardPairs.length > 0 ? (matchedPairs.length / cardPairs.length) * 100 : 0}
//                     className="h-2"
//                   />
//                 </div>

//                 {/* Game Grid */}
//                 <div className="grid grid-cols-3 md:grid-cols-4 gap-4 relative z-20">
//                   {cards.map((card) => (
//                     <motion.div
//                       key={card.id}
//                       className={`aspect-square cursor-pointer ${card.isMatched ? 'pointer-events-none' : ''
//                         }`}
//                       whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => flipCard(card.id)}
//                     >
//                       <div className="relative w-full h-full">
//                         <motion.div
//                           className={`absolute inset-0 rounded-lg border-2 transition-all duration-300 ${card.isMatched
//                             ? 'border-green-500 bg-green-50 dark:bg-green-950'
//                             : card.isFlipped
//                               ? card.type === 'anxious'
//                                 ? 'border-red-300 bg-red-50 dark:bg-red-950'
//                                 : 'border-blue-300 bg-blue-50 dark:bg-blue-950'
//                               : 'border-muted bg-muted hover:border-primary'
//                             }`}
//                           animate={{
//                             rotateY: card.isFlipped || card.isMatched ? 0 : 180
//                           }}
//                           transition={{ duration: 0.3 }}
//                         >
//                           <div className="p-3 h-full flex items-center justify-center text-center">
//                             {card.isFlipped || card.isMatched ? (
//                               <p className={`text-xs leading-tight ${card.type === 'anxious'
//                                 ? 'text-red-700 dark:text-red-300'
//                                 : 'text-blue-700 dark:text-blue-300'
//                                 }`}>
//                                 {card.text}
//                               </p>
//                             ) : (
//                               <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
//                                 <span className="text-primary font-bold">?</span>
//                               </div>
//                             )}
//                           </div>
//                         </motion.div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>

//                 {/* Reset Button */}
//                 <div className="flex justify-center mt-8">
//                   <Button
//                     onClick={() => {
//                       initializeGame();
//                       setStartTime(Date.now());
//                     }}
//                     variant="outline"
//                     className="flex items-center gap-2"
//                   >
//                     <RotateCcw className="h-4 w-4" />
//                     Reset Game
//                   </Button>
//                 </div>
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
//                       Reflection Journal
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
//                       <p className="text-green-800 dark:text-green-200 text-center">
//                         🎉 Congratulations! You've successfully completed The Foggy Entrance!
//                       </p>
//                     </div>

//                     <div className="grid md:grid-cols-3 gap-4 text-center">
//                       <div className="p-4 bg-muted/50 rounded-lg">
//                         <div className="text-2xl font-bold text-primary">{formatTime(timeElapsed)}</div>
//                         <div className="text-sm text-muted-foreground">Time Taken</div>
//                       </div>
//                       <div className="p-4 bg-muted/50 rounded-lg">
//                         <div className="text-2xl font-bold text-secondary">{moves}</div>
//                         <div className="text-sm text-muted-foreground">Total Moves</div>
//                       </div>
//                       <div className="p-4 bg-muted/50 rounded-lg">
//                         <div className={`text-2xl font-bold ${getScoreColor(Math.max(0, 100 - (moves - cardPairs.length) * 5))}`}>
//                           {Math.max(0, 100 - (moves - cardPairs.length) * 5)}%
//                         </div>
//                         <div className="text-sm text-muted-foreground">Efficiency Score</div>
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <Label htmlFor="journal" className="text-base font-medium">
//                         Reflect on your experience:
//                       </Label>
//                       <p className="text-sm text-muted-foreground">
//                         Take a moment to write about any anxious thoughts you've been having lately.
//                         Practice reframing them using the techniques you just learned.
//                       </p>
//                       <Textarea
//                         id="journal"
//                         placeholder="Write about your anxious thoughts and how you might reframe them..."
//                         value={journalEntry}
//                         onChange={(e) => setJournalEntry(e.target.value)}
//                         className="min-h-32"
//                       />
//                     </div>

//                     <div className="flex justify-center">
//                       <Button onClick={submitJournal} size="lg" className="px-8">
//                         Complete Level 1
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
//                 <Card className="border-green-500/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
//                   <CardContent className="p-8">
//                     <motion.div
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       transition={{ delay: 0.2, type: "spring" }}
//                       className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
//                     >
//                       <CheckCircle className="w-10 h-10 text-white" />
//                     </motion.div>

//                     <h2 className="text-3xl font-bold mb-4">Level 1 Complete!</h2>
//                     <p className="text-lg text-muted-foreground mb-8">
//                       You've taken the first step in your mental wellness journey.
//                       The fog has cleared, and you're ready for the next challenge!
//                     </p>

//                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                       <Button asChild size="lg">
//                         <Link href="/games/level-2">
//                           Continue to Level 2
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
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, CheckCircle, Clock, Target, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import UserNavbar from '@/components/user-navbar';
import { toast } from 'sonner';
import { getRandomMemoryPairs } from '@/lib/game-patterns';

export default function Level1Page() {
  const [gameState, setGameState] = useState('instructions'); // instructions, playing, journal, completed
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [fogOpacity, setFogOpacity] = useState(0.8);
  const timerRef = useRef(null);
  const [cardPairs, setCardPairs] = useState([]);

  useEffect(() => {
    // Get random card pairs for this session
    const pairs = getRandomMemoryPairs(6, 'beginner', {
      age: 25, // Could get from user context
      hobbies: ['reading', 'music'] // Could get from user context
    });
    setCardPairs(pairs);
  }, []);

  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
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

  // Update fog opacity based on progress
  useEffect(() => {
    if (cardPairs.length > 0) {
      const progress = matchedPairs.length / cardPairs.length;
      setFogOpacity(0.8 - (progress * 0.7)); // Fog clears as matches are made
    }
  }, [matchedPairs, cardPairs.length]);

  const initializeGame = () => {
    const gameCards = [];
    cardPairs.forEach(pair => {
      gameCards.push(
        { id: `${pair.id}-anxious`, pairId: pair.id, type: 'anxious', text: pair.anxious, isFlipped: false, isMatched: false },
        { id: `${pair.id}-reframed`, pairId: pair.id, type: 'reframed', text: pair.reframed, isFlipped: false, isMatched: false }
      );
    });

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setTimeElapsed(0);
  };

  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
  };

  const flipCard = (cardId) => {
    if (flippedCards.length >= 2) return;

    const card = cards.find(c => c.id === cardId);
    if (card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card state
    setCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      checkForMatch(newFlippedCards);
    }
  };

  const checkForMatch = (flippedCardIds) => {
    const [card1Id, card2Id] = flippedCardIds;
    const card1 = cards.find(c => c.id === card1Id);
    const card2 = cards.find(c => c.id === card2Id);

    setTimeout(() => {
      if (card1.pairId === card2.pairId) {
        // Match found!
        setCards(prev => prev.map(c =>
          flippedCardIds.includes(c.id) ? { ...c, isMatched: true } : c
        ));
        setMatchedPairs(prev => [...prev, card1.pairId]);
        setFlippedCards([]);

        // Check if game is complete
        if (matchedPairs.length + 1 === cardPairs.length) {
          setTimeout(() => {
            setGameState('journal');
          }, 1000);
        }
      } else {
        // No match, flip cards back
        setCards(prev => prev.map(c =>
          flippedCardIds.includes(c.id) ? { ...c, isFlipped: false } : c
        ));
        setFlippedCards([]);
      }
    }, 1000);
  };

  const submitJournal = async () => {
    // Mock success - no actual API call
    setTimeout(() => {
      setGameState('completed');
      toast.success('Level 1 completed! Well done on your anxiety management journey.');
    }, 1000);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  // Safe progress value calculation
  const progressValue = cardPairs.length > 0 ? (matchedPairs.length / cardPairs.length) * 100 : 0;

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
                <h1 className="text-3xl font-bold">Level 1: The Foggy Entrance</h1>
                <p className="text-muted-foreground">Navigate through anxiety with memory and reframing</p>
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
                  <span>{moves} moves</span>
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
                className="max-w-4xl mx-auto"
              >
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Welcome to The Foggy Entrance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-lg leading-relaxed">
                        Anxiety often clouds our thinking with negative thoughts. In this level, you'll practice
                        <strong> cognitive reframing</strong> - a powerful technique to transform anxious thoughts
                        into more balanced, realistic perspectives.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">How to Play:</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            Click cards to flip them and reveal the text
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            Match anxious thoughts with their reframed counterparts
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            Watch the fog clear as you make successful matches
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            Complete all pairs to unlock the journal reflection
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Learning Goals:</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Recognize common anxious thought patterns
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Practice cognitive reframing techniques
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Build awareness of thought-emotion connections
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Develop tools for managing anxiety
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Remember:</strong> This is a safe space to explore your thoughts.
                        Take your time and be gentle with yourself as you practice these new skills.
                      </p>
                    </div>

                    <div className="flex justify-center pt-4">
                      <Button onClick={startGame} size="lg" className="px-8">
                        Begin Your Journey
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Game Board */}
            {gameState === 'playing' && (
              <motion.div
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                {/* Fog Overlay */}
                <div
                  className="fixed inset-0 bg-gradient-to-b from-gray-400/20 to-gray-600/30 pointer-events-none transition-opacity duration-1000 z-10"
                  style={{ opacity: fogOpacity }}
                />

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {matchedPairs.length}/{cardPairs.length} pairs matched
                    </span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>

                {/* Game Grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 relative z-20">
                  {cards.map((card) => (
                    <motion.div
                      key={card.id}
                      className={`aspect-square cursor-pointer ${card.isMatched ? 'pointer-events-none' : ''
                        }`}
                      whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => flipCard(card.id)}
                    >
                      <div className="relative w-full h-full">
                        <motion.div
                          className={`absolute inset-0 rounded-lg border-2 transition-all duration-300 ${card.isMatched
                            ? 'border-green-500 bg-green-50 dark:bg-green-950'
                            : card.isFlipped
                              ? card.type === 'anxious'
                                ? 'border-red-300 bg-red-50 dark:bg-red-950'
                                : 'border-blue-300 bg-blue-50 dark:bg-blue-950'
                              : 'border-muted bg-muted hover:border-primary'
                            }`}
                          animate={{
                            rotateY: card.isFlipped || card.isMatched ? 0 : 180
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-3 h-full flex items-center justify-center text-center">
                            {card.isFlipped || card.isMatched ? (
                              <p className={`text-xs leading-tight ${card.type === 'anxious'
                                ? 'text-red-700 dark:text-red-300'
                                : 'text-blue-700 dark:text-blue-300'
                                }`}>
                                {card.text}
                              </p>
                            ) : (
                              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                <span className="text-primary font-bold">?</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Reset Button */}
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => {
                      initializeGame();
                      setStartTime(Date.now());
                    }}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Game
                  </Button>
                </div>
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
                      Reflection Journal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                      <p className="text-green-800 dark:text-green-200 text-center">
                        🎉 Congratulations! You've successfully completed The Foggy Entrance!
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{formatTime(timeElapsed)}</div>
                        <div className="text-sm text-muted-foreground">Time Taken</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">{moves}</div>
                        <div className="text-sm text-muted-foreground">Total Moves</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className={`text-2xl font-bold ${getScoreColor(Math.max(0, 100 - (moves - cardPairs.length) * 5))}`}>
                          {Math.max(0, 100 - (moves - cardPairs.length) * 5)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Efficiency Score</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="journal" className="text-base font-medium">
                        Reflect on your experience:
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Take a moment to write about any anxious thoughts you've been having lately.
                        Practice reframing them using the techniques you just learned.
                      </p>
                      <Textarea
                        id="journal"
                        placeholder="Write about your anxious thoughts and how you might reframe them..."
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                        className="min-h-32"
                      />
                    </div>

                    <div className="flex justify-center">
                      <Button onClick={submitJournal} size="lg" className="px-8">
                        Complete Level 1
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
                <Card className="border-green-500/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                  <CardContent className="p-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>

                    <h2 className="text-3xl font-bold mb-4">Level 1 Complete!</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      You've taken the first step in your mental wellness journey.
                      The fog has cleared, and you're ready for the next challenge!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild size="lg">
                        <Link href="/games/level-2">
                          Continue to Level 2
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}