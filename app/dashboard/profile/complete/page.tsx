"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Loader2, 
  User, 
  MapPin, 
  Globe, 
  Code, 
  Target, 
  CheckCircle,
  ArrowRight,
  Sprout,
  Info
} from "lucide-react"
import { useAuth } from "@/context/auth-context"

type InterestType = {
  id: string
  name: string
  icon: any
  description: string
}

const interests: InterestType[] = [
  { id: "farming", name: "Farming & Agriculture", icon: Sprout, description: "Organic farming, permaculture, crop management" },
  { id: "restaurant", name: "Restaurant & Food Service", icon: "🍽️", description: "Farm-to-table, culinary arts, food business" },
  { id: "crafts", name: "Craftsmanship & Trades", icon: "🛠️", description: "Woodworking, pottery, traditional crafts" },
  { id: "sustainability", name: "Environmental Work", icon: "🌍", description: "Conservation, renewable energy, green tech" },
  { id: "education", name: "Teaching & Training", icon: "📚", description: "Agricultural education, workshop instruction" },
  { id: "business", name: "Earth-based Business", icon: "💼", description: "Sustainable entrepreneurship, eco-commerce" }
]

export default function ProfileCompletePage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const totalSteps = 3

  // Enhanced Google OAuth user detection
  const providers = user?.app_metadata?.providers || []
  const primaryProvider = user?.app_metadata?.provider
  const hasGoogleMetadata = !!(
    user?.user_metadata?.picture ||
    user?.user_metadata?.provider_id ||
    user?.user_metadata?.sub
  )
  
  const isGoogleUser = 
    providers.includes('google') || 
    primaryProvider === 'google' ||
    hasGoogleMetadata
    
  const hasGoogleInfo = !!(user?.user_metadata?.name || user?.user_metadata?.picture)

  const [profile, setProfile] = useState({
    full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || "",
    location: "",
    current_role: "",
    career_interests: [] as string[],
    bio: "",
    experience_level: "",
    motivation: ""
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    console.log('👤 Profile completion for user:', {
      provider: user.app_metadata?.provider,
      hasName: !!(user.user_metadata?.name || user.user_metadata?.full_name),
      hasPicture: !!user.user_metadata?.picture,
      metadata: user.user_metadata
    })

    console.log('🔍 Enhanced provider detection:', {
      providers,
      primaryProvider,
      hasGoogleMetadata,
      isGoogleUser,
      hasGoogleInfo
    })

    // If user already has a complete profile, redirect to dashboard
    if (user.user_metadata?.profile_completed) {
      router.push("/dashboard")
      return
    }

    // For Google users, skip basic info step if they have name/email
    if (isGoogleUser && hasGoogleInfo) {
      console.log('🌐 Google user with basic info, skipping to interests')
      setStep(2) // Skip to interests step
    }

    // Pre-fill Google user data
    if (isGoogleUser) {
      setProfile(prev => ({
        ...prev,
        full_name: user.user_metadata?.name || user.user_metadata?.full_name || prev.full_name
      }))
    }
  }, [user, router, isGoogleUser, hasGoogleInfo])

  const handleInterestToggle = (interestId: string) => {
    setProfile(prev => ({
      ...prev,
      career_interests: prev.career_interests.includes(interestId)
        ? prev.career_interests.filter(id => id !== interestId)
        : [...prev.career_interests, interestId]
    }))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('💾 Completing profile for user:', user?.id)
      console.log('📊 Profile data:', profile)

      // Update user metadata (for immediate access)
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          ...profile,
          profile_completed: true,
          completed_at: new Date().toISOString()
        }
      })

      if (updateError) {
        throw updateError
      }

      console.log('✅ User metadata updated')

      // Also save to profiles table for extended queries and relationships
      if (user) {
        const profileData = {
          id: user.id,
          email: user.email,
          full_name: profile.full_name,
          location: profile.location,
          current_role: profile.current_role,
          career_interests: profile.career_interests,
          bio: profile.bio,
          experience_level: profile.experience_level,
          motivation: profile.motivation,
          profile_completed: true,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          signup_method: isGoogleUser ? 'google' : user.user_metadata?.signup_method || 'email',
          provider: user.app_metadata?.provider || 'email'
        }

        console.log('💾 Saving to profiles table:', profileData)

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(profileData)

        if (profileError) {
          console.warn('⚠️ Profile table update failed:', profileError.message)
          // Don't fail the entire process if profiles table isn't set up yet
        } else {
          console.log('✅ Profile saved to database')
        }
      }

      // Redirect to dashboard
      console.log('🚀 Redirecting to dashboard')
      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      console.error('❌ Profile completion error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const progress = (step / totalSteps) * 100

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-8">
      <div className="container max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to TechTo.Earth! 🌱
          </h1>
          <p className="text-lg text-gray-600">
            {isGoogleUser ? 
              "Let's complete your profile to personalize your journey from tech to earth-based careers." :
              "Let's set up your profile to personalize your journey from tech to earth-based careers."
            }
          </p>
          {isGoogleUser && hasGoogleInfo && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-blue-700">
                <Info className="h-4 w-4" />
                <span className="text-sm">
                  We've pre-filled your basic info from Google. Just add your interests and background!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Profile Setup Progress</span>
              <span className="font-medium text-green-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>{isGoogleUser && hasGoogleInfo ? "Google Info ✓" : "Basic Info"}</span>
              <span>Interests</span>
              <span>Background</span>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.user_metadata?.avatar_url || user.user_metadata?.picture} />
                <AvatarFallback className="bg-green-100 text-green-700 text-lg font-bold">
                  {profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 
                   user.email?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Step {step} of {totalSteps}</CardTitle>
                <CardDescription>
                  {step === 1 && "Tell us about yourself"}
                  {step === 2 && "What interests you?"}
                  {step === 3 && "Your background and goals"}
                </CardDescription>
                {isGoogleUser && (
                  <Badge variant="outline" className="mt-2">
                    <Globe className="h-3 w-3 mr-1" />
                    Google Account
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Your full name"
                    required
                    disabled={isGoogleUser && hasGoogleInfo} // Disable if from Google
                  />
                  {isGoogleUser && hasGoogleInfo && (
                    <p className="text-xs text-blue-600 mt-1">
                      ✓ Pre-filled from your Google account
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State/Country"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This helps us connect you with local opportunities and communities
                  </p>
                </div>

                <div>
                  <Label htmlFor="current_role">Current/Previous Tech Role</Label>
                  <Input
                    id="current_role"
                    value={profile.current_role}
                    onChange={(e) => setProfile(prev => ({ ...prev, current_role: e.target.value }))}
                    placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Career Interests */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-4">What earth-based careers interest you?</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Select all that apply. We'll personalize your experience based on your interests.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interests.map((interest) => {
                      const isSelected = profile.career_interests.includes(interest.id)
                      return (
                        <button
                          key={interest.id}
                          onClick={() => handleInterestToggle(interest.id)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            isSelected 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">{typeof interest.icon === 'string' ? interest.icon : '🌱'}</span>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{interest.name}</h4>
                                {isSelected && <CheckCircle className="h-4 w-4 text-green-600" />}
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{interest.description}</p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Background and Goals */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="experience_level">Experience with Earth-based Work</Label>
                  <select
                    id="experience_level"
                    value={profile.experience_level}
                    onChange={(e) => setProfile(prev => ({ ...prev, experience_level: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select your experience level</option>
                    <option value="complete_beginner">Complete beginner</option>
                    <option value="some_interest">Some interest/hobby experience</option>
                    <option value="some_experience">Some practical experience</option>
                    <option value="experienced">Experienced (career changer)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="motivation">What motivates your transition? *</Label>
                  <Textarea
                    id="motivation"
                    value={profile.motivation}
                    onChange={(e) => setProfile(prev => ({ ...prev, motivation: e.target.value }))}
                    placeholder="Tell us what's driving you to make this career change..."
                    rows={4}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This helps us understand your goals and provide better recommendations
                  </p>
                </div>

                <div>
                  <Label htmlFor="bio">Brief Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell the community a bit about yourself..."
                    rows={3}
                  />
                </div>
              </div>
            )}
          </CardContent>

          <div className="p-6 border-t bg-gray-50 flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || (isGoogleUser && hasGoogleInfo && step === 2)}
            >
              Back
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && !profile.full_name) ||
                  (step === 2 && profile.career_interests.length === 0) ||
                  (step === 3 && !profile.motivation)
                }
                className="bg-green-600 hover:bg-green-700"
              >
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={loading || !profile.motivation}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    Complete Profile <CheckCircle className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Benefits Card */}
        <Card className="mt-8 bg-gradient-to-r from-green-600 to-yellow-500 text-white">
          <CardContent className="pt-6">
            <h3 className="font-bold text-lg mb-4">What you'll get:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Personalized course recommendations</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Connect with like-minded professionals</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Local events and opportunities</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 