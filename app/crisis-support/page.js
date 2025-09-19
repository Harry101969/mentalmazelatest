'use client';

import { motion } from 'framer-motion';
import { Phone, MessageCircle, Heart, Shield, AlertTriangle, Clock, Globe, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UserNavbar from '@/components/user-navbar';

export default function CrisisSupportPage() {
    const emergencyContacts = [
        {
            name: "National Suicide Prevention Lifeline",
            number: "988",
            description: "24/7 crisis support for suicidal thoughts and mental health emergencies",
            type: "call",
            country: "US",
            languages: ["English", "Spanish"]
        },
        {
            name: "Crisis Text Line",
            number: "741741",
            description: "Text HOME to connect with a crisis counselor",
            type: "text",
            country: "US",
            languages: ["English"]
        },
        {
            name: "SAMHSA National Helpline",
            number: "1-800-662-4357",
            description: "Treatment referral and information service for mental health and substance abuse",
            type: "call",
            country: "US",
            languages: ["English", "Spanish"]
        },
        {
            name: "International Association for Suicide Prevention",
            number: "Visit Website",
            description: "Global directory of crisis centers and helplines",
            type: "website",
            country: "International",
            website: "https://www.iasp.info/resources/Crisis_Centres/"
        }
    ];

    const selfCareStrategies = [
        {
            title: "Immediate Grounding",
            icon: Shield,
            techniques: [
                "5-4-3-2-1 technique: Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste",
                "Hold an ice cube or splash cold water on your face",
                "Take 10 slow, deep breaths",
                "Call someone from your support network"
            ]
        },
        {
            title: "Safety Planning",
            icon: Heart,
            techniques: [
                "Remove any means of self-harm from your immediate environment",
                "Stay with trusted friends or family",
                "Avoid alcohol and drugs",
                "Create a list of reasons to stay safe"
            ]
        },
        {
            title: "Reach Out",
            icon: Users,
            techniques: [
                "Call a trusted friend or family member",
                "Contact your therapist or counselor",
                "Go to your nearest emergency room",
                "Call emergency services if in immediate danger"
            ]
        }
    ];

    const warningSignsToWatch = [
        "Thoughts of suicide or self-harm",
        "Feeling hopeless or trapped",
        "Extreme mood swings",
        "Withdrawing from friends and activities",
        "Increased use of alcohol or drugs",
        "Feeling like a burden to others",
        "Talking about death or dying",
        "Giving away possessions"
    ];

    const callNumber = (number) => {
        if (number === "Visit Website") {
            window.open("https://www.iasp.info/resources/Crisis_Centres/", "_blank");
        } else {
            window.location.href = `tel:${number}`;
        }
    };

    const textNumber = (number) => {
        window.location.href = `sms:${number}`;
    };

    return (
        <div className="min-h-screen bg-background">
            <UserNavbar />

            <main className="pt-20 pb-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full">
                                <Heart className="h-12 w-12 text-red-600" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Crisis Support</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            If you're in crisis or having thoughts of self-harm, you're not alone.
                            Help is available 24/7. Reach out now - your life matters.
                        </p>
                    </motion.div>

                    {/* Emergency Alert */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Card className="border-red-500 bg-red-50 dark:bg-red-950">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
                                            If you're in immediate danger
                                        </h3>
                                        <p className="text-red-700 dark:text-red-300 mb-4">
                                            If you're having thoughts of suicide or self-harm, or if you're in immediate physical danger,
                                            please contact emergency services right away.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Button
                                                onClick={() => callNumber('911')}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                                size="lg"
                                            >
                                                <Phone className="w-4 h-4 mr-2" />
                                                Call 911 (Emergency)
                                            </Button>
                                            <Button
                                                onClick={() => callNumber('988')}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                                size="lg"
                                            >
                                                <Phone className="w-4 h-4 mr-2" />
                                                Call 988 (Crisis Line)
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Crisis Helplines */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    Crisis Helplines & Support
                                </CardTitle>
                                <CardDescription>
                                    Free, confidential support available 24/7
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    {emergencyContacts.map((contact, index) => (
                                        <div
                                            key={index}
                                            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg mb-1">{contact.name}</h3>
                                                    <p className="text-muted-foreground mb-2">{contact.description}</p>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="outline">
                                                            <Globe className="w-3 h-3 mr-1" />
                                                            {contact.country}
                                                        </Badge>
                                                        <Badge variant="outline">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            24/7
                                                        </Badge>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {contact.languages.map((lang, i) => (
                                                            <Badge key={i} variant="secondary" className="text-xs">
                                                                {lang}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    {contact.type === 'call' && (
                                                        <Button
                                                            onClick={() => callNumber(contact.number)}
                                                            className="bg-green-600 hover:bg-green-700 text-white"
                                                        >
                                                            <Phone className="w-4 h-4 mr-2" />
                                                            Call {contact.number}
                                                        </Button>
                                                    )}
                                                    {contact.type === 'text' && (
                                                        <Button
                                                            onClick={() => textNumber(contact.number)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                                        >
                                                            <MessageCircle className="w-4 h-4 mr-2" />
                                                            Text {contact.number}
                                                        </Button>
                                                    )}
                                                    {contact.type === 'website' && (
                                                        <Button
                                                            onClick={() => window.open(contact.website, '_blank')}
                                                            variant="outline"
                                                        >
                                                            <Globe className="w-4 h-4 mr-2" />
                                                            Visit Website
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Self-Care Strategies */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Immediate Self-Care Strategies</CardTitle>
                                <CardDescription>
                                    Things you can do right now to help yourself feel safer
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {selfCareStrategies.map((strategy, index) => {
                                        const Icon = strategy.icon;
                                        return (
                                            <div key={index} className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Icon className="h-5 w-5 text-primary" />
                                                    <h3 className="font-semibold">{strategy.title}</h3>
                                                </div>
                                                <ul className="space-y-2 text-sm">
                                                    {strategy.techniques.map((technique, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                                                            {technique}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Warning Signs */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                            <CardHeader>
                                <CardTitle className="text-amber-800 dark:text-amber-200">
                                    Warning Signs to Watch For
                                </CardTitle>
                                <CardDescription className="text-amber-700 dark:text-amber-300">
                                    If you or someone you know is experiencing these signs, reach out for help immediately
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {warningSignsToWatch.map((sign, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-amber-800 dark:text-amber-200">{sign}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Resources */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Resources</CardTitle>
                                <CardDescription>
                                    More ways to get support and information
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                            Mental Health America
                                        </h4>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                                            Comprehensive mental health resources, screening tools, and support information.
                                        </p>
                                        <Button
                                            onClick={() => window.open('https://www.mhanational.org', '_blank')}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Visit Website
                                        </Button>
                                    </div>

                                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                                            NAMI (National Alliance on Mental Illness)
                                        </h4>
                                        <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                                            Support groups, educational resources, and advocacy for mental health.
                                        </p>
                                        <Button
                                            onClick={() => window.open('https://www.nami.org', '_blank')}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Visit Website
                                        </Button>
                                    </div>

                                    <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                                        <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                                            Psychology Today Therapist Directory
                                        </h4>
                                        <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                                            Find mental health professionals in your area.
                                        </p>
                                        <Button
                                            onClick={() => window.open('https://www.psychologytoday.com/us/therapists', '_blank')}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Find Therapists
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Important Note */}
                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
                            <CardContent className="p-6 text-center">
                                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-4">You Are Not Alone</h3>
                                <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
                                    Crisis situations are temporary, but suicide is permanent. There are people who want to help you
                                    through this difficult time. Your life has value, and there is hope for feeling better.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    If you're supporting someone in crisis, listen without judgment, take their feelings seriously,
                                    and help them connect with professional support.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}