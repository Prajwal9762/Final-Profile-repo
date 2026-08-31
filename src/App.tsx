/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { CustomCursor } from './components/CustomCursor';
import { InteractiveBackground, VIDEO_PRESETS } from './components/InteractiveBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { CodeLabSection } from './components/CodeLabSection';
import { DevSetupSection } from './components/DevSetupSection';
import { JourneySection } from './components/JourneySection';
import { GitHubSection } from './components/GitHubSection';
import { ContactSection } from './components/ContactSection';
import { FinalScreen } from './components/FinalScreen';
import { GitHubPagesExportGuide } from './components/GitHubPagesExportGuide';
import { InteractiveFXOverlay, VfxMode } from './components/InteractiveFXOverlay';
import { MatrixRain } from './components/MatrixRain';
import { ThemeId, applyTheme, getSavedTheme } from './utils/theme';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [forceReplayIntro, setForceReplayIntro] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobile, setIsMobile] = useState(false);
  const [exportGuideOpen, setExportGuideOpen] = useState(false);
  const [vfxMode, setVfxMode] = useState<VfxMode>('shockwave');
  const [matrixActive, setMatrixActive] = useState(false);
  const [isVideoBgEnabled, setIsVideoBgEnabled] = useState(true);
  const [videoPresetIndex, setVideoPresetIndex] = useState(0);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('cyan');

  // Initialize and apply theme
  useEffect(() => {
    const saved = getSavedTheme();
    setCurrentTheme(saved);
    applyTheme(saved);
  }, []);

  const handleSelectTheme = (theme: ThemeId) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  // Mobile & Touch detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // IntersectionObserver for active navigation highlighting
  useEffect(() => {
    if (isLoading) return;

    const sections = ['hero', 'about', 'skills', 'projects', 'codelab', 'journey', 'github', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLoading]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReplayIntro = () => {
    setForceReplayIntro(true);
    setIsLoading(true);
  };

  return (
    <div className="relative min-h-screen bg-[var(--theme-bg)] text-slate-100 selection:bg-purple-500 selection:text-slate-950 font-sans transition-colors duration-700">
      {/* Cinematic Loading Screen */}
      {isLoading ? (
        <LoadingScreen
          forceReplay={forceReplayIntro}
          onComplete={() => {
            setIsLoading(false);
            setForceReplayIntro(false);
          }}
        />
      ) : (
        <>
          {/* Custom Cursor for Desktop */}
          <CustomCursor isMobile={isMobile} />

          {/* Interactive Click FX Engine Overlay */}
          <InteractiveFXOverlay currentMode={vfxMode} onModeChange={setVfxMode} />

          {/* Optional Matrix Rain Mode */}
          <MatrixRain isActive={matrixActive} onClose={() => setMatrixActive(false)} />

          {/* Layered Animated Background with Optional Video BG */}
          <InteractiveBackground
            isMobile={isMobile}
            isVideoEnabled={isVideoBgEnabled}
            videoSource={VIDEO_PRESETS[videoPresetIndex].url}
            themeId={currentTheme}
          />

          {/* Floating Navigation */}
          <Navbar
            activeSection={activeSection}
            onNavigate={scrollToSection}
            onReplayIntro={handleReplayIntro}
            onOpenExportGuide={() => setExportGuideOpen(true)}
            onToggleMatrixRain={() => setMatrixActive(!matrixActive)}
            isMatrixActive={matrixActive}
            vfxMode={vfxMode}
            isVideoBgEnabled={isVideoBgEnabled}
            onToggleVideoBg={() => setIsVideoBgEnabled(!isVideoBgEnabled)}
            videoPresetIndex={videoPresetIndex}
            onChangeVideoPreset={(idx) => setVideoPresetIndex(idx)}
            currentTheme={currentTheme}
            onSelectTheme={handleSelectTheme}
          />

          {/* Main Portfolio Sections */}
          <main className="relative z-10">
            <Hero onExplore={() => scrollToSection('about')} isMobile={isMobile} themeId={currentTheme} />
            <AboutSection isMobile={isMobile} />
            <SkillsSection isMobile={isMobile} />
            <ProjectsSection isMobile={isMobile} />
            <CodeLabSection />
            <DevSetupSection />
            <JourneySection isMobile={isMobile} />
            <GitHubSection />
            <ContactSection />
          </main>

          {/* Final Statement & Footer */}
          <FinalScreen
            onScrollTop={() => scrollToSection('hero')}
            onOpenExportGuide={() => setExportGuideOpen(true)}
          />

          {/* Deployment / Export Guide Modal */}
          <GitHubPagesExportGuide
            isOpen={exportGuideOpen}
            onClose={() => setExportGuideOpen(false)}
          />
        </>
      )}
    </div>
  );
}
