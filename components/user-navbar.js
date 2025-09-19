// // 'use client';

// // import { useState } from 'react';
// // import Link from 'next/link';
// // import { motion } from 'framer-motion';
// // import { Brain, Menu, X, User, Settings, LogOut, TowerControl as GameController2, MessageCircle, Heart, Users, Music, BookOpen, Flower, Headphones, Phone, CreditCard } from 'lucide-react';
// // import { Button } from '@/components/ui/button';
// // import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuLabel,
// //   DropdownMenuSeparator,
// //   DropdownMenuTrigger,
// // } from '@/components/ui/dropdown-menu';
// // import { ThemeToggle } from './theme-toggle';
// // import { useAuth } from './auth-provider';

// // export default function UserNavbar() {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const { user, logout } = useAuth();

// //   const navItems = [
// //     { href: '/games', label: 'Games', icon: GameController2 },
// //     { href: '/ai-chat', label: 'AI Buddy', icon: MessageCircle },
// //     { href: '/mood-tracker', label: 'Mood', icon: Heart },
// //     { href: '/therapists', label: 'Therapists', icon: Users },
// //     { href: '/music', label: 'Music', icon: Music },
// //     { href: '/journal', label: 'Journal', icon: BookOpen },
// //   ];

// //   return (
// //     <motion.nav 
// //       className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-blue-100 dark:border-slate-700"
// //       initial={{ y: -100 }}
// //       animate={{ y: 0 }}
// //       transition={{ duration: 0.6 }}
// //     >
// //       <div className="container mx-auto px-4">
// //         <div className="flex items-center justify-between h-16">
// //           {/* Logo */}
// //           <Link href="/dashboard" className="flex items-center space-x-2 group">
// //             <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
// //               <Brain className="h-6 w-6 text-blue-600" />
// //             </div>
// //             <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// //               MindMaze
// //             </span>
// //           </Link>

// //           {/* Desktop Navigation */}
// //           <div className="hidden md:flex items-center space-x-6">
// //             {navItems.map((item) => {
// //               const Icon = item.icon;
// //               return (
// //                 <Link
// //                   key={item.href}
// //                   href={item.href}
// //                   className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium group"
// //                 >
// //                   <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
// //                   <span>{item.label}</span>
// //                 </Link>
// //               );
// //             })}
// //           </div>

// //           {/* Right side */}
// //           <div className="hidden md:flex items-center space-x-4">
// //             <ThemeToggle />

// //             {/* User Menu */}
// //             <DropdownMenu>
// //               <DropdownMenuTrigger asChild>
// //                 <Button variant="ghost" className="flex items-center space-x-2 hover:bg-blue-50 dark:hover:bg-blue-900/20">
// //                   <Avatar className="h-8 w-8">
// //                     <AvatarImage src={user?.avatar} />
// //                     <AvatarFallback className="bg-blue-500/20 text-blue-600">
// //                       {user?.name?.charAt(0)?.toUpperCase() || 'U'}
// //                     </AvatarFallback>
// //                   </Avatar>
// //                   <span className="font-medium">{user?.nickname || user?.name}</span>
// //                 </Button>
// //               </DropdownMenuTrigger>
// //               <DropdownMenuContent align="end" className="w-56">
// //                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
// //                 <DropdownMenuSeparator />
// //                 <DropdownMenuItem asChild>
// //                   <Link href="/profile" className="flex items-center">
// //                     <User className="mr-2 h-4 w-4" />
// //                     Profile
// //                   </Link>
// //                 </DropdownMenuItem>
// //                 <DropdownMenuItem asChild>
// //                   <Link href="/subscription" className="flex items-center">
// //                     <CreditCard className="mr-2 h-4 w-4" />
// //                     Subscription
// //                   </Link>
// //                 </DropdownMenuItem>
// //                 <DropdownMenuItem asChild>
// //                   <Link href="/zen-mode" className="flex items-center">
// //                     <Flower className="mr-2 h-4 w-4" />
// //                     Zen Mode
// //                   </Link>
// //                 </DropdownMenuItem>
// //                 <DropdownMenuItem asChild>
// //                   <Link href="/meditation" className="flex items-center">
// //                     <Headphones className="mr-2 h-4 w-4" />
// //                     Meditation
// //                   </Link>
// //                 </DropdownMenuItem>
// //                 <DropdownMenuItem asChild>
// //                   <Link href="/call-friend" className="flex items-center">
// //                     <Phone className="mr-2 h-4 w-4" />
// //                     Call a Friend
// //                   </Link>
// //                 </DropdownMenuItem>
// //                 <DropdownMenuSeparator />
// //                 <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
// //                   <LogOut className="mr-2 h-4 w-4" />
// //                   Logout
// //                 </DropdownMenuItem>
// //               </DropdownMenuContent>
// //             </DropdownMenu>
// //           </div>

// //           {/* Mobile menu button */}
// //           <div className="md:hidden flex items-center space-x-2">
// //             <ThemeToggle />
// //             <Button
// //               variant="ghost"
// //               size="icon"
// //               onClick={() => setIsOpen(!isOpen)}
// //             >
// //               {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
// //             </Button>
// //           </div>
// //         </div>

