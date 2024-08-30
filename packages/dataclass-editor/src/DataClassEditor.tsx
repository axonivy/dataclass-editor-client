import {
  Flex,
  PanelMessage,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  SidebarHeader,
  Spinner,
  Toolbar,
  ToolbarTitle
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { isEntityClass } from './components/dataclass/data/dataclass-utils';
import { DataClassMasterContent } from './components/dataclass/master/DataClassMasterContent';
import { DataClassMasterToolbarControls } from './components/dataclass/master/DataClassMasterToolbarControls';
import './DataClassEditor.css';
import { useClient } from './protocol/ClientContextProvider';
import type { EditorProps } from './protocol/types';
import { genQueryKey } from './query/query-client';

function DataClassEditor(props: EditorProps) {
  const [sidebar, setSidebar] = useState(true);

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
    <ResizablePanelGroup direction='horizontal' style={{ height: `100vh` }}>
      <ResizablePanel defaultSize={75} minSize={50} className='master-panel' data-testid='master-panel'>
        <Flex className='panel-content-container' direction='column'>
          <Toolbar className='master-toolbar'>
            <ToolbarTitle>{title}</ToolbarTitle>
            <DataClassMasterToolbarControls sidebar={sidebar} setSidebar={setSidebar} />
          </Toolbar>
          <DataClassMasterContent dataClassFields={dataClassFields} setSelectedField={setSelectedField} />
        </Flex>
      </ResizablePanel>
      {sidebar && (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={25} minSize={10}>
            <Flex direction='column' className='panel-content-container' data-testid='details-container'>
              <SidebarHeader icon={IvyIcons.PenEdit} title={detailTitle} data-testid='Detail title' />
              <PanelMessage message={'Detail Content'} />
            </Flex>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}

export default DataClassEditor;
