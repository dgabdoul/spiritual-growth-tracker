
import React from 'react';
import { Shield, Mail, LockKeyhole } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Politique de Confidentialité de SpiritTrack</h1>
            <p className="text-gray-600">Dernière mise à jour : 16 Avril 2025</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-spirit-purple" />
                <h2 className="text-xl font-semibold">1. Données Collectées</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Informations de compte</strong> : Adresse e-mail, nom d'utilisateur et mot de passe chiffré.</li>
                <li><strong>Données spirituelles</strong> : Vos évaluations et suivis dans les 5 dimensions clés.</li>
                <li><strong>Données techniques</strong> : Historique de connexion, adresse IP (masquée), type d'appareil.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <LockKeyhole className="h-6 w-6 text-spirit-purple" />
                <h2 className="text-xl font-semibold">2. Utilisation des Données</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fournir des recommandations personnalisées pour votre croissance spirituelle.</li>
                <li>Améliorer nos services grâce à des analyses statistiques anonymes.</li>
                <li>Sécuriser votre compte et prévenir les fraudes.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">3. Partage des Données</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Aucune vente de données</strong> : Vos informations ne sont jamais vendues à des tiers.</li>
                <li><strong>Sous-traitants</strong> : Nous utilisons des services sécurisés qui respectent le RGPD.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">4. Vos Droits (RGPD)</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Accès et rectification</strong> : Vous pouvez consulter et modifier vos données via votre compte.</li>
                <li><strong>Suppression</strong> : Vous pouvez demander la suppression de vos données à tout moment.</li>
                <li><strong>Portabilité</strong> : Export de vos données en format lisible.</li>
                <li><strong>Opposition</strong> : Vous pouvez refuser les analyses statistiques.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">5. Sécurité</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Chiffrement des données (AES-256).</li>
                <li>Sauvegardes régulières.</li>
                <li>Audits de sécurité annuels.</li>
              </ul>
            </CardContent>
          </Card>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-6 w-6 text-spirit-purple" />
              <h2 className="text-xl font-semibold">Contact DPO</h2>
            </div>
            <p>Email : dpo@spirittrack.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
