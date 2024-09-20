import { Flex, PanelMessage, ResizableHandle, ResizablePanel, ResizablePanelGroup, SidebarHeader, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import type { DataClass } from './components/dataclass/data/dataclass';
import { headerTitles } from './components/dataclass/data/dataclass-utils';
import { DataClassDetailContent } from './components/dataclass/detail/DataClassDetailContent';
import { FieldDetailContent } from './components/dataclass/detail/FieldDetailContent';
import { DataClassMasterContent } from './components/dataclass/master/DataClassMasterContent';
import { DataClassMasterToolbar } from './components/dataclass/master/DataClassMasterToolbar';
import { AppProvider } from './context/AppContext';
import './DataClassEditor.css';
import { useClient } from './protocol/ClientContextProvider';
import type { Data, EditorProps } from './protocol/types';
import { genQueryKey } from './query/query-client';
import type { Unary } from './utils/lambda/lambda';

function DataClassEditor(props: EditorProps) {
  const [detail, setDetail] = useState(true);

  const [context, setContext] = useState(props.context);
  const [directSave, setDirectSave] = useState(props.directSave);
  useEffect(() => {
    setContext(props.context);
    setDirectSave(props.directSave);
  }, [props]);
  const [selectedField, setSelectedField] = useState<number>();

  const client = useClient();
  const queryClient = useQueryClient();

  const queryKeys = useMemo(() => {
    return {
      data: () => genQueryKey('data', context),
      saveData: () => genQueryKey('saveData', context)
    };
  }, [context]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.data(),
    queryFn: () => client.data(context),
    structuralSharing: false
  });

  const mutation = useMutation({
    mutationKey: queryKeys.saveData(),
    mutationFn: async (updateData: Unary<DataClass>) => {
      const saveData = queryClient.setQueryData<Data>(queryKeys.data(), prevData => {
        if (prevData) {
          return { ...prevData, data: updateData(prevData.data) };
        }
        return undefined;
      });
      if (saveData) {
        return await client.saveData({ context, data: saveData.data, directSave });
      }
      return Promise.resolve();
    }
  });

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
        <Spinner />
      </Flex>
    );
  }

  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={`An error has occurred: ${error.message}`} />;
  }
  if (data.data.simpleName === undefined) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={'Dataclass not found'} />;
  }

  const dataClass = data.data;
  const { masterTitle, detailTitle } = headerTitles(dataClass, selectedField);

  return (
    <AppProvider
      value={{
        dataClass: dataClass,
        setDataClass: dataClass => mutation.mutate(() => dataClass),
        selectedField: selectedField,
        setSelectedField: setSelectedField,
        detail: detail,
        setDetail: setDetail
      }}
    >
      <ResizablePanelGroup direction='horizontal' style={{ height: `100vh` }}>
        <ResizablePanel defaultSize={75} minSize={50} className='master-panel'>
          <Flex className='panel-content-container' direction='column'>
            <DataClassMasterToolbar title={masterTitle} />
            <DataClassMasterContent />
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={10} className='detail-panel'>
              <Flex direction='column' className='panel-content-container detail-container'>
                <SidebarHeader icon={IvyIcons.PenEdit} title={detailTitle} className='detail-header' />
                {selectedField == undefined ? <DataClassDetailContent /> : <FieldDetailContent key={selectedField} />}
              </Flex>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </AppProvider>
  );
}

export default DataClassEditor;
