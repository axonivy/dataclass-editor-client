import * as ReactDOM from 'react-dom/client';
import { DataClassEditor } from '../../../packages/dataclass-editor/src';
import './index.css';

export async function start(): Promise<void> {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(<DataClassEditor />);
}

start();
