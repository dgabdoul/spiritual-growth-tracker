
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Book } from 'lucide-react';
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

const QuranSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<QuranSearchResult | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(searchTerm)}/all/en`);
      const data: QuranApiResponse = await response.json();
      
      if (data.code !== 200 || !data.data) {
        throw new Error('Failed to fetch search results');
      }
      
      setSearchResults(data.data);
      
      if (data.data.count === 0) {
        toast({
          title: "No results found",
          description: "Try another search term or check your spelling",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching Quran:', error);
      toast({
        title: "Error",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8 text-center">
          <Book className="h-12 w-12 mb-3 text-spirit-purple" />
          <h1 className="text-3xl font-bold text-gradient mb-2">Recherche de Versets du Coran</h1>
          <p className="text-gray-600">Recherchez des versets du Coran par mot clé</p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recherche de Versets</CardTitle>
            <CardDescription>
              Entrez un mot ou une phrase pour trouver des versets correspondants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Exemple: Abraham, Moses, Jesus..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" className="bg-spirit-purple hover:bg-spirit-deep-purple" disabled={isLoading}>
                {isLoading ? "Recherche..." : "Rechercher"}
              </Button>
            </form>
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
              <h2 className="text-xl font-semibold">Résultats ({searchResults.count})</h2>
            </div>

            {searchResults.count > 0 ? (
              <div className="space-y-4">
                {searchResults.matches.map((match, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="p-4">
                      <Tabs defaultValue="translation">
                        <TabsList className="mb-2">
                          <TabsTrigger value="translation">Traduction</TabsTrigger>
                          <TabsTrigger value="info">Informations</TabsTrigger>
                        </TabsList>
                        <TabsContent value="translation">
                          <div className="text-lg" dir="auto">{match.text}</div>
                        </TabsContent>
                        <TabsContent value="info">
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Sourate: {match.surah.englishName} ({match.surah.number})</p>
                            <p>Signification: {match.surah.englishNameTranslation}</p>
                            <p>Verset: {match.numberInSurah}</p>
                            <p>Page: {match.page} | Juz: {match.juz}</p>
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
                <p className="text-gray-500">Aucun résultat trouvé pour "{searchTerm}"</p>
                <p className="text-sm text-gray-400 mt-1">Essayez un autre terme ou vérifiez l'orthographe</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuranSearchPage;
