
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Lightbulb, Heart, Users, BookOpen, ScrollText, Brain } from 'lucide-react';

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
              Découvrez notre mission, notre vision et notre équipe dédiée à votre développement spirituel et personnel.
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
                src="https://images.unsplash.com/photo-1501139083538-0139c4722333?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNwaXJpdHVhbGl0eXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=80" 
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
              icon={<Brain className="h-10 w-10 text-spirit-purple" />}
              title="Intégrité scientifique" 
              description="Nos évaluations et recommandations sont basées sur des recherches scientifiques rigoureuses et des méthodologies éprouvées."
            />
            <ValueCard 
              icon={<Heart className="h-10 w-10 text-spirit-purple" />}
              title="Bienveillance" 
              description="Nous abordons chaque parcours avec empathie et sans jugement, reconnaissant l'unicité de chaque individu."
            />
            <ValueCard 
              icon={<Users className="h-10 w-10 text-spirit-purple" />}
              title="Communauté" 
              description="Nous croyons au pouvoir du soutien mutuel et de l'apprentissage collectif pour une croissance durable."
            />
            <ValueCard 
              icon={<BookOpen className="h-10 w-10 text-spirit-purple" />}
              title="Apprentissage continu" 
              description="Nous nous engageons à améliorer constamment nos connaissances et nos outils pour mieux vous servir."
            />
            <ValueCard 
              icon={<Lightbulb className="h-10 w-10 text-spirit-purple" />}
              title="Innovation" 
              description="Nous explorons sans cesse de nouvelles approches pour vous offrir la meilleure expérience possible."
            />
            <ValueCard 
              icon={<ScrollText className="h-10 w-10 text-spirit-purple" />}
              title="Transparence" 
              description="Nous communiquons clairement sur nos méthodes, nos sources et nos résultats pour établir une relation de confiance."
            />
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gradient">Notre équipe</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TeamMember 
              name="Thomas Laurent" 
              role="Fondateur & Psychologue"
              image="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
              description="Psychologue clinicien avec plus de 15 ans d'expérience, Thomas a fondé SpiritTrack pour répondre à un besoin qu'il observait chez ses patients : disposer d'outils d'auto-évaluation fiables."
            />
            <TeamMember 
              name="Marie Dubois" 
              role="Experte en Développement Personnel"
              image="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
              description="Coach certifiée et auteure de plusieurs livres sur le développement personnel, Marie apporte son expertise pour créer des parcours d'évaluation pertinents et impactants."
            />
            <TeamMember 
              name="Jean Moreau" 
              role="Responsable Technique"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
              description="Expert en technologie avec une passion pour les applications au service du bien-être, Jean supervise le développement technique de la plateforme."
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

// Value Card Component
const ValueCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Team Member Component
const TeamMember = ({ name, role, image, description }: { name: string; role: string; image: string; description: string }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100">
      <div className="flex flex-col items-center mb-4">
        <img 
          src={image} 
          alt={name} 
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-spirit-purple font-medium">{role}</p>
      </div>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
};

export default AboutPage;
