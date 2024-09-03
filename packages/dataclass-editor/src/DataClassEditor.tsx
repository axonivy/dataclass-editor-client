import { Flex, PanelMessage, ResizableHandle, ResizablePanel, ResizablePanelGroup, SidebarHeader, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { isEntityClass } from './components/dataclass/data/dataclass-utils';
import { DataClassDetailContent } from './components/dataclass/detail/DataClassDetailContent';
import { FieldDetailContent } from './components/dataclass/detail/FieldDetailContent';
import { DataClassMasterContent } from './components/dataclass/master/DataClassMasterContent';
import { DataClassMasterToolbar } from './components/dataclass/master/DataClassMasterToolbar';
import { AppProvider } from './context/AppContext';
import './DataClassEditor.css';
import { useClient } from './protocol/ClientContextProvider';
import type { EditorProps } from './protocol/types';
import { genQueryKey } from './query/query-client';

function DataClassEditor(props: EditorProps) {
  const [detail, setDetail] = useState(true);

  const [context, setContext] = useState(props.context);
  useEffect(() => {
    setContext(props.context);
  }, [props]);
  const [selectedField, setSelectedField] = useState<number>();

  const client = useClient();

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

  const dataClass = data.data;
  const dataClassFields = dataClass.fields;

  const title = isEntityClass(dataClass) ? 'Entity Class Editor' : 'Data Class Editor';
  let detailTitle = title;
  if (selectedField !== undefined && selectedField < dataClassFields.length) {
    const selectedDataClassField = dataClassFields[selectedField];
    detailTitle = 'Attribute - ' + selectedDataClassField.name;
  }

  return (
    <AppProvider
      value={{
        dataClass: dataClass,
        selectedField: selectedField,
        setSelectedField: setSelectedField,
        detail: detail,
        setDetail: setDetail
      }}
    >
      <ResizablePanelGroup direction='horizontal' style={{ height: `100vh` }}>
        <ResizablePanel defaultSize={75} minSize={50} className='master-panel'>
          <Flex className='panel-content-container' direction='column'>
            <DataClassMasterToolbar title={title} />
            <DataClassMasterContent />
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={10} data-testid='detail-panel'>
              <Flex direction='column' className='panel-content-container' data-testid='detail-container'>
                <SidebarHeader icon={IvyIcons.PenEdit} title={detailTitle} data-testid='detail-header' />
                {selectedField == undefined ? <DataClassDetailContent /> : <FieldDetailContent />}
              </Flex>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </AppProvider>
  );
}

export default DataClassEditor;
