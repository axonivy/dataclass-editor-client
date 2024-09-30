import { useAppContext } from './AppContext';
import { useClient } from '../protocol/ClientContextProvider';
import type { DataClassActionArgs } from '../protocol/types';

export function useAction(actionId: DataClassActionArgs['actionId']) {
  const { context } = useAppContext();
  const client = useClient();

  return (content?: DataClassActionArgs['payload']) => {
    let payload = content ?? '';
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }
    client.action({ actionId, context, payload });
  };
}
