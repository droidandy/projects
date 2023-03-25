import Alert from './Alert';

export default class ModalAlertStatic extends Alert {
  constructor(props) {
    super(props);
    ModalAlertStatic.context = this;
  }

  static show(props) {
    ModalAlertStatic.context.setState(props, () => {
      clearTimeout(ModalAlertStatic.context.timeout);

      ModalAlertStatic.context.alertAnim.setValue(0);

      ModalAlertStatic.context.animate(1);

      ModalAlertStatic.context.timeout = setTimeout(() => {
        ModalAlertStatic.context.hide();
      }, 5000);
    });
  }

  render() {
    return super.render();
  }
}
