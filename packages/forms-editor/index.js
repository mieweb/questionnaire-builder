// Public exports for forms-editor package
if (typeof globalThis !== 'undefined' && !globalThis.__QB_EDITOR_INDEX_LOGGED) {
	globalThis.__QB_EDITOR_INDEX_LOGGED = true;
	// eslint-disable-next-line no-console
	console.log('[QB] forms-editor index loaded', new Date().toISOString());
}
export { QuestionnaireEditor } from './src/QuestionnaireEditor.jsx';
