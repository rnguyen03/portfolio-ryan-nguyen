"use client"

import { useEffect, useState } from 'react';
import Link from "next/link";
import Particles from "./components/particles";
import { allProjects } from "contentlayer/generated";
import { Card } from "./components/card";
import { Article } from "./projects/article";
import { ResumeModal } from "./components/resume-modal";

type NavItem = {
  name: string;
  href: string;
  kind?: "modal" | "scroll";
};

const navigation: NavItem[] = [
  { name: "Projects", href: "#projects", kind: "scroll" },
  { name: "Resume", href: "#resume", kind: "modal" },
  { name: "Contact", href: "#contact", kind: "scroll" },
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

  const handleNavClick = (item: NavItem) => {
    if (item.kind === "modal") {
      setShowResumeModal(true);
      return;
    }

    if (item.href === "#contact") {
      const footer = document.querySelector("#contact") as HTMLElement | null;
      if (!footer) return;

      footer.scrollIntoView({ behavior: "smooth", block: "start" });

      const triggerIconHighlight = (icon: HTMLElement) => {
        icon.style.transition =
          "transform 180ms ease-out, filter 180ms ease-out, color 180ms ease-out";
        icon.style.transform = "scale(1.9)";
        icon.style.color = "#6fa051";
        icon.style.filter = "drop-shadow(0 0 18px rgba(111, 160, 81, 0.55))";

        window.setTimeout(() => {
          icon.style.transform = "scale(1.7)";
        }, 180);

        window.setTimeout(() => {
          icon.style.transform = "";
          icon.style.color = "";
          icon.style.filter = "";
          icon.style.transition = "";
        }, 900);
      };

      const waitUntilVisibleThen = (cb: () => void) => {
        const maxTries = 60; // ~1s at 60fps
        let tries = 0;

        const tick = () => {
          const rect = footer.getBoundingClientRect();
          const nearViewport = rect.top < window.innerHeight * 0.8;
          if (nearViewport || tries++ >= maxTries) cb();
          else requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      };

      waitUntilVisibleThen(() => {
        const firstIcon = footer.querySelector("a") as HTMLElement | null;
        firstIcon?.focus({ preventScroll: true });

        const contactIcons = footer.querySelectorAll("a") as NodeListOf<HTMLElement>;
        contactIcons.forEach((icon, index) => {
          window.setTimeout(() => triggerIconHighlight(icon), index * 120);
        });
      });

      return;
    }


    const target = document.querySelector(item.href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

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
      {/* 🌤 Ambient Café Sunlight Layer */}
      <div className="fixed inset-0 bg-sunlight pointer-events-none z-[1]"></div>
      
      {/* 🌿 Matcha Dust Corner Gradients */}
      <div className="fixed inset-0 bg-matcha-corner pointer-events-none z-[1]"></div>
      
      {/* 📔 Paper Grain Texture Overlay */}
      <div className="fixed inset-0 bg-paper-grain z-[1]"></div>
      
      {/* ☁️ Floating Dust Particles */}
      <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
        <div className="floating-dust"></div>
        <div className="floating-dust"></div>
        <div className="floating-dust"></div>
        <div className="floating-dust"></div>
        <div className="floating-dust"></div>
      </div>
      
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden relative px-4 z-10">
        <nav
          className={`my-8 md:my-16 ${
            skipHeroAnimation ? "" : "animate-fade-in"
          } relative z-10`}
        >
          <div
            className="
              inline-flex items-center justify-center
              rounded-full border border-line/30
              bg-cream/85 backdrop-blur-md
              px-3 py-1.5 md:px-5 md:py-2
              shadow-[0_6px_18px_rgba(0,0,0,0.04)]
            "
          >
            <ul className="flex items-center justify-center gap-1.5 md:gap-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className="
                      group relative inline-flex items-center justify-center
                      rounded-full px-3.5 py-1.5 md:px-4 md:py-1.5
                      text-[13px] md:text-xs font-light tracking-[0.12em] uppercase
                      text-subink/90
                      transition-colors duration-200
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-matcha/45 focus-visible:ring-offset-2
                      focus-visible:ring-offset-transparent
                      hover:text-matcha-dark focus-visible:text-matcha-dark
                    "
                  >

                    {/* Main rough pencil stroke (with noise texture) */}
                    <span
                      className="
                        pointer-events-none absolute bottom-[2px] left-3 right-3
                        h-[2px]
                        origin-left scale-x-0 translate-y-[0.5px]
                        transition-transform duration-300 ease-out
                        group-hover:scale-x-100 group-focus-visible:scale-x-100
                        opacity-0 group-hover:opacity-85 group-focus-visible:opacity-85
                        rounded-sm
                        bg-[rgba(90,75,60,0.8)]
                        [background-image:repeating-linear-gradient(90deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_1px,transparent_1px,transparent_3px)]
                        [filter:blur(0.4px)]
                        [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]
                        z-10
                      "
                    />

                    {/* Slight offset echo stroke (lighter graphite) */}
                    <span
                      className="
                        pointer-events-none absolute bottom-[3px] left-3 right-6
                        h-[1.5px]
                        origin-left scale-x-0 translate-y-[0.5px]
                        transition-transform duration-500 ease-out
                        group-hover:scale-x-100 group-focus-visible:scale-x-100
                        opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60
                        rounded-sm
                        bg-[rgba(120,105,90,0.4)]
                        [filter:blur(0.2px)]
                        z-10
                      "
                    />

                    {/* Imperfection gaps (pencil skipping over paper) */}
                    <span
                      className="
                        pointer-events-none absolute bottom-[2px] left-3 right-3
                        h-[2px]
                        origin-left scale-x-0
                        transition-transform duration-300 ease-out
                        group-hover:scale-x-100 group-focus-visible:scale-x-100
                        opacity-0 group-hover:opacity-40 group-focus-visible:opacity-40
                        bg-gradient-to-r
                          from-transparent
                          via-[rgba(0,0,0,0.35)]
                          to-transparent
                        [mask-image:radial-gradient(circle_at_10%_50%,transparent_0%,black_40%,transparent_80%)]
                        [background-size:8px_100%]
                        z-10
                      "
                    />

                    <span className="relative z-20">
                      {item.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
            AI & Full Stack Developer
          </h2>
          <p className="text-base md:text-sm text-subink max-w-2xl mx-auto leading-relaxed font-light">
            Passionate about transforming ideas into impactful applications through innovative AI solutions and robust web development.
          </p>
        </div>
        
        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${showScrollIndicator ? 'opacity-100 animate-gentle-bounce' : 'opacity-0'} z-10`}>
          <div className="w-6 h-10 border-2 border-matcha rounded-full flex justify-center backdrop-blur-sm bg-cream-50/30">
            <div className="w-1 h-3 bg-matcha rounded-full mt-2 animate-pulse-soft"></div>
          </div>
          <p className="text-xs text-matcha mt-2 font-handwritten">scroll</p>
        </div>
      </div>


      {/* Projects Section */}
      <div id="projects" className={`relative pb-16 ${skipHeroAnimation ? '' : 'animate-fade-in'} z-10`}>
        <div className="px-4 pt-12 mx-auto space-y-6 max-w-7xl sm:px-6 md:space-y-8 md:pt-20 lg:px-8 md:space-y-16 lg:pt-32">
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <h2 className="text-4xl font-semibold tracking-tight text-matcha sm:text-5xl md:text-3xl lg:text-4xl font-medium">
              Projects
            </h2>
            <p className="mt-4 text-base md:text-sm text-subink leading-relaxed font-light">
              A showcase of my innovative projects and collaborative efforts in AI, web development, and software engineering.
            </p>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-line/70 to-transparent" />

          <div className="grid grid-cols-1 gap-6 mx-auto lg:grid-cols-2 lg:gap-8">
            <Card>
              <Article project={featured} views={views[featured.slug] ?? 0} variant="featured" />
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
      <ResumeModal open={showResumeModal} onClose={() => setShowResumeModal(false)} />

      {/* Footer */}
      <footer id="contact" className="relative border-t border-line/50 bg-gradient-to-br from-card/70 to-latte/40 backdrop-blur-sm z-10">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 md:py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            <div className="flex flex-col space-y-2">
              <div className="text-sm text-subink text-center md:text-left font-light">
                © 2024 Ryan Nguyen. All rights reserved.
              </div>
              {/* <p className="text-xs text-subink/80 italic font-handwritten text-center md:text-left">
                "brewed with matcha & code ☕"
              </p> */}
            </div>
            <div className="flex space-x-8">
              <a
                href="https://github.com/rnguyen03"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex flex-col items-center text-matcha hover:text-matcha-light transition-colors duration-300 p-2 rounded-xl hover:bg-latte/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matcha/45 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6 md:w-5 md:h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="pointer-events-none absolute bottom-0 left-1 right-1 h-[2px] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 opacity-0 group-hover:opacity-85 group-focus-visible:opacity-85 rounded-sm bg-[rgba(90,75,60,0.8)] [background-image:repeating-linear-gradient(90deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_1px,transparent_1px,transparent_3px)] [filter:blur(0.4px)] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] z-10" />
                <span className="pointer-events-none absolute bottom-[1px] left-1 right-4 h-[1.5px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60 rounded-sm bg-[rgba(120,105,90,0.4)] [filter:blur(0.2px)] z-10" />
                <span className="pointer-events-none absolute bottom-0 left-1 right-1 h-[2px] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 opacity-0 group-hover:opacity-40 group-focus-visible:opacity-40 bg-gradient-to-r from-transparent via-[rgba(0,0,0,0.35)] to-transparent [mask-image:radial-gradient(circle_at_10%_50%,transparent_0%,black_40%,transparent_80%)] [background-size:8px_100%] z-10" />
              </a>
              <a
                href="https://www.linkedin.com/in/ryannguyenuog/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex flex-col items-center text-matcha hover:text-matcha-light transition-colors duration-300 p-2 rounded-xl hover:bg-latte/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matcha/45 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6 md:w-5 md:h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="pointer-events-none absolute bottom-0 left-1 right-1 h-[2px] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 opacity-0 group-hover:opacity-85 group-focus-visible:opacity-85 rounded-sm bg-[rgba(90,75,60,0.8)] [background-image:repeating-linear-gradient(90deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_1px,transparent_1px,transparent_3px)] [filter:blur(0.4px)] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] z-10" />
                <span className="pointer-events-none absolute bottom-[1px] left-1 right-4 h-[1.5px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60 rounded-sm bg-[rgba(120,105,90,0.4)] [filter:blur(0.2px)] z-10" />
                <span className="pointer-events-none absolute bottom-0 left-1 right-1 h-[2px] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 opacity-0 group-hover:opacity-40 group-focus-visible:opacity-40 bg-gradient-to-r from-transparent via-[rgba(0,0,0,0.35)] to-transparent [mask-image:radial-gradient(circle_at_10%_50%,transparent_0%,black_40%,transparent_80%)] [background-size:8px_100%] z-10" />
              </a>
              <a
                href="mailto:ryanvannguyen@gmail.com"
                className="group relative inline-flex flex-col items-center text-matcha hover:text-matcha-light transition-colors duration-300 p-2 rounded-xl hover:bg-latte/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matcha/45 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                aria-label="Email"
              >
                <svg className="w-6 h-6 md:w-5 md:h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819c.904 0 1.636.732 1.636 1.636z"/>
                </svg>
                <span className="pointer-events-none absolute bottom-0 left-1 right-1 h-[2px] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 opacity-0 group-hover:opacity-85 group-focus-visible:opacity-85 rounded-sm bg-[rgba(90,75,60,0.8)] [background-image:repeating-linear-gradient(90deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_1px,transparent_1px,transparent_3px)] [filter:blur(0.4px)] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] z-10" />
                <span className="pointer-events-none absolute bottom-[1px] left-1 right-4 h-[1.5px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60 rounded-sm bg-[rgba(120,105,90,0.4)] [filter:blur(0.2px)] z-10" />
                <span className="pointer-events-none absolute bottom-0 left-1 right-1 h-[2px] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 opacity-0 group-hover:opacity-40 group-focus-visible:opacity-40 bg-gradient-to-r from-transparent via-[rgba(0,0,0,0.35)] to-transparent [mask-image:radial-gradient(circle_at_10%_50%,transparent_0%,black_40%,transparent_80%)] [background-size:8px_100%] z-10" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
