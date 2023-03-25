import React from 'react';
import PropTypes from 'prop-types';
import { Header, Loader, Dimmer } from 'semantic-ui-react';
import EnrollmentTable from './components/EnrollmentTable';
import ProjectedEnrollmentModal from './components/ProjectedEnrollmentModal';

class Enrollment extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    getEnrollment: PropTypes.func.isRequired,
    changeEnrollment: PropTypes.func.isRequired,
    cancelEnrollment: PropTypes.func.isRequired,
    editEnrollment: PropTypes.func.isRequired,
    saveEnrollment: PropTypes.func.isRequired,
    medicalEnrollment: PropTypes.object.isRequired,
    dentalEnrollment: PropTypes.object.isRequired,
    visionEnrollment: PropTypes.object.isRequired,
    virginList: PropTypes.object.isRequired,
    medicalEdit: PropTypes.bool.isRequired,
    dentalEdit: PropTypes.bool.isRequired,
    visionEdit: PropTypes.bool.isRequired,
    load: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    hideTitle: PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      modalOpen: false,
    };

    this.onEdit = this.onEdit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSave = this.onCancel.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentWillMount() {
    if (this.props.load) this.props.getEnrollment();
  }

  onEdit() {
    this.setState({ edit: true });
  }

  onCancel() {
    this.setState({ edit: false });
  }

  onSave() {
    this.setState({ edit: false });
  }

  toggleModal() {
    const currModalState = this.state.modalOpen;
    this.setState({ modalOpen: !currModalState });
  }

  render() {
    const {
      medicalEnrollment,
      dentalEnrollment,
      visionEnrollment,
      changeEnrollment,
      cancelEnrollment,
      saveEnrollment,
      editEnrollment,
      medicalEdit,
      dentalEdit,
      visionEdit,
      loading,
      virginList,
      hideTitle,
    } = this.props;
    const empty = (!medicalEnrollment.contributions || !medicalEnrollment.networks.length) && (!dentalEnrollment.contributions || !dentalEnrollment.networks.length) && (!visionEnrollment.contributions || !visionEnrollment.networks.length);
    return (
      <div className="presentation-enrollment">
        <Header className="presentation-options-header" as="h2">{ !hideTitle && 'Enrollment' }<Loader inline active={loading && medicalEnrollment.contributions && medicalEnrollment.contributions.length > 0} style={{ float: 'right', marginTop: '8px' }} /></Header>
        <Dimmer active={loading && !medicalEnrollment.contributions} inverted>
          <Loader indeterminate size="big">Loading enrollments</Loader>
        </Dimmer>
        { medicalEnrollment.contributions && medicalEnrollment.networks.length > 0 &&
          <EnrollmentTable
            data={medicalEnrollment}
            edit={medicalEdit}
            changeEnrollment={changeEnrollment}
            cancelEnrollment={cancelEnrollment}
            saveEnrollment={saveEnrollment}
            editEnrollment={editEnrollment}
            openModal={this.toggleModal}
            isVirgin={virginList.medical}
            name="medical"
          />
        }
        { dentalEnrollment.contributions && dentalEnrollment.networks.length > 0 &&
          <EnrollmentTable
            data={dentalEnrollment}
            edit={dentalEdit}
            changeEnrollment={changeEnrollment}
            cancelEnrollment={cancelEnrollment}
            saveEnrollment={saveEnrollment}
            editEnrollment={editEnrollment}
            openModal={this.toggleModal}
            isVirgin={virginList.dental}
            name="dental"
          />
        }
        { visionEnrollment.contributions && visionEnrollment.networks.length > 0 &&
          <EnrollmentTable
            data={visionEnrollment}
            edit={visionEdit}
            changeEnrollment={changeEnrollment}
            cancelEnrollment={cancelEnrollment}
            saveEnrollment={saveEnrollment}
            editEnrollment={editEnrollment}
            openModal={this.toggleModal}
            isVirgin={virginList.vision}
            name="vision"
          />
        }
        { empty && !loading &&
          <div className="empty">
            No Enrollments
          </div>
        }
        <ProjectedEnrollmentModal
          open={this.state.modalOpen}
          closeModal={this.toggleModal}
        />
      </div>
    );
  }
}

export default Enrollment;
