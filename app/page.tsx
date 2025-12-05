"use client";
import { useState } from "react";
import heroChicks from "@/public/file.svg";
import chickGallery from "@/public/file.svg";
import freshEggs from "@/public/file.svg";
import farmInterior from "@/public/file.svg";
import Image from "next/image";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: "🌿",
      title: "Organic Feed",
      description: "Our chickens are fed with 100% organic feed, ensuring the highest quality eggs and meat.",
    },
    {
      icon: "🏡",
      title: "Free Range",
      description: "All our poultry roam freely in spacious, natural environments for healthier livestock.",
    },
    {
      icon: "✨",
      title: "Farm Fresh",
      description: "From our farm to your table in less than 24 hours, guaranteeing maximum freshness.",
    },
  ];

  const farmers = [
    { name: "Marie Dupont", role: "Head Farmer", avatar: "MD" },
    { name: "Jean Pierre", role: "Veterinarian", avatar: "JP" },
    { name: "Claire Martin", role: "Quality Manager", avatar: "CM" },
    { name: "Lucas Bernard", role: "Operations", avatar: "LB" },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-sps backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐣</span>
            <span className="font-display text-xl font-semibold text-foreground">Poulet</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {["Accueil", "À propos", "Produits", "Galerie", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-green-700 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <button className="hidden md:block bg-green-500 text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
            Commander
          </button>

          <button 
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-t border-border py-4">
            <div className="container mx-auto px-4 flex flex-col gap-4">
              {["Accueil", "À propos", "Produits", "Galerie", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:bg-orange-dark transition-colors w-fit">
                Commander
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
                Bienvenue à notre ferme
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                The Poultry<br />
                <span className="text-primary">Farm Company</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-md">
                Découvrez nos produits fermiers de qualité supérieure, élevés avec passion et respect de la nature depuis 1985.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:bg-orange-dark transition-all hover:shadow-hover">
                  Découvrir nos produits
                </button>
                <button className="border-2 border-border text-foreground px-8 py-3.5 rounded-full font-medium hover:border-primary hover:text-primary transition-colors">
                  En savoir plus
                </button>
              </div>
            </div>

            <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-card">
                <Image
                  src={heroChicks}
                  alt="Poussins dans la ferme"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-card hidden lg:block">
                <p className="text-3xl font-display font-bold text-primary">35+</p>
                <p className="text-sm text-muted-foreground">Années d'expérience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-card">
                <img
                  src={farmInterior}
                  alt="Intérieur de la ferme"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary/10 rounded-full -z-10" />
            </div>

            <div>
              <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
                Notre histoire
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Une Ferme Propre et Parfumée
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Depuis trois générations, notre famille élève des volailles dans le respect des traditions et du bien-être animal. Notre ferme est reconnue pour ses pratiques durables et la qualité exceptionnelle de ses produits.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Nous croyons qu'une alimentation saine commence par des animaux heureux et bien traités. C'est pourquoi nous mettons tout en œuvre pour offrir à nos volailles les meilleures conditions de vie.
              </p>
              <button className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:bg-orange-dark transition-all hover:shadow-hover">
                Visiter la ferme
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
              Galerie
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Découvrez Notre Élevage
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={chickGallery}
                  alt="Poussin adorable"
                  className="w-80 h-80 object-cover rounded-full shadow-card"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-display text-lg font-bold">
                  100%
                  <br />
                  <span className="text-xs font-body">Bio</span>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-soft">
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Œufs Frais et Poules Fermières
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Nos œufs sont récoltés chaque matin et livrés frais à votre porte. Riches en oméga-3 et en vitamines, ils sont le fruit d'un élevage respectueux et attentionné.
              </p>
              <ul className="space-y-3 mb-8">
                {["Œufs bio certifiés", "Livraison quotidienne", "Traçabilité garantie", "Poules en liberté"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:bg-orange-dark transition-all hover:shadow-hover">
                Commander maintenant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
              Nos produits
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Produits Fermiers de Qualité
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: freshEggs, title: "Œufs Fermiers", price: "6.50€", unit: "la douzaine" },
              { img: chickGallery, title: "Poussins", price: "Sur demande", unit: "élevage" },
              { img: heroChicks, title: "Volailles", price: "15€", unit: "le kg" },
            ].map((product, index) => (
              <div
                key={product.title}
                className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {product.title}
                  </h3>
                  <p className="text-primary font-bold text-lg">
                    {product.price} <span className="text-sm text-muted-foreground font-normal">/ {product.unit}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
              Notre équipe
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Nos Fermiers Passionnés
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {farmers.map((farmer, index) => (
              <div key={farmer.name} className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-display text-xl font-bold text-primary">
                    {farmer.avatar}
                  </span>
                </div>
                <h4 className="font-display font-semibold text-foreground">{farmer.name}</h4>
                <p className="text-sm text-muted-foreground">{farmer.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Obtenez des Produits Avicoles de Qualité
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Commandez dès aujourd'hui et recevez vos produits frais directement de notre ferme à votre table. Livraison disponible dans toute la région.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-card text-foreground px-8 py-3.5 rounded-full font-medium hover:shadow-hover transition-all">
              Passer commande
            </button>
            <button className="border-2 border-primary-foreground text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:bg-primary-foreground hover:text-primary transition-colors">
              Nous contacter
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brown-dark py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🐣</span>
                <span className="font-display text-xl font-semibold text-cream">Poulet</span>
              </div>
              <p className="text-brown-light text-sm leading-relaxed">
                Une ferme familiale dédiée à la qualité et au bien-être animal depuis 1985.
              </p>
            </div>

            <div>
              <h4 className="font-display font-semibold text-cream mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                {["Accueil", "À propos", "Produits", "Contact"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-brown-light text-sm hover:text-cream transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-cream mb-4">Produits</h4>
              <ul className="space-y-2">
                {["Œufs fermiers", "Volailles", "Poussins", "Fumier bio"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-brown-light text-sm hover:text-cream transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-cream mb-4">Contact</h4>
              <ul className="space-y-2 text-brown-light text-sm">
                <li>📍 123 Route de la Ferme</li>
                <li>📞 01 23 45 67 89</li>
                <li>✉️ contact@poulet.fr</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-brown-light/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-brown-light text-sm">
              © 2024 Poulet Farm. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              {["Facebook", "Instagram", "Twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-brown-light text-sm hover:text-cream transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
