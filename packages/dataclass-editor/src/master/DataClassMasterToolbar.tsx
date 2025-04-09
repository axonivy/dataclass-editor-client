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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys,
  useTheme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAction } from '../context/useAction';
import { useKnownHotkeys } from '../utils/useKnownHotkeys';
import { useHeaderTitles } from '../utils/useHeaderTitles';
import { useTranslation } from 'react-i18next';

export const DataClassMasterToolbar = () => {
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

  const { masterTitle: title } = useHeaderTitles();
  const { t } = useTranslation();

  return (
    <Toolbar tabIndex={-1} ref={firstElement} className='dataclass-editor-main-toolbar'>
      <ToolbarTitle className='dataclass-editor-main-toolbar-title'>{title}</ToolbarTitle>
      <Flex gap={1}>
        <ToolbarContainer maxWidth={450}>
          <Flex>
            <Flex gap={1}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button aria-label={hotkeys.undo.label} icon={IvyIcons.Undo} size='large' onClick={undo} disabled={!history.canUndo} />
                  </TooltipTrigger>
                  <TooltipContent>{hotkeys.undo.label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button aria-label={hotkeys.redo.label} icon={IvyIcons.Redo} size='large' onClick={redo} disabled={!history.canRedo} />
                  </TooltipTrigger>
                  <TooltipContent>{hotkeys.redo.label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Flex>
            <Separator orientation='vertical' style={{ height: '26px', marginInline: 'var(--size-2)' }} />
          </Flex>
        </ToolbarContainer>
        {isHdData && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button icon={IvyIcons.File} size='large' aria-label={hotkeys.openForm.label} onClick={() => openForm()} />
                </TooltipTrigger>
                <TooltipContent>{hotkeys.openForm.label}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button icon={IvyIcons.Process} size='large' aria-label={hotkeys.openProcess.label} onClick={() => openProcess()} />
                </TooltipTrigger>
                <TooltipContent>{hotkeys.openProcess.label}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
        {!disabled && (
          <Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button icon={IvyIcons.Settings} size='large' aria-label={t('common.label.settings')} />
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>{t('common.label.settings')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent sideOffset={12}>
              <ReadonlyProvider readonly={false}>
                <Flex direction='column' gap={2}>
                  <Field direction='row' alignItems='center' justifyContent='space-between' gap={4}>
                    <Label>
                      <Flex alignItems='center' gap={1}>
                        <IvyIcon icon={IvyIcons.DarkMode} />
                        {t('common.label.theme')}
                      </Flex>
                    </Label>
                    <Switch
                      defaultChecked={theme === 'dark'}
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      size='small'
                      aria-label={t('common.label.theme')}
                    />
                  </Field>
                </Flex>
                <PopoverArrow />
              </ReadonlyProvider>
            </PopoverContent>
          </Popover>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                icon={IvyIcons.LayoutSidebarRightCollapse}
                size='large'
                onClick={() => setDetail(!detail)}
                aria-label={t('common.label.details')}
              />
            </TooltipTrigger>
            <TooltipContent>{t('common.label.details')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Flex>
    </Toolbar>
  );
};
