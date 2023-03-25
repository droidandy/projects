import React from 'react';
import NumberFormat from 'react-number-format';
import Moment from 'react-moment';
import { InvoicesIcon } from 'components/Icons';
import InvoiceStatus from './InvoiceStatus';
import InvoiceAmount from './InvoiceAmount';

const Invoices = ({ plan, subscription, usage_stats, invoices }) => {
  return (
    <div>
      {!plan.free && (
        <div className="c-c__b-billing__invoice c-c__b-billing__current-plan">
          <div className="c-c__b-billing__title">
            <svg
              className="c-c__b-billing__title-icon va-middle"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.5 2L3 1V15L5.5 14L8 15L10.5 14L13 15V1L10.5 2L8 1L5.5 2ZM9.5 5.5H8.5V5H7.5V5.5C7.10218 5.5 6.72064 5.65804 6.43934 5.93934C6.15804 6.22064 6 6.60218 6 7C6 7.39782 6.15804 7.77936 6.43934 8.06066C6.72064 8.34196 7.10218 8.5 7.5 8.5H8.5C8.77614 8.5 9 8.72386 9 9C9 9.27614 8.77614 9.5 8.5 9.5H7.5H6.5V10.5H7.5V11H8.5V10.5C8.89782 10.5 9.27936 10.342 9.56066 10.0607C9.84196 9.77936 10 9.39783 10 9C10 8.60218 9.84196 8.22064 9.56066 7.93934C9.27936 7.65804 8.89782 7.5 8.5 7.5H7.5C7.22386 7.5 7 7.27614 7 7C7 6.72386 7.22386 6.5 7.5 6.5H8.5H9.5V5.5Z"
                fill="#97ADC6"
              />
            </svg>
            <span className="c-c__b-billing__title-text va-middle">
              Next invoice estimation
            </span>
          </div>
          <div className="c-c__b-billing__current-plan__desc-row mt15">
            Fixed fee:&nbsp;
            <b>
              <NumberFormat
                value={
                  subscription.cancel_at
                    ? 0.0
                    : parseFloat(plan.price).toFixed(2)
                }
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />
            </b>
          </div>
          <div className="c-c__b-billing__current-plan__desc-row">
            Overaged MTR fee:{' '}
            <b>
              (
              <NumberFormat
                value={Math.max(
                  0,
                  Math.round(usage_stats.overage_since_free_plan)
                )}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />
              &nbsp;+&nbsp;
              <NumberFormat
                value={Math.max(
                  0,
                  Math.round(usage_stats.mtr_with_overage - plan.mtr)
                )}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />
              ) ÷ $1,000 ×&nbsp;
              <NumberFormat
                value={plan.price_per_1k_mtr}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />
              &nbsp;=&nbsp;
              <NumberFormat
                value={(
                  ((Math.max(
                    0,
                    Math.round(usage_stats.mtr_with_overage - plan.mtr)
                  ) +
                    Math.round(usage_stats.overage_since_free_plan)) /
                    1000) *
                  plan.price_per_1k_mtr
                ).toFixed(2)}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />
            </b>
          </div>
          <div className="c-c__b-billing__invoice-price">
            Estimation: $
            {subscription.cancel_at
              ? (
                  ((Math.max(
                    0,
                    Math.round(usage_stats.mtr_with_overage - plan.mtr)
                  ) +
                    Math.round(usage_stats.overage_since_free_plan)) /
                    1000) *
                  plan.price_per_1k_mtr
                ).toFixed(2)
              : (
                  parseFloat(plan.price) +
                  ((Math.max(
                    0,
                    Math.round(usage_stats.mtr_with_overage - plan.mtr)
                  ) +
                    Math.round(usage_stats.overage_since_free_plan)) /
                    1000) *
                    plan.price_per_1k_mtr
                ).toFixed(2)}
          </div>
          <div className="c-c__b-billing__invoice-description">
            You will be charged on&nbsp;
            <Moment
              className="uppercase"
              format="MMM DD, Y"
              date={subscription.current_period_end}
            />
          </div>
        </div>
      )}
      {!plan.free && subscription.cancel_at && (
        <div className="c-c__b-billing__pm">
          <div className="c-c__b-billing__title">
            <svg
              className="c-c__b-billing__title-icon va-middle"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.5858 9.46446L8.05025 13L6.63604 11.5858L9.22183 9L2 9L2 7L9.12132 7L6.63604 4.51471L8.05025 3.1005L11.5858 6.63604L13 8.05025L11.5858 9.46446Z"
                fill="#97ADC6"
              />
            </svg>
            <span className="c-c__b-billing__title-text va-middle">
              Upcoming changes
            </span>
          </div>
          <div className="c-c__b-billing__invoice-description mt15">
            You will be downgraded to Free plan at&nbsp;
            <Moment
              className="uppercase"
              format="MMM DD, Y"
              date={subscription.cancel_at}
            />
            .
          </div>
        </div>
      )}
      <div className="container-content__integrations-settings__content-title">
        <InvoicesIcon />
        <span>Invoices</span>
      </div>
      <div>
        <table className="table">
          <thead>
            <tr className="table100-head">
              <th className="column1_integrations">
                <span className="uppercase">ID</span>
              </th>
              <th className="column2">
                <span className="uppercase">DATE</span>
              </th>
              <th className="column3">
                <span className="uppercase">PAYMENT METHOD</span>
              </th>
              <th className="column4">
                <span className="uppercase">AMOUNT</span>
              </th>
              <th className="column5">
                <span className="uppercase">STATUS</span>
              </th>
              <th className="column5">
                <span className="uppercase">RECEIPT</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={index}>
                <td className="column1_integrations">
                  <span className="column-value">{invoice.invoice_number}</span>
                </td>
                <td className="column2 column-long">
                  <Moment format="MMM DD, Y" date={invoice.purchased_at} />
                </td>
                <td className="column3">{invoice.payment_method}</td>
                <td className="column4">
                  <InvoiceAmount invoice={invoice} />
                </td>
                <td className="column5 ta-center">
                  <InvoiceStatus invoice={invoice} />
                </td>
                <td className="column4">
                  {invoice.receipt_url && (
                    <a
                      className="link link_normal"
                      href={invoice.receipt_url}
                      target="_blank"
                    >
                      Download
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
