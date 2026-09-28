import React, { useState, useCallback } from 'react';
import { Student } from './types';
import { generateStudentPopulation } from './utils/populationGenerator';
import { Navbar } from './components/Navbar';
import { PopulationBanner } from './components/PopulationBanner';
import { HomeView } from './components/HomeView';
import { AnalyzeView } from './components/AnalyzeView';
import { ExperimentView } from './components/ExperimentView';
import { AboutView } from './components/AboutView';
import { StudentDataModal } from './components/StudentDataModal';
import { Footer } from './components/Footer';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'analyze' | 'experiment' | 'about'>('home');
  const [populationSize, setPopulationSize] = useState<number>(1000);
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Generate initial simulated college population (default: 1000 students)
  const [students, setStudents] = useState<Student[]>(() => {
    return generateStudentPopulation(1000);
  });

  // Regenerate handler
  const handleRegenerate = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPop = generateStudentPopulation(populationSize);
      setStudents(newPop);
      setIsGenerating(false);
    }, 150);
  }, [populationSize]);

  // Size change handler
  const handleSizeChange = useCallback((newSize: number) => {
    setPopulationSize(newSize);
    setIsGenerating(true);
    setTimeout(() => {
      const newPop = generateStudentPopulation(newSize);
      setStudents(newPop);
      setIsGenerating(false);
    }, 150);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. Sticky Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        populationSize={students.length}
        onRegenerate={handleRegenerate}
        onOpenDataModal={() => setIsDataModalOpen(true)}
      />

      {/* 2. Population Info & Quick Generation Strip */}
      <PopulationBanner
        populationSize={students.length}
        onSizeChange={handleSizeChange}
        onRegenerate={handleRegenerate}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        isGenerating={isGenerating}
      />

      {/* 3. Main Page Content View */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={setCurrentTab}
            students={students}
          />
        )}

        {currentTab === 'analyze' && (
          <AnalyzeView
            key={`analyze-${students.length}-${students[0]?.id || ''}`}
            students={students}
          />
        )}

        {currentTab === 'experiment' && (
          <ExperimentView
            key={`exp-${students.length}-${students[0]?.id || ''}`}
            students={students}
          />
        )}

        {currentTab === 'about' && (
          <AboutView />
        )}
      </main>

      {/* 4. Educational Footer */}
      <Footer onNavigate={setCurrentTab} />

      {/* 5. Population Data Modal Inspector */}
      <StudentDataModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        students={students}
      />

    </div>
  );
}
