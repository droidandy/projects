import OptionList1 from './../../assets/img/guide-tour/option-list-1.svg';
import OptionOverview1 from './../../assets/img/guide-tour/option-overview-1.svg';
import OptionOverview2 from './../../assets/img/guide-tour/option-overview-2.svg';
import OptionOverview3 from './../../assets/img/guide-tour/option-overview-3.svg';
import OptionOverview4 from './../../assets/img/guide-tour/option-overview-4.svg';

const pages = {
  OptionList: {
    attribute: 'OPTION_LIST_TOUR_COMPLETED',
    tips: [
      {
        tipPosition: 'bottom',
        elem: '.ui.card.card-current',
        elem2: '.ui.card.card-option.card-1 .card-link',
        title: 'Your current plan',
        text: 'The first box displays your current carrier and current annual plan costs.',
        title2: 'New closest matching plan',
        text2: 'The second box "option 1" displays Anthem\'s closest matching option to replace the incumbent carrier plans.',
        image: OptionList1,
        scrollTo: 40,
      },
      {
        tipPosition: 'right',
        elem: '.ui.card.card-option.card-1 .card-link',
        title: 'Click anywhere in the box',
        text: 'to see plan details or view alternative plan designs.',
        scrollTo: 41,
      },
    ],
  },
  OptionListCV: {
    attribute: 'OPTION_LIST_TOUR_COMPLETED',
    tips: [
      {
        tipPosition: 'bottom',
        elem: '.ui.card.card-current',
        elem2: '.ui.card.card-option.card-1 .card-link',
        title: 'Your current plan',
        text: 'The first box displays your current carrier and current annual plan costs.',
        title2: 'New closest matching plan',
        text2: 'The second box "option 1" will display Anthems closest matching plan once that quote has been received. However, we do have the Anthem clear value quote in the third box which is ready to view right now.',
        image: OptionList1,
        scrollTo: 40,
      },
      {
        tipPosition: 'bottom',
        elem: '.ui.card.card-option.card-1 .card-link',
        title: 'Click anywhere in the box',
        text: 'to see plan details or view alternative plan designs.',
        scrollTo: 41,
      },
    ],
  },
  OptionOverview: {
    attribute: 'OPTION_OVERVIEW_TOUR_COMPLETED',
    tips: [
      {
        tipPosition: 'bottom',
        elem: '.overview-top',
        title: 'Start with the total medical cost',
        text: 'Here we show total monthly employer and employee costs for the incumbent and quoted option. Annualized premium and difference is displayed to the right.',
        image: OptionOverview1,
      },
      {
        tipPosition: 'bottom',
        elem: '.plan-0',
        title: 'See the plan breakdown',
        text: 'Within each card, we break down the monthly costs for that particular plan. ',
        image: OptionOverview2,
        scrollTo: 400,
      },
      {

        tipPosition: 'bottom',
        elem: '.plan-0-difference',
        title: 'See the new plan cost',
        text: 'See how that particular plan compares to the closest matching incumbnet plan here.',
        image: OptionOverview3,
        scrollTo: 401,
      },
      {
        tipPosition: 'bottom',
        elem: '.plan-0-action',
        title: 'Lots of alternatives available',
        text: 'Shop across different plans and compare based on plan benefits and price.',
        image: OptionOverview4,
        scrollTo: 500,
      },
    ],
  },
  ViewAlternative: {
    attribute: 'VIEW_ALTERNATIVE_TOUR_COMPLETED',
    tips: [
      {
        tipPosition: 'right',
        elem: '.alternative-plan-current',
        title: 'Current plan rates',
        text: 'In the first column tiered rates for your incumbent plan are displayed here. You can also enter the current benefits for comparison purposes.',
        padding: 25,
      },
      {
        tipPosition: 'right',
        elem: '.alternative-plan-match',
        title: 'Closest matching plan benefits',
        text: 'The second column displays the rates and benefits for the closest matching Anthem plan.',
        padding: 25,
        scrollTo: 20,
      },
      {
        tipPosition: 'bottom',
        elem: '.alternatives-selected-header',
        title: 'Easily toggle alternatives',
        text: 'By clicking the arrow in either direction, easily compare across all the alternative plans available to replace the incumbent plan in the first column.',
        image: OptionOverview4,
        padding: 20,
        scrollTo: 1,
      },
    ],
  },
};

export default pages;
