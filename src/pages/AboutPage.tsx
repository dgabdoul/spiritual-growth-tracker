
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { BookOpen, Heart, Users, ScrollText, Star, Compass } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-white py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              À propos de <span className="text-gradient">SpiritTrack</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez notre mission, notre vision et nos valeurs dédiées à votre développement spirituel et personnel.
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gradient">Notre mission</h2>
              <p className="text-gray-700 mb-4">
                SpiritTrack est né d'une vision simple mais puissante : aider chacun à suivre et améliorer son développement spirituel de manière holistique et mesurable.
              </p>
              <p className="text-gray-700 mb-4">
                Nous croyons fermement que la croissance personnelle n'est pas limitée à un seul domaine de la vie. C'est pourquoi notre plateforme vous accompagne dans cinq dimensions essentielles : psychologie, santé, spiritualité, relations et finances.
              </p>
              <p className="text-gray-700">
                Notre objectif est de vous offrir des outils scientifiquement validés pour évaluer votre progression, identifier vos points forts et vos axes d'amélioration, et vous guider vers votre meilleure version.
              </p>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://img.freepik.com/vecteurs-libre/fond-conception-lanternes-islamiques-aquarelles_23-2149374210.jpg" 
                alt="Notre mission" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gradient">Nos valeurs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Compass className="h-10 w-10 text-spirit-purple" />}
              title="Intégrité scientifique" 
              description="Nos évaluations et recommandations sont basées sur des recherches scientifiques rigoureuses et des méthodologies éprouvées."
              quoteType="Coran"
              quote="Dis : Sont-ils égaux, ceux qui savent et ceux qui ne savent pas ? Seules les personnes douées d'intelligence réfléchissent."
              quoteSource="Sourate Az-Zumar, verset 9"
              hadith="Quiconque suit un chemin à la recherche de la connaissance, Allah lui facilitera un chemin vers le Paradis."
              hadithSource="Rapporté par Muslim"
            />
            <ValueCard 
              icon={<Heart className="h-10 w-10 text-spirit-purple" />}
              title="Bienveillance" 
              description="Nous abordons chaque parcours avec empathie et sans jugement, reconnaissant l'unicité de chaque individu."
              quoteType="Coran"
              quote="Et par miséricorde de la part d'Allah, tu as été doux envers eux. Si tu avais été rude et dur de cœur, ils se seraient enfuis de ton entourage."
              quoteSource="Sourate Al-Imran, verset 159"
              hadith="Les croyants, dans leur affection, leur miséricorde et leur sympathie les uns envers les autres, sont comme un seul corps : si un membre souffre, tout le corps partage sa souffrance, sa fièvre et son insomnie."
              hadithSource="Rapporté par Al-Bukhari et Muslim"
            />
            <ValueCard 
              icon={<Users className="h-10 w-10 text-spirit-purple" />}
              title="Communauté" 
              description="Nous croyons au pouvoir du soutien mutuel et de l'apprentissage collectif pour une croissance durable."
              quoteType="Coran"
              quote="Entraidez-vous dans l'accomplissement des bonnes œuvres et de la piété et ne vous entraidez pas dans le péché et la transgression."
              quoteSource="Sourate Al-Maidah, verset 2"
              hadith="Le croyant est au croyant comme les parties d'un édifice qui se renforcent les unes les autres."
              hadithSource="Rapporté par Al-Bukhari et Muslim"
            />
            <ValueCard 
              icon={<BookOpen className="h-10 w-10 text-spirit-purple" />}
              title="Apprentissage continu" 
              description="Nous nous engageons à améliorer constamment nos connaissances et nos outils pour mieux vous servir."
              quoteType="Coran"
              quote="Ô mon Seigneur, accrois-moi en science."
              quoteSource="Sourate Ta-Ha, verset 114"
              hadith="La recherche du savoir est une obligation pour tout musulman."
              hadithSource="Rapporté par Ibn Majah"
            />
            <ValueCard 
              icon={<Star className="h-10 w-10 text-spirit-purple" />}
              title="Innovation" 
              description="Nous explorons sans cesse de nouvelles approches pour vous offrir la meilleure expérience possible."
              quoteType="Coran"
              quote="En vérité, dans la création des cieux et de la terre, et dans l'alternance de la nuit et du jour, il y a certes des signes pour les doués d'intelligence."
              quoteSource="Sourate Al-Imran, verset 190"
              hadith="Celui qui introduit une bonne pratique en Islam reçoit sa récompense et celle de tous ceux qui la suivent après lui, sans que leur récompense ne soit diminuée."
              hadithSource="Rapporté par Muslim"
            />
            <ValueCard 
              icon={<ScrollText className="h-10 w-10 text-spirit-purple" />}
              title="Transparence" 
              description="Nous communiquons clairement sur nos méthodes, nos sources et nos résultats pour établir une relation de confiance."
              quoteType="Coran"
              quote="Ô vous qui croyez! Craignez Allah et soyez avec les véridiques."
              quoteSource="Sourate At-Tawbah, verset 119"
              hadith="La véracité mène à la piété et la piété mène au Paradis. Et l'homme ne cesse d'être véridique jusqu'à ce qu'il soit inscrit auprès d'Allah comme très véridique."
              hadithSource="Rapporté par Al-Bukhari et Muslim"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-spirit-purple to-spirit-deep-purple text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à commencer votre parcours ?</h2>
          <p className="text-lg mb-8 opacity-90">
            Rejoignez notre communauté et commencez votre voyage de transformation personnelle aujourd'hui.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-spirit-deep-purple hover:bg-gray-100">
                S'inscrire gratuitement
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Se connecter
              </Button>
            </Link>
          </div>
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
                <li><Link to="/landing" className="text-gray-400 hover:text-white transition-colors">Accueil</Link></li>
                <li><Link to="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
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

// Value Card Component with Quran verse and hadith
const ValueCard = ({ 
  icon, 
  title, 
  description, 
  quoteType, 
  quote, 
  quoteSource, 
  hadith, 
  hadithSource 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  quoteType: string;
  quote: string;
  quoteSource: string;
  hadith: string;
  hadithSource: string;
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="border-t border-gray-100 pt-4 mt-3">
        <div className="mb-3">
          <p className="italic text-gray-600 text-sm">&ldquo;{quote}&rdquo;</p>
          <p className="text-spirit-purple text-xs font-medium mt-1">{quoteSource}</p>
        </div>
        <div>
          <p className="italic text-gray-600 text-sm">&ldquo;{hadith}&rdquo;</p>
          <p className="text-spirit-purple text-xs font-medium mt-1">{hadithSource}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
