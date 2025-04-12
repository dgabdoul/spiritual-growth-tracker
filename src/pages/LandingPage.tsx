
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Brain, Lightbulb, Users, Coins } from 'lucide-react';
import Header from '@/components/Header';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-spirit-soft-purple py-20 px-6 flex-1">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            Track Your Spiritual Growth Journey
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
            Monitor your progress across 5 key life dimensions: Psychology, Health, Spirituality, Relationships, and Finances.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-spirit-purple hover:bg-spirit-deep-purple text-white">
                Start Your Journey
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Holistic Growth Tracking</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-spirit-soft-purple p-4 rounded-full mb-4">
                <Lightbulb className="text-spirit-deep-purple h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
              <p className="text-gray-600">
                Monitor your growth with intuitive assessments and beautiful visualizations.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-spirit-soft-purple p-4 rounded-full mb-4">
                <Brain className="text-spirit-deep-purple h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Personalized Insights</h3>
              <p className="text-gray-600">
                Receive tailored recommendations based on your assessment results.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-spirit-soft-purple p-4 rounded-full mb-4">
                <Heart className="text-spirit-deep-purple h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Holistic Growth</h3>
              <p className="text-gray-600">
                Balance all aspects of your life: mental, physical, spiritual, social, and financial.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient">The Five Dimensions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <Brain className="text-spirit-purple h-10 w-10 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Psychology</h3>
              <p className="text-gray-600 text-sm">Emotional well-being and mental health</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <Heart className="text-spirit-purple h-10 w-10 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Health</h3>
              <p className="text-gray-600 text-sm">Physical vitality and wellness</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <Lightbulb className="text-spirit-purple h-10 w-10 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Spirituality</h3>
              <p className="text-gray-600 text-sm">Connection to deeper values and purpose</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <Users className="text-spirit-purple h-10 w-10 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Relationships</h3>
              <p className="text-gray-600 text-sm">Quality of personal connections</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <Coins className="text-spirit-purple h-10 w-10 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Finances</h3>
              <p className="text-gray-600 text-sm">Prosperity and material stability</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-spirit-purple to-spirit-deep-purple text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-lg mb-10 opacity-90">
            Create your account today and take the first step toward holistic growth and self-improvement.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="bg-white text-spirit-deep-purple hover:bg-gray-100">
              Start Now
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white">SpiritTrack</h2>
            </div>
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} SpiritTrack. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
