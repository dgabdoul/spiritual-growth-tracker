
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Book, Globe, Play, Pause, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuranSearchResult {
  count: number;
  matches: {
    number: number;
    text: string;
    surah: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
    };
    numberInSurah: number;
    juz: number;
    page: number;
  }[];
}

interface QuranApiResponse {
  code: number;
  status: string;
  data: QuranSearchResult;
}

interface AudioEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

interface AudioApiResponse {
  code: number;
  status: string;
  data: AudioEdition[];
}

const QuranSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<QuranSearchResult | null>(null);
  const [language, setLanguage] = useState<'en' | 'fr'>('fr'); // Default to French
  const [audioEditions, setAudioEditions] = useState<AudioEdition[]>([]);
  const [selectedAudioEdition, setSelectedAudioEdition] = useState<string>('');
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Fetch audio editions on component mount
  React.useEffect(() => {
    fetchAudioEditions();
  }, []);

  const fetchAudioEditions = async () => {
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/edition?format=audio&language=${language}&type=versebyverse`);
      const data: AudioApiResponse = await response.json();
      
      if (data.code === 200 && data.data && data.data.length > 0) {
        setAudioEditions(data.data);
        setSelectedAudioEdition(data.data[0].identifier); // Default to first audio edition
      }
    } catch (error) {
      console.error('Error fetching audio editions:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      // Use the selected language for the API call
      const response = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(searchTerm)}/all/${language}`);
      const data: QuranApiResponse = await response.json();
      
      if (data.code !== 200 || !data.data) {
        throw new Error('Failed to fetch search results');
      }
      
      setSearchResults(data.data);
      
      if (data.data.count === 0) {
        toast({
          title: language === 'en' ? "No results found" : "Aucun résultat trouvé",
          description: language === 'en' 
            ? "Try another search term or check your spelling" 
            : "Essayez un autre terme ou vérifiez l'orthographe",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching Quran:', error);
      toast({
        title: language === 'en' ? "Error" : "Erreur",
        description: language === 'en' 
          ? "An error occurred while searching. Please try again." 
          : "Une erreur est survenue pendant la recherche. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'fr' : 'en';
    setLanguage(newLang);
    
    // Fetch audio editions for the new language
    fetchAudioEditions();
    
    if (searchResults) {
      // Re-fetch results in the new language if we already have results
      handleSearch(new Event('submit') as any);
    }
  };

  const playAudio = async (surahNumber: number, verseNumber: number, index: number) => {
    if (!selectedAudioEdition) {
      toast({
        title: language === 'en' ? "No audio edition selected" : "Aucune édition audio sélectionnée",
        description: language === 'en' 
          ? "Please select an audio edition first" 
          : "Veuillez d'abord sélectionner une édition audio",
        variant: "default",
      });
      return;
    }

    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      if (currentlyPlaying === index) {
        setCurrentlyPlaying(null);
        return;
      }
    }

    setIsLoadingAudio(true);
    setCurrentlyPlaying(index);

    try {
      // Format URL for verse audio
      const audioUrl = `https://cdn.islamic.network/quran/audio/${selectedAudioEdition}/${surahNumber}${verseNumber.toString().padStart(3, '0')}.mp3`;
      
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      audioRef.current.src = audioUrl;
      audioRef.current.onloadedmetadata = () => {
        setIsLoadingAudio(false);
        audioRef.current?.play();
      };
      
      audioRef.current.onended = () => {
        setCurrentlyPlaying(null);
      };
      
      audioRef.current.onerror = () => {
        setIsLoadingAudio(false);
        setCurrentlyPlaying(null);
        toast({
          title: language === 'en' ? "Audio Error" : "Erreur Audio",
          description: language === 'en' 
            ? "Could not load audio for this verse" 
            : "Impossible de charger l'audio pour ce verset",
          variant: "destructive",
        });
      };
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsLoadingAudio(false);
      setCurrentlyPlaying(null);
      toast({
        title: language === 'en' ? "Audio Error" : "Erreur Audio",
        description: language === 'en' 
          ? "An error occurred while playing audio" 
          : "Une erreur est survenue lors de la lecture audio",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8 text-center">
          <Book className="h-12 w-12 mb-3 text-spirit-purple" />
          <h1 className="text-3xl font-bold text-gradient mb-2">
            {language === 'en' ? 'Quran Verse Search' : 'Recherche de Versets du Coran'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' ? 'Search for verses in the Quran by keyword' : 'Recherchez des versets du Coran par mot clé'}
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {language === 'en' ? 'Verse Search' : 'Recherche de Versets'}
                </CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Enter a word or phrase to find matching verses' 
                    : 'Entrez un mot ou une phrase pour trouver des versets correspondants'}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1" 
                onClick={toggleLanguage}
              >
                <Globe className="h-4 w-4" />
                {language === 'en' ? 'Français' : 'English'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={language === 'en' ? "Example: Abraham, Moses, Jesus..." : "Exemple: Abraham, Moïse, Jésus..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" className="bg-spirit-purple hover:bg-spirit-deep-purple" disabled={isLoading}>
                {isLoading 
                  ? (language === 'en' ? "Searching..." : "Recherche...") 
                  : (language === 'en' ? "Search" : "Rechercher")
                }
              </Button>
            </form>

            {audioEditions.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  {language === 'en' ? 'Select Audio Recitation:' : 'Sélectionner Récitation Audio:'}
                </label>
                <select
                  value={selectedAudioEdition}
                  onChange={(e) => setSelectedAudioEdition(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {audioEditions.map((edition) => (
                    <option key={edition.identifier} value={edition.identifier}>
                      {edition.englishName} ({edition.identifier})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </CardContent>
        </Card>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {!isLoading && searchResults && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {language === 'en' ? `Results (${searchResults.count})` : `Résultats (${searchResults.count})`}
              </h2>
            </div>

            {searchResults.count > 0 ? (
              <div className="space-y-4">
                {searchResults.matches.map((match, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="p-4">
                      <Tabs defaultValue="translation">
                        <div className="flex justify-between items-center mb-2">
                          <TabsList>
                            <TabsTrigger value="translation">
                              {language === 'en' ? 'Translation' : 'Traduction'}
                            </TabsTrigger>
                            <TabsTrigger value="info">
                              {language === 'en' ? 'Information' : 'Informations'}
                            </TabsTrigger>
                          </TabsList>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => playAudio(match.surah.number, match.numberInSurah, index)}
                            disabled={isLoadingAudio && currentlyPlaying === index}
                            className="ml-2"
                          >
                            {isLoadingAudio && currentlyPlaying === index ? (
                              <div className="flex items-center">
                                <span className="animate-spin mr-2">⏳</span>
                                {language === 'en' ? 'Loading...' : 'Chargement...'}
                              </div>
                            ) : currentlyPlaying === index ? (
                              <Pause className="h-4 w-4 mr-1" />
                            ) : (
                              <Volume2 className="h-4 w-4 mr-1" />
                            )}
                            {currentlyPlaying === index
                              ? (language === 'en' ? 'Stop' : 'Arrêter')
                              : (language === 'en' ? 'Listen' : 'Écouter')}
                          </Button>
                        </div>
                        <TabsContent value="translation">
                          <div className="text-lg" dir="auto">{match.text}</div>
                        </TabsContent>
                        <TabsContent value="info">
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              {language === 'en' ? 'Surah' : 'Sourate'}: {match.surah.englishName} ({match.surah.number})
                            </p>
                            <p>
                              {language === 'en' ? 'Meaning' : 'Signification'}: {match.surah.englishNameTranslation}
                            </p>
                            <p>
                              {language === 'en' ? 'Verse' : 'Verset'}: {match.numberInSurah}
                            </p>
                            <p>
                              {language === 'en' ? 'Page' : 'Page'}: {match.page} | 
                              {language === 'en' ? ' Juz' : ' Juz'}: {match.juz}
                            </p>
                          </div>
                        </TabsContent>
                      </Tabs>
                      <Separator className="my-3" />
                      <div className="text-sm font-medium">
                        {match.surah.englishName} ({match.surah.number}:{match.numberInSurah})
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-500">
                  {language === 'en' 
                    ? `No results found for "${searchTerm}"` 
                    : `Aucun résultat trouvé pour "${searchTerm}"`}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {language === 'en' 
                    ? "Try another term or check your spelling" 
                    : "Essayez un autre terme ou vérifiez l'orthographe"}
                </p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuranSearchPage;
