import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { heroSection, featuresSection, interactiveDemoSection, quickStart, packagesSection, resourcesSection } from './index.config';
import { useState } from 'react';

const FeatureIcon = ({ path }) => (
  <div className="text-green-600 mb-4">
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  </div>
);

// const ExternalLinkIcon = () => (
//   <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//   </svg>
// );

const GitHubIcon = () => (
  <svg className="w-8 h-8 text-slate-700 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const IssueIcon = () => (
  <svg className="w-8 h-8 text-slate-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopyCommand = (command, index) => {
    navigator.clipboard.writeText(command);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Layout title="Home" description="Professional form builder with FHIR QuestionnaireResponse output">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-b from-slate-50 to-white pt-32 min-h-[calc(100vh-85px)] flex items-center">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[80%] rounded-full bg-green-200/40 blur-[96px]"></div>
          <div className="absolute top-[10%] -left-[10%] w-[40%] h-[60%] rounded-full bg-blue-200/40 blur-[96px]"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-7xl px-3 mx-auto text-center">
            <div className="flex items-center justify-center gap-6 mb-6">
              <h1 className="text-7xl lg:text-9xl font-extrabold tracking-tight leading-none m-0">
                <span className="inline-block bg-linear-[to_right,#059669,#0891b2_30%,#f59e0b_60%,#22c55e] bg-clip-text text-transparent">
                  {heroSection.title}
                </span>
              </h1>
            </div>
            <p className="text-lg lg:text-2xl text-slate-600 mb-20 leading-relaxed max-w-2xl font-medium mx-auto">
              {heroSection.description}
            </p>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-green-600 hover:text-green-700 transition-all duration-200 hover:translate-y-1 border-0 bg-transparent p-0"
              aria-label="Scroll to next section"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="bg-slate-50 py-20">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
              {featuresSection.badge}
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              <span className="bg-linear-[to_right,#059669,#0891b2_30%,#f59e0b_60%,#22c55e] bg-clip-text text-transparent">
                {featuresSection.title}
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">{featuresSection.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {featuresSection.items.map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <FeatureIcon path={feature.icon} />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Renderer Demo */}
      <div className="bg-linear-to-b from-white to-slate-50 py-16 overflow-hidden">
        <div className="container">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                {interactiveDemoSection.badge}
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                <span className="bg-linear-[to_right,#059669,#0891b2_30%,#f59e0b_60%,#22c55e] bg-clip-text text-transparent">
                  {interactiveDemoSection.title}
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                {interactiveDemoSection.subtitle}
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto mb-10">
              <a 
                href={siteConfig.customFields.demoUrl} 
                className="block group"
              >
                <div className="relative bg-linear-to-br from-slate-50 to-white rounded-xl shadow-xl border border-slate-200 hover:border-green-500 transition-all cursor-pointer overflow-hidden max-h-[500px]">
                  <img 
                    src="/img/preview.webp" 
                    alt="Interactive form renderer demo showing live preview" 
                    className="w-full h-full object-cover object-top rounded-lg shadow-lg -mb-8"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="text-center py-20"><p class="text-slate-600 text-lg">Preview image coming soon</p><p class="text-slate-500 text-sm mt-2">Click to try the live demo</p></div>';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-green-600 text-xl leading-relaxed flex items-center gap-2">
                      Try Live Demo
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-slate-50 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                {quickStart.badge}
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                <span className="bg-linear-[to_right,#059669,#0891b2_30%,#f59e0b_60%,#22c55e] bg-clip-text text-transparent">
                  {quickStart.title}
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">{quickStart.subtitle}</p>
            </div>
            
            <div className="space-y-6 mb-8">
              {quickStart.installCommands.map((cmd, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{cmd.package}</h3>
                  <p className="text-sm text-slate-600 mb-3">{cmd.description}</p>
                  <div className="bg-slate-900 p-6 rounded-xl relative shadow-xl">
                    <button
                      onClick={() => handleCopyCommand(cmd.command, idx)}
                      className="copy-btn absolute top-4 right-4 px-3 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-md text-slate-300 hover:text-slate-100 transition-all duration-200 flex items-center gap-2 text-sm font-medium border border-slate-700 hover:border-slate-600"
                      title={copiedIndex === idx ? quickStart.copyButton.copied : quickStart.copyButton.tooltip}>
                      {copiedIndex === idx ? (
                        <>
                          <CheckIcon />
                          <span>{quickStart.copyButton.copied}</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon />
                          <span>{quickStart.copyButton.copy}</span>
                        </>
                      )}
                    </button>
                    <code className="text-sm text-slate-100 bg-slate-900 pr-28">{cmd.command}</code>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickStart.guides.map((guide, idx) => (
                <Link
                  key={idx}
                  to={guide.to}
                  className="group no-underline block p-6 bg-white border border-slate-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all duration-200">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition-colors">{guide.title}</h3>
                  <p className="text-slate-600 text-sm mb-0">{guide.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Packages */}
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
              {packagesSection.badge}
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              <span className="bg-linear-[to_right,#059669,#0891b2_30%,#f59e0b_60%,#22c55e] bg-clip-text text-transparent">
                {packagesSection.title}
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">{packagesSection.subtitle}</p>
          </div>
          <div className="space-y-4">
            {packagesSection.items.map((pkg, idx) => (
              <a
                key={idx}
                href={pkg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group no-underline flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all duration-200">
                <code className="bg-green-50 px-4 py-2 rounded-lg text-sm font-bold text-green-700 border border-green-200 shrink-0">
                  {pkg.name}
                </code>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-600 m-0">{pkg.description}</p>
                </div>
                <svg className="w-5 h-5 text-slate-400 shrink-0 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-slate-50 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                {resourcesSection.badge}
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                <span className="bg-linear-[to_right,#059669,#0891b2_30%,#f59e0b_60%,#22c55e] bg-clip-text text-transparent">
                  {resourcesSection.title}
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">{resourcesSection.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resourcesSection.items.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group no-underline flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all duration-200">
                  {resource.icon === 'github' ? <GitHubIcon /> : <IssueIcon />}
                  <div>
                    <div className="font-bold text-lg group-hover:text-green-600 transition-colors">{resource.title}</div>
                    <div className="text-sm text-slate-500">{resource.subtitle}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

    </Layout>
  );
}

