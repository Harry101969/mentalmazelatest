'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  Award,
  Clock,
  Users
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import AdminNavbar from '@/components/admin-navbar';

export default function AdminTherapistsPage() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState(null);
  const [newTherapistData, setNewTherapistData] = useState({
    name: '',
    email: '',
    phone: '',
    specializations: '',
    qualifications: '',
    experience: '',
    location: '',
    consultationFee: '',
    languages: '',
    bio: '',
    isVerified: false,
    isActive: true
  });
  const [isCreating, setIsCreating] = useState(false);

  const specializationOptions = [
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
      const response = await fetch('/api/admin/therapists', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setTherapists(data.therapists || []);
      } else {
        toast.error('Failed to fetch therapists');
      }
    } catch (error) {
      console.error('Error fetching therapists:', error);
      toast.error('Error loading therapists');
    } finally {
      setLoading(false);
    }
  };

  const saveTherapist = async (e) => {
    e.preventDefault();

    if (!newTherapistData.name || !newTherapistData.email || !newTherapistData.phone || !newTherapistData.specializations) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreating(true);

    try {
      const url = editingTherapist ? `/api/admin/therapists/${editingTherapist._id}` : '/api/admin/therapists';
      const method = editingTherapist ? 'PUT' : 'POST';

      const therapistData = {
        ...newTherapistData,
        specializations: newTherapistData.specializations.split(',').map(s => s.trim()).filter(s => s),
        qualifications: newTherapistData.qualifications ? newTherapistData.qualifications.split('\n').map(q => {
          const [degree, institution, year] = q.split('|').map(p => p.trim());
          return { degree, institution, year: year ? parseInt(year) : null };
        }).filter(q => q.degree) : [],
        experience: parseInt(newTherapistData.experience) || 0,
        consultationFee: parseFloat(newTherapistData.consultationFee) || 0,
        languages: newTherapistData.languages.split(',').map(l => l.trim()).filter(l => l),
        location: {
          city: newTherapistData.location.split(',')[0]?.trim() || '',
          state: newTherapistData.location.split(',')[1]?.trim() || '',
          country: newTherapistData.location.split(',')[2]?.trim() || 'India'
        }
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(therapistData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editingTherapist ? 'Therapist updated successfully!' : 'Therapist added successfully!');
        setIsDialogOpen(false);
        setEditingTherapist(null);
        resetForm();
        fetchTherapists();
      } else {
        toast.error(data.message || 'Failed to save therapist');
      }
    } catch (error) {
      console.error('Error saving therapist:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setNewTherapistData({
      name: '',
      email: '',
      phone: '',
      specializations: '',
      qualifications: '',
      experience: '',
      location: '',
      consultationFee: '',
      languages: '',
      bio: '',
      isVerified: false,
      isActive: true
    });
  };

  const editTherapist = (therapist) => {
    setEditingTherapist(therapist);
    setNewTherapistData({
      name: therapist.name,
      email: therapist.email,
      phone: therapist.phone,
      specializations: therapist.specializations?.join(', ') || '',
      qualifications: therapist.qualifications?.map(q => `${q.degree}|${q.institution}|${q.year || ''}`).join('\n') || '',
      experience: therapist.experience?.toString() || '',
      location: `${therapist.location?.city || ''}, ${therapist.location?.state || ''}, ${therapist.location?.country || ''}`,
      consultationFee: therapist.consultationFee?.toString() || '',
      languages: therapist.languages?.join(', ') || '',
      bio: therapist.bio || '',
      isVerified: therapist.isVerified || false,
      isActive: therapist.isActive !== false
    });
    setIsDialogOpen(true);
  };

  const toggleTherapistStatus = async (therapistId, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/therapists/${therapistId}/toggle-status`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success(`Therapist ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        fetchTherapists();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update therapist status');
      }
    } catch (error) {
      console.error('Error toggling therapist status:', error);
      toast.error('Something went wrong');
    }
  };

  const deleteTherapist = async (therapistId, therapistName) => {
    if (!confirm(`Are you sure you want to delete "${therapistName}"? This action cannot be undone.`)) return;

    try {
      const response = await fetch(`/api/admin/therapists/${therapistId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Therapist deleted successfully');
        fetchTherapists();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete therapist');
      }
    } catch (error) {
      console.error('Error deleting therapist:', error);
      toast.error('Something went wrong');
    }
  };

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.specializations?.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && therapist.isActive) ||
                         (statusFilter === 'inactive' && !therapist.isActive) ||
                         (statusFilter === 'verified' && therapist.isVerified) ||
                         (statusFilter === 'unverified' && !therapist.isVerified);
    
    return matchesSearch && matchesStatus;
  });

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
              <h1 className="text-3xl font-bold mb-2">Therapist Directory</h1>
              <p className="text-muted-foreground">
                Manage mental health professionals and their profiles.
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Therapist
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingTherapist ? 'Edit Therapist Profile' : 'Add New Therapist'}
                  </DialogTitle>
                  <DialogDescription>
                    Add a mental health professional to the directory for users to find and connect with.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={saveTherapist} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Dr. Sarah Johnson"
                        value={newTherapistData.name}
                        onChange={(e) => setNewTherapistData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="sarah@example.com"
                        value={newTherapistData.email}
                        onChange={(e) => setNewTherapistData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={newTherapistData.phone}
                        onChange={(e) => setNewTherapistData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        placeholder="5"
                        value={newTherapistData.experience}
                        onChange={(e) => setNewTherapistData(prev => ({ ...prev, experience: e.target.value }))}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specializations">Specializations * (comma separated)</Label>
                    <Input
                      id="specializations"
                      placeholder="Anxiety Disorders, Depression, PTSD"
                      value={newTherapistData.specializations}
                      onChange={(e) => setNewTherapistData(prev => ({ ...prev, specializations: e.target.value }))}
                      required
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {specializationOptions.slice(0, 6).map((spec) => (
                        <Badge
                          key={spec}
                          variant="outline"
                          className="cursor-pointer text-xs"
                          onClick={() => {
                            const current = newTherapistData.specializations;
                            const newSpec = current ? `${current}, ${spec}` : spec;
                            setNewTherapistData(prev => ({ ...prev, specializations: newSpec }));
                          }}
                        >
                          + {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualifications">Qualifications (format: Degree|Institution|Year, one per line)</Label>
                    <Textarea
                      id="qualifications"
                      placeholder="PhD in Clinical Psychology|Stanford University|2015&#10;Licensed Clinical Social Worker|California Board|2018"
                      value={newTherapistData.qualifications}
                      onChange={(e) => setNewTherapistData(prev => ({ ...prev, qualifications: e.target.value }))}
                      className="min-h-20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location (City, State, Country)</Label>
                      <Input
                        id="location"
                        placeholder="San Francisco, CA, USA"
                        value={newTherapistData.location}
                        onChange={(e) => setNewTherapistData(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                      <Input
                        id="consultationFee"
                        type="number"
                        placeholder="2000"
                        value={newTherapistData.consultationFee}
                        onChange={(e) => setNewTherapistData(prev => ({ ...prev, consultationFee: e.target.value }))}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="languages">Languages (comma separated)</Label>
                    <Input
                      id="languages"
                      placeholder="English, Hindi, Spanish"
                      value={newTherapistData.languages}
                      onChange={(e) => setNewTherapistData(prev => ({ ...prev, languages: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Dr. Sarah Johnson is a licensed clinical psychologist with over 10 years of experience..."
                      value={newTherapistData.bio}
                      onChange={(e) => setNewTherapistData(prev => ({ ...prev, bio: e.target.value }))}
                      className="min-h-24"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isVerified"
                        checked={newTherapistData.isVerified}
                        onCheckedChange={(checked) => setNewTherapistData(prev => ({ ...prev, isVerified: checked }))}
                      />
                      <Label htmlFor="isVerified">Verified Professional</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={newTherapistData.isActive}
                        onCheckedChange={(checked) => setNewTherapistData(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="isActive">Active Profile</Label>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingTherapist(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? 'Saving...' : editingTherapist ? 'Update Therapist' : 'Add Therapist'}
                    </Button>
                  </DialogFooter>
                </form>
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
                <UserCheck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{therapists.length}</div>
                <div className="text-sm text-muted-foreground">Total Therapists</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{therapists.filter(t => t.isVerified).length}</div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{therapists.filter(t => t.isActive).length}</div>
                <div className="text-sm text-muted-foreground">Active Profiles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {therapists.length > 0 ? (therapists.reduce((acc, t) => acc + (t.rating || 0), 0) / therapists.length).toFixed(1) : '0.0'}
                </div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Therapists</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="unverified">Unverified Only</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Therapists List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid gap-6">
              {filteredTherapists.length > 0 ? (
                filteredTherapists.map((therapist) => (
                  <Card key={therapist._id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={therapist.profileImage} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                            {therapist.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold mb-1">{therapist.name}</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={therapist.isVerified ? 'default' : 'secondary'}>
                                  {therapist.isVerified ? 'Verified' : 'Unverified'}
                                </Badge>
                                <Badge variant={therapist.isActive ? 'default' : 'outline'}>
                                  {therapist.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                {therapist.rating > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                                    <span className="text-sm font-medium">{therapist.rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => editTherapist(therapist)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => toggleTherapistStatus(therapist._id, therapist.isActive)}
                                >
                                  {therapist.isActive ? (
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
                                  onClick={() => deleteTherapist(therapist._id, therapist.name)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Mail className="w-4 h-4" />
                                {therapist.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Phone className="w-4 h-4" />
                                {therapist.phone}
                              </div>
                              {therapist.location?.city && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                  <MapPin className="w-4 h-4" />
                                  {therapist.location.city}, {therapist.location.state}
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                {therapist.experience} years experience
                              </div>
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
                              
                              {therapist.consultationFee > 0 && (
                                <div className="text-sm">
                                  <span className="font-medium">Fee:</span> ₹{therapist.consultationFee}/session
                                </div>
                              )}
                              
                              {therapist.languages?.length > 0 && (
                                <div className="text-sm">
                                  <span className="font-medium">Languages:</span> {therapist.languages.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>

                          {therapist.bio && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {therapist.bio.length > 200 
                                  ? `${therapist.bio.substring(0, 200)}...` 
                                  : therapist.bio
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <UserCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'No therapists match your criteria' 
                        : 'No therapists added yet'
                      }
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Add mental health professionals to help users find support.'
                      }
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)} size="lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Therapist
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