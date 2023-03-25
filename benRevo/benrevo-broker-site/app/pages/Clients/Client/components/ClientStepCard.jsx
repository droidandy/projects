import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Grid, Image, Button } from 'semantic-ui-react';
import {
  NOT_STARTED,
  READY,
  COMPLETED,
} from './../../constants';
import CompleteIcon from '../../../../assets/img/svg/complete.svg';
import ClientsIcon from '../../../../assets/img/svg/clients_icon.svg';
import Step2Icon from './../../../../assets/img/svg/step2_icon.svg';
import Step3Icon from '../../../../assets/img/svg/step3_icon.svg';
import Step4Icon from './../../../../assets/img/svg/step4_icon.svg';

class ClientStepCard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    link: PropTypes.string.isRequired,
    status: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    descr: PropTypes.string.isRequired,
  };

  render() {
    const { header, descr, status, link, disabled, type } = this.props;
    let color = '';
    let icon = null;
    switch (type) {
      case 'client':
        color = 'setup';
        icon = status[type] === COMPLETED ? CompleteIcon : ClientsIcon;
        break;
      case 'rfp':
        color = 'rfps';
        icon = status[type] === COMPLETED ? CompleteIcon : Step2Icon;
        break;
      case 'presentation':
        color = 'build';
        icon = status[type] === COMPLETED ? CompleteIcon : Step3Icon;
        break;
      case 'download':
        color = 'build';
        icon = status.presentation === COMPLETED ? CompleteIcon : Step4Icon;
        break;
      default:
        color = '';
        icon = CompleteIcon;
    }
    const verticalLineClassName = `${color} vertical-line`;
    return (
      <Grid className="client-step-card">
        <Grid.Row>
          <Grid.Column className={verticalLineClassName} />
          <Grid.Column computer="2" tablet="2" mobile="2" className="icon-column padded">
            <Image className="icon-image" src={icon} />
          </Grid.Column>
          <Grid.Column computer="10" tablet="10" mobile="10" className="text-column padded">
            <p className="header">{header}</p>
            <p className="descr">{descr}</p>
          </Grid.Column>
          <Grid.Column computer="4" tablet="4" mobile="4" className="text-column padded">
            { (type !== 'download' && status[type] === COMPLETED) &&
            <Button disabled={disabled} as={Link} to={link} fluid primary>View/Edit</Button>
            }
            { (type === 'download' && (status.presentation === READY || status.presentation === COMPLETED)) &&
            <Button disabled={disabled} as={Link} to={link} fluid primary>View and Download</Button>
            }
            { (status[type] === READY && type !== 'download') &&
            <Button disabled={disabled} as={Link} to={link} fluid primary>Start</Button>
            }
            { (status[type] === NOT_STARTED || (type === 'download' && status.presentation === NOT_STARTED)) &&
            <Button disabled as={Link} to={link} fluid color="grey">Not Started</Button>
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ClientStepCard;

