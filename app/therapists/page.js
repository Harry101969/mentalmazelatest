// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Search, MapPin, Star, Phone, Mail, Filter, Users, Award, Clock, Heart } from 'lucide-react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import UserNavbar from '@/components/user-navbar';
// import { toast } from 'sonner';

// export default function TherapistsPage() {
//   const [therapists, setTherapists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [locationFilter, setLocationFilter] = useState('all');
//   const [specializationFilter, setSpecializationFilter] = useState('all');
//   const [selectedTherapist, setSelectedTherapist] = useState(null);

//   const specializations = [
//     'Anxiety Disorders',
//     'Depression',
//     'PTSD',
//     'Addiction',
//     'Relationship Counseling',
//     'Family Therapy',
//     'Child Psychology',
//     'Cognitive Behavioral Therapy',
//     'Mindfulness-Based Therapy',
//     'Trauma Therapy',
//     'Eating Disorders',
//     'Grief Counseling'
//   ];

//   useEffect(() => {
//     fetchTherapists();
//   }, []);

//   const fetchTherapists = async () => {
//     try {
//       const response = await fetch('/api/therapists', {
//         credentials: 'include',
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setTherapists(data.therapists || []);
//       } else {
//         toast.error('Failed to load therapists');
//       }
//     } catch (error) {
//       console.error('Error fetching therapists:', error);
//       toast.error('Error loading therapist directory');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const contactTherapist = (therapist, method) => {
//     if (method === 'phone') {
//       window.location.href = `tel:${therapist.phone}`;
//       toast.success(`Calling ${therapist.name}...`);
//     } else if (method === 'email') {
//       window.location.href = `mailto:${therapist.email}`;
//       toast.success(`Opening email to ${therapist.name}...`);
//     }
//   };

//   const filteredTherapists = therapists.filter(therapist => {
//     const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          therapist.specializations?.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
//     const matchesLocation = locationFilter === 'all' || 
//                            therapist.location?.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
//                            therapist.location?.state?.toLowerCase().includes(locationFilter.toLowerCase());
    
//     const matchesSpecialization = specializationFilter === 'all' ||
//                                  therapist.specializations?.includes(specializationFilter);
    
//     return matchesSearch && matchesLocation && matchesSpecialization && therapist.isActive && therapist.isVerified;
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <UserNavbar />
//         <div className="pt-20 flex items-center justify-center min-h-screen">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <UserNavbar />
      
//       <main className="pt-20 pb-12">
//         <div className="container mx-auto px-4">
//           {/* Header */}
//           <motion.div
//             className="text-center mb-8"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <h1 className="text-3xl font-bold mb-2">Find a Therapist</h1>
//             <p className="text-muted-foreground max-w-2xl mx-auto">
//               Connect with verified mental health professionals who can provide personalized support 
//               for your wellness journey. All therapists are licensed and experienced.
//             </p>
//           </motion.div>

//           {/* Filters */}
//           <motion.div
//             className="flex flex-col md:flex-row gap-4 mb-8"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//           >
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by name or specialization..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
            
//             <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
//               <SelectTrigger className="w-64">
//                 <SelectValue placeholder="Specialization" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Specializations</SelectItem>
//                 {specializations.map((spec) => (
//                   <SelectItem key={spec} value={spec}>
//                     {spec}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Input
//               placeholder="Location (city, state)"
//               value={locationFilter === 'all' ? '' : locationFilter}
//               onChange={(e) => setLocationFilter(e.target.value || 'all')}
//               className="w-48"
//             />
//           </motion.div>

//           {/* Therapists Grid */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             {filteredTherapists.length > 0 ? (
//               <div className="grid gap-6">
//                 {filteredTherapists.map((therapist) => (
//                   <Card key={therapist._id} className="hover:shadow-lg transition-shadow">
//                     <CardContent className="p-6">
//                       <div className="flex items-start gap-6">
//                         <Avatar className="w-20 h-20">
//                           <AvatarImage src={therapist.profileImage} />
//                           <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
//                             {therapist.name.split(' ').map(n => n[0]).join('')}
//                           </AvatarFallback>
//                         </Avatar>

