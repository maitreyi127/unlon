import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CreatePageProps {
  onClose?: () => void;
}

export default function CreatePage({ onClose }: CreatePageProps = {}) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    datetime: '',
    duration: '',
    maxParticipants: '',
    location: '',
    vibes: [] as string[],
    image: '',
    visibility: 'public' as 'public' | 'private',
    acceptanceMode: 'manual' as 'manual' | 'auto',
  });
  
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [suggestedVibes, setSuggestedVibes] = useState<string[]>([]);
  const [showVibeSuggestions, setShowVibeSuggestions] = useState(false);

  const vibeOptions = ['Casual', 'Fun', 'Relaxed', 'Adventurous', 'Social', 'Creative', 'Active', 'Chill', 'Intellectual', 'Professional', 'Artistic', 'Musical', 'Sporty', 'Wellness', 'Tech', 'Food', 'Travel', 'Educational', 'Networking', 'Party'];

  const createActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/activities', data);
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: "Activity created successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      if (onClose) {
        onClose();
      } else {
        setLocation('/');
      }
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create activity", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.datetime || !formData.location || !formData.maxParticipants) {
      toast({ 
        title: "Missing required fields", 
        description: "Please fill in all required fields",
        variant: "destructive" 
      });
      return;
    }

    const submitData = {
      ...formData,
      maxParticipants: parseInt(formData.maxParticipants),
      datetime: new Date(formData.datetime).toISOString(),
    };

    createActivityMutation.mutate(submitData);
  };

  const toggleVibe = (vibe: string) => {
    setFormData(prev => ({
      ...prev,
      vibes: prev.vibes.includes(vibe) 
        ? prev.vibes.filter(v => v !== vibe)
        : [...prev.vibes, vibe]
    }));
  };

  const suggestVibes = async () => {
    if (!formData.title && !formData.description) {
      toast({ 
        title: "Add a title or description first", 
        description: "AI needs some context to suggest vibes",
        variant: "destructive" 
      });
      return;
    }

    setAiGenerating(true);
    try {
      // Simulate AI analysis based on title and description
      const text = `${formData.title} ${formData.description}`.toLowerCase();
      const suggestions: string[] = [];

      // Simple keyword-based AI suggestions
      if (text.includes('coffee') || text.includes('cafe') || text.includes('drink')) {
        suggestions.push('Casual', 'Social', 'Relaxed');
      }
      if (text.includes('tech') || text.includes('coding') || text.includes('programming')) {
        suggestions.push('Tech', 'Educational', 'Professional');
      }
      if (text.includes('music') || text.includes('guitar') || text.includes('jam')) {
        suggestions.push('Musical', 'Creative', 'Fun');
      }
      if (text.includes('book') || text.includes('reading') || text.includes('discussion')) {
        suggestions.push('Intellectual', 'Educational', 'Social');
      }
      if (text.includes('yoga') || text.includes('meditation') || text.includes('wellness')) {
        suggestions.push('Wellness', 'Relaxed', 'Chill');
      }
      if (text.includes('sport') || text.includes('fitness') || text.includes('workout')) {
        suggestions.push('Sporty', 'Active', 'Fun');
      }
      if (text.includes('art') || text.includes('creative') || text.includes('painting')) {
        suggestions.push('Artistic', 'Creative', 'Fun');
      }
      if (text.includes('party') || text.includes('celebration') || text.includes('birthday')) {
        suggestions.push('Party', 'Fun', 'Social');
      }
      if (text.includes('networking') || text.includes('business') || text.includes('professional')) {
        suggestions.push('Networking', 'Professional', 'Social');
      }
      if (text.includes('travel') || text.includes('adventure') || text.includes('explore')) {
        suggestions.push('Adventurous', 'Travel', 'Fun');
      }
      if (text.includes('food') || text.includes('cooking') || text.includes('dinner')) {
        suggestions.push('Food', 'Social', 'Fun');
      }

      // Add some default vibes if no specific matches
      if (suggestions.length === 0) {
        suggestions.push('Social', 'Fun', 'Casual');
      }

      // Remove duplicates and limit to 5 suggestions
      const uniqueSuggestions = [...new Set(suggestions)].slice(0, 5);
      setSuggestedVibes(uniqueSuggestions);
      setShowVibeSuggestions(true);

      toast({ 
        title: "AI suggested vibes!", 
        description: `Based on your event: ${uniqueSuggestions.join(', ')}`
      });
    } catch (error) {
      toast({ 
        title: "Failed to generate suggestions", 
        description: "Please try again",
        variant: "destructive" 
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, image: e.target?.result as string }));
        setShowImageOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImageWithAI = async () => {
    if (!formData.title && !formData.description) {
      toast({ 
        title: "Missing information", 
        description: "Please add a title or description first",
        variant: "destructive" 
      });
      return;
    }

    setAiGenerating(true);
    try {
      // Create a smart image prompt based on title and description
      const text = `${formData.title} ${formData.description}`.toLowerCase();
      let imagePrompt = '';
      let imageUrl = '';

      // Generate contextually relevant images based on event type
      if (text.includes('coffee') || text.includes('cafe') || text.includes('drink')) {
        imageUrl = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&h=600&q=80';
        imagePrompt = 'coffee shop meeting';
      } else if (text.includes('tech') || text.includes('coding') || text.includes('programming')) {
        imageUrl = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&h=600&q=80';
        imagePrompt = 'coding meetup';
      } else if (text.includes('music') || text.includes('guitar') || text.includes('jam')) {
        imageUrl = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&h=600&q=80';
        imagePrompt = 'music jam session';
      } else if (text.includes('book') || text.includes('reading') || text.includes('discussion')) {
        imageUrl = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&h=600&q=80';
        imagePrompt = 'book club discussion';
      } else if (text.includes('yoga') || text.includes('meditation') || text.includes('wellness')) {
        imageUrl = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&h=600&q=80';
        imagePrompt = 'yoga meditation session';
      } else if (text.includes('sport') || text.includes('fitness') || text.includes('workout')) {
        imageUrl = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=600&q=80';
        imagePrompt = 'fitness workout session';
      } else if (text.includes('art') || text.includes('creative') || text.includes('painting')) {
        imageUrl = 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8a?auto=format&fit=crop&w=800&h=600&q=80';
        imagePrompt = 'art creative workshop';
      } else if (text.includes('party') || text.includes('celebration') || text.includes('birthday')) {
        imageUrl = 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&h=600&q=80';
        imagePrompt = 'party celebration';
      } else if (text.includes('networking') || text.includes('business') || text.includes('professional')) {
        imageUrl = 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&h=600&q=80';
        imagePrompt = 'business networking event';
      } else if (text.includes('travel') || text.includes('adventure') || text.includes('explore')) {
        imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&h=600&q=80';
        imagePrompt = 'travel adventure';
      } else if (text.includes('food') || text.includes('cooking') || text.includes('dinner')) {
        imageUrl = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&h=600&q=80';
        imagePrompt = 'food cooking dinner';
      } else if (text.includes('game') || text.includes('board') || text.includes('play')) {
        imageUrl = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&h=600&q=80';
        imagePrompt = 'board games night';
      } else if (text.includes('study') || text.includes('academic') || text.includes('learning')) {
        imageUrl = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=600&q=80';
        imagePrompt = 'study group learning';
      } else {
        // Default social gathering image
        imageUrl = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&h=600&q=80';
        imagePrompt = 'social gathering event';
      }
      
      setFormData(prev => ({ ...prev, image: imageUrl }));
      setShowImageOptions(false);
      toast({ 
        title: "AI image generated!", 
        description: `Created: ${imagePrompt}`
      });
    } catch (error) {
      toast({ 
        title: "Failed to generate image", 
        description: "Please try again or upload manually",
        variant: "destructive" 
      });
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="flex-grow overflow-y-auto bg-white">
      <div className={`relative flex size-full ${onClose ? 'min-h-auto' : 'min-h-screen'} flex-col bg-white justify-between group/design-root overflow-x-hidden`}>
        <div>
          {/* Header - Only show when not in modal */}
          {!onClose && (
            <div className="flex items-center bg-white p-4 pb-2 justify-between max-w-[480px] mx-auto">
              <button 
                onClick={() => setLocation('/')}
                className="text-unalon-900 flex size-12 shrink-0 items-center cursor-pointer"
              >
                <span className="material-icons">close</span>
              </button>
              <h2 className="text-unalon-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
                New activity
              </h2>
            </div>
          )}
          
          {/* Close button for modal */}
          {onClose && (
            <div className="flex justify-end p-4">
              <button 
                onClick={onClose}
                className="text-unalon-600 hover:text-unalon-800 transition-colors duration-200 p-2 rounded-full hover:bg-unalon-100"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
          )}

          {/* Activity Title */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
            <label className="flex flex-col min-w-40 flex-1">
              <input 
                placeholder="What do you want to do? 👀" 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-unalon-900 focus:outline-0 focus:ring-0 border-none bg-unalon-200 focus:border-none h-14 placeholder:text-unalon-400 p-4 text-base font-normal leading-normal"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </label>
          </div>

          {/* When Section */}
          <h3 className="text-unalon-900 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 max-w-[480px] mx-auto">
            When
          </h3>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
            <label className="flex flex-col min-w-40 flex-1">
              <input 
                type="datetime-local" 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-unalon-900 focus:outline-0 focus:ring-0 border-none bg-unalon-200 focus:border-none h-14 placeholder:text-unalon-400 p-4 text-base font-normal leading-normal"
                value={formData.datetime}
                onChange={(e) => setFormData(prev => ({ ...prev, datetime: e.target.value }))}
              />
            </label>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
            <label className="flex flex-col min-w-40 flex-1">
              <input 
                type="text" 
                placeholder="Duration (e.g., 2 hours, 30 mins)" 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-unalon-900 focus:outline-0 focus:ring-0 border-none bg-unalon-200 focus:border-none h-14 placeholder:text-unalon-400 p-4 text-base font-normal leading-normal"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              />
            </label>
          </div>

          {/* Description */}
          <h3 className="text-unalon-900 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 max-w-[480px] mx-auto">
            Description
          </h3>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
            <label className="flex flex-col min-w-40 flex-1">
              <textarea 
                placeholder="Add a description" 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-unalon-900 focus:outline-0 focus:ring-0 border-none bg-unalon-200 focus:border-none min-h-36 placeholder:text-unalon-400 p-4 text-base font-normal leading-normal"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </label>
          </div>

          {/* Photo Section */}
          <h3 className="text-unalon-900 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 max-w-[480px] mx-auto">
            Add a photo
          </h3>
          
          {formData.image ? (
            <div className="max-w-[480px] mx-auto px-4 pb-4">
              <div className="relative">
                <img 
                  src={formData.image} 
                  alt="Activity preview" 
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1"
                >
                  <span className="material-icons text-sm">close</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-[480px] mx-auto px-4 pb-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowImageOptions(!showImageOptions)}
                  className="flex-1 bg-unalon-200 hover:bg-unalon-300 text-unalon-800 py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-icons">add_photo_alternate</span>
                  <span>Add Photo</span>
                </button>
                <button
                  onClick={generateImageWithAI}
                  disabled={aiGenerating}
                  className="flex-1 bg-unalon-accent-400 hover:bg-unalon-accent-500 text-white py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-icons">auto_awesome</span>
                  <span>{aiGenerating ? 'Generating...' : 'AI Generate'}</span>
                </button>
              </div>
              
              {showImageOptions && (
                <div className="mt-3 bg-unalon-100 rounded-xl p-4 border border-unalon-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="block w-full text-center py-8 border-2 border-dashed border-unalon-400 rounded-lg cursor-pointer hover:border-unalon-600 transition-colors"
                  >
                    <span className="material-icons text-4xl text-unalon-500 mb-2 block">cloud_upload</span>
                    <span className="text-unalon-700">Click to upload or drag photo here</span>
                  </label>
                  <button
                    onClick={() => setShowImageOptions(false)}
                    className="mt-3 w-full text-unalon-600 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* How many */}
          <h3 className="text-unalon-900 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 max-w-[480px] mx-auto">
            How many
          </h3>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
            <label className="flex flex-col min-w-40 flex-1">
              <input 
                type="number" 
                placeholder="Max number of participants" 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-unalon-900 focus:outline-0 focus:ring-0 border-none bg-unalon-200 focus:border-none h-14 placeholder:text-unalon-400 p-4 text-base font-normal leading-normal"
                value={formData.maxParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                min="1"
              />
            </label>
          </div>

          {/* Where */}
          <h3 className="text-unalon-900 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 max-w-[480px] mx-auto">
            Where
          </h3>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
            <label className="flex flex-col min-w-40 flex-1">
              <input 
                type="text" 
                placeholder="Location" 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-unalon-900 focus:outline-0 focus:ring-0 border-none bg-unalon-200 focus:border-none h-14 placeholder:text-unalon-400 p-4 text-base font-normal leading-normal"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </label>
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="flex items-center justify-center w-14 h-14 bg-unalon-accent-400 text-white rounded-xl hover:bg-unalon-accent-500 transition-colors"
            >
              <span className="material-icons">map</span>
            </button>
          </div>

          {/* Map Integration */}
          {showMap && (
            <div className="max-w-[480px] mx-auto px-4 pb-4">
              <div className="bg-unalon-100 rounded-xl p-4 border border-unalon-300">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-unalon-800">Popular Locations</h4>
                  <button onClick={() => setShowMap(false)}>
                    <span className="material-icons text-unalon-600">close</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {/* Sponsored Locations */}
                  <div className="mb-2">
                    <div className="text-xs text-unalon-400 font-medium px-3 py-1 bg-gradient-to-r from-unalon-accent-50 to-unalon-50 rounded-full flex items-center gap-1">
                      <span className="text-unalon-accent-400">✨</span>
                      Sponsored
                    </div>
                  </div>
                  {[
                    { name: 'Mocha Mojo Café', sponsored: true },
                    { name: 'The Daily Grind', sponsored: true },
                    { name: 'Creativity Explored', sponsored: true }
                  ].map(location => (
                    <button
                      key={location.name}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, location: location.name }));
                        setShowMap(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-gradient-to-r from-unalon-accent-50 to-white hover:from-unalon-accent-100 hover:to-unalon-50 transition-colors text-unalon-700 border-l-2 border-unalon-accent-300 shadow-sm"
                    >
                      📍 {location.name} 
                      <span className="text-xs text-unalon-accent-400 font-medium ml-2">✨</span>
                    </button>
                  ))}
                  
                  {/* Regular Locations */}
                  <div className="mt-3 mb-2">
                    <div className="text-xs text-unalon-500 px-3 py-1">
                      Popular Locations
                    </div>
                  </div>
                  {[
                    'Mission District',
                    'Golden Gate Park',
                    'Castro Street',
                    'Lombard Street',
                    'Fishermans Wharf',
                    'Union Square'
                  ].map(location => (
                    <button
                      key={location}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, location }));
                        setShowMap(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-white hover:bg-unalon-200 transition-colors text-unalon-700"
                    >
                      📍 {location}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Location Map Display */}
          {formData.location && (
            <div className="max-w-[480px] mx-auto px-4 pb-4">
              <div className="bg-unalon-100 rounded-xl p-4 border border-unalon-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-icons text-unalon-600">location_on</span>
                  <h4 className="font-semibold text-unalon-800">Location Preview</h4>
                </div>
                <div className="bg-white rounded-lg p-4 border border-unalon-200">
                  <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {formData.location}
                    </div>
                  </div>
                  <p className="text-sm text-unalon-600 mt-2 text-center">📍 {formData.location}</p>
                </div>
              </div>
            </div>
          )}

          {/* Vibe */}
          <div className="flex items-center justify-between px-4 pt-4 max-w-[480px] mx-auto">
            <h3 className="text-unalon-900 text-lg font-bold leading-tight tracking-[-0.015em]">
              Vibe
            </h3>
            <button
              onClick={suggestVibes}
              disabled={aiGenerating || (!formData.title && !formData.description)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                aiGenerating || (!formData.title && !formData.description)
                  ? 'bg-unalon-100 text-unalon-400 cursor-not-allowed'
                  : 'bg-unalon-accent-500 text-white hover:bg-unalon-accent-600 active:scale-95'
              }`}
            >
              <span className="material-icons text-sm">
                {aiGenerating ? 'hourglass_empty' : 'auto_awesome'}
              </span>
              {aiGenerating ? 'AI Thinking...' : 'AI Suggest'}
            </button>
          </div>

          {/* AI Suggested Vibes */}
          {showVibeSuggestions && suggestedVibes.length > 0 && (
            <div className="px-4 pb-2 max-w-[480px] mx-auto">
              <div className="bg-unalon-accent-50 border border-unalon-accent-200 rounded-xl p-3 mb-3">
                <p className="text-sm text-unalon-accent-700 mb-2">
                  <span className="material-icons text-sm mr-1">lightbulb</span>
                  AI suggested vibes for your event:
                </p>
                <div className="flex gap-2 flex-wrap">
                  {suggestedVibes.map((vibe) => (
                    <button
                      key={vibe}
                      onClick={() => toggleVibe(vibe)}
                      className={`flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-full pl-3 pr-3 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                        formData.vibes.includes(vibe)
                          ? 'bg-unalon-accent-500 text-white'
                          : 'bg-white border border-unalon-accent-300 text-unalon-accent-700 hover:bg-unalon-accent-100'
                      }`}
                    >
                      <p className="text-xs font-medium leading-normal">{vibe}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 p-3 flex-wrap pr-4 max-w-[480px] mx-auto">
            {vibeOptions.map((vibe) => (
              <button
                key={vibe}
                onClick={() => toggleVibe(vibe)}
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-4 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                  formData.vibes.includes(vibe)
                    ? 'bg-unalon-900 text-white'
                    : 'bg-unalon-200 text-unalon-900 hover:bg-unalon-900 hover:text-white'
                }`}
              >
                <p className="text-sm font-medium leading-normal">{vibe}</p>
              </button>
            ))}
          </div>

          {/* Visibility Options */}
          <h3 className="text-unalon-900 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 max-w-[480px] mx-auto">
            Visibility
          </h3>
          <div className="flex max-w-[480px] mx-auto px-4 pb-4 gap-3">
            <button
              onClick={() => setFormData(prev => ({ ...prev, visibility: 'public' }))}
              className={`flex-1 py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                formData.visibility === 'public'
                  ? 'bg-unalon-900 text-white'
                  : 'bg-unalon-200 text-unalon-800 hover:bg-unalon-300'
              }`}
            >
              <span className="material-icons text-sm">public</span>
              <span className="font-medium">Public</span>
            </button>
            <button
              onClick={() => setFormData(prev => ({ ...prev, visibility: 'private' }))}
              className={`flex-1 py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                formData.visibility === 'private'
                  ? 'bg-unalon-900 text-white'
                  : 'bg-unalon-200 text-unalon-800 hover:bg-unalon-300'
              }`}
            >
              <span className="material-icons text-sm">lock</span>
              <span className="font-medium">Private</span>
            </button>
          </div>

          {/* Request Acceptance - Only show after participants are entered */}
          {formData.maxParticipants && (
            <div className={`transition-all duration-300 ease-in-out ${formData.maxParticipants ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
              <h3 className="text-unalon-900 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 max-w-[480px] mx-auto">
                Request Acceptance
              </h3>
              <div className="flex max-w-[480px] mx-auto px-4 pb-4 gap-3">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, acceptanceMode: 'manual' }))}
                  className={`flex-1 py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                    formData.acceptanceMode === 'manual'
                      ? 'bg-unalon-900 text-white'
                      : 'bg-unalon-200 text-unalon-800 hover:bg-unalon-300'
                  }`}
                >
                  <span className="material-icons text-sm">how_to_reg</span>
                  <span className="font-medium">Manual</span>
                </button>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, acceptanceMode: 'auto' }))}
                  className={`flex-1 py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                    formData.acceptanceMode === 'auto'
                      ? 'bg-unalon-900 text-white'
                      : 'bg-unalon-200 text-unalon-800 hover:bg-unalon-300'
                  }`}
                >
                  <span className="material-icons text-sm">done_all</span>
                  <span className="font-medium text-xs">
                    Auto-accept first {formData.maxParticipants}
                  </span>
                </button>
              </div>

              {formData.acceptanceMode === 'auto' && (
                <div className="max-w-[480px] mx-auto px-4 pb-4">
                  <div className="bg-unalon-100 rounded-xl p-3 border border-unalon-300">
                    <p className="text-sm text-unalon-700 text-center">
                      <span className="material-icons text-sm mr-1">info</span>
                      The first {formData.maxParticipants} people to request will be automatically accepted
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create Button */}
        <div className="flex px-4 py-6 max-w-[480px] mx-auto w-full">
          <button 
            onClick={handleSubmit}
            disabled={createActivityMutation.isPending}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-black text-white text-base font-bold leading-normal tracking-[0.015em] w-full button-effect disabled:opacity-50"
          >
            <span className="truncate">
              {createActivityMutation.isPending ? 'Creating...' : 'Create Activity'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
