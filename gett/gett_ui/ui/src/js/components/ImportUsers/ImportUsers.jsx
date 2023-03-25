import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connectAdvanced } from 'react-redux';
import YouTube from 'react-youtube';
import { Upload, Progress, Spin, Modal } from 'antd';
import { Button } from 'components';
import Form, { Checkbox, bindState } from 'components/form';
import { noop } from 'lodash';
import { faye, urlFor, gettAnalytics } from 'utils';
import update from 'update-js';
import dispatchers from 'js/redux/app/passengers.dispatchers';
import moment from 'moment';

const youTubeOpts = {
  height: '315',
  width: '560'
};

function mapStateToProps(state) {
  const { importChannel, memberId, companyId } = state.session;

  return { importChannel, memberId, companyId };
}

const initialState = {
  form: {
    onboarding: false
  },
  fileName: null,
  saving: false,
  progress: 0,
  createdCount: 0,
  updatedCount: 0,
  failedCount: 0,
  errors: [],
  processingError: '',
  showErrors: false
};

class ImportUsers extends PureComponent {
  static propTypes = {
    importChannel: PropTypes.string.isRequired,
    importPassengers: PropTypes.func,
    showVideo: PropTypes.bool,
    memberId: PropTypes.number,
    companyId: PropTypes.number
  };

  static defaultProps = {
    showVideo: true
  };

  state = initialState;

  componentDidMount() {
    this.subscription = faye.on(this.props.importChannel, (message) => {
      const { line, total, status, errors, processingError } = message.data;

      if (processingError) {
        return this.setState({ processingError });
      }

      const progress = Math.ceil((line - 1) / total * 100);
      const nextState = { progress, [`${status}Count`]: this.state[`${status}Count`] + 1 };

      if (status === 'failed') {
        const errorLine = `Line ${line}: ${errors.join(', ')}`;

        nextState.errors = [...this.state.errors, errorLine];
      }

      this.setState(nextState);
    });
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.cancel();
    }
  }

  setFormRef = form => this.form = form;

  changeFile = (info) => {
    this.setState(update(this.state, {
      'form.file': info.file.originFileObj,
      fileName: info.file.name,
      progress: 0,
      createdCount: 0,
      updatedCount: 0,
      failedCount: 0,
      errors: [],
      processingError: null
    }));
  };

  startImport = () => {
    this.form.ifValid(() => {
      const { file, onboarding } = this.state.form;
      const data = new FormData();

      data.append('import[onboarding]', onboarding);
      data.append('import[file]', file);

      this.setState({ saving: true });
      this.props.importPassengers(data)
        .then(() => {
          this.logImportCompletion();
          this.setState(update(this.state, {
            'form.file': null,
            fileName: null,
            saving: false
          }));
        })
        .catch(() => {
          this.setState({ saving: false });

          Modal.error({
            title: 'Check required fields',
            content: `Please make sure all required fields
              are present; email, status, first name, last name and
              phone are all required.`
          });
        });
    });
  };

  logImportCompletion = () => {
    const { memberId, companyId } = this.props;
    const { createdCount, updatedCount, failedCount } = this.state;

    gettAnalytics('company_web|passengers|import_employees|completed', {
      companyId,
      userId: memberId,
      timestamp: moment(),
      employeesAddedSuccessfully: createdCount,
      employeesUpdatedSuccessfully: updatedCount,
      employeesRejected: failedCount
    });
  };

  reset() {
    this.setState(initialState);
  }

  toggleErrors = () => {
    this.setState({ showErrors: !this.state.showErrors });
  };

  render() {
    const { saving, fileName, progress, showErrors, createdCount, updatedCount, failedCount, errors, processingError } = this.state;

    return (
      <div>
        <div className="text-18 black-text bold-text mb-20">Import employees to Gett Business Solutions</div>
        <div className="layout horizontal sm-wrap">
          <div className="flex sm-full-width sm-mb-20 black-text pt-20 mr-20">
            <div className="text-18 bold-text mb-10">Instructions:</div>
            <ol className="decimal pl-40 mb-20">
              <li>
                Download CSV template <a href={ urlFor.statics('/import_example.csv') } { ...urlFor.downloadProps }>here</a>
              </li>
              <li>Load employee details to file</li>
              <li>Save file in a .csv format</li>
              <li>Click "Browse" to select the file from your computer</li>
              <li>Check "Start Employee On-Boarding"</li>
              <li>Click "Import" to add new users.</li>
            </ol>
            <div className="text-14 mb-20">
              New users will be sent a welcome email asking them to activate their Gett Business Solutions powered by One Transport account.
            </div>
            <Spin spinning={ saving }>
              <Form { ...bindState(this) } validations={ { file: { presence: { message: 'Please attach the file' } } } } ref={ this.setFormRef }>
                { $ => (
                  <div>
                    <div className="layout horizontal center">
                      <Upload
                        { ...$('file')(this.changeFile) }
                        customRequest={ noop }
                        showUploadList={ false }
                        accept=".csv, text/csv"
                      >
                        <Button type="secondary">Browse</Button>
                        { this.form && this.form.getError('file') &&
                          <div className="error">{ this.form.getError('file') }</div>
                        }
                      </Upload>

                      { fileName &&
                        <div className="ml-10">{ fileName }</div>
                      }
                    </div>

                    <Checkbox { ...$('onboarding') }className="mt-20 mb-20">
                      <span className="bold-text">Start Employee On-Boarding</span>
                    </Checkbox>
                  </div>
                ) }
              </Form>
            </Spin>
            <div className="mb-20 mt-20">
              <Button type="secondary" onClick={ this.startImport }>Import</Button>
            </div>
            { progress == 100 &&
              <div className="text-12 bold-text mb-5">Import employees has been completed</div>
            }
            <Progress percent={ progress } />
            <div className="mt-20 pb-20 mb-20 border-bottom">
              Employees added successfully: <span className="green-text bold-text" data-name="createdCount">{ createdCount }</span>,
              employees updated successfully: <span className="green-text bold-text" data-name="updatedCount">{ updatedCount }</span>
              <div>
                employees rejected: <span className="red-text bold-text" data-name="rejectedCount">{ failedCount }</span>
                { errors.length > 0 &&
                  <span onClick={ this.toggleErrors } className="link pointer ml-20">
                    { showErrors ? 'close error list' : 'show error list' }
                  </span>
                }
              </div>
            </div>
            { showErrors &&
              <div data-name="errorsList">
                { errors.map((line, i) => <div key={ i }>{ line }</div>) }
              </div>
            }
            { processingError &&
              <span className="red-text bold-text">{ processingError }</span>
            }
          </div>
          { this.props.showVideo && <YouTube videoId="qtJKJUmX4tI" opts={ youTubeOpts } /> }
        </div>
      </div>
    );
  }
}

function selectorFactory(dispatch) {
  return (nextState, ownProps) => ({
    ...ownProps,
    ...mapStateToProps(nextState),
    ...dispatchers(dispatch, ['importPassengers'])
  });
}

export default connectAdvanced(selectorFactory, { forwardRef: true })(ImportUsers);
