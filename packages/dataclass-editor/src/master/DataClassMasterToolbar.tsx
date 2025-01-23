import {
  Button,
  Field,
  Flex,
  hotkeyRedoFix,
  hotkeyUndoFix,
  IvyIcon,
  Label,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  ReadonlyProvider,
  Separator,
  Switch,
  Toolbar,
  ToolbarContainer,
  ToolbarTitle,
  useHotkeys,
  useTheme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../context/AppContext';
import { useAction } from '../context/useAction';
import { useKnownHotkeys } from '../utils/hotkeys';
import { useRef } from 'react';

type DataClassMasterToolbarProps = {
  title: string;
};

export const DataClassMasterToolbar = ({ title }: DataClassMasterToolbarProps) => {
  const { detail, setDetail, isHdData, history, setUnhistorisedDataClass } = useAppContext();
  const { theme, setTheme, disabled } = useTheme();
  const openForm = useAction('openForm');
  const openProcess = useAction('openProcess');
  const hotkeys = useKnownHotkeys();

  useHotkeys(hotkeys.openForm.hotkey, () => openForm(), { scopes: ['global'], enabled: isHdData });
  useHotkeys(hotkeys.openProcess.hotkey, () => openProcess(), { scopes: ['global'], enabled: isHdData });

  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusToolbar.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });
  useHotkeys(
    hotkeys.focusInscription.hotkey,
    () => {
      setDetail(true);
      document.querySelector<HTMLElement>('.ui-accordion-trigger')?.focus();
    },
    {
      scopes: ['global']
    }
  );
  const undo = () => history.undo(setUnhistorisedDataClass);
  const redo = () => history.redo(setUnhistorisedDataClass);
  useHotkeys(hotkeys.undo.hotkey, e => hotkeyUndoFix(e, undo), { scopes: ['global'] });
  useHotkeys(hotkeys.redo.hotkey, e => hotkeyRedoFix(e, redo), { scopes: ['global'] });

  return (
    <Toolbar tabIndex={-1} ref={firstElement} className='master-toolbar'>
      <ToolbarTitle className='master-header'>{title}</ToolbarTitle>
      <Flex gap={1}>
        <ToolbarContainer maxWidth={450}>
          <Flex>
            <Flex gap={1}>
              <Button
                title={hotkeys.undo.label}
                aria-label={hotkeys.undo.label}
                icon={IvyIcons.Undo}
                size='large'
                onClick={undo}
                disabled={!history.canUndo}
              />
              <Button
                title={hotkeys.redo.label}
                aria-label={hotkeys.redo.label}
                icon={IvyIcons.Redo}
                size='large'
                onClick={redo}
                disabled={!history.canRedo}
              />
            </Flex>
            <Separator orientation='vertical' style={{ height: '26px', marginInline: 'var(--size-2)' }} />
          </Flex>
        </ToolbarContainer>
        {isHdData && (
          <>
            <Button
              icon={IvyIcons.File}
              size='large'
              title={hotkeys.openForm.label}
              aria-label={hotkeys.openForm.label}
              onClick={() => openForm()}
            />
            <Button
              icon={IvyIcons.Process}
              size='large'
              title={hotkeys.openProcess.label}
              aria-label={hotkeys.openProcess.label}
              onClick={() => openProcess()}
            />
          </>
        )}
        {!disabled && (
          <Popover>
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
                </Flex>
                <PopoverArrow />
              </ReadonlyProvider>
            </PopoverContent>
          </Popover>
        )}
        <Button
          icon={IvyIcons.LayoutSidebarRightCollapse}
          size='large'
          onClick={() => setDetail(!detail)}
          title='Details toggle'
          aria-label='Details toggle'
        />
      </Flex>
    </Toolbar>
  );
};