//                         <div className="flex-1">
//                           <div className="flex items-start justify-between mb-3">
//                             <div>
//                               <h3 className="text-xl font-bold mb-1">{therapist.name}</h3>
//                               <div className="flex items-center gap-2 mb-2">
//                                 <Badge variant="default">Verified</Badge>
//                                 {therapist.rating > 0 && (
//                                   <div className="flex items-center gap-1">
//                                     <Star className="w-4 h-4 text-amber-500 fill-current" />
//                                     <span className="text-sm font-medium">{therapist.rating.toFixed(1)}</span>
//                                     <span className="text-xs text-muted-foreground">
//                                       ({therapist.reviews?.length || 0} reviews)
//                                     </span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
                            
//                             <div className="text-right">
//                               <div className="text-lg font-bold text-primary">₹{therapist.consultationFee}</div>
//                               <div className="text-xs text-muted-foreground">per session</div>
//                             </div>
//                           </div>

//                           <div className="grid md:grid-cols-2 gap-4 mb-4">
//                             <div>
//                               <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
//                                 <MapPin className="w-4 h-4" />
//                                 {therapist.location?.city}, {therapist.location?.state}
//                               </div>
//                               <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
//                                 <Clock className="w-4 h-4" />
//                                 {therapist.experience} years experience
//                               </div>
//                               {therapist.languages?.length > 0 && (
//                                 <div className="text-sm text-muted-foreground">
//                                   <strong>Languages:</strong> {therapist.languages.join(', ')}
//                                 </div>
//                               )}
//                             </div>

//                             <div>
//                               <div className="mb-2">
//                                 <span className="text-sm font-medium">Specializations:</span>
//                                 <div className="flex flex-wrap gap-1 mt-1">
//                                   {therapist.specializations?.slice(0, 3).map((spec, index) => (
//                                     <Badge key={index} variant="outline" className="text-xs">
//                                       {spec}
//                                     </Badge>
//                                   ))}
//                                   {therapist.specializations?.length > 3 && (
//                                     <Badge variant="outline" className="text-xs">
//                                       +{therapist.specializations.length - 3} more
//                                     </Badge>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>

//                           {therapist.bio && (
//                             <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
//                               {therapist.bio.length > 200 
//                                 ? `${therapist.bio.substring(0, 200)}...` 
//                                 : therapist.bio
//                               }
//                             </p>
//                           )}

//                           <div className="flex items-center gap-3">
//                             <Button
//                               onClick={() => contactTherapist(therapist, 'phone')}
//                               className="flex items-center gap-2"
//                             >
//                               <Phone className="w-4 h-4" />
//                               Call
//                             </Button>
//                             <Button
//                               onClick={() => contactTherapist(therapist, 'email')}
//                               variant="outline"
//                               className="flex items-center gap-2"
//                             >
//                               <Mail className="w-4 h-4" />
//                               Email
//                             </Button>
                            
//                             <Dialog>
//                               <DialogTrigger asChild>
//                                 <Button variant="outline">
//                                   View Profile
//                                 </Button>
//                               </DialogTrigger>
//                               <DialogContent className="sm:max-w-2xl">
//                                 <DialogHeader>
//                                   <DialogTitle>{therapist.name}</DialogTitle>
//                                   <DialogDescription>
//                                     Complete therapist profile and qualifications
//                                   </DialogDescription>
//                                 </DialogHeader>
                                
