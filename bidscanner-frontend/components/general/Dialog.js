import styled from 'styled-components';

import Dialog from 'material-ui/Dialog';
import Clear from 'material-ui/svg-icons/content/clear';

export const Close = styled.button`
  position: absolute;
  right: -50px;
  top: -5px;
  color: white;
  cursor: pointer;
  padding: 0;
  border: 0 none;
  background: transparent;
`;

export default props => {
  const { width = 380, ...restProps } = props;

  return (
    <Dialog
      {...restProps}
      paperProps={{ style: { borderRadius: '8px' } }}
      contentStyle={{ width: `${width}px` }}
    >
      {props.children}
      {!props.modal &&
        <Close onClick={props.onRequestClose}>
          <Clear color="white" style={{ width: '30px', height: '30px' }} />
        </Close>}
    </Dialog>
  );
};
