import { Flex, PanelMessage, ResizableHandle, ResizablePanel, ResizablePanelGroup, SidebarHeader, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { AppProvider } from './context/AppContext';
import { FieldProvider } from './context/FieldContext';
import type { DataClass, Field, Data, EditorProps, ValidationResult } from '@axonivy/dataclass-editor-protocol';
import { classTypeOf } from './data/dataclass-utils';
import './DataClassEditor.css';
import { DataClassDetailContent } from './detail/dataclass/DataClassDetailContent';
import { FieldDetailContent } from './detail/field/FieldDetailContent';
import { DataClassMasterContent } from './master/DataClassMasterContent';
import { DataClassMasterToolbar } from './master/DataClassMasterToolbar';
import { useClient } from './protocol/ClientContextProvider';
import { genQueryKey } from './query/query-client';
import type { Unary } from './utils/lambda/lambda';

export const headerTitles = (dataClass: DataClass, selectedField?: number) => {
  let baseTitle = '';
  switch (classTypeOf(dataClass)) {
    case 'DATA':
      baseTitle = 'Data';
      break;
    case 'BUSINESS_DATA':
      baseTitle = 'Business Data';
      break;
    case 'ENTITY':
      baseTitle = 'Entity';
  }
  const masterTitle = `${baseTitle} Class - ${dataClass.simpleName}`;

  const fields = dataClass.fields;

  let detailTitle = '';
  if (selectedField === undefined) {
    detailTitle = masterTitle;
  } else if (selectedField < fields.length) {
    const selectedDataClassField = fields[selectedField];
    detailTitle = 'Attribute - ' + selectedDataClassField.name;
  }
  return { masterTitle, detailTitle };
};

function DataClassEditor(props: EditorProps) {
  const [detail, setDetail] = useState(true);

  const [context, setContext] = useState(props.context);
  const [directSave, setDirectSave] = useState(props.directSave);
  useEffect(() => {
    setContext(props.context);
    setDirectSave(props.directSave);
  }, [props]);
  const [selectedField, setSelectedField] = useState<number>();
  const [validationMessages, setValidationMessages] = useState<Array<ValidationResult>>([]);

  const client = useClient();
  const queryClient = useQueryClient();

  const queryKeys = useMemo(() => {
    return {
      data: () => genQueryKey('data', context),
      saveData: () => genQueryKey('saveData', context),
      validate: () => genQueryKey('validate', context)
    };
  }, [context]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.data(),
    queryFn: () => client.data(context),
    structuralSharing: false
  });

  useQuery({
    queryKey: queryKeys.validate(),
    queryFn: async () => {
      const validationMessages = await client.validate(context);
      setValidationMessages(validationMessages);
      return validationMessages;
    }
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
        const validationMessages = await client.saveData({ context, data: saveData.data, directSave });
        return setValidationMessages(validationMessages);
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

  const setDataClass = (dataClass: DataClass) => mutation.mutate(() => dataClass);

  return (
    <AppProvider value={{ context, dataClass, setDataClass, selectedField, setSelectedField, detail, setDetail, validationMessages }}>
      <ResizablePanelGroup direction='horizontal' style={{ height: `100vh` }}>
        <ResizablePanel defaultSize={75} minSize={50} className='master-panel'>
          <Flex className='panel-content-container master-container' direction='column'>
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
                {selectedField === undefined || dataClass.fields.length <= selectedField ? (
                  <DataClassDetailContent />
                ) : (
                  <FieldProvider
                    value={{
                      field: dataClass.fields[selectedField],
                      setField: (field: Field) => {
                        const newDataClass = structuredClone(dataClass);
                        newDataClass.fields[selectedField] = field;
                        setDataClass(newDataClass);
                      }
                    }}
                  >
                    <FieldDetailContent key={selectedField} />
                  </FieldProvider>
                )}
              </Flex>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </AppProvider>
  );
}

export default DataClassEditor;
