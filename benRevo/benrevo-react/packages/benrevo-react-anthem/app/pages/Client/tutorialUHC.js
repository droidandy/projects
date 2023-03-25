import Page2 from '../../assets/img/tutorial/uhc/page2.png';
import Page3 from '../../assets/img/tutorial/uhc/page3.png';
import Page4 from '../../assets/img/tutorial/uhc/page4.png';
import Page5 from '../../assets/img/tutorial/uhc/page5.png';
import Page6 from '../../assets/img/tutorial/uhc/page6.png';
import Page7 from '../../assets/img/tutorial/uhc/page7.png';
import Page8 from '../../assets/img/tutorial/uhc/page8.png';

const data = {
  title: 'Welcome to UnitedHealthcare Online Quoting.',
  description: 'This tutorial will give you a brief overview of the features available through this portal.',
  pages: [
    {
      image: Page2,
      title: 'Clients Homepage',
      list: [
        {
          text: 'To begin a new RFP, click Start New RFP.',
        },
      ],
    },
    {
      image: Page3,
      title: 'Navigating around',
      list: [
        {
          text: 'The top navigation bar shows every product and section of the RFP.',
        },
        {
          text: 'The sub-navigation will appear when there are multiple pages in a section.',
        },
      ],
    },
    {
      image: Page4,
      title: 'Sending RFP to Carrier',
      list: [
        {
          text: 'Select which lines of coverage to include in the RFP.',
        },
        {
          text: 'Submit the RFP directly to UnitedHealthcare.',
        },
        {
          text: 'Download a Word or PDF version of your RFP to send directly to the market.',
        },
      ],
    },
    {
      image: Page5,
      title: 'Review your quotes',
      list: [
        {
          text: 'Once your quote is received you can review and create new options.',
        },
      ],
    },
    {
      image: Page6,
      title: 'View alternatives',
      list: [
        {
          text: 'Easily compare across all available UnitedHealthcare plan options.',
        },
      ],
    },
    {
      image: Page7,
      title: 'Contributions',
      list: [
        {
          text: 'Built in contribution tools to formulate employee and employer contributions.',
        },
      ],
    },
    {
      image: Page8,
      title: 'Onboarding',
      mode: 'inline',
      list: [
        {
          text: 'Fill-out all the implementation questions in a simple format. Forms will be automatically populated and available for electronic signature.',
        },
      ],
    },
  ],
};


export default data;
