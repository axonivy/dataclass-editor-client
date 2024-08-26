import { Flex, Separator } from '@axonivy/ui-components';
import type { ReactElement } from 'react';
import { Fragment } from 'react';

type ControlProps = {
  buttons: Array<ReactElement>;
};

export const Control = ({ buttons }: ControlProps) => {
  const controlButtons = buttons.map((button, index) => {
    if (index === 0) {
      return button;
    }
    return (
      <Fragment key={index}>
        <Separator decorative orientation='vertical' style={{ height: '20px', margin: '0 10px' }} />
        {button}
      </Fragment>
    );
  });
  return <Flex>{controlButtons}</Flex>;
};
