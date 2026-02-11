import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function DemoLink({ title, description, className }) {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className="p-8 bg-slate-50 rounded-lg text-center">
      <h3 className="mt-0">{title}</h3>
      <p>{description}</p>
      <a href={siteConfig.customFields.demoUrl} target="_blank" rel="noopener noreferrer" className={`${className || ''} button button--primary button--lg`}>Launch Live Demo →</a>
    </div>
  );
}
