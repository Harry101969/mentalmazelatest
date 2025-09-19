'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Plus, Edit, Trash2, Heart, Users, PhoneCall, MessageCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import UserNavbar from '@/components/user-navbar';
import { toast } from 'sonner';

export default function CallFriendPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
    isEmergency: false
  });

  const relationships = [
    'Family Member',
    'Close Friend',
    'Partner',
    'Therapist',
    'Support Group',
    'Mentor',
    'Other'
  ];

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Please fill in name and phone number');
      return;
    }

    try {
      const url = editingContact ? `/api/contacts/${editingContact._id}` : '/api/contacts';
      const method = editingContact ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newContact),
      });

      if (response.ok) {
        toast.success(editingContact ? 'Contact updated!' : 'Contact added!');
        setIsDialogOpen(false);
        setEditingContact(null);
        setNewContact({ name: '', phone: '', relationship: '', isEmergency: false });
        fetchContacts();
      } else {
        toast.error('Failed to save contact');
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Something went wrong');
    }
  };

  const deleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Contact deleted');
        fetchContacts();
      } else {
        toast.error('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Something went wrong');
    }
  };

  const editContact = (contact) => {
    setEditingContact(contact);
    setNewContact({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      isEmergency: contact.isEmergency
    });
    setIsDialogOpen(true);
  };

  const callContact = (contact) => {
    // Create a tel: link to initiate phone call
    window.location.href = `tel:${contact.phone}`;
    
    // Log the call attempt
    logCallAttempt(contact);
  };

  const logCallAttempt = async (contact) => {
    try {
      await fetch('/api/contacts/call-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          contactId: contact._id,
          contactName: contact.name
        }),
      });
    } catch (error) {
      console.error('Error logging call:', error);
    }
  };

  const callRandomContact = () => {
    const availableContacts = contacts.filter(c => !c.isEmergency);
    if (availableContacts.length === 0) {
      toast.error('No contacts available for random calling');
      return;
    }
    
    const randomContact = availableContacts[Math.floor(Math.random() * availableContacts.length)];
    callContact(randomContact);
    toast.success(`Calling ${randomContact.name}...`);
  };

  const emergencyContacts = contacts.filter(c => c.isEmergency);
  const regularContacts = contacts.filter(c => !c.isEmergency);

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
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-2">Call a Friend</h1>
            <p className="text-muted-foreground mb-6">
              Reach out to your support network when you need someone to talk to
            </p>
            
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={callRandomContact}
                disabled={regularContacts.length === 0}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Random Friend
              </Button>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingContact ? 'Edit Contact' : 'Add New Contact'}
                    </DialogTitle>
                    <DialogDescription>
                      Add someone to your support network who you can reach out to when needed
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter name"
                        value={newContact.name}
                        onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={newContact.phone}
                        onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Select
                        value={newContact.relationship}
                        onValueChange={(value) => setNewContact(prev => ({ ...prev, relationship: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationships.map((rel) => (
                            <SelectItem key={rel} value={rel}>
                              {rel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="emergency"
                        checked={newContact.isEmergency}
                        onCheckedChange={(checked) => setNewContact(prev => ({ ...prev, isEmergency: checked }))}
                      />
                      <Label htmlFor="emergency">Emergency contact</Label>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setEditingContact(null);
                          setNewContact({ name: '', phone: '', relationship: '', isEmergency: false });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={saveContact}>
                        {editingContact ? 'Update' : 'Add'} Contact
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {/* Emergency Contacts */}
          {emergencyContacts.length > 0 && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <Shield className="h-5 w-5" />
                    Emergency Contacts
                  </CardTitle>
                  <CardDescription className="text-red-600 dark:text-red-400">
                    Quick access to your emergency support network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {emergencyContacts.map((contact) => (
                      <div
                        key={contact._id}
                        className="flex items-center justify-between p-4 bg-white dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-red-900 dark:text-red-100">{contact.name}</h3>
                            <p className="text-sm text-red-700 dark:text-red-300">{contact.relationship}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => callContact(contact)}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <PhoneCall className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Button
                            onClick={() => editContact(contact)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Regular Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Support Network
                </CardTitle>
                <CardDescription>
                  Friends and family you can reach out to for support
                </CardDescription>
              </CardHeader>
              <CardContent>
                {regularContacts.length > 0 ? (
                  <div className="grid gap-4">
                    {regularContacts.map((contact) => (
                      <div
                        key={contact._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{contact.name}</h3>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                              {contact.isEmergency && (
                                <Badge variant="destructive" className="text-xs">
                                  Emergency
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => callContact(contact)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <PhoneCall className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Button
                            onClick={() => editContact(contact)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => deleteContact(contact._id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No contacts added yet</p>
                    <Button onClick={() => setIsDialogOpen(true)}>
                      Add Your First Contact
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                  💡 Tips for Reaching Out
                </h3>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>• It's okay to reach out when you're struggling - that's what friends are for</p>
                  <p>• You don't need a "good reason" to call someone you care about</p>
                  <p>• Sometimes just hearing a familiar voice can make a big difference</p>
                  <p>• Consider letting your contacts know they're on your support list</p>
                  <p>• Remember: most people feel honored to be someone's support person</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}