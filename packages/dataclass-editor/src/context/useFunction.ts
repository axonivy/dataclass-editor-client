import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { genQueryKey } from '../query/query-client';
import type { FunctionRequestTypes } from '@axonivy/dataclass-editor-protocol';
import { useClient } from '../protocol/ClientContextProvider';

type UseFunctionOptions<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
};

export function useFunction<TFunct extends keyof FunctionRequestTypes>(
  path: TFunct,
  args: FunctionRequestTypes[TFunct][0],
  options?: UseFunctionOptions<FunctionRequestTypes[TFunct][1]>
): UseMutationResult<FunctionRequestTypes[TFunct][1], Error, void> {
  const client = useClient();

  return useMutation({
    mutationKey: genQueryKey(path, args),
    mutationFn: () => client.function(path, args),
    onSuccess: options?.onSuccess,
    onError: options?.onError
  });
}