//                                 <div className="space-y-6">
//                                   <div className="flex items-start gap-4">
//                                     <Avatar className="w-16 h-16">
//                                       <AvatarImage src={therapist.profileImage} />
//                                       <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
//                                         {therapist.name.split(' ').map(n => n[0]).join('')}
//                                       </AvatarFallback>
//                                     </Avatar>
//                                     <div className="flex-1">
//                                       <h3 className="text-xl font-bold mb-2">{therapist.name}</h3>
//                                       <div className="flex items-center gap-2 mb-2">
//                                         <Badge variant="default">Verified Professional</Badge>
//                                         {therapist.rating > 0 && (
//                                           <div className="flex items-center gap-1">
//                                             <Star className="w-4 h-4 text-amber-500 fill-current" />
//                                             <span className="font-medium">{therapist.rating.toFixed(1)}</span>
//                                           </div>
//                                         )}
//                                       </div>
//                                       <p className="text-muted-foreground">
//                                         {therapist.experience} years of experience
//                                       </p>
//                                     </div>
//                                   </div>

//                                   {therapist.bio && (
//                                     <div>
//                                       <h4 className="font-semibold mb-2">About</h4>
//                                       <p className="text-sm leading-relaxed">{therapist.bio}</p>
//                                     </div>
//                                   )}

//                                   <div>
//                                     <h4 className="font-semibold mb-2">Specializations</h4>
//                                     <div className="flex flex-wrap gap-2">
//                                       {therapist.specializations?.map((spec, index) => (
//                                         <Badge key={index} variant="outline">
//                                           {spec}
//                                         </Badge>
//                                       ))}
//                                     </div>
//                                   </div>

//                                   {therapist.qualifications?.length > 0 && (
//                                     <div>
//                                       <h4 className="font-semibold mb-2">Qualifications</h4>
//                                       <div className="space-y-2">
//                                         {therapist.qualifications.map((qual, index) => (
//                                           <div key={index} className="text-sm">
//                                             <span className="font-medium">{qual.degree}</span>
//                                             {qual.institution && <span> - {qual.institution}</span>}
//                                             }
//                                             {qual.year && <span> ({qual.year})</span>}
//                                             }
//                                           </div>
//                                         ))}
//                                       </div>
//                                     </div>
//                                   )}

//                                   <div className="grid grid-cols-2 gap-4 text-sm">
//                                     <div>
//                                       <span className="font-medium">Location:</span>
//                                       <p>{therapist.location?.city}, {therapist.location?.state}</p>
//                                     </div>
//                                     <div>
//                                       <span className="font-medium">Consultation Fee:</span>
//                                       <p>₹{therapist.consultationFee} per session</p>
//                                     </div>
//                                   </div>

//                                   <div className="flex gap-3">
//                                     <Button
//                                       onClick={() => contactTherapist(therapist, 'phone')}
//                                       className="flex-1"
//                                     >
//                                       <Phone className="w-4 h-4 mr-2" />
//                                       Call Now
//                                     </Button>
//                                     <Button
//                                       onClick={() => contactTherapist(therapist, 'email')}
//                                       variant="outline"
//                                       className="flex-1"
//                                     >
//                                       <Mail className="w-4 h-4 mr-2" />
//                                       Send Email
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </DialogContent>
//                             </Dialog>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             ) : (
//               <Card>
//                 <CardContent className="text-center py-12">
//                   <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold mb-2">
//                     {searchTerm || locationFilter !== 'all' || specializationFilter !== 'all'
//                       ? 'No therapists match your criteria'
//                       : 'No therapists available'
//                     }
//                   </h3>
//                   <p className="text-muted-foreground mb-6">
//                     {searchTerm || locationFilter !== 'all' || specializationFilter !== 'all'
//                       ? 'Try adjusting your search criteria or filters.'
//                       : 'Our therapist directory is being updated. Please check back soon.'
//                     }
//                   </p>
//                   <Button variant="outline" onClick={() => {
//                     setSearchTerm('');
//                     setLocationFilter('all');
//                     setSpecializationFilter('all');
//                   }}>
//                     Clear Filters
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
//           </motion.div>

