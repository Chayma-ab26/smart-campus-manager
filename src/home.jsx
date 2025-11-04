import React from 'react';
import { Link } from 'react-router-dom';
import sc from "./assets/images/sc.jpg";
import "./home.css";
import './index.css';

export default function Home() {
  return (
    <div id="home">
      {/* HEADER */}
      <header className="header">
        <div className="logo">SmartCampus</div>
        <nav className="nav-links">
          <a href="#home">Accueil</a>
          <a href="#about">À propos</a>
          <Link to="/login" className="login-btn">Se connecter</Link>
        </nav>
      </header>

      {/* SECTION HERO */}
      <section className="hero-section">
        <img src={sc} alt="Smart Campus" className="hero-bg" />
        <div className="hero-overlay">
          <h1>Bienvenue sur Smart Campus</h1>
          <p>
            Connectez-vous, gérez et vivez votre campus de manière intelligente 🚀
          </p>
          <a href="#about" className="scroll-btn">En savoir plus</a>
        </div>
      </section>

      {/* SECTION À PROPOS */}
      <section id="about" className="about-section">
        <h2>À propos de Smart Campus</h2>
        <p>
          Smart Campus est une plateforme moderne qui simplifie la vie
          universitaire. Les étudiants, enseignants et administrateurs peuvent
          gérer les cours, les événements, les salles et les réservations dans un
          seul espace centralisé et intuitif.
        </p>
      </section>
    </div>
  );
}