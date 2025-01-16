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
  useHotkeys,
  useTheme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../context/AppContext';
import { useAction } from '../context/useAction';
import { HOTKEYS, useHotkeyTexts } from '../utils/hotkeys';
import { useRef } from 'react';

type DataClassMasterToolbarProps = {
  title: string;
};

export const DataClassMasterToolbar = ({ title }: DataClassMasterToolbarProps) => {
  const { detail, setDetail, isHdData } = useAppContext();
  const { theme, setTheme, disabled } = useTheme();
  const openForm = useAction('openForm');
  const openProcess = useAction('openProcess');

  useHotkeys(HOTKEYS.OPEN_FORM, () => openForm(), { scopes: ['global'], enabled: isHdData });
  useHotkeys(HOTKEYS.OPEN_PROCESS, () => openProcess(), { scopes: ['global'], enabled: isHdData });

  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(HOTKEYS.FOCUS_TOOLBAR, () => firstElement.current?.focus(), { scopes: ['global'] });
  useHotkeys(
    HOTKEYS.FOCUS_INSCRIPTION,
    () => {
      setDetail(true);
      document.querySelector<HTMLElement>('.ui-accordion-trigger')?.focus();
    },
    {
      scopes: ['global']
    }
  );
  const texts = useHotkeyTexts();

  return (
    <Toolbar tabIndex={-1} ref={firstElement} className='master-toolbar'>
      <ToolbarTitle className='master-header'>{title}</ToolbarTitle>
      <Flex gap={1}>
        {isHdData && (
          <>
            <Button icon={IvyIcons.File} size='large' title={texts.openForm} aria-label={texts.openForm} onClick={() => openForm()} />
            <Button
              icon={IvyIcons.Process}
              size='large'
              title={texts.openProcess}
              aria-label={texts.openProcess}
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
