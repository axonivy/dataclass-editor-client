import { BrowsersView } from '@axonivy/ui-components';
import { useTypeBrowser } from './useTypeBrowser';

type BrowserProps = {
  onChange: (value: string) => void;
  value: string;
  close: () => void;
};

export const Browser = ({ onChange, close, value }: BrowserProps) => {
  const typeBrowser = useTypeBrowser(value);
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
