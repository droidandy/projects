import React from 'react';
import PropTypes from 'prop-types';
import { scrollToInvalid } from '@benrevo/benrevo-react-core';

class Form extends React.Component {
  static propTypes = {
    saveFormState: PropTypes.func.isRequired,
    nextPage: PropTypes.func.isRequired,
    isValid: PropTypes.bool,
    products: PropTypes.object.isRequired,
    sendRfp: PropTypes.func.isRequired,
    showErrors: PropTypes.bool.isRequired,
    formErrors: PropTypes.object.isRequired,
    changeShowErrors: PropTypes.func.isRequired,
    containerId: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.saveInformationSection = ::this.saveInformationSection;
    this.changePage = ::this.changePage;
  }

  componentDidMount() {
    const { showErrors, formErrors, changeShowErrors, containerId } = this.props;
    if (showErrors && formErrors && Object.keys(formErrors)[0]) {
      scrollToInvalid(Object.keys(formErrors), null, null, containerId);
      changeShowErrors(false);
    }
  }

  saveInformationSection(type) {
    if (type === 'next') {
      // save the rfp on each continue action
      this.props.sendRfp();
    }

    // if (this.props.client.id) return this.changePage(type);
    return this.changePage(type);
  }

  changePage(type) {
    const props = this.props;
    const page = (props.routes[3]) ? props.routes[3].path : null;
    const section = (page !== props.section) ? props.section : props.routes[2].path;

    return this.calculatePath({ section, page, type });
  }

  /**
   * Choosing the right path for the selected products. Strict dependence on the order of paths in routes.js.
   *
   * @param  {object} data Contains the name of the first (ex. medical) and second (ex. info) level and the type of action (next / back)
   *
   * products - List of selected products. If false, the path is skipped.
   * virginCoverage - Indication of the virgin product. If true, the subpath (page) is skipped. Does not affect section.
   */

  calculatePath(data) {
    const props = this.props;
    const products = this.props.products;
    const virginCoverage = this.props.virginCoverage;
    const routes = props.routes[1].childRoutes;
    let section = data.section;
    let page = data.page;
    const type = data.type;
    const goToPrevSection = (i) => {
      const prevRoute = routes[i - 1];
      const prevChildPath = prevRoute.childRoutes[prevRoute.childRoutes.length - 1].path;

      if (products[prevRoute.path] === false || virginCoverage[prevChildPath] || products[prevChildPath] === false) {
        page = prevChildPath;
        section = prevRoute.path;
        this.calculatePath({ section, page, type });
        return true;
      } else {
        props.changePage(`${prevRoute.path}/${prevChildPath}`, props.prefix);
      }
    };

    if (routes && routes.length > 0) {
      for (let i = 0; i < routes.length; i += 1) {
        const item = routes[i];

        if (item.path === section) {
          if (item.childRoutes) {
            for (let j = 0; j < item.childRoutes.length; j += 1) {
              const item2 = item.childRoutes[j];
              if (item2.path === page) {
                if (type === 'back') {
                  if (j > 0) {
                    const prevRoute = item.childRoutes[j - 1];

                    if (products[prevRoute.path] === false || products[section] === false || virginCoverage[prevRoute.path]) {
                      page = prevRoute.path;
                      this.calculatePath({ section, page, type });
                      return true;
                    } else {
                      props.changePage(`${item.path}/${prevRoute.path}`, props.prefix);
                      return true;
                    }
                  } else {
                    goToPrevSection(i);
                    return true;
                  }
                } else if (j < item.childRoutes.length - 1) {
                  const nextRoute = item.childRoutes[j + 1];

                  if (products[nextRoute.path] === false || virginCoverage[nextRoute.path]) {
                    page = nextRoute.path;
                  } else {
                    props.changePage(`${item.path}/${nextRoute.path}`, props.prefix);
                    return true;
                  }
                } else {
                  const nextRoute = routes[i + 1];

                  if (products[nextRoute.path] === false) {
                    section = nextRoute.path;
                    page = nextRoute.childRoutes[nextRoute.childRoutes.length - 1].path;
                  } else if (nextRoute.childRoutes) {
                    for (let m = 0; m < nextRoute.childRoutes.length; m += 1) {
                      const nextChildPath = nextRoute.childRoutes[m].path;

                      if ((products[nextChildPath] && !virginCoverage[nextChildPath]) || products[nextChildPath] === undefined) {
                        props.changePage(`${nextRoute.path}/${nextChildPath}`, props.prefix);
                        return true;
                      }
                    }

                    section = nextRoute.path;
                    page = nextRoute.childRoutes[nextRoute.childRoutes.length - 1].path;
                  } else props.changePage(nextRoute.path, props.prefix);
                }
              }
            }
          } else {
            if (type === 'back') {
              goToPrevSection(i);
            } else props.changePage(`${item.path}`, props.prefix);
            break;
          }
        }
      }
    }
  }
}

export default Form;
