"use client"

import { useEffect, useState } from 'react';
import Link from "next/link";
import Particles from "./components/particles";
import { allProjects } from "contentlayer/generated";
import { Card } from "./components/card";
import { Article } from "./projects/article";

const navigation = [
  { name: "Projects", href: "#projects" },
  { name: "Resume", href: "#resume" },
  { name: "Contact", href: "#contact" },
];

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [skipHeroAnimation, setSkipHeroAnimation] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if user is returning from a project page (has hash in URL)
    const hasHash = window.location.hash;
    if (hasHash) {
      // Skip animation and show scroll indicator immediately
      setSkipHeroAnimation(true);
      setShowScrollIndicator(true);
    } else {
      // First visit - show scroll indicator after landing animation completes (3 seconds)
      const timer = setTimeout(() => {
        setShowScrollIndicator(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Get projects data
  const views = allProjects.reduce((acc, project) => {
    acc[project.slug] = 0;
    return acc;
  }, {} as Record<string, number>);

  const featured = allProjects.find((project) => project.slug === "pact")!;
  const top2 = allProjects.find((project) => project.slug === "chainguardia")!;
  const top3 = allProjects.find((project) => project.slug === "2fold")!;
  const sorted = allProjects
    .filter((p) => p.published)
    .filter(
      (project) =>
        project.slug !== featured.slug &&
        project.slug !== top2.slug &&
        project.slug !== top3.slug,
    )
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  return (
    <div className="min-h-screen relative">
      {/* Subtle warm gradient overlay over paper texture */}
      <div className="fixed inset-0 bg-gradient-to-br from-cream-200/20 via-transparent to-cream-300/20 pointer-events-none z-0"></div>
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-matcha-300/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cream-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-matcha-200/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden relative px-4 z-10">
        <nav className={`my-8 md:my-16 ${skipHeroAnimation ? '' : 'animate-fade-in'} relative z-10`}>
          <ul className="flex items-center justify-center gap-6 md:gap-4">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-base md:text-sm font-light duration-300 text-subink hover:text-matcha-dark cursor-pointer px-4 py-2 rounded-xl hover:bg-latte/30 backdrop-blur-sm transition-all hover:shadow-matcha-sm"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.href === "#resume") {
                    setShowResumeModal(true);
                  } else if (item.href === "#contact") {
                    // Scroll to footer and highlight contact icons
                    document.querySelector('footer')?.scrollIntoView({
                      behavior: 'smooth'
                    });
                    // Add highlight effect to contact icons
                    setTimeout(() => {
                      const contactIcons = document.querySelectorAll('footer a') as NodeListOf<HTMLElement>;
                      contactIcons.forEach((icon, index) => {
                        // Add a more noticeable highlight effect with staggered timing
                        setTimeout(() => {
                          icon.style.transform = 'scale(1.3)';
                          icon.style.color = '#6fa051';
                          icon.style.filter = 'drop-shadow(0 0 20px rgba(111, 160, 81, 0.8))';
                          icon.style.transition = 'all 0.3s ease';
                          
                          // Add a subtle bounce effect
                          setTimeout(() => {
                            icon.style.transform = 'scale(1.1)';
                            setTimeout(() => {
                              icon.style.transform = 'scale(1.3)';
                            }, 150);
                          }, 200);
                          
                          // Remove the effect after 2.5 seconds
                          setTimeout(() => {
                            icon.style.transform = 'scale(1)';
                            icon.style.color = '';
                            icon.style.filter = '';
                          }, 2500);
                        }, index * 200); // Stagger each icon by 200ms
                      });
                    }, 500);
                  } else {
                    document.querySelector(item.href)?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                {item.name}
              </a>
            ))}
          </ul>
        </nav>
        {!skipHeroAnimation && (
          <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-matcha-300/0 via-matcha-400/60 to-matcha-300/0" />
        )}

        {/* Render Particles only when the component is mounted */}
        {isMounted && (
          <Particles
            className="absolute inset-0 -z-10 animate-fade-in opacity-40"
            quantity={80}
          />
        )}

        <h1 className={`py-3.5 px-0.5 z-10 text-5xl duration-1000 text-matcha cursor-default font-display sm:text-6xl md:text-9xl whitespace-nowrap text-center ${skipHeroAnimation ? '' : 'animate-title'}`} style={{ textShadow: '0 4px 12px rgba(95, 125, 78, 0.25), 0 0 30px rgba(167, 196, 154, 0.15)' }}>
          Ryan Nguyen
        </h1>

        {!skipHeroAnimation && (
          <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-matcha-300/0 via-matcha-400/60 to-matcha-300/0" />
        )}
        <div className={`my-8 md:my-16 text-center px-4 ${skipHeroAnimation ? '' : 'animate-fade-in'} relative z-10`}>
          <h2 className="text-xl md:text-lg text-matcha-dark mb-4 font-light tracking-wide">
            Aspiring AI Engineer & Full Stack Developer
          </h2>
          <p className="text-base md:text-sm text-subink max-w-2xl mx-auto leading-relaxed font-light">
            Passionate about transforming ideas into impactful applications through innovative AI solutions and robust web development.
          </p>
        </div>
        
        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${showScrollIndicator ? 'opacity-100 animate-gentle-bounce' : 'opacity-0'} z-10`}>
          <div className="w-6 h-10 border-2 border-matcha-500 rounded-full flex justify-center backdrop-blur-sm bg-cream-50/30">
            <div className="w-1 h-3 bg-matcha-500 rounded-full mt-2 animate-pulse-soft"></div>
          </div>
        </div>
      </div>


      {/* Projects Section */}
      <div id="projects" className={`relative pb-16 ${skipHeroAnimation ? '' : 'animate-fade-in'} z-10`}>
        <div className="px-4 pt-12 mx-auto space-y-6 max-w-7xl sm:px-6 md:space-y-8 md:pt-20 lg:px-8 md:space-y-16 lg:pt-32">
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <h2 className="text-4xl font-semibold tracking-tight text-matcha sm:text-5xl md:text-3xl lg:text-4xl font-display">
              Projects
            </h2>
            <p className="mt-4 text-base md:text-sm text-subink leading-relaxed font-light">
              A showcase of my innovative projects and collaborative efforts in AI, web development, and software engineering.
            </p>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-line/70 to-transparent" />

          <div className="grid grid-cols-1 gap-6 mx-auto lg:grid-cols-2 lg:gap-8">
            <Card>
              <Link href={`/projects/${featured.slug}`}>
                <article className="relative group w-full h-full p-6 md:p-8 flex flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm md:text-xs text-subink font-light">
                      {featured.date ? (
                        <time dateTime={new Date(featured.date).toISOString()}>
                          {Intl.DateTimeFormat(undefined, {
                            dateStyle: "medium",
                          }).format(new Date(featured.date))}
                        </time>
                      ) : (
                        <span>SOON</span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-subink">
                    </span>
                  </div>

                  <h2
                    id="featured-post"
                    className="mt-2 text-2xl font-semibold text-matcha sm:text-3xl md:text-4xl font-display"
                  >
                    {featured.title}
                  </h2>
                  <p className="mt-2 text-base md:text-sm leading-6 md:leading-8 duration-150 text-subink group-hover:text-matcha-dark font-light">
                    {featured.description}
                  </p>
                  <div className="mt-auto pt-6 md:pt-8">
                    <p className="text-matcha hover:text-matcha-light text-sm md:text-base font-medium flex items-center gap-2">
                      Read more <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                    </p>
                  </div>
                </article>
              </Link>
            </Card>

            <div className="flex flex-col w-full gap-6 mx-auto border-t border-line/30 lg:mx-0 lg:border-t-0 lg:gap-8">
              {[top2, top3].map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} />
                </Card>
              ))}
            </div>
          </div>
          <div className="hidden w-full h-px md:block bg-gradient-to-r from-transparent via-line/70 to-transparent" />

          <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 sm:grid-cols-2 md:grid-cols-3">
            {sorted.map((project) => (
              <Card key={project.slug}>
                <Article project={project} views={views[project.slug] ?? 0} />
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Resume Modal */}
      {showResumeModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-matcha-900/60 backdrop-blur-md px-4"
          style={{ animation: 'fadeIn 0.2s ease-in-out' }}
          onClick={() => setShowResumeModal(false)}
        >
          <div 
            className="relative bg-gradient-to-br from-card to-latte border-2 border-line/60 rounded-3xl p-8 max-w-md w-full shadow-matcha-xl"
            style={{ animation: 'fadeIn 0.3s ease-in-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowResumeModal(false)}
              className="absolute top-4 right-4 text-matcha hover:text-matcha-dark transition-colors p-2 hover:bg-latte/50 rounded-xl"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              {/* Icon */}
              <div className="mx-auto w-16 h-16 bg-latte rounded-2xl flex items-center justify-center mb-6 shadow-matcha-sm">
                <svg className="w-8 h-8 text-matcha" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <h3 className="text-2xl font-semibold text-matcha mb-2 font-display">My Resume</h3>
              <p className="text-subink mb-8 text-sm font-light">
                View my qualifications, experience, and skills
              </p>

              {/* Action buttons */}
              <div className="space-y-3">
                <a
                  href="/Ryan%20Nguyen%20Resume%202025.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-matcha hover:bg-matcha-dark text-cream-50 font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-matcha-md"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Resume
                  </span>
                </a>
                
                <a
                  href="/Ryan%20Nguyen%20Resume%202025.pdf"
                  download="Ryan_Nguyen_Resume.pdf"
                  className="block w-full bg-card hover:bg-latte text-matcha-dark hover:text-matcha font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer id="contact" className="relative border-t border-line/50 bg-gradient-to-br from-card/70 to-latte/40 backdrop-blur-sm z-10">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 md:py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            <div className="text-sm text-subink text-center md:text-left font-light">
              © 2024 Ryan Nguyen. All rights reserved.
            </div>
            <div className="flex space-x-8">
              <a 
                href="https://github.com/rnguyen03" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-matcha hover:text-matcha-light transition-all duration-300 hover:scale-110 p-2 rounded-xl hover:bg-latte/40"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/ryannguyenuog/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-matcha hover:text-matcha-light transition-all duration-300 hover:scale-110 p-2 rounded-xl hover:bg-latte/40"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="mailto:ryanvannguyen@gmail.com"
                className="text-matcha hover:text-matcha-light transition-all duration-300 hover:scale-110 p-2 rounded-xl hover:bg-latte/40"
                aria-label="Email"
              >
                <svg className="w-6 h-6 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819c.904 0 1.636.732 1.636 1.636z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
