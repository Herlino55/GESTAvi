import React from 'react';
import { ArrowRight, Sun, Sprout, Wheat, Feather } from 'lucide-react';
import { useRouter } from "next/navigation";

const LandingPage = () => {
    const router = useRouter()
  // Fonction pour gérer le clic sur le bouton Genuka
  const handleGenukaClick = () => {
    router.push('/dashboard');
    // window.location.href = "https://genuka.com"; // À activer en prod
  };

  return (
    <div className="min-h-screen font-sans bg-stone-50 text-stone-800 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-700 rounded-lg">
                <Feather className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-2xl font-bold text-emerald-900 tracking-tight">
                Avi<span className="text-amber-500">Culture</span>
              </span>
            </div>
            <div className="hidden md:flex space-x-8 text-emerald-900 font-medium">
              <a href="#vision" className="hover:text-amber-600 transition-colors">Notre Vision</a>
              <a href="#pratiques" className="hover:text-amber-600 transition-colors">Pratiques</a>
              <a href="#technologie" className="hover:text-amber-600 transition-colors">Technologie</a>
            </div>
            <button 
              onClick={handleGenukaClick}
              className="bg-emerald-800 hover:bg-emerald-900 text-amber-50 px-5 py-2 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              Connexion
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Image de fond : Paysage propice aux poulets */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1563205096-749448888b56?q=80&w=2070&auto=format&fit=crop" 
            alt="Poulets en liberté dans une ferme verdoyante" 
            className="w-full h-full object-cover"
          />
          {/* Overlay dégradé Vert/Or subtil */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-emerald-900/40 to-black/70"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <div className="inline-block animate-fade-in-down">
            <span className="bg-amber-500/20 border border-amber-400 text-amber-300 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
              L'excellence Avicole
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Élevez votre potentiel <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              Naturellement.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-10 font-light max-w-2xl mx-auto drop-shadow-md">
            L'aviculture moderne allie le respect de la nature aux outils de gestion de demain.
          </p>

          <button 
            onClick={handleGenukaClick}
            className="group relative bg-amber-500 hover:bg-amber-400 text-emerald-900 text-lg md:text-xl font-bold py-4 px-10 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Continuez avec Genuka
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
          </button>
        </div>
      </header>

      {/* --- SECTION CONTENU (Paragraphes Aviculture) --- */}
      <section id="vision" className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Texte */}
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-emerald-900 border-l-4 border-amber-500 pl-6">
                L'Art de l'Aviculture
              </h2>
              
              <div className="prose prose-lg text-stone-600">
                <p>
                  L'aviculture est bien plus qu'une simple production animale ; c'est un engagement envers le cycle de la vie. Dans un paysage verdoyant où chaque poulet peut exprimer son comportement naturel, nous cultivons une qualité supérieure. Un sol riche, une herbe grasse et un soleil généreux sont les ingrédients premiers d'un élevage réussi.
                </p>
                <p>
                  Aujourd'hui, l'éleveur moderne doit être à la fois gardien de ses bêtes et gestionnaire avisé. La santé du troupeau passe par une surveillance rigoureuse de l'alimentation, de l'hygiène et du bien-être animal. C'est dans cet équilibre entre tradition fermière et rigueur sanitaire que se construit la rentabilité d'une exploitation.
                </p>
                <p className="font-medium text-emerald-800">
                  Avec les bons outils, chaque étape, de l'éclosion à la maturité, devient une opportunité d'optimisation. La gestion de ferme n'est plus un fardeau, mais un levier de croissance puissant pour l'agriculteur visionnaire.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-50 px-4 py-2 rounded-lg">
                  <Sun className="w-5 h-5 text-amber-500" />
                  Bien-être animal
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-50 px-4 py-2 rounded-lg">
                  <Sprout className="w-5 h-5 text-amber-500" />
                  Croissance durable
                </div>
              </div>
            </div>

            {/* Image d'illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500 rounded-2xl transform rotate-3 translate-x-2 translate-y-2 opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1566453837936-a14a387588e7?q=80&w=1974&auto=format&fit=crop" 
                alt="Poulet de ferme en gros plan" 
                className="relative rounded-2xl shadow-2xl z-10 w-full object-cover h-[500px]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl z-20 border-t-4 border-amber-500 max-w-xs">
                <p className="text-emerald-900 italic font-medium">
                  "Un élevage sain commence par une gestion saine."
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- SECTION CARDS --- */}
      <section id="pratiques" className="py-20 bg-emerald-900 text-white relative overflow-hidden">
        {/* Décoration de fond */}
        <Wheat className="absolute top-10 right-10 text-emerald-800 w-64 h-64 opacity-20 -rotate-12" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Les Piliers de la Réussite</h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Carte 1 */}
            <div className="bg-emerald-800/50 backdrop-blur-sm p-8 rounded-2xl border border-emerald-700 hover:border-amber-500 transition-colors group">
              <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">Environnement</h3>
              <p className="text-emerald-100/80 leading-relaxed">
                Créer un espace propice où la nature joue son rôle. Une ventilation naturelle et un accès au plein air garantissent des animaux robustes.
              </p>
            </div>

            {/* Carte 2 */}
            <div className="bg-emerald-800/50 backdrop-blur-sm p-8 rounded-2xl border border-emerald-700 hover:border-amber-500 transition-colors group">
              <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wheat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">Alimentation</h3>
              <p className="text-emerald-100/80 leading-relaxed">
                Le choix des grains est crucial. Une nutrition équilibrée, riche en protéines végétales et minéraux, assure une croissance optimale sans forcer la nature.
              </p>
            </div>

            {/* Carte 3 */}
            <div className="bg-emerald-800/50 backdrop-blur-sm p-8 rounded-2xl border border-emerald-700 hover:border-amber-500 transition-colors group">
              <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Feather className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">Suivi Digital</h3>
              <p className="text-emerald-100/80 leading-relaxed">
                L'œil de l'éleveur se prolonge dans le numérique. Suivez vos stocks, vos pertes et vos ventes pour ne rien laisser au hasard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-24 bg-stone-100 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-emerald-900 mb-8">
            Prêt à transformer votre élevage ?
          </h2>
          <p className="text-lg text-stone-600 mb-10 max-w-2xl mx-auto">
            Rejoignez la communauté des éleveurs qui utilisent la technologie pour revenir à l'essentiel : produire mieux.
          </p>
          
          <button 
            onClick={handleGenukaClick}
            className="inline-flex items-center gap-3 bg-emerald-900 hover:bg-emerald-800 text-amber-400 font-bold text-xl py-5 px-12 rounded-full shadow-2xl transition-all hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)] transform hover:-translate-y-1"
          >
            Continuez avec Genuka
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* --- SIMPLE FOOTER --- */}
      <footer className="bg-white border-t border-emerald-100 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-stone-500 text-sm">
          <p>© 2024 Genuka Farms. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-amber-600">Politique de confidentialité</a>
            <a href="#" className="hover:text-amber-600">Conditions d'utilisation</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;