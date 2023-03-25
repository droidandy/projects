import { Modal } from 'antd';

const { confirm } = Modal;

export default function Confirm(props) {
  return (
    confirm({
      ...props,
      cancelButtonProps: {
        type: 'secondary'
      }
    })
  );
}
