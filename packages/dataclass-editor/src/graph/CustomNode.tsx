import './CustomNode.css';
import type { DataclassType } from '@axonivy/dataclass-editor-protocol';
import { Button, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { useState } from 'react';

type CustomNodeData = {
  isOriginalDataClass: boolean;
  dataClass: DataclassType;
};

export type CustomNode = Node<{ CustomNodeData: CustomNodeData }, 'custom'>;

export function CustomNode({ data, selected }: NodeProps<CustomNode>) {
  const [expanded, setExpanded] = useState(false);

  const fieldsToShow = expanded ? data.CustomNodeData.dataClass.fields : data.CustomNodeData.dataClass.fields.slice(0, 2);
  const getCleanedFieldType = (type: string): string => {
    const lastDotIndex = type.lastIndexOf('.');
    return lastDotIndex !== -1 ? type.slice(lastDotIndex + 1) : type;
  };

  return (
    <>
      <Handle type='source' position={Position.Top} id='t' />
      <Handle type='source' position={Position.Left} id='l' />
      <Handle type='source' position={Position.Right} id='r' />
      <Handle type='source' position={Position.Bottom} id='b' />
      <div className={`custom-node ${selected ? 'selected' : data.CustomNodeData.isOriginalDataClass ? 'original' : 'normal'}`}>
        <div className='custom-node-header'>{data.CustomNodeData.dataClass.name}</div>
        <hr />
        <ul className='custom-node-fields'>
          {fieldsToShow.map((field: { name: string; type: string }) => (
            <li key={field.name} className='custom-node-field'>
              <span className='custom-node-field-name'>{field.name}:</span> <i>{getCleanedFieldType(field.type)}</i>
            </li>
          ))}
        </ul>
        {data.CustomNodeData.dataClass.fields.length > 2 && (
          <Flex justifyContent='center'>
            <Button icon={IvyIcons.Chevron} rotate={expanded ? 270 : 90} size='small' onClick={() => setExpanded(!expanded)} />
          </Flex>
        )}
      </div>
    </>
  );
}
