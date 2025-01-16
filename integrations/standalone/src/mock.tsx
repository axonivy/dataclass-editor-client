import { ClientContextProvider, DataClassEditor, initQueryClient, QueryProvider } from '@axonivy/dataclass-editor';
import { HotkeysProvider, ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import { DataClassClientMock } from './mock/dataclass-client-mock';
import { URLParams } from './url-helper';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const client = new DataClassClientMock();
const queryClient = initQueryClient();

const readonly = URLParams.readonly();
const app = URLParams.app();
const file = URLParams.file();

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={'light'}>
      <ClientContextProvider client={client}>
        <QueryProvider client={queryClient}>
          <ReadonlyProvider readonly={readonly}>
            <HotkeysProvider initiallyActiveScopes={['global']}>
              <DataClassEditor context={{ app, pmv: '', file }} />
            </HotkeysProvider>
          </ReadonlyProvider>
        </QueryProvider>
      </ClientContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
