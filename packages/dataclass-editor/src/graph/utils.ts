import type { InternalNode } from '@xyflow/react';
import { Position } from '@xyflow/react';

type Params = [number, number, Position];
type EdgeParams = {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  sourcePos: Position;
  targetPos: Position;
};

function getParams(nodeA: InternalNode, nodeB: InternalNode): Params {
  const centerA = getNodeCenter(nodeA);
  const centerB = getNodeCenter(nodeB);
  const horizontalDiff = Math.abs(centerA.x - centerB.x);
  const verticalDiff = Math.abs(centerA.y - centerB.y);

  let position: Position;
  if (horizontalDiff > verticalDiff) {
    position = centerA.x > centerB.x ? Position.Left : Position.Right;
  } else {
    // here the vertical difference between the nodes is bigger, so we use Position.Top or Position.Bottom for the handle
    position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
  }

  const [x, y] = getHandleCoordsByPosition(nodeA, position);
  return [x, y, position];
}

function getHandleCoordsByPosition(node: InternalNode, handlePosition: Position): [number, number] {
  // all handles are of type source, that's why we use handleBounds.source here
  const handle = node.internals.handleBounds?.source?.find(h => h.position === handlePosition);

  if (!handle) {
    throw new Error(`Handle not found for position: ${handlePosition}`);
  }

  let offsetX = handle.width / 2;
  let offsetY = handle.height / 2;

  // Adjust for the correct handle position offsets
  switch (handlePosition) {
    case Position.Left:
      offsetX = 0;
      break;
    case Position.Right:
      offsetX = handle.width;
      break;
    case Position.Top:
      offsetY = 0;
      break;
    case Position.Bottom:
      offsetY = handle.height;
      break;
  }

  const x = node.internals.positionAbsolute.x + handle.x + offsetX;
  const y = node.internals.positionAbsolute.y + handle.y + offsetY;

  return [x, y];
}

function getNodeCenter(node: InternalNode): { x: number; y: number } {
  const x = node.internals?.positionAbsolute?.x ?? 0;
  const y = node.internals?.positionAbsolute?.y ?? 0;
  const width = node.measured?.width ?? 0;
  const height = node.measured?.height ?? 0;

  return {
    x: x + width / 2,
    y: y + height / 2
  };
}
// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: InternalNode, target: InternalNode): EdgeParams {
  const [sx, sy, sourcePos] = getParams(source, target);
  const [tx, ty, targetPos] = getParams(target, source);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos
  };
}
