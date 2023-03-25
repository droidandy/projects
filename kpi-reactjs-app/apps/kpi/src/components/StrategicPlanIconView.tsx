import * as React from 'react';
import { API_BASE_URL } from 'shared/API';
import styled from 'styled-components';
import { StrategicPlanIcon } from 'src/features/strategicPlan/interface';

interface StrategicPlanIconProps {
  width: number | string;
  height: number | string;
  icons?: StrategicPlanIcon[];
  field?: string;
  targetObject?: StrategicPlanIcon;
}

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;IconIconIconIconIconIcon
`;

export const StrategicPlanIconView = (props: StrategicPlanIconProps) => {
  const { width, height, icons, field, targetObject } = props;
  const targetIcon = !targetObject
    ? icons!.find(el => el.field === field)
    : targetObject;
  if (!targetIcon || !targetIcon.icon || !targetIcon.iconId) {
    return (
      <Div style={{ width: width, height: height }}>
        <i className="flaticon2-image-file" style={{ fontSize: width }} />
      </Div>
    );
  }

  return (
    <img
      src={`${API_BASE_URL}/api/documents/files?token=${targetIcon.icon.downloadToken}`}
      style={{ width: width, height: height }}
    />
  );
};