//           {/* Emergency Support */}
//           <motion.div
//             className="mt-12"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//           >
//             <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <Heart className="w-6 h-6 text-red-600" />
//                   <h3 className="font-semibold text-red-800 dark:text-red-200">
//                     Need Immediate Support?
//                   </h3>
//                 </div>
//                 <div className="grid md:grid-cols-2 gap-4 text-sm text-red-700 dark:text-red-300">
//                   <div>
//                     <p className="font-medium mb-2">Crisis Helplines:</p>
//                     <p>• National Suicide Prevention: 988</p>
//                     <p>• Crisis Text Line: Text HOME to 741741</p>
//                     <p>• SAMHSA Helpline: 1-800-662-4357</p>
//                   </div>
//                   <div>
//                     <p className="font-medium mb-2">Emergency Services:</p>
//                     <p>• Call 911 for immediate danger</p>
//                     <p>• Go to nearest emergency room</p>
//                     <p>• Call local crisis intervention team</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </main>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Phone, Mail, Filter, Users, Award, Clock, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UserNavbar from '@/components/user-navbar';
import { toast } from 'sonner';

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [selectedTherapist, setSelectedTherapist] = useState(null);

  const specializations = [
    'Anxiety Disorders',
    'Depression',
    'PTSD',
    'Addiction',
    'Relationship Counseling',
    'Family Therapy',
    'Child Psychology',
    'Cognitive Behavioral Therapy',
    'Mindfulness-Based Therapy',
    'Trauma Therapy',
    'Eating Disorders',
    'Grief Counseling'
  ];

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const response = await fetch('/api/therapists', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setTherapists(data.therapists || []);
      } else {
        toast.error('Failed to load therapists');
      }
    } catch (error) {
      console.error('Error fetching therapists:', error);
      toast.error('Error loading therapist directory');
    } finally {
      setLoading(false);
    }
  };

  const contactTherapist = (therapist, method) => {
    if (method === 'phone') {
      window.location.href = `tel:${therapist.phone}`;
      toast.success(`Calling ${therapist.name}...`);
    } else if (method === 'email') {
      window.location.href = `mailto:${therapist.email}`;
      toast.success(`Opening email to ${therapist.name}...`);
    }
  };

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.specializations?.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = locationFilter === 'all' || 
                           therapist.location?.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
                           therapist.location?.state?.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesSpecialization = specializationFilter === 'all' ||
                                 therapist.specializations?.includes(specializationFilter);
    
    return matchesSearch && matchesLocation && matchesSpecialization && therapist.isActive && therapist.isVerified;
  });

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
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-2">Find a Therapist</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with verified mental health professionals who can provide personalized support 
              for your wellness journey. All therapists are licensed and experienced.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="flex flex-col md:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Location (city, state)"
              value={locationFilter === 'all' ? '' : locationFilter}
              onChange={(e) => setLocationFilter(e.target.value || 'all')}
              className="w-48"
            />
          </motion.div>

          {/* Therapists Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {filteredTherapists.length > 0 ? (
              <div className="grid gap-6">
                {filteredTherapists.map((therapist) => (
                  <Card key={therapist._id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={therapist.profileImage} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                            {therapist.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold mb-1">{therapist.name}</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="default">Verified</Badge>
                                {therapist.rating > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                                    <span className="text-sm font-medium">{therapist.rating.toFixed(1)}</span>
                                    <span className="text-xs text-muted-foreground">
                                      ({therapist.reviews?.length || 0} reviews)
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">₹{therapist.consultationFee}</div>
                              <div className="text-xs text-muted-foreground">per session</div>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <MapPin className="w-4 h-4" />
                                {therapist.location?.city}, {therapist.location?.state}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Clock className="w-4 h-4" />
                                {therapist.experience} years experience
                              </div>
                              {therapist.languages?.length > 0 && (
                                <div className="text-sm text-muted-foreground">
                                  <strong>Languages:</strong> {therapist.languages.join(', ')}
                                </div>
                              )}
                            </div>

                            <div>
                              <div className="mb-2">
                                <span className="text-sm font-medium">Specializations:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {therapist.specializations?.slice(0, 3).map((spec, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {spec}
                                    </Badge>
                                  ))}
                                  {therapist.specializations?.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{therapist.specializations.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {therapist.bio && (
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                              {therapist.bio.length > 200 
                                ? `${therapist.bio.substring(0, 200)}...` 
                                : therapist.bio
                              }
                            </p>
                          )}

                          <div className="flex items-center gap-3">
                            <Button
                              onClick={() => contactTherapist(therapist, 'phone')}
                              className="flex items-center gap-2"
                            >
                              <Phone className="w-4 h-4" />
                              Call
                            </Button>
                            <Button
                              onClick={() => contactTherapist(therapist, 'email')}
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              <Mail className="w-4 h-4" />
                              Email
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline">
                                  View Profile
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{therapist.name}</DialogTitle>
                                  <DialogDescription>
                                    Complete therapist profile and qualifications
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-6">
                                  <div className="flex items-start gap-4">
                                    <Avatar className="w-16 h-16">
                                      <AvatarImage src={therapist.profileImage} />
                                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                                        {therapist.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <h3 className="text-xl font-bold mb-2">{therapist.name}</h3>
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="default">Verified Professional</Badge>
                                        {therapist.rating > 0 && (
                                          <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                                            <span className="font-medium">{therapist.rating.toFixed(1)}</span>
                                          </div>
                                        )}
                                      </div>
                                      <p className="text-muted-foreground">
                                        {therapist.experience} years of experience
                                      </p>
                                    </div>
                                  </div>

                                  {therapist.bio && (
                                    <div>
                                      <h4 className="font-semibold mb-2">About</h4>
                                      <p className="text-sm leading-relaxed">{therapist.bio}</p>
                                    </div>
                                  )}

                                  <div>
                                    <h4 className="font-semibold mb-2">Specializations</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {therapist.specializations?.map((spec, index) => (
                                        <Badge key={index} variant="outline">
                                          {spec}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  {therapist.qualifications?.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Qualifications</h4>
                                      <div className="space-y-2">
                                        {therapist.qualifications.map((qual, index) => (
                                          <div key={index} className="text-sm">
                                            <span className="font-medium">{qual.degree}</span>
                                            {qual.institution && <span> - {qual.institution}</span>}
                                            {qual.year && <span> ({qual.year})</span>}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Location:</span>
                                      <p>{therapist.location?.city}, {therapist.location?.state}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Consultation Fee:</span>
                                      <p>₹{therapist.consultationFee} per session</p>
                                    </div>
                                  </div>

                                  <div className="flex gap-3">
                                    <Button
                                      onClick={() => contactTherapist(therapist, 'phone')}
                                      className="flex-1"
                                    >
                                      <Phone className="w-4 h-4 mr-2" />
                                      Call Now
                                    </Button>
                                    <Button
                                      onClick={() => contactTherapist(therapist, 'email')}
                                      variant="outline"
                                      className="flex-1"
                                    >
                                      <Mail className="w-4 h-4 mr-2" />
                                      Send Email
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm || locationFilter !== 'all' || specializationFilter !== 'all'
                      ? 'No therapists match your criteria'
                      : 'No therapists available'
                    }
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || locationFilter !== 'all' || specializationFilter !== 'all'
                      ? 'Try adjusting your search criteria or filters.'
                      : 'Our therapist directory is being updated. Please check back soon.'
                    }
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setLocationFilter('all');
                    setSpecializationFilter('all');
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Emergency Support */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-red-600" />
                  <h3 className="font-semibold text-red-800 dark:text-red-200">
                    Need Immediate Support?
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-red-700 dark:text-red-300">
                  <div>
                    <p className="font-medium mb-2">Crisis Helplines:</p>
                    <p>• National Suicide Prevention: 988</p>
                    <p>• Crisis Text Line: Text HOME to 741741</p>
                    <p>• SAMHSA Helpline: 1-800-662-4357</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Emergency Services:</p>
                    <p>• Call 911 for immediate danger</p>
                    <p>• Go to nearest emergency room</p>
                    <p>• Call local crisis intervention team</p>
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