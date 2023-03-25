import React from 'react';
import { SketchPicker } from 'react-color';
import styled, { createGlobalStyle } from 'styled-components';
import TetherComponent from 'react-tether';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const Inner = styled.div`
  width: 36px;
  height: 14px;
  border-radius: 2px;
`;

const TetherStyle = createGlobalStyle`
.tether-element {
  z-index: 100;
}
`;

interface ColorPickerProps {
  className?: string;
}

const _ColorPicker = (props: ColorPickerProps) => {
  const { className, color, onChange } = props;
  const [isVisible, setIsVisible] = React.useState(false);
  const rafRef = React.useRef(0);

  React.useEffect(() => {
    if (!isVisible) {
      return;
    }
    const handler = () => {
      setIsVisible(false);
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [isVisible]);

  return (
    <div className={className}>
      <TetherStyle />
      <TetherComponent
        attachment="top center"
        renderTarget={ref => (
          <Inner
            ref={ref as any}
            style={{ background: color }}
            onClick={() => setIsVisible(true)}
          />
        )}
        renderElement={ref =>
          isVisible && (
            <>
              <div
                ref={ref as any}
                onClick={e => {
                  e.nativeEvent.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                }}
              >
                <SketchPicker
                  color={color}
                  onChange={res => {
                    cancelAnimationFrame(rafRef.current);
                    rafRef.current = requestAnimationFrame(() => {
                      onChange(res.hex);
                    });
                  }}
                />
              </div>
            </>
          )
        }
      />
    </div>
  );
};

export const ColorPicker = styled(_ColorPicker)`
  padding: 5px;
  background: rgb(255, 255, 255);
  border-radius: 1px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px;
  display: inline-block;
  cursor: pointer;
`;
