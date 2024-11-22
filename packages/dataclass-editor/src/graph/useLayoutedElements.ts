import '@xyflow/react/dist/style.css';
import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import ElkConstructor, { type ElkNode } from 'elkjs/lib/elk.bundled.js';

const elk = new ElkConstructor();
export const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const defaultOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    'elk.spacing.nodeNode': '80'
  };

  const getLayoutedElements = useCallback((options: Record<string, string | number>) => {
    const layoutOptions = { ...defaultOptions, ...options };
    const graph: ElkNode = {
      id: 'root',
      layoutOptions: layoutOptions,
      children: getNodes().map(node => ({
        ...node,
        width: node.measured?.width,
        height: node.measured?.height
      })),
      edges: getEdges()
    };

    elk.layout(graph).then(({ children }) => {
      // By mutating the children in-place we saves ourselves from creating a
      // needless copy of the nodes array.
      children?.forEach(node => {
        node.position = { x: node.x, y: node.y };
      });

      setNodes(children);
      window.requestAnimationFrame(() => {
        fitView();
      });
    });
  }, []);

  return { getLayoutedElements };
};
