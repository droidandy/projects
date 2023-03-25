import * as React from 'react';
import styled from 'styled-components';
import { Card } from 'src/components/Card';
import { getStrategicMapsState } from '../interface';
import { DropGroup } from './DropGroup';
import { StrategicMapsHeader } from './StrategicMapsHeader';
import { ConnectLine } from './ConnectLine';
import { TextItem } from './TextItem';
import { ImageItem } from './ImageItem';
interface StrategicMapsPaneProps {
  className?: string;
}

const Groups = styled.div`
  background-size: 40px 40px;
  background-image: linear-gradient(to right, #f3f4f5 1px, transparent 1px),
    linear-gradient(to bottom, #f3f4f5 1px, transparent 1px);
  flex: 1 0 0;
  padding: 30px;
`;

const Wrapper = styled.div`
  position: relative;
  width: 961px;
`;

const _StrategicMapsPane = (props: StrategicMapsPaneProps) => {
  const {
    groups,
    isEditMode,
    texts,
    images,
  } = getStrategicMapsState.useState();
  const { className } = props;
  const relativeRef = React.useRef(null as null | HTMLDivElement);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  React.useLayoutEffect(() => {
    if (relativeRef.current) {
      const rect = relativeRef.current.getBoundingClientRect();
      setOffset({
        x: rect.x,
        y: rect.y,
      });
    }
  }, []);

  return (
    <Wrapper>
      <Card className={className}>
        <StrategicMapsHeader />
        <Groups style={isEditMode ? undefined : { background: 'none' }}>
          <Relative ref={relativeRef}>
            {texts.map(item => (
              <TextItem
                item={item}
                key={item.id}
                isEditMode={isEditMode}
                offset={offset}
              />
            ))}
            {images.map(item => (
              <ImageItem
                item={item}
                key={item.id}
                isEditMode={isEditMode}
                offset={offset}
              />
            ))}
          </Relative>
          {groups.map((group, i) => (
            <React.Fragment key={group.id}>
              <DropGroup group={group} index={i} isEditMode={isEditMode} />{' '}
              {groups.length - 1 !== i && (
                <ConnectLine size={groups[i + 1].columns.length} />
              )}
            </React.Fragment>
          ))}
        </Groups>
      </Card>
    </Wrapper>
  );
};

export const StrategicMapsPane = styled(_StrategicMapsPane)`
  display: flex;
  min-height: 100%;
  overflow: auto;
  background: white;
  flex-direction: column;
`;

export const Relative = styled.div`
  position: relative;
  z-index: 2;
`;
