import { cardinalityLabels, cascadeTypeLabels, modifierLabels, type Field } from '@axonivy/dataclass-editor-protocol';
import { Flex, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import './FieldBadges.css';

type FieldBadgesProps = {
  field: Field;
};

export const FieldBadges = ({ field }: FieldBadgesProps) => {
  const entityProperties = field.modifiers.filter(modifier => modifier !== 'PERSISTENT');
  return (
    <Flex gap={1}>
      {field.entity?.association && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='badge'>C</div>
            </TooltipTrigger>
            <TooltipContent>
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
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {entityProperties.length !== 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='badge'>E</div>
            </TooltipTrigger>
            <TooltipContent>
              <div>
                <b>Entity Properties</b>
              </div>
              {entityProperties.map(modifier => (
                <div key={modifier}>{modifierLabels[modifier]}</div>
              ))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {field.annotations.length !== 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='badge'>A</div>
            </TooltipTrigger>
            <TooltipContent>
              <div>
                <b>Annotations</b>
              </div>
              {field.annotations.map((annotation, index) => (
                <div key={index}>{simpleAnnotationName(annotation)}</div>
              ))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {field.modifiers.includes('PERSISTENT') && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='badge'>P</div>
            </TooltipTrigger>
            <TooltipContent>
              <div>
                <b>Properties</b>
              </div>
              <div>{modifierLabels.PERSISTENT}</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </Flex>
  );
};

const fullQualifiedAnnotationRegex = /@(?:[\w]+\.)*([\w]+)(\(.*|$)/g;
export const simpleAnnotationName = (fullQualifiedAnnotation: string) => {
  return fullQualifiedAnnotation.replace(fullQualifiedAnnotationRegex, (_fullQualifiedAnnotation, annotationName) => annotationName);
};
