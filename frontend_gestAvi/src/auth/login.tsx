import React, { useState } from 'react';
import { Bird, ChevronRight } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuthStore } from '../stores/useAuthStore';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const login = useAuthStore(state => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email);
    if (!success) {
      alert("Email non reconnu. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
            <Bird size={40} className="text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
          Ferme Manager Pro
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Connectez-vous à votre compte
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email de démonstration" 
            type="email" 
            placeholder="ex: admin@ferme.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <div className="text-sm text-slate-500 pt-2">
            <p className="font-bold mb-1">Emails de démo disponibles :</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs ml-2">
              <li><Badge variant="info">ADMIN</Badge> : admin@ferme.com</li>
              <li><Badge variant="info">SECRETAIRE</Badge> : sarah@ferme.com</li>
              <li><Badge variant="info">EMPLOYE</Badge> : paul@ferme.com</li>
            </ul>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6" 
            icon={ChevronRight}
          >
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  );
};