// //         {/* Mobile Navigation */}
// //         <motion.div
// //           className={`md:hidden overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
// //           initial={false}
// //           animate={{ height: isOpen ? 'auto' : 0 }}
// //           transition={{ duration: 0.3 }}
// //         >
// //           <div className="pb-4 space-y-2">
// //             {navItems.map((item) => {
// //               const Icon = item.icon;
// //               return (
// //                 <Link
// //                   key={item.href}
// //                   href={item.href}
// //                   className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
// //                   onClick={() => setIsOpen(false)}
// //                 >
// //                   <Icon className="h-4 w-4" />
// //                   <span>{item.label}</span>
// //                 </Link>
// //               );
// //             })}
// //             <div className="border-t border-border/50 pt-4">
// //               <Button
// //                 variant="ghost"
// //                 onClick={() => {
// //                   logout();
// //                   setIsOpen(false);
// //                 }}
// //                 className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
// //               >
// //                 <LogOut className="mr-2 h-4 w-4" />
// //                 Logout
// //               </Button>
// //             </div>
// //           </div>
// //         </motion.div>
// //       </div>
// //     </motion.nav>
// //   );
// // }

// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { Brain, Menu, X, User, Settings, LogOut, TowerControl as GameController2, MessageCircle, Heart, Users, Music, BookOpen, Flower, Headphones, Phone, CreditCard } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { ThemeToggle } from './theme-toggle';

// // Mock user data
// const mockUser = {
//   name: 'John Doe',
//   nickname: 'John',
//   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
//   email: 'john@example.com',
// };

// export default function UserNavbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   // Using mock data instead of useAuth
//   const user = mockUser;
//   const logout = () => {
//     console.log('Mock logout called');
//   };

//   const navItems = [
//     { href: '/games', label: 'Games', icon: GameController2 },
//     { href: '/ai-chat', label: 'AI Buddy', icon: MessageCircle },
//     { href: '/mood-tracker', label: 'Mood', icon: Heart },
//     { href: '/therapists', label: 'Therapists', icon: Users },
//     { href: '/music', label: 'Music', icon: Music },
//     { href: '/journal', label: 'Journal', icon: BookOpen },
//   ];

//   return (
//     <motion.nav
//       className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-blue-100 dark:border-slate-700"
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link href="/dashboard" className="flex items-center space-x-2 group">
//             <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
//               <Brain className="h-6 w-6 text-blue-600" />
//             </div>
//             <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               MindMaze
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-6">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium group"
//                 >
//                   <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
//                   <span>{item.label}</span>
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Right side */}
//           <div className="hidden md:flex items-center space-x-4">
//             <ThemeToggle />

//             {/* User Menu */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="flex items-center space-x-2 hover:bg-blue-50 dark:hover:bg-blue-900/20">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage src={user?.avatar} />
//                     <AvatarFallback className="bg-blue-500/20 text-blue-600">
//                       {user?.name?.charAt(0)?.toUpperCase() || 'U'}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="font-medium">{user?.nickname || user?.name}</span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem asChild>
//                   <Link href="/profile" className="flex items-center">
//                     <User className="mr-2 h-4 w-4" />
//                     Profile
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/subscription" className="flex items-center">
//                     <CreditCard className="mr-2 h-4 w-4" />
//                     Subscription
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/zen-mode" className="flex items-center">
//                     <Flower className="mr-2 h-4 w-4" />
//                     Zen Mode
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/meditation" className="flex items-center">
//                     <Headphones className="mr-2 h-4 w-4" />
//                     Meditation
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/call-friend" className="flex items-center">
//                     <Phone className="mr-2 h-4 w-4" />
//                     Call a Friend
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Logout
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center space-x-2">
//             <ThemeToggle />
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setIsOpen(!isOpen)}
//             >
//               {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         <motion.div
//           className={`md:hidden overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
//           initial={false}
//           animate={{ height: isOpen ? 'auto' : 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <div className="pb-4 space-y-2">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <Icon className="h-4 w-4" />
//                   <span>{item.label}</span>
//                 </Link>
//               );
//             })}
//             <div className="border-t border-border/50 pt-4">
//               <Button
//                 variant="ghost"
//                 onClick={() => {
//                   logout();
//                   setIsOpen(false);
//                 }}
//                 className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
//               >
//                 <LogOut className="mr-2 h-4 w-4" />
//                 Logout
//               </Button>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </motion.nav>
//   );
// }

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Menu, X, User, Settings, LogOut, TowerControl as GameController2, MessageCircle, Heart, Users, Music, BookOpen, Flower, Headphones, Phone, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './theme-toggle';

// Mock user data
const mockUser = {
  name: 'John Doe',
  nickname: 'John',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  email: 'john@example.com',
};

export default function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Using mock data instead of useAuth
  const user = mockUser;
  const logout = () => {
    console.log('Mock logout called');
  };

  const navItems = [
    { href: '/games', label: 'Games', icon: GameController2 },
    { href: '/ai-chat', label: 'AI Buddy', icon: MessageCircle },
    { href: '/mood-tracker', label: 'Mood', icon: Heart },
    { href: '/therapists', label: 'Therapists', icon: Users },
    { href: '/music', label: 'Music', icon: Music },
    { href: '/journal', label: 'Journal', icon: BookOpen },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-blue-100 dark:border-slate-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MindMaze
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium group"
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-blue-500/20 text-blue-600">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user?.nickname || user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subscription" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscription
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/zen-mode" className="flex items-center">
                    <Flower className="mr-2 h-4 w-4" />
                    Zen Mode
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/meditation" className="flex items-center">
                    <Headphones className="mr-2 h-4 w-4" />
                    Meditation
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/call-friend" className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    Call a Friend
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={`md:hidden overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="pb-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="border-t border-border/50 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}