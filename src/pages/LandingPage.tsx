
import React, { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Heart, Star, Users, Coins, CheckCircle2, Compass } from 'lucide-react';
import Header from '@/components/Header';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Évaluations complètes",
    description: "Analysez votre progression dans 5 dimensions essentielles de la vie",
    icon: <CheckCircle2 className="h-8 w-8 text-spirit-purple" />
  },
  {
    title: "Visualisation intuitive",
    description: "Graphiques clairs pour visualiser votre progression au fil du temps",
    icon: <Star className="h-8 w-8 text-spirit-purple" />
  },
  {
    title: "Recommandations personnalisées",
    description: "Conseils adaptés à votre profil et à vos résultats",
    icon: <Compass className="h-8 w-8 text-spirit-purple" />
  },
  {
    title: "Rapports détaillés",
    description: "Exportez et partagez vos résultats facilement",
    icon: <BookOpen className="h-8 w-8 text-spirit-purple" />
  }
];

// Extraction du composant DimensionCard pour améliorer les performances de rendu
const DimensionCard = React.memo(({ icon, title, color, textColor }: { 
  icon: React.ReactNode; 
  title: string; 
  color: string; 
  textColor: string 
}) => {
  return (
    <div className={`${color} rounded-xl p-6 text-center h-full flex flex-col items-center justify-center transition-transform hover:scale-105`}>
      <div className={`${textColor} mb-4`}>{icon}</div>
      <h3 className={`text-xl font-semibold ${textColor}`}>{title}</h3>
    </div>
  );
});

// Utilisation du lazy loading pour la LandingPage
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section - Modern and Clean */}
      <section className="relative bg-white py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 md:space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Suivez votre <span className="text-gradient">progression spirituelle</span> en toute simplicité
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              Évaluez votre croissance personnelle dans 5 dimensions clés et recevez des recommandations adaptées à votre parcours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" prefetch="intent">
                <Button size="lg" className="bg-spirit-purple hover:bg-spirit-deep-purple text-white">
                  Commencer gratuitement <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login" prefetch="intent">
                <Button variant="outline" size="lg">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <img 
              src="/lovable-uploads/0101b87a-45a9-40d3-92b5-b71cdf749a5a.png" 
              alt="Digital Muslim Services Illustration" 
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-spirit-purple/30 to-transparent mix-blend-overlay"></div>
          </div>
        </div>
      </section>
      
      {/* Features Section - Grid Layout */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gradient">Fonctionnalités principales</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Notre plateforme vous offre tous les outils nécessaires pour suivre votre progression spirituelle et personnelle.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Dimensions Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gradient">Les cinq dimensions de croissance</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nous évaluons votre progression dans cinq aspects fondamentaux de la vie pour une approche holistique.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <DimensionCard icon={<Compass className="h-12 w-12" />} title="Psychologie" color="bg-blue-50" textColor="text-blue-700" />
            <DimensionCard icon={<Heart className="h-12 w-12" />} title="Santé" color="bg-green-50" textColor="text-green-700" />
            <DimensionCard icon={<Star className="h-12 w-12" />} title="Spiritualité" color="bg-purple-50" textColor="text-spirit-purple" />
            <DimensionCard icon={<Users className="h-12 w-12" />} title="Relations" color="bg-amber-50" textColor="text-amber-700" />
            <DimensionCard icon={<Coins className="h-12 w-12" />} title="Finances" color="bg-emerald-50" textColor="text-emerald-700" />
          </div>
        </div>
      </section>
      
      {/* CTA Section - White background */}
      <section className="py-20 px-6 bg-white text-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à commencer votre parcours ?</h2>
          <p className="text-lg mb-8 opacity-90">
            Créez votre compte aujourd'hui et prenez le contrôle de votre croissance personnelle et spirituelle.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-spirit-purple hover:bg-spirit-deep-purple text-white">
              Commencer maintenant <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">SpiritTrack</h3>
              <p className="text-gray-400 mb-6">
                Votre partenaire pour une croissance holistique et spirituelle équilibrée.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-4">Liens utiles</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">À propos</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-4">Légal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Conditions d'utilisation</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Politique de confidentialité</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} SpiritTrack. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Dimension Card Component
const DimensionCard = ({ icon, title, color, textColor }: { icon: React.ReactNode; title: string; color: string; textColor: string }) => {
  return (
    <div className={`${color} rounded-xl p-6 text-center h-full flex flex-col items-center justify-center transition-transform hover:scale-105`}>
      <div className={`${textColor} mb-4`}>{icon}</div>
      <h3 className={`text-xl font-semibold ${textColor}`}>{title}</h3>
    </div>
  );
};

export default LandingPage;
