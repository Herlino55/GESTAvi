import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { loginUser } from './FetchData';
// import { useAuthStore } from '../stores/useAuthStore';

export const Login: React.FC = () => {
  const [form, setForm] = useState({email: "", password: ""});
  // const login = useAuthStore(state => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginUser(form.email, form.password)
        .then(user => {
          console.log("User logged in:", user);
          window.location.href = '/dashboard';
          
        })
        .catch(error => {
          console.error("Login error:", error);
          alert("Invalid credentials");
        });
      
      
    }
    catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials");
    }
    // const success = login(form.email, form.password);
    // if (!success) {
    //   alert("Email non reconnu. Veuillez réessayer.");
    // }
  };

  return (
    <div className="min-h-screen flex items-center flex-col justify-center p-4">
      <div className="flex justify-center mb-6">
          <div className=" p-3 rounded-2xl shadow-blue-200">
            <img src="images/logo2.jpg" className='w-[150px]' alt="logo-GestAvi" />
          </div>
        </div>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        
        
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
          Connexion
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Connectez-vous à votre compte
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email" 
            type="email" 
            placeholder="ex: admin@ferme.com"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            required
          />
          
          <Input 
            label="Mot de passe" 
            type="password" 
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            required
          />  
          
          
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