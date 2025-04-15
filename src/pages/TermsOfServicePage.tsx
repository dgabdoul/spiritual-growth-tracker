
import React from 'react';
import { FileText, User, Shield, Scale, Mail } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Conditions Générales d'Utilisation</h1>
            <p className="text-gray-600">Version 2.0.1 : Avril 2025</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-6 w-6 text-spirit-purple" />
                <h2 className="text-xl font-semibold">1. Compte Utilisateur</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vous êtes responsable de la confidentialité de votre compte.</li>
                <li>Vous garantissez l'exactitude des informations fournies.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-6 w-6 text-spirit-purple" />
                <h2 className="text-xl font-semibold">2. Utilisation du Service</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2">
                <li>SpiritTrack est destiné à un usage <strong>strictement personnel</strong>.</li>
                <li>Toute tentative d'automatisation ou d'accès non autorisé est interdite.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-spirit-purple" />
                <h2 className="text-xl font-semibold">3. Propriété Intellectuelle</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vous conservez la propriété de vos données spirituelles.</li>
                <li>SpiritTrack conserve les droits sur la plateforme, les algorithmes et les interfaces.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">4. Modération</h2>
              <p>Les contenus contraires aux valeurs éthiques et spirituelles pourront être supprimés.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">5. Résiliation</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vous pouvez supprimer votre compte à tout moment.</li>
                <li>Vos données seront anonymisées ou supprimées sous 30 jours.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">6. Modifications des CGU</h2>
              <p>Les mises à jour seront notifiées par e-mail 15 jours avant leur application.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="h-6 w-6 text-spirit-purple" />
                <h2 className="text-xl font-semibold">7. Litiges</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2">
                <li>En cas de litige, une médiation sera privilégiée.</li>
                <li>Juridiction compétente : Tribunaux français.</li>
              </ul>
            </CardContent>
          </Card>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-6 w-6 text-spirit-purple" />
              <h2 className="text-xl font-semibold">Comment Nous Contacter ?</h2>
            </div>
            <p className="mb-2">Pour toute question sur la confidentialité ou les conditions d'utilisation :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email : contact@spirittrack.com</li>
              <li>Site web : https://spirittrack.com/contact</li>
            </ul>
          </div>

          <p className="text-center text-gray-600 italic mt-8">
            SpiritTrack – Votre compagnon de croissance spirituelle
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
