
import { Category, Assessment } from '@/contexts/assessment';
import { toast } from '@/components/ui/use-toast';

// DeepSeek API key
const DEEPSEEK_API_KEY = 'sk-e3b71b8cb5f94b95b19fcee5906d2cf1';

// Cache recommendations to avoid unnecessary API calls
const recommendationCache = new Map<string, CategoryRecommendation[]>();

interface RecommendationResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface CategoryRecommendation {
  category: Category;
  title: string;
  advice: string;
  quranVerse?: string;
  hadith?: string;
  actions: string[];
}

export const fetchRecommendation = async (assessment: Assessment | null): Promise<CategoryRecommendation[] | null> => {
  if (!assessment) return null;
  
  // Generate a cache key from the assessment
  const cacheKey = JSON.stringify(assessment.scores);
  
  // Check if recommendations are already in the cache
  if (recommendationCache.has(cacheKey)) {
    return recommendationCache.get(cacheKey) || null;
  }
  
  try {
    const categoryList: Category[] = Object.keys(assessment.scores) as Category[];
    const recommendations: CategoryRecommendation[] = [];
    
    // Use Promise.all to fetch recommendations in parallel
    const categoryPromises = categoryList.map(async (category) => {
      const score = assessment.scores[category] || 0;
      const promptContent = generatePromptForCategory(category, score);
      
      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { 
                role: "system", 
                content: "Tu es un assistant spirituel musulman bienveillant qui donne des conseils basés sur l'Islam. Ton rôle est d'aider à améliorer le bien-être spirituel et émotionnel. Réponds toujours en français. Structure ta réponse avec 4 parties: un conseil général, un verset du Coran approprié, un hadith pertinent, et 2-3 actions concrètes. Utilise le format JSON suivant exactement: {\"title\": \"titre court et motivant\", \"advice\": \"conseil général\", \"quranVerse\": \"verset du Coran avec référence\", \"hadith\": \"hadith avec source\", \"actions\": [\"action 1\", \"action 2\", \"action 3\"]}" 
              },
              { role: "user", content: promptContent }
            ],
            temperature: 0.7,
            max_tokens: 800,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`DeepSeek API Error: ${error}`);
        }

        const data: RecommendationResponse = await response.json();
        const content = data.choices[0]?.message?.content;

        try {
          // Parse the JSON response from DeepSeek
          const parsedRecommendation = JSON.parse(content);
          return {
            category,
            ...parsedRecommendation
          };
        } catch (e) {
          console.error('Failed to parse DeepSeek response:', e);
          return {
            category,
            title: "Recommandation pour " + getCategoryTitle(category),
            advice: "Nous n'avons pas pu générer une recommandation personnalisée à ce moment. Veuillez réessayer plus tard.",
            actions: ["Réessayer l'évaluation", "Consulter les guides généraux"]
          };
        }
      } catch (error) {
        console.error(`Error fetching recommendation for ${category}:`, error);
        return {
          category,
          title: "Recommandation pour " + getCategoryTitle(category),
          advice: "Erreur lors de la génération de la recommandation. Veuillez réessayer plus tard.",
          actions: ["Réessayer plus tard", "Contacter le support"]
        };
      }
    });
    
    // Wait for all recommendations to be processed
    const results = await Promise.all(categoryPromises);
    recommendations.push(...results);
    
    // Store in cache for future use
    recommendationCache.set(cacheKey, recommendations);
    
    return recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    toast({
      title: "Erreur",
      description: "Impossible de générer les recommandations. Veuillez réessayer plus tard.",
      variant: "destructive"
    });
    return null;
  }
};

// Memoization helper for category titles
const categoryTitles: Record<Category, string> = {
  psychology: 'Bien-être Mental',
  health: 'Santé Physique',
  spirituality: 'Croissance Spirituelle',
  relationships: 'Relations Sociales',
  finances: 'Bien-être Financier'
};

function generatePromptForCategory(category: Category, score: number): string {
  const categoryTitle = getCategoryTitle(category);
  
  let promptLevel = "";
  if (score >= 80) {
    promptLevel = "excellent";
  } else if (score >= 60) {
    promptLevel = "bon";
  } else if (score >= 40) {
    promptLevel = "moyen";
  } else {
    promptLevel = "faible";
  }
  
  return `Mon score dans la catégorie "${categoryTitle}" est ${score}% (niveau ${promptLevel}). 
    Donne-moi des conseils adaptés pour améliorer ce domaine selon les enseignements islamiques. 
    Inclus un verset du Coran et un hadith pertinents, ainsi que 2-3 actions concrètes que je peux mettre en place.`;
}

function getCategoryTitle(category: Category): string {
  return categoryTitles[category] || category;
}
