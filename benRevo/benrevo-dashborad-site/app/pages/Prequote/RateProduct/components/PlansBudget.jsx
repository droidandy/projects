import { Button, Input } from 'semantic-ui-react';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import NumberFormat from 'react-number-format';

class PlansBudget extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    rateBank: PropTypes.object.isRequired,
    saveBudgetData: PropTypes.func.isRequired,
    quoteType: PropTypes.string.isRequired,
    editBudgetInput: PropTypes.func.isRequired,
    editedBudgetInputs: PropTypes.object.isRequired,
    isBudgetEdit: PropTypes.bool,
    changeEditBudget: PropTypes.func.isRequired,
  }
  onBudgetChangeHandler = (e, item) => {
    const { editBudgetInput } = this.props;
    const value = e.target.value.replace('$', '').trim() || 0;
    editBudgetInput(item, value.toString());
  }
  render() {
    const {
    changeEditBudget,
    isBudgetEdit,
    editedBudgetInputs,
    saveBudgetData,
    quoteType,
    rateBank,
  } = this.props;
    return (
      <ul className="leaders">
        <li>
          <div className="title budget__editButton">
            {!isBudgetEdit && <Button primary floated={'right'} onClick={() => { changeEditBudget(true); }} size="medium">Add/Edit Ratebank</Button>}
            { isBudgetEdit && <Link className="budget__editLink" floated={'right'} onClick={() => { changeEditBudget(false); }}>Enter Buget Request(s) amount here <i className="share icon"></i></Link>}
          </div>
        </li>
        <li>
          <div className="budget-title"><span>Wellness Budget</span></div>
          {!isBudgetEdit ?
            <div className="nums"><span className="nums-black">{rateBank.wellnessBudget || '-'}</span></div> :
            <NumberFormat
              className="rate-bank__input right aligned budget"
              customInput={Input}
              allowNegative={false}
              prefix={'$'}
              placeholder="$"
              value={editedBudgetInputs.get('wellnessBudget') || rateBank.wellnessBudget}
              onChange={(e) => this.onBudgetChangeHandler(e, 'wellnessBudget')}
            />
          }
        </li>
        <li>
          <div className="budget-title"><span>Communication Budget</span></div>
          {!isBudgetEdit ?
            <div className="nums"><span className="nums-black">{rateBank.communicationBudget || '-'}</span></div> :
            <NumberFormat
              className="rate-bank__input right aligned budget"
              customInput={Input}
              allowNegative={false}
              prefix={'$'}
              placeholder="$"
              value={editedBudgetInputs.get('communicationBudget') || rateBank.communicationBudget}
              onChange={(e) => this.onBudgetChangeHandler(e, 'communicationBudget')}
            />
          }
        </li>
        <li>
          <div className="budget-title"><span>Implementation Budget</span></div>
          {!isBudgetEdit ?
            <div className="nums"><span className="nums-black">{rateBank.implementationBudget || '-'}</span></div> :
            <NumberFormat
              className="rate-bank__input right aligned budget"
              customInput={Input}
              allowNegative={false}
              prefix={'$'}
              placeholder="$"
              value={editedBudgetInputs.get('implementationBudget') || rateBank.implementationBudget}
              onChange={(e) => this.onBudgetChangeHandler(e, 'implementationBudget')}
            />
          }
        </li>
        { isBudgetEdit &&

          <li>
            <Button
              className="rate-bank__editButton ui grey button"
              floated={'left'}
              onClick={() => { changeEditBudget(false); }}
              size="medium"
            >Cancel</Button>
            <Button
              type="submit"
              className="rate-bank__editButton ui blue button"
              floated={'right'}
              onClick={() => {
                saveBudgetData({ data: editedBudgetInputs.toJS(), quoteType });
                changeEditBudget(false);
              }}
              size="medium"
            >Save Changes</Button>
          </li>
            }
      </ul>
    );
  }
}
export default PlansBudget;
