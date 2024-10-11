import { BrowsersView } from '@axonivy/ui-components';
import { useTypeBrowser } from './useTypeBrowser';

type BrowserProps = {
  onChange: (value: string) => void;
  close: () => void;
};

export const Browser = ({ onChange, close }: BrowserProps) => {
  const typeBrowser = useTypeBrowser();
  return (
    <BrowsersView
      browsers={[typeBrowser]}
      apply={(browserName, result) => {
        if (result) {
          onChange(result.value);
        }
        close();
      }}
    />
  );
};
