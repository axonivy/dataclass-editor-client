import { hotkeyText, isWindows } from '@axonivy/ui-components';
import { useMemo } from 'react';

type KnownHotkey = { hotkey: string; label: string };

export const useKnownHotkeys = () => {
  const undo = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+Z';
    return { hotkey, label: `Undo (${hotkeyText(hotkey)})` };
  }, []);

  const redo = useMemo<KnownHotkey>(() => {
    const hotkey = isWindows() ? 'mod+Y' : 'mod+shift+Z';
    return { hotkey, label: `Redo (${hotkeyText(hotkey)})` };
  }, []);

  const openForm = useMemo<KnownHotkey>(() => {
    const hotkey = 'F';
    return { hotkey, label: `Open Form (${hotkeyText(hotkey)})` };
  }, []);

  const openProcess = useMemo<KnownHotkey>(() => {
    const hotkey = 'P';
    return { hotkey, label: `Open Process (${hotkeyText(hotkey)})` };
  }, []);

  const openHelp = useMemo<KnownHotkey>(() => {
    const hotkey = 'F1';
    return { hotkey, label: `Open Help (${hotkeyText(hotkey)})` };
  }, []);

  const addAttr = useMemo<KnownHotkey>(() => {
    const hotkey = 'A';
    return { hotkey, label: `Add Attribute (${hotkeyText(hotkey)})` };
  }, []);

  const combineAttr = useMemo<KnownHotkey>(() => {
    const hotkey = 'C';
    return { hotkey, label: `Combine Attributes (${hotkeyText(hotkey)})` };
  }, []);

  const deleteAttr = useMemo<KnownHotkey>(() => {
    const hotkey = 'Delete';
    return { hotkey, label: `Delete Attribute (${hotkeyText(hotkey)})` };
  }, []);

  const focusToolbar = useMemo<KnownHotkey>(() => {
    const hotkey = '1';
    return { hotkey, label: `Focus Toolbar (${hotkeyText(hotkey)})` };
  }, []);

  const focusMain = useMemo<KnownHotkey>(() => {
    const hotkey = '2';
    return { hotkey, label: `Focus Main (${hotkeyText(hotkey)})` };
  }, []);

  const focusInscription = useMemo<KnownHotkey>(() => {
    const hotkey = '3';
    return { hotkey, label: `Focus Inscription (${hotkeyText(hotkey)})` };
  }, []);

  return { undo, redo, openForm, openProcess, openHelp, addAttr, combineAttr, deleteAttr, focusToolbar, focusMain, focusInscription };
};
