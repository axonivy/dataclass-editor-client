import { cardinalityLabels, cascadeTypeLabels, modifierLabels, type Field } from '@axonivy/dataclass-editor-protocol';
import { Flex } from '@axonivy/ui-components';
import { Badge } from './Badge';
import './FieldBadges.css';

type FieldBadgesProps = {
  field: Field;
};

export const FieldBadges = ({ field }: FieldBadgesProps) => {
  const entityProperties = field.modifiers.filter(modifier => modifier !== 'PERSISTENT');
  return (
    <Flex gap={1} className='badges-container'>
      {field.entity?.association && (
        <Badge
          value='C'
          className='cardinality-badge'
          tooltip={
            <>
              <div>
                <b>Cardinality</b>
              </div>
              <div>{cardinalityLabels[field.entity.association]}</div>
              {field.entity.cascadeTypes.length !== 0 && (
                <>
                  <div>
                    <b>Cascade</b>
                  </div>
                  {field.entity.cascadeTypes.map(cascadeType => (
                    <div key={cascadeType}>{cascadeTypeLabels[cascadeType]}</div>
                  ))}
                </>
              )}
              {field.entity.mappedByFieldName && (
                <>
                  <div>
                    <b>Mapped by</b>
                  </div>
                  <div>{field.entity.mappedByFieldName}</div>
                  {field.entity.orphanRemoval && <div>Remove orphans</div>}
                </>
              )}
            </>
          }
        />
      )}
      {entityProperties.length !== 0 && (
        <Badge
          value='E'
          className='entity-properties-badge'
          tooltip={
            <>
              <div>
                <b>Entity Properties</b>
              </div>
              {entityProperties.map(modifier => (
                <div key={modifier}>{modifierLabels[modifier]}</div>
              ))}
            </>
          }
        />
      )}
      {field.annotations.length !== 0 && (
        <Badge
          value='A'
          className='annotations-badge'
          tooltip={
            <>
              <div>
                <b>Annotations</b>
              </div>
              {field.annotations.map((annotation, index) => (
                <div key={index}>{simpleAnnotationName(annotation)}</div>
              ))}
            </>
          }
        />
      )}
      {field.modifiers.includes('PERSISTENT') && (
        <Badge
          value='P'
          className='properties-badge'
          tooltip={
            <>
              <div>
                <b>Properties</b>
              </div>
              <div>{modifierLabels.PERSISTENT}</div>
            </>
          }
        />
      )}
    </Flex>
  );
};

const fullQualifiedAnnotationRegex = /@(?:[\w]+\.)*([\w]+)(\(.*|$)/g;
export const simpleAnnotationName = (fullQualifiedAnnotation: string) => {
  return fullQualifiedAnnotation.replace(fullQualifiedAnnotationRegex, (_fullQualifiedAnnotation, annotationName) => annotationName);
};
