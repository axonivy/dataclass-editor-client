import {
  Button,
  Flex,
  Input,
  InputGroup,
  IvyIcon,
  Popover,
  PopoverAnchor,
  PopoverContent,
  useField,
  type BrowserNode
} from '@axonivy/ui-components';
import type { DataclassType } from '../../../protocol/types';
import { useEffect, useRef, useState } from 'react';
import { useCombobox } from 'downshift';
import { IvyIcons } from '@axonivy/ui-icons';
import './ComboboxTypeBrowser.css';
import { useTypeBrowser } from '../browser/useTypeBrowser';

type ComboboxProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'value' | 'onChange'> & {
  value: string;
  onChange: (change: string) => void;
};

const defaultFilter = (option: BrowserNode<DataclassType>, input?: string): boolean => {
  if (!input) {
    return true;
  }
  const filter = input.toLowerCase();
  return option.value.toLowerCase().includes(filter);
};

const listType: BrowserNode<DataclassType> = {
  value: 'List<>',
  info: 'java.lang',
  icon: IvyIcons.DataClass,
  children: [],
  data: {
    fullQualifiedName: 'java.util.List',
    name: 'List',
    packageName: 'java.util',
    path: '/java/util/List'
  }
};

export const ComboboxWithTypeBrowser = ({ value, onChange }: ComboboxProps) => {
  const options = useTypeBrowser().types;
  const [listAdded, setListAdded] = useState(false);
  const [listContent, setListContent] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [filteredItems, setFilteredItems] = useState([listType, ...options]);
  useEffect(() => setFilteredItems([listType, ...options]), [options]);
  const { inputProps } = useField();

  const { isOpen, getToggleButtonProps, getMenuProps, getInputProps, highlightedIndex, getItemProps, selectedItem, selectItem, openMenu } =
    useCombobox({
      inputId: inputProps.id,
      labelId: inputProps['aria-labelledby'],
      onSelectedItemChange(change) {
        setFilteredItems([listType, ...options]);
        const newValue = change.inputValue ?? '';
        if (newValue.startsWith('List<') && newValue.endsWith('>')) {
          setFilteredItems(options);
          onChange(newValue);
          setListAdded(true);
          if (inputRef.current) {
            inputRef.current.focus();
            const cursorPosition = newValue.length - 1;
            inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
          }
          if (change.inputValue !== value) {
            openMenu();
          }
          return;
        }
        if (listAdded) {
          const updatedValue = `List<${newValue}>`;
          onChange(updatedValue);
          setListAdded(false);
          return;
        }
        if (change.inputValue !== value) {
          onChange(change.inputValue ?? '');
        }
      },
      stateReducer(state, actionAndChanges) {
        switch (actionAndChanges.type) {
          case useCombobox.stateChangeTypes.InputBlur:
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
            selectItem({ value: actionAndChanges.changes.inputValue ?? '' } as BrowserNode<DataclassType>);
        }
        return actionAndChanges.changes;
      },
      onInputValueChange(change) {
        if (change.type !== useCombobox.stateChangeTypes.FunctionSelectItem) {
          const inputValue = change.inputValue ?? '';

          if (inputValue.startsWith('List<') && inputValue.endsWith('>')) {
            const insideList = inputValue.slice(5, -1);
            setListContent(insideList);
            setListAdded(true);
          } else {
            setListAdded(false);
            setListContent('');
          }
          const filterValue = listAdded ? listContent : inputValue;
          const newOptions = !listAdded ? [listType, ...options] : options;
          setFilteredItems(newOptions.filter(option => defaultFilter(option, filterValue)));
        }
      },

      items: filteredItems,
      itemToString(item) {
        return item?.value ?? '';
      },
      initialSelectedItem: { value } as BrowserNode<DataclassType>
    });

  useEffect(() => {
    selectItem({ value } as BrowserNode<DataclassType>);
    setFilteredItems(options);
  }, [options, selectItem, value]);

  return (
    <Popover open={isOpen}>
      <div className='ui-combobox'>
        <PopoverAnchor asChild>
          <InputGroup>
            <Input {...getInputProps({ ref: inputRef })} />
            <Button {...getToggleButtonProps()} icon={IvyIcons.Chevron} rotate={90} aria-label='toggle menu' />
          </InputGroup>
        </PopoverAnchor>
        <div {...getMenuProps()}>
          <PopoverContent onOpenAutoFocus={e => e.preventDefault()} className='ui-combobox-menu'>
            {filteredItems.map((item, index) => (
              <Flex
                gap={2}
                className='ui-combobox-item'
                data-highlighted={highlightedIndex === index ? '' : undefined}
                data-state={selectedItem?.value === item.value ? 'checked' : 'unchecked'}
                key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                <Flex gap={1} alignItems='center'>
                  <IvyIcon icon={item.icon} />
                  <span>{item.value}</span>
                  <span style={{ color: 'var(--N700)' }}>{item.info}</span>
                </Flex>
              </Flex>
            ))}
          </PopoverContent>
        </div>
      </div>
    </Popover>
  );
};
