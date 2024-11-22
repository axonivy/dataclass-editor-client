import type { DataclassType } from '@axonivy/dataclass-editor-protocol';
import { Handle, Position } from '@xyflow/react';

type CustomNodeProps = { borderColor: string; dataClass: DataclassType };

export function CustomNode({ data }: { data: CustomNodeProps }) {
  return (
    <>
      <Handle type='source' position={Position.Top} id='t' style={{ visibility: 'hidden' }} />
      <Handle type='source' position={Position.Left} id='l' style={{ visibility: 'hidden' }} />
      <Handle type='source' position={Position.Right} id='r' style={{ visibility: 'hidden' }} />
      <Handle type='source' position={Position.Bottom} id='b' style={{ visibility: 'hidden' }} />
      <div
        style={{
          border: `1px solid ${data.borderColor}`,
          borderRadius: '5px',
          background: 'white',
          padding: '10px',
          width: '150px',
          textAlign: 'left'
        }}
      >
        <div style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '5px' }}>{data.dataClass.name}</div>
        <hr style={{ margin: '5px 0' }} />
        <ul style={{ padding: '0 10px', listStyleType: 'none', margin: 0 }}>
          {data.dataClass.fields.map((field: { name: string; type: string }) => (
            <li key={field.name}>
              {field.name}: <i>{field.type}</i>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
