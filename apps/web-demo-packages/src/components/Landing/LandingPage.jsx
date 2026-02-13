import { DemoCard } from '../Shared';

export function LandingPage() {
  return (
    <div className="demo-app-landing min-h-screen bg-slate-50">
      <div className="demo-app-landing-wrapper max-w-5xl mx-auto px-6 py-24">
        <div className="demo-app-landing-hero text-center mb-16">
          <h1 className="m-0 mb-4 text-5xl font-bold text-slate-900">
            Interactive Playground
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 leading-relaxed">
            Explore the form builder and renderer in action. Build questionnaires, test rendering, and see real-time FHIR output.
          </p>
        </div>

        <div className="demo-app-landing-cards grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <DemoCard 
            title="Form Editor" 
            desc="Build and modify questionnaire structures with an intuitive visual editor." 
            to="/packages/editor" 
          />
          <DemoCard 
            title="Form Renderer" 
            desc="Fill out questionnaires and see FHIR QuestionnaireResponse output." 
            to="/packages/renderer" 
          />
        </div>
      </div>
    </div>
  );
}
