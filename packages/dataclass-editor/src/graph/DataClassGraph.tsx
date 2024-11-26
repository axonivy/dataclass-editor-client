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
  // Panel,
  ReactFlow,
  useReactFlow
} from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import FloatingEdge from './FloatingEdge';
import { useMeta } from '../context/useMeta';
import { useAppContext } from '../context/AppContext';
import { useLayoutedElements } from './useLayoutedElements';
import { Button, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { getLayoutedElements_dagre, type Direction } from './getLayoutedElements_Dagre';

export const DataClassGraph = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { getLayoutedElements } = useLayoutedElements();
  const { context, dataClass: originalDataClass } = useAppContext();
  const dataClasses = useMeta('meta/scripting/dataClasses', context, []).data;
  const { getNodes, getEdges, fitView } = useReactFlow<CustomNode>();

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

  const onLayout = useCallback(
    (direction: Direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements_dagre({ nodes: getNodes(), edges: getEdges(), direction });
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [fitView, getEdges, getNodes]
  );

  useEffect(() => {
    console.log(dataClasses);
    const originalDataClassFqn = originalDataClass.namespace + '.' + originalDataClass.simpleName;
    const filteredDataClasses = dataClasses.filter(dataClass => {
      const isOriginalDataClass = dataClass.fullQualifiedName === originalDataClassFqn;
      const hasMatchingField = dataClass.fields?.some(field => field.type === originalDataClassFqn);
      const fieldInOriginalDataClassMatches = originalDataClass.fields?.some(field => field.type === dataClass.fullQualifiedName);
      return isOriginalDataClass || hasMatchingField || fieldInOriginalDataClassMatches;
    });
    // Create nodes
    const newNodes = filteredDataClasses.map((dataClass, index) => ({
      id: dataClass.fullQualifiedName,
      position: { x: index * 200, y: 0 },
      data: {
        CustomNodeData: {
          isOriginalDataClass: originalDataClassFqn === dataClass.fullQualifiedName,
          dataClass: {
            name: dataClass.name,
            fullQualifiedName: dataClass.fullQualifiedName,
            fields: dataClass.fields
          }
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
      {/* <PositioningTools /> */}
      <Panel position='top-right'>
        <Flex direction='row' gap={1}>
          <button onClick={() => onLayout('TB')}>vertical layout</button>
          <button onClick={() => onLayout('LR')}>horizontal layout</button>
          <Button
            icon={IvyIcons.Process}
            rotate={90}
            onClick={() =>
              getLayoutedElements({
                'elk.algorithm': 'layered',
                'elk.direction': 'DOWN'
              })
            }
            style={{ background: 'white', boxShadow: 'var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default))' }}
          />
          <Button
            icon={IvyIcons.Process}
            onClick={() =>
              getLayoutedElements({
                'elk.algorithm': 'layered',
                'elk.direction': 'RIGHT'
              })
            }
            style={{ background: 'white', boxShadow: 'var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default))' }}
          />
          <Button
            icon={IvyIcons.FitToScreen}
            onClick={() =>
              getLayoutedElements({
                'elk.algorithm': 'org.eclipse.elk.force'
              })
            }
            style={{ background: 'white', boxShadow: 'var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default))' }}
          />
        </Flex>
      </Panel>
    </ReactFlow>
  );
};

export default DataClassGraph;
