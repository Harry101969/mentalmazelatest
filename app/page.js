'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Brain, Heart, Shield, Users, Star, TowerControl as GameController2, MessageCircle, BarChart3, CheckCircle, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/navbar';

export default function HomePage() {
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialsRef = useRef(null);
  
  const featuresInView = useInView(featuresRef, { once: true });
  const howItWorksInView = useInView(howItWorksRef, { once: true });
  const testimonialsInView = useInView(testimonialsRef, { once: true });

  const features = [
    {
      icon: GameController2,
      title: "Interactive Game Levels",
      description: "5 therapeutic levels designed to guide you through anxiety management, mindfulness, and self-care mastery.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageCircle,
      title: "AI Therapy Companion",
      description: "24/7 AI-powered emotional support with personalized guidance and crisis intervention capabilities.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "Advanced mood monitoring with insights, patterns recognition, and personalized recommendations.",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: Users,
      title: "Professional Network",
      description: "Connect with verified mental health professionals in your area for real-world support.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Detailed insights into your mental wellness journey with personalized growth metrics.",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "End-to-end encryption and privacy-first design to protect your sensitive mental health data.",
      gradient: "from-gray-500 to-slate-500"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Start Your Journey",
      description: "Create your account and complete our brief wellness assessment to personalize your experience.",
      icon: Play
    },
    {
      number: "02", 
      title: "Navigate the Levels",
      description: "Progress through 5 carefully designed levels, each targeting different aspects of mental wellness.",
      icon: GameController2
    },
    {
      number: "03",
      title: "Track & Grow",
      description: "Monitor your progress, celebrate victories, and receive AI-powered insights for continuous improvement.",
      icon: BarChart3
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Student, 22",
      content: "MindMaze helped me understand my anxiety patterns and gave me practical tools to manage stress during exams. The game format made therapy feel less intimidating.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    },
    {
      name: "Marcus Johnson",
      role: "Software Engineer, 28",
      content: "The AI companion is incredibly understanding and available whenever I need support. It's like having a therapist in my pocket, but more accessible.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    },
    {
      name: "Elena Rodriguez",
      role: "Teacher, 35",
      content: "The mindfulness levels transformed how I handle classroom stress. My students even noticed I'm more calm and present. Thank you MindMaze!",
      rating: 5,
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
        {/* Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse delay-500" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <Badge variant="outline" className="mb-4 px-4 py-2 bg-primary/10 border-primary/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Revolutionary Mental Wellness Platform
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 bg-clip-text text-transparent leading-tight">
                Navigate Your
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Mental Wellness
                </span>
                <br />
                Journey
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Transform anxiety into resilience through interactive therapeutic games, AI-powered support, and evidence-based mental wellness tools designed for the modern mind.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Button asChild size="lg" className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg px-8 py-6 text-white">
                <Link href="/auth/register" className="flex items-center">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="group border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:hover:border-blue-600 dark:hover:bg-blue-900/20 hover:shadow-lg hover:scale-105 transition-all duration-300 text-lg px-8 py-6">
                <Link href="#how-it-works" className="flex items-center">
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Learn More
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-slate-600 dark:text-slate-400">Lives Transformed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                <div className="text-slate-600 dark:text-slate-400">User Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">24/7</div>
                <div className="text-slate-600 dark:text-slate-400">AI Support</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-800 dark:to-slate-900" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Comprehensive Mental Wellness Tools
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Every feature is designed with mental health professionals to provide evidence-based support for your wellness journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30">
                    <CardContent className="p-8">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24" ref={howItWorksRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Path to Mental Wellness
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              A simple, scientifically-backed approach to improving your mental health through gamification and personalized support.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`flex flex-col md:flex-row items-center gap-8 mb-16 ${
                    index % 2 === 1 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <span className="text-6xl font-bold text-primary/20 mr-4">
                        {step.number}
                      </span>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center shadow-inner">
                      <Icon className="h-32 w-32 text-blue-400/60" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-white to-blue-50/50 dark:from-slate-900 dark:to-slate-800" ref={testimonialsRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Success Stories
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Real people sharing how MindMaze transformed their mental wellness journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white dark:bg-slate-800 border-blue-100 dark:border-slate-700">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <Brain className="h-20 w-20 mx-auto mb-8 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Mental Wellness?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of users who have already started their journey to better mental health. Your transformation begins today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="group bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 hover:scale-105 transition-all duration-300 shadow-lg">
                <Link href="/auth/register" className="flex items-center">
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <div className="text-sm opacity-75">
                ✓ Free trial • ✓ No credit card required • ✓ 24/7 support
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white dark:bg-slate-900 border-t border-blue-100 dark:border-slate-700 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="font-bold text-xl">MindMaze</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Navigate your mental wellness journey with innovative, evidence-based tools and compassionate AI support.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><Link href="/games" className="hover:text-blue-600 transition-colors">Game Levels</Link></li>
                <li><Link href="/ai-chat" className="hover:text-blue-600 transition-colors">AI Companion</Link></li>
                <li><Link href="/therapists" className="hover:text-blue-600 transition-colors">Find Therapists</Link></li>
                <li><Link href="/mood-tracker" className="hover:text-blue-600 transition-colors">Mood Tracking</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><a href="mailto:support@mindmaze.com" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
                <li><Link href="/help" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
                <li><Link href="/crisis-support" className="hover:text-blue-600 transition-colors">Crisis Support</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Emergency Support</h3>
              <div className="space-y-2 text-slate-600 dark:text-slate-400">
                <p className="font-semibold text-red-600">Crisis Helpline:</p>
                <p>Call 988 (US)</p>
                <p>Text "HELLO" to 741741</p>
                <p className="text-sm">Available 24/7 for immediate support</p>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-100 dark:border-slate-700 pt-8 text-center text-slate-600 dark:text-slate-400">
            <p>&copy; 2024 MindMaze. All rights reserved. Nurturing minds, one level at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}