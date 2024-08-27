import { Flex, PanelMessage, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { isEntityClass } from './components/dataclass/data/dataclass-utils';
import { DataClassMaster } from './components/dataclass/master/DataClassMaster';
import { Editor } from './components/editor/Editor';
import './DataClassEditor.css';
import { useClient } from './protocol/ClientContextProvider';
import type { EditorProps } from './protocol/types';
import { genQueryKey } from './query/query-client';

function DataClassEditor(props: EditorProps) {
  const [context, setContext] = useState(props.context);
  useEffect(() => {
    setContext(props.context);
  }, [props]);
  const [selectedDataClassFieldIndex, setSelectedDataClassFieldIndex] = useState<number>();

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
  if (selectedDataClassFieldIndex !== undefined && selectedDataClassFieldIndex < dataClassFields.length) {
    const selectedDataClassField = dataClassFields[selectedDataClassFieldIndex];
    detailTitle = 'Attribute - ' + selectedDataClassField.name;
  }

  return (
    <Editor
      masterTitle={title}
      masterContent={<DataClassMaster dataClassFields={dataClassFields} setSelectedDataClassFieldIndex={setSelectedDataClassFieldIndex} />}
      detailTitle={detailTitle}
      detailContent={<PanelMessage message={'Detail Content'} />}
    />
  );
}

export default DataClassEditor;
