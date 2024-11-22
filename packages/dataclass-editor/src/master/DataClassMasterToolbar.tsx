import {
  Button,
  Field,
  Flex,
  IvyIcon,
  Label,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  ReadonlyProvider,
  Switch,
  Toolbar,
  ToolbarTitle,
  useTheme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../context/AppContext';
import { useAction } from '../context/useAction';
import { useState } from 'react';

type DataClassMasterToolbarProps = {
  title: string;
  graph: boolean;
  setGraph: (value: boolean) => void;
};

export const DataClassMasterToolbar = ({ title, graph, setGraph }: DataClassMasterToolbarProps) => {
  const { detail, setDetail, isHdData } = useAppContext();
  const { theme, setTheme, disabled } = useTheme();
  const openForm = useAction('openForm');
  const openProcess = useAction('openProcess');
  const [open, setOpen] = useState(false);

  return (
    <Toolbar className='master-toolbar'>
      <ToolbarTitle className='master-header'>{title}</ToolbarTitle>
      <Flex gap={1}>
        {isHdData && (
          <>
            <Button icon={IvyIcons.File} size='large' title='Open Form' aria-label='Open Form' onClick={() => openForm()} />
            <Button icon={IvyIcons.Process} size='large' title='Open Process' aria-label='Open Process' onClick={() => openProcess()} />
          </>
        )}
        {!disabled && (
          <Popover
            open={open}
            onOpenChange={e => {
              setOpen(e);
            }}
          >
            <PopoverTrigger asChild>
              <Button icon={IvyIcons.Settings} size='large' title='Settings' aria-label='Settings' />
            </PopoverTrigger>
            <PopoverContent sideOffset={12}>
              <ReadonlyProvider readonly={false}>
                <Flex direction='column' gap={2}>
                  <Field direction='row' alignItems='center' justifyContent='space-between' gap={4}>
                    <Label>
                      <Flex alignItems='center' gap={1}>
                        <IvyIcon icon={IvyIcons.DarkMode} />
                        Theme
                      </Flex>
                    </Label>
                    <Switch
                      defaultChecked={theme === 'dark'}
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      size='small'
                      aria-label='Theme'
                    />
                  </Field>
                  <Field direction='row' alignItems='center' justifyContent='space-between' gap={4}>
                    <Label>
                      <Flex alignItems='center' gap={1}>
                        <IvyIcon icon={IvyIcons.Process} />
                        Data Class Graph
                      </Flex>
                    </Label>
                    <Switch
                      checked={graph}
                      onCheckedChange={e => {
                        setGraph(e), setOpen(false);
                      }}
                      size='small'
                      aria-label='Theme'
                    />
                  </Field>
                </Flex>
                <PopoverArrow />
              </ReadonlyProvider>
            </PopoverContent>
          </Popover>
        )}
        <Button
          icon={graph ? IvyIcons.Undo : IvyIcons.LayoutSidebarRightCollapse}
          size='large'
          onClick={() => (graph ? setGraph(false) : setDetail(!detail))}
          title='Details toggle'
          aria-label='Details toggle'
        />
      </Flex>
    </Toolbar>
  );
};
