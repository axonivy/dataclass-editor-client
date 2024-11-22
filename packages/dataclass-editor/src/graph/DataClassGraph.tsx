import type { Edge, Node, OnConnect, OnEdgesChange, OnNodesChange } from '@xyflow/react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ConnectionMode,
  Controls,
  MarkerType,
  MiniMap,
  Panel,
  ReactFlow
} from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import FloatingEdge from './FloatingEdge';
import { useMeta } from '../context/useMeta';
import { useAppContext } from '../context/AppContext';
import { useLayoutedElements } from './useLayoutedElements';

export const DataClassGraph = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { getLayoutedElements } = useLayoutedElements();
  const { context, dataClass: originalDataClass } = useAppContext();
  const dataClasses = useMeta('meta/scripting/dataClasses', context, []).data;

  const onNodesChange: OnNodesChange = useCallback(changes => setNodes(nds => applyNodeChanges(changes, nds)), [setNodes]);
  const onEdgesChange: OnEdgesChange = useCallback(changes => setEdges(eds => applyEdgeChanges(changes, eds)), [setEdges]);
  const onConnect: OnConnect = useCallback(
    params =>
      setEdges(eds =>
        addEdge(
          {
            ...params,
            type: 'floating',
            markerEnd: { type: MarkerType.Arrow }
          },
          eds
        )
      ),
    [setEdges]
  );

  useEffect(() => {
    const originalDataClassFqn = originalDataClass.namespace + '.' + originalDataClass.simpleName;
    // Create nodes
    const newNodes = dataClasses.map((dataClass, index) => ({
      id: dataClass.fullQualifiedName,
      position: { x: index * 200, y: 0 },
      data: {
        borderColor: originalDataClassFqn === dataClass.fullQualifiedName ? 'blue' : 'black',
        dataClass: {
          name: dataClass.name,
          fullQualifiedName: dataClass.fullQualifiedName,
          fields: dataClass.fields
        }
      },
      type: 'customNode'
    }));

    // Create edges
    const newEdges: Edge[] = [];
    dataClasses.forEach(dataClass => {
      dataClass.fields.forEach(field => {
        if (dataClasses.some(dc => dc.fullQualifiedName === field.type)) {
          newEdges.push({
            id: `${dataClass.fullQualifiedName}-${field.type}`,
            source: dataClass.fullQualifiedName,
            target: field.type,
            sourceHandle: 'b',
            targetHandle: 't',
            type: 'floating',
            markerEnd: {
              type: MarkerType.Arrow,
              width: 15,
              height: 15
            },
            style: { strokeWidth: 2 }
          });
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [setNodes, setEdges, dataClasses, originalDataClass]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={{ customNode: CustomNode }}
      edgeTypes={{ floating: FloatingEdge }}
      connectionMode={ConnectionMode.Loose}
    >
      <Controls />
      <MiniMap />
      <Background gap={12} size={1} />
      <Panel position='top-right'>
        <button
          onClick={() =>
            getLayoutedElements({
              'elk.algorithm': 'layered',
              'elk.direction': 'DOWN'
            })
          }
        >
          vertical layout
        </button>
        <button
          onClick={() =>
            getLayoutedElements({
              'elk.algorithm': 'layered',
              'elk.direction': 'RIGHT'
            })
          }
        >
          horizontal layout
        </button>
        <button
          onClick={() =>
            getLayoutedElements({
              'elk.algorithm': 'org.eclipse.elk.force'
            })
          }
        >
          force layout
        </button>
      </Panel>
    </ReactFlow>
  );
};

export default DataClassGraph;
