import '@xyflow/react/dist/style.css';
import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import ElkConstructor, { type ElkNode } from 'elkjs/lib/elk.bundled.js';
import type { CustomNode } from './CustomNode';

const elk = new ElkConstructor();
export const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow<CustomNode>();

  const getLayoutedElements = useCallback(
    (options: Record<string, string | number>) => {
      const defaultOptions = {
        'elk.algorithm': 'layered',
        'elk.layered.spacing.nodeNodeBetweenLayers': '100',
        'elk.spacing.nodeNode': '80'
      };
      const layoutOptions = { ...defaultOptions, ...options };
      const graph: ElkNode = {
        id: 'root',
        layoutOptions: layoutOptions,
        children: getNodes().map(node => ({
          ...node,
          width: node.measured?.width,
          height: node.measured?.height
        })),
        edges: getEdges().map(edge => ({
          id: edge.id,
          sources: [edge.source],
          targets: [edge.target]
        }))
      };

      elk.layout(graph).then(({ children }) => {
        if (!children) return;
        const oldNodes = getNodes();
        const transformedNodes: CustomNode[] = children.map(elkNode => {
          const oldNode = oldNodes.find(node => node.id === elkNode.id);
          if (oldNode) {
            return {
              ...oldNode,
              position: { x: elkNode.x ? elkNode.x : oldNode.position.x, y: elkNode.y ? elkNode.y : oldNode.position.y }
            };
          }
          return {
            id: '',
            position: { x: 0, y: 0 },
            data: {
              CustomNodeData: {
                isOriginalDataClass: false,
                dataClass: { fields: [], fullQualifiedName: '', name: '', packageName: '', path: '' }
              }
            }
          };
        });

        setNodes(transformedNodes);
        window.requestAnimationFrame(() => {
          fitView();
        });
      });
    },
    [fitView, getEdges, getNodes, setNodes]
  );

  return { getLayoutedElements };
};
