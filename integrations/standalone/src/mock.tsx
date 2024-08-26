import { ClientContextProvider, DataClassEditor, initQueryClient, QueryProvider } from '@axonivy/dataclass-editor';
import { ThemeProvider } from '@axonivy/ui-components';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import { DataClassClientMock } from './mock/dataclass-client-mock';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const client = new DataClassClientMock();
const queryClient = initQueryClient();

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={'light'}>
      <ClientContextProvider client={client}>
        <QueryProvider client={queryClient}>
          <DataClassEditor context={{ app: '', pmv: '', file: '' }} />
        </QueryProvider>
      </ClientContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
