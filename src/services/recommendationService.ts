
import { Category, Assessment } from '@/contexts/assessment';
import { toast } from '@/components/ui/use-toast';

// DeepSeek API key
const DEEPSEEK_API_KEY = 'sk-e3b71b8cb5f94b95b19fcee5906d2cf1';

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
  
  try {
    const categoryList: Category[] = Object.keys(assessment.scores) as Category[];
    const recommendations: CategoryRecommendation[] = [];
    
    // Get recommendations for each category
    for (const category of categoryList) {
      const score = assessment.scores[category] || 0;
      const promptContent = generatePromptForCategory(category, score);
      
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
        recommendations.push({
          category,
          ...parsedRecommendation
        });
      } catch (e) {
        console.error('Failed to parse DeepSeek response:', e);
        recommendations.push({
          category,
          title: "Recommandation pour " + getCategoryTitle(category),
          advice: "Nous n'avons pas pu générer une recommandation personnalisée à ce moment. Veuillez réessayer plus tard.",
          actions: ["Réessayer l'évaluation", "Consulter les guides généraux"]
        });
      }
    }
    
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
  switch(category) {
    case 'psychology':
      return 'Bien-être Mental';
    case 'health':
      return 'Santé Physique';
    case 'spirituality':
      return 'Croissance Spirituelle';
    case 'relationships':
      return 'Relations Sociales';
    case 'finances':
      return 'Bien-être Financier';
    default:
      return category;
  }
}
