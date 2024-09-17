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
import { useAppContext } from '../../../context/AppContext';

type DataClassMasterToolbarProps = {
  title: string;
};

export const DataClassMasterToolbar = ({ title }: DataClassMasterToolbarProps) => {
  const { detail, setDetail } = useAppContext();
  const { theme, setTheme } = useTheme();

  return (
    <Toolbar className='master-toolbar'>
      <ToolbarTitle className='master-header'>{title}</ToolbarTitle>
      <Flex gap={1}>
        {theme !== 'system' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button icon={IvyIcons.Settings} size='large' aria-label='Settings' />
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
        <Button icon={IvyIcons.LayoutSidebarRightCollapse} size='large' onClick={() => setDetail(!detail)} aria-label='Details toggle' />
      </Flex>
    </Toolbar>
  );
};
