import { renderToString } from 'react-dom/server';
import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

export function render(path = '/') {
  return renderToString(<ErrorBoundary><App ssrPath={path} /></ErrorBoundary>);
}
