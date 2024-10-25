import { useQuery } from '@tanstack/react-query';
import { genQueryKey } from '../query/query-client';
import type { FunctionRequestTypes } from '../protocol/types';
import { useClient } from '../protocol/ClientContextProvider';

type NonUndefinedGuard<T> = T extends undefined ? never : T;

export function useFunction<TFunct extends keyof FunctionRequestTypes>(
  path: TFunct,
  args: FunctionRequestTypes[TFunct][0],
  returns: NonUndefinedGuard<FunctionRequestTypes[TFunct][1]>,
  options?: { disable?: boolean }
): { data: FunctionRequestTypes[TFunct][1] } {
  const client = useClient();
  return useQuery({
    enabled: !options?.disable,
    queryKey: genQueryKey(path, args),
    queryFn: () => client.function(path, args),
    initialData: returns
  });
}
