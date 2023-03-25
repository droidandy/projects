import React from 'react';
import PropTypes from 'prop-types';

class Totals extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    rateBank: PropTypes.object.isRequired,
  }
  render() {
    const { rateBank } = this.props;
    return (
      <div>
        <div className="header-border">Totals</div>
        <ul className="leaders">
          <li>
            <div className="title"><span>PEPY</span></div>
            <div className="nums">{rateBank.pepy ?
              <span className={`${rateBank.pepy ? 'nums-blue totals-true' : 'nums-black totals-true'}`} >${rateBank.pepy}</span> :
              <span className="totals">-</span>}
            </div>
          </li>
          <li>
            <div className="title"><span>Total rate bank $ amount requested</span></div>
            <div className="nums">{rateBank.rateBankAmountRequested ?
              <span className={`${rateBank.rateBankAmountRequested ? 'nums-blue totals-true' : 'nums-black totals-true'}`} >${rateBank.rateBankAmountRequested}</span> :
              <span className="totals">-</span>}
            </div>
          </li>
          <li>
            <div className={`title ${rateBank.costVsCurrent ? 'cost' : ''}`}><span>Quote cost vs current</span></div>
            <div className="nums">
              { rateBank.costVsCurrent && <span className={`${rateBank.costVsCurrent ? 'nums-blue totals-true' : 'nums-black totals-true'}`}>${rateBank.costVsCurrent}</span> }
              { rateBank.costVsCurrent && <span className={`${rateBank.costVsCurrentPercentage ? 'nums-blue totals-true' : 'nums-black totals-true-percentage'}`}>{rateBank.costVsCurrentPercentage}%</span> }
              { !rateBank.costVsCurrent && <span className="totals">-</span> }
            </div>
          </li>
          <li>
            <div className={`title ${rateBank.costVsRenewal ? 'cost' : ''}`}><span>Quote cost vs reneval</span></div>
            <div className="nums">
              { rateBank.costVsRenewal && <span className={`${rateBank.costVsRenewal ? 'nums-blue totals-true' : 'nums-black totals-true'}`}>${rateBank.costVsRenewal}</span> }
              { rateBank.costVsRenewal && <span className={`${rateBank.costVsRenewalPercentage ? 'nums-blue totals-true' : 'nums-black totals-true-percentage'}`}>{rateBank.costVsRenewalPercentage}%</span> }
              { !rateBank.costVsRenewal && <span className="totals">-</span> }
            </div>
          </li>
        </ul>
      </div>

    );
  }
}
export default Totals;
