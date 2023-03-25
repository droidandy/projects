import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import Helmet from 'react-helmet';

class MedicalPresentation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    Options: PropTypes.func,
    Compare: PropTypes.func,
    Alternatives: PropTypes.func,
    Overview: PropTypes.func,
    Networks: PropTypes.func,
    Comparsion: PropTypes.func,
    section: PropTypes.string.isRequired,
    page: PropTypes.object.isRequired,
    medicalPage: PropTypes.object.isRequired,
    carrierList: PropTypes.array.isRequired,
    changeCurrentPage: PropTypes.func.isRequired,
    mainCarrier: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.changePage = this.changePage.bind(this);
  }

  changePage(section, page, readOnly, index, id, carrier = this.props.mainCarrier, options = {}) {
    // scroll up if user navigates from long scroll position
    if (document.body && document.body.scrollTop > 200) {
      window.scrollTo(0, 0);
    }
    this.props.changeCurrentPage(section, { currentPage: page, readOnly, index, id, carrier, options });
  }

  render() {
    const { section, page, Options, Compare, Alternatives, Overview, Networks, Comparsion } = this.props;

    return (
      <div key={section}>
        <Helmet
          title="Presentation"
          meta={[
            { name: 'description', content: 'Medical Presentation' },
          ]}
        />
        <Grid stackable className="medical-presentation">
          <Grid.Row>
            <Grid.Column width={16}>
              { page.currentPage === 'Options' &&
              <Options section={section} changePage={this.changePage} />
              }
              { page.currentPage === 'Compare' &&
              <Compare section={section} changePage={this.changePage} />
              }
              { page.currentPage === 'Overview' &&
              <Overview
                id={page.id}
                medicalPageId={page.id}
                carrier={page.carrier}
                index={page.index}
                section={section}
                changePage={this.changePage}
                readOnly={page.readOnly}
              />
              }
              { page.currentPage === 'Alternatives' &&
              <Alternatives
                id={page.id}
                index={page.index}
                section={section}
                changePage={this.changePage}
                carrier={page.carrier}
              /> }
              { page.currentPage === 'Comparison' &&
                <Comparsion section={section} changePage={this.changePage} />
              }
              { page.currentPage === 'Networks' &&
                <Networks section={section} changePage={this.changePage} />
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default MedicalPresentation;
