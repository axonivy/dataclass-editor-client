import { hotkeyText } from '@axonivy/ui-components';
import { useMemo } from 'react';

export const HOTKEYS = {
  UNDO: 'mod+Z',
  REDO: 'mod+shift+Z',

  OPEN_FORM: 'F',
  OPEN_PROCESS: 'P',
  OPEN_HELP: 'F1',

  ADD_ATTR: 'A',
  DELETE_ATTR: 'Delete',
  COMBINE_ATTR: 'C',

  FOCUS_TOOLBAR: '1',
  FOCUS_MAIN: '2',
  FOCUS_INSCRIPTION: '3'
} as const;

export const useHotkeyTexts = () => {
  const undo = useMemo(() => `Undo (${hotkeyText(HOTKEYS.UNDO)})`, []);
  const redo = useMemo(() => `Redo (${hotkeyText(HOTKEYS.REDO)})`, []);
  const openForm = useMemo(() => `Open Form (${hotkeyText(HOTKEYS.OPEN_FORM)})`, []);
  const openProcess = useMemo(() => `Open Process (${hotkeyText(HOTKEYS.OPEN_PROCESS)})`, []);
  const openHelp = useMemo(() => `Open Help (${hotkeyText(HOTKEYS.OPEN_HELP)})`, []);
  const addAttr = useMemo(() => `Add Attribute (${hotkeyText(HOTKEYS.ADD_ATTR)})`, []);
  const combineAttr = useMemo(() => `Combine Attributes (${hotkeyText(HOTKEYS.COMBINE_ATTR)})`, []);
  const deleteAttr = useMemo(() => `Delete Attribute (${hotkeyText(HOTKEYS.DELETE_ATTR)})`, []);
  return { undo, redo, openForm, openProcess, openHelp, addAttr, combineAttr, deleteAttr };
};
