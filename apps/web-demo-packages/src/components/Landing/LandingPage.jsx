import React from 'react';
import { DemoCard } from '../Shared';
import { PackagesSection } from './PackagesSection';
import { ResourcesSection } from './ResourcesSection';

export function LandingPage() {
  return (
    <div className="demo-app-landing min-h-dvh px-6 md:px-12 py-16 bg-linear-to-b from-white to-slate-50 text-slate-900 font-sans">
      <div className="demo-app-landing-wrapper max-w-5xl mx-auto">
        <div className="demo-app-landing-hero text-center mb-14">
          <h1 className="m-0 mb-4 text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Questionnaire Builder
          </h1>
          <p className="mx-auto max-w-xl leading-relaxed text-lg text-slate-500">
            Professional form builder with FHIR <code className="bg-indigo-100 px-2 py-1 rounded-md text-sm font-medium text-indigo-700">QuestionnaireResponse</code> output
          </p>
        </div>

        <div className="demo-app-landing-cards grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          <DemoCard title="Editor" desc="Build & modify questionnaire structure." to="/packages/editor" />
          <DemoCard title="Renderer" desc="Fill out the questionnaire & submit." to="/packages/renderer" />
        </div>

        <PackagesSection />
        <ResourcesSection />
      </div>
    </div>
  );
}
