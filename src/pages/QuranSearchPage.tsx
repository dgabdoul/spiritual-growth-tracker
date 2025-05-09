
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Book, Globe, Volume2, Pause, ChevronUp, ChevronDown, Play, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

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
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [expandedVerses, setExpandedVerses] = useState<Set<number>>(new Set());
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioBitrate, setAudioBitrate] = useState<'64' | '128'>('128'); // Default to 128kbps
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Alafasy reciter is now fixed, so we don't need to fetch audio editions
  const reciterIdentifier = 'ar.alafasy';
  const reciterName = 'Mishary bin Rashid Alafasy';

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
      } else {
        // Auto-expand first few results
        const newExpanded = new Set<number>();
        data.data.matches.slice(0, 3).forEach((_, index) => newExpanded.add(index));
        setExpandedVerses(newExpanded);
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
    
    if (searchResults) {
      // Re-fetch results in the new language if we already have results
      handleSearch(new Event('submit') as any);
    }
  };

  const toggleVerseExpansion = (index: number) => {
    const newExpandedVerses = new Set(expandedVerses);
    if (newExpandedVerses.has(index)) {
      newExpandedVerses.delete(index);
    } else {
      newExpandedVerses.add(index);
    }
    setExpandedVerses(newExpandedVerses);
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stopAudio = (): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentlyPlaying(null);
      setAudioProgress(0);
    }
  };

  const seekAudio = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!audioRef.current || !audioDuration) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const seekPercentage = clickPosition / progressBarWidth;
    const seekTime = audioDuration * seekPercentage;
    
    audioRef.current.currentTime = seekTime;
    setAudioProgress(seekTime);
  };

  const playAudio = async (surahNumber: number, verseNumber: number, index: number) => {
    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (currentlyPlaying === index) {
        setCurrentlyPlaying(null);
        return;
      }
    }

    setIsLoadingAudio(true);
    setCurrentlyPlaying(index);

    try {
      // Format ayah number for the new API (sourate:verset format)
      const ayahNumber = `${surahNumber}:${verseNumber}`;
      
      // Format URL for the Alafasy recitation using the CDN
      // Format: https://cdn.islamic.network/quran/audio/{bitrate}/ar.alafasy/{surah}{verse_padded}.mp3
      const paddedVerseNumber = verseNumber.toString().padStart(3, '0');
      const audioUrl = `https://cdn.islamic.network/quran/audio/${audioBitrate}/${reciterIdentifier}/${surahNumber}${paddedVerseNumber}.mp3`;
      
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      audioRef.current.src = audioUrl;
      audioRef.current.onloadedmetadata = () => {
        setIsLoadingAudio(false);
        setAudioDuration(audioRef.current?.duration || 0);
        audioRef.current?.play();
        setIsPlaying(true);
      };
      
      audioRef.current.onended = () => {
        setCurrentlyPlaying(null);
        setIsPlaying(false);
        setAudioProgress(0);
      };

      audioRef.current.onpause = () => {
        setIsPlaying(false);
      };

      audioRef.current.onplay = () => {
        setIsPlaying(true);
      };
      
      audioRef.current.onerror = () => {
        setIsLoadingAudio(false);
        setCurrentlyPlaying(null);
        setIsPlaying(false);
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
      setIsPlaying(false);
      toast({
        title: language === 'en' ? "Audio Error" : "Erreur Audio",
        description: language === 'en' 
          ? "An error occurred while playing audio" 
          : "Une erreur est survenue lors de la lecture audio",
        variant: "destructive",
      });
    }
  };

  const togglePlayPause = (index: number) => {
    if (currentlyPlaying === index && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const getGradientClass = (index: number) => {
    const gradients = [
      "bg-gradient-to-r from-spirit-soft-purple to-spirit-light-purple",
      "bg-gradient-to-r from-blue-50 to-blue-100",
      "bg-gradient-to-r from-amber-50 to-amber-100",
      "bg-gradient-to-r from-emerald-50 to-emerald-100",
      "bg-gradient-to-r from-rose-50 to-rose-100"
    ];
    return gradients[index % gradients.length];
  };

  // Clean up audio and intervals when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Update audio progress when playing
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      progressIntervalRef.current = window.setInterval(() => {
        if (audioRef.current) {
          setAudioProgress(audioRef.current.currentTime);
          setAudioDuration(audioRef.current.duration || 0);
        }
      }, 100);
    } else if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="w-20 h-20 rounded-full bg-spirit-soft-purple flex items-center justify-center mb-6 shadow-lg">
            <Book className="h-10 w-10 text-spirit-purple" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-spirit-purple to-spirit-deep-purple mb-3">
            {language === 'en' ? 'Quranic Verse Explorer' : 'Explorateur de Versets Coraniques'}
          </h1>
          <p className="text-gray-600 text-lg max-w-md">
            {language === 'en' 
              ? 'Discover wisdom through keywords. Search the Quran with ease.' 
              : 'Découvrez la sagesse à travers des mots-clés. Explorez le Coran en toute simplicité.'}
          </p>
        </div>
        
        <Card className="mb-10 overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-spirit-soft-purple to-white border-b pb-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-spirit-deep-purple text-2xl">
                  {language === 'en' ? 'Search Verses' : 'Recherche de Versets'}
                </CardTitle>
                <CardDescription className="text-gray-700">
                  {language === 'en' 
                    ? 'Enter keywords to find relevant verses in the Quran' 
                    : 'Entrez des mots-clés pour trouver des versets pertinents dans le Coran'}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 bg-white hover:bg-gray-50" 
                onClick={toggleLanguage}
              >
                <Globe className="h-4 w-4" />
                {language === 'en' ? 'Français' : 'English'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex w-full items-center gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={language === 'en' ? "Abraham, Moses, Jesus..." : "Abraham, Moïse, Jésus..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-spirit-purple hover:bg-spirit-deep-purple h-12 px-6 shadow-md"
                disabled={isLoading}
              >
                {isLoading 
                  ? (language === 'en' ? "Searching..." : "Recherche...") 
                  : (language === 'en' ? "Search" : "Rechercher")
                }
              </Button>
            </form>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium mb-1 text-gray-700">
                    {language === 'en' ? 'Recitation by:' : 'Récitation par:'}
                  </p>
                  <p className="text-sm text-spirit-deep-purple font-semibold">{reciterName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{language === 'en' ? 'Audio Quality:' : 'Qualité Audio:'}</span>
                  <div className="flex gap-2">
                    <Button 
                      variant={audioBitrate === '64' ? "default" : "outline"} 
                      size="sm"
                      className={audioBitrate === '64' ? "bg-spirit-purple hover:bg-spirit-deep-purple" : ""} 
                      onClick={() => setAudioBitrate('64')}
                    >
                      64 kbps
                    </Button>
                    <Button 
                      variant={audioBitrate === '128' ? "default" : "outline"} 
                      size="sm" 
                      className={audioBitrate === '128' ? "bg-spirit-purple hover:bg-spirit-deep-purple" : ""} 
                      onClick={() => setAudioBitrate('128')}
                    >
                      128 kbps
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-1/3 rounded-md" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                  </div>
                  <Skeleton className="h-24 w-full mt-4 rounded-md" />
                  <div className="flex mt-4 items-center">
                    <Skeleton className="h-6 w-32 mr-3 rounded-md" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && searchResults && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-spirit-deep-purple">
                  {language === 'en' ? 'Results' : 'Résultats'}
                </h2>
                <Badge variant="outline" className="bg-spirit-soft-purple text-spirit-deep-purple border-0 px-3 py-1">
                  {searchResults.count}
                </Badge>
              </div>
            </div>

            {searchResults.count > 0 ? (
              <div className="space-y-6">
                {searchResults.matches.map((match, index) => (
                  <Card 
                    key={index} 
                    className={`overflow-hidden border-0 shadow-md hover:shadow-lg transition-all ${expandedVerses.has(index) ? getGradientClass(index) : 'bg-white'}`}
                  >
                    <div className="p-0">
                      <div 
                        className="p-6 cursor-pointer flex justify-between items-center"
                        onClick={() => toggleVerseExpansion(index)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-spirit-purple/20 flex items-center justify-center text-spirit-purple font-bold">
                            {match.surah.number}:{match.numberInSurah}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">{match.surah.englishName}</h3>
                            <p className="text-sm text-gray-600">{match.surah.englishNameTranslation}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {expandedVerses.has(index) ? (
                            <ChevronUp className="h-5 w-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                      </div>
                      
                      {expandedVerses.has(index) && (
                        <div className="px-6 pb-6">
                          <Separator className="my-3" />

                          {/* Audio controls - For Alafasy recitation */}
                          <div className="mb-4 p-3 rounded-lg bg-spirit-soft-purple/30">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (currentlyPlaying === index) {
                                      togglePlayPause(index);
                                    } else {
                                      playAudio(match.surah.number, match.numberInSurah, index);
                                    }
                                  }}
                                  disabled={isLoadingAudio && currentlyPlaying === index}
                                  className="h-10 w-10 rounded-full bg-spirit-purple text-white hover:bg-spirit-deep-purple"
                                >
                                  {isLoadingAudio && currentlyPlaying === index ? (
                                    <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                                  ) : currentlyPlaying === index && isPlaying ? (
                                    <Pause className="h-5 w-5" />
                                  ) : (
                                    <Play className="h-5 w-5 ml-0.5" />
                                  )}
                                </Button>
                                <div>
                                  <p className="text-sm font-medium text-spirit-deep-purple">
                                    {language === 'en' ? 'Recitation' : 'Récitation'}
                                  </p>
                                  <p className="text-xs text-gray-600">{reciterName}</p>
                                </div>
                              </div>
                              {currentlyPlaying === index && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    stopAudio();
                                  }}
                                  className="h-8 w-8 rounded-full hover:bg-red-100 text-red-500"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            {currentlyPlaying === index && (
                              <div className="mt-2">
                                <div 
                                  className="relative h-2 bg-gray-200 rounded-full cursor-pointer mb-1"
                                  onClick={seekAudio}
                                >
                                  <div 
                                    className="absolute top-0 left-0 h-full bg-spirit-purple rounded-full"
                                    style={{ width: `${audioDuration ? (audioProgress / audioDuration) * 100 : 0}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-600">
                                  <span>{formatTime(audioProgress)}</span>
                                  <span>{formatTime(audioDuration)}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <Tabs defaultValue="translation" className="w-full">
                            <TabsList className="mb-4">
                              <TabsTrigger value="translation" className="text-sm">
                                {language === 'en' ? 'Translation' : 'Traduction'}
                              </TabsTrigger>
                              <TabsTrigger value="info" className="text-sm">
                                {language === 'en' ? 'Details' : 'Détails'}
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="translation">
                              <ScrollArea className="max-h-60">
                                <div className="text-lg font-medium leading-relaxed p-2" dir="auto">
                                  {match.text}
                                </div>
                              </ScrollArea>
                            </TabsContent>
                            <TabsContent value="info">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-white/60 p-3 rounded-lg">
                                  <span className="block font-medium text-gray-700">
                                    {language === 'en' ? 'Surah' : 'Sourate'}
                                  </span>
                                  <span>{match.surah.englishName} ({match.surah.number})</span>
                                </div>
                                <div className="bg-white/60 p-3 rounded-lg">
                                  <span className="block font-medium text-gray-700">
                                    {language === 'en' ? 'Meaning' : 'Signification'}
                                  </span>
                                  <span>{match.surah.englishNameTranslation}</span>
                                </div>
                                <div className="bg-white/60 p-3 rounded-lg">
                                  <span className="block font-medium text-gray-700">
                                    {language === 'en' ? 'Verse' : 'Verset'}
                                  </span>
                                  <span>{match.numberInSurah}</span>
                                </div>
                                <div className="bg-white/60 p-3 rounded-lg">
                                  <span className="block font-medium text-gray-700">
                                    {language === 'en' ? 'Location' : 'Emplacement'}
                                  </span>
                                  <span>
                                    {language === 'en' ? 'Page' : 'Page'}: {match.page} | 
                                    {language === 'en' ? ' Juz' : ' Juz'}: {match.juz}
                                  </span>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-md bg-gray-50 p-8 text-center">
                <div className="flex flex-col items-center">
                  <Search className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg mb-2">
                    {language === 'en' 
                      ? `No results found for "${searchTerm}"` 
                      : `Aucun résultat trouvé pour "${searchTerm}"`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {language === 'en' 
                      ? "Try using different keywords or check your spelling" 
                      : "Essayez d'utiliser d'autres mots-clés ou vérifiez l'orthographe"}
                  </p>
                </div>
              </Card>
            )}
            
            {searchResults && searchResults.count > 5 && (
              <div className="mt-8 text-center">
                <p className="text-gray-500 mb-3">
                  {language === 'en'
                    ? `Showing ${searchResults.matches.length} of ${searchResults.count} results`
                    : `Affichage de ${searchResults.matches.length} sur ${searchResults.count} résultats`}
                </p>
              </div>
            )}
          </div>
        )}

        {!isLoading && !searchResults && (
          <Card className="border-0 shadow-md mt-8 bg-gradient-to-r from-spirit-soft-purple to-white p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow">
                <Search className="h-8 w-8 text-spirit-purple" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-800">
                {language === 'en' 
                  ? "Start your spiritual journey" 
                  : "Commencez votre voyage spirituel"}
              </h3>
              <p className="text-gray-600 max-w-md">
                {language === 'en' 
                  ? "Enter keywords above to search for verses in the Quran" 
                  : "Saisissez des mots-clés ci-dessus pour rechercher des versets dans le Coran"}
              </p>
            </div>
          </Card>
        )}

        <CardFooter className="text-center text-xs text-gray-500 mt-8 pt-8 border-t">
          {language === 'en' 
            ? "Data provided by Quran API (alquran.cloud)" 
            : "Données fournies par l'API du Coran (alquran.cloud)"}
        </CardFooter>
      </div>
    </div>
  );
};

export default QuranSearchPage;
