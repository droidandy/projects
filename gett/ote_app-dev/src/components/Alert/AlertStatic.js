import Alert from './Alert';

export default class AlertStatic extends Alert {
  constructor(props) {
    super(props);
    AlertStatic.context = this;
  }

  static show(props) {
    AlertStatic.context.setState(props, () => {
      clearTimeout(AlertStatic.context.timeout);

      AlertStatic.context.alertAnim.setValue(0);

      AlertStatic.context.animate(1);

      AlertStatic.context.timeout = setTimeout(() => {
        AlertStatic.context.hide();
      }, 5000);
    });
  }

  static hideAlert() {
    AlertStatic.context.hide();
  }

  render() {
    return super.render();
  }
}
