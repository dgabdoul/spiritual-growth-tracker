import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAssessment, Category } from '@/contexts/assessment';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Lightbulb, Users, Coins } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import { Button } from '@/components/ui/button';
import { generate } from '@/integrations/replicate';
import { toast } from '@/components/ui/sonner';
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAuth();
  const { assessmentHistory, calculateCategoryScore, getAdvice } = useAssessment();
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [isPublic, setIsPublic] = useState(profile?.is_public || false);
  const [bio, setBio] = useState(profile?.bio || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const { toast } = useToast()
  const [assessmentData, setAssessmentData] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setIsPublic(profile.is_public || false);
      setBio(profile.bio || '');
    }
  }, [profile]);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching assessment data:', error);
        } else {
          setAssessmentData(data);
        }
      }
    };

    fetchAssessmentData();
  }, [user]);

  const latestAssessment = assessmentHistory.length > 0 ? assessmentHistory[assessmentHistory.length - 1] : null;

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const prompt = "a serene and inspiring landscape reflecting personal growth and spiritual balance";
      const imageUrl = await generate(prompt);
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem generating the image. Please try again.",
      })
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await updateProfile({
        display_name: displayName,
        is_public: isPublic,
        bio: bio
      });
      toast({
        title: "Profile updated successfully!",
      })
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to update profile. Please try again.",
      })
    } finally {
      setIsSavingProfile(false);
      setIsProfileDialogOpen(false);
    }
  };

  const psychologyScore = latestAssessment ? calculateCategoryScore('psychology') : 0;
  const healthScore = latestAssessment ? calculateCategoryScore('health') : 0;
  const spiritualityScore = latestAssessment ? calculateCategoryScore('spirituality') : 0;
  const relationshipsScore = latestAssessment ? calculateCategoryScore('relationships') : 0;
  const financesScore = latestAssessment ? calculateCategoryScore('finances') : 0;

  const categoryIcons: Record<Category, React.ReactNode> = {
    psychology: <Brain className="h-6 w-6" />,
    health: <Heart className="h-6 w-6" />,
    spirituality: <Lightbulb className="h-6 w-6" />,
    relationships: <Users className="h-6 w-6" />,
    finances: <Coins className="h-6 w-6" />
  };

  const categoryTitles: Record<Category, string> = {
    psychology: 'Mental Wellbeing',
    health: 'Physical Health',
    spirituality: 'Spiritual Growth',
    relationships: 'Social Connections',
    finances: 'Financial Wellness'
  };

  const categoryDescriptions: Record<Category, string> = {
    psychology: 'Your mental and emotional state.',
    health: 'Your physical health and habits.',
    spirituality: 'Your sense of purpose and connection.',
    relationships: 'Your relationships with others.',
    finances: 'Your financial stability and habits.'
  };

  if (!user) {
    return null;
  }

  const chartData = assessmentData.map(assessment => ({
    date: format(new Date(assessment.created_at), 'dd/MM/yy', { locale: fr }),
    psychology: assessment.psychology_score,
    health: assessment.health_score,
    spirituality: assessment.spirituality_score,
    relationships: assessment.relationships_score,
    finances: assessment.finances_score,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle>Welcome, {profile?.display_name || user.email}!</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Here's a snapshot of your spiritual journey.</p>
              <div className="mt-4">
                <Button onClick={() => navigate('/assessment')}>Take New Assessment</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle>Generate Inspiration</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Need a boost? Generate an image to inspire your journey.</p>
              <div className="mt-4">
                <Button onClick={handleGenerateImage} disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate Image"}
                </Button>
                {generatedImage && (
                  <img src={generatedImage} alt="Generated Inspiration" className="mt-4 rounded-md" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CategoryCard
            category="psychology"
            title={categoryTitles['psychology']}
            score={psychologyScore}
            description={categoryDescriptions['psychology']}
            icon={categoryIcons['psychology']}
            advice={latestAssessment ? getAdvice('psychology') : undefined}
          />
          <CategoryCard
            category="health"
            title={categoryTitles['health']}
            score={healthScore}
            description={categoryDescriptions['health']}
            icon={categoryIcons['health']}
            advice={latestAssessment ? getAdvice('health') : undefined}
          />
          <CategoryCard
            category="spirituality"
            title={categoryTitles['spirituality']}
            score={spiritualityScore}
            description={categoryDescriptions['spirituality']}
            icon={categoryIcons['spirituality']}
            advice={latestAssessment ? getAdvice('spirituality') : undefined}
          />
          <CategoryCard
            category="relationships"
            title={categoryTitles['relationships']}
            score={relationshipsScore}
            description={categoryDescriptions['relationships']}
            icon={categoryIcons['relationships']}
            advice={latestAssessment ? getAdvice('relationships') : undefined}
          />
          <CategoryCard
            category="finances"
            title={categoryTitles['finances']}
            score={financesScore}
            description={categoryDescriptions['finances']}
            icon={categoryIcons['finances']}
            advice={latestAssessment ? getAdvice('finances') : undefined}
          />
        </div>

        <Card className="mt-8 bg-white shadow-md">
          <CardHeader>
            <CardTitle>Progression au fil du temps</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip />
                  <Legend />
                  <Bar dataKey="psychology" name="Psychologie" fill="#8884d8" />
                  <Bar dataKey="health" name="Santé" fill="#82ca9d" />
                  <Bar dataKey="spirituality" name="Spiritualité" fill="#ffc658" />
                  <Bar dataKey="relationships" name="Relations" fill="#a4de6c" />
                  <Bar dataKey="finances" name="Finances" fill="#d0ed57" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>Aucune donnée d'évaluation disponible pour le moment.</p>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="fixed bottom-4 right-4">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Display Name
              </Label>
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Public Profile
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch id="public" checked={isPublic} onCheckedChange={(checked) => setIsPublic(checked)} />
                <Label htmlFor="public">
                  Make profile public
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
            {isSavingProfile ? "Saving..." : "Save changes"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
