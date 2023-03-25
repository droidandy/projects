import Page2 from '../../assets/img/tutorial/anthem/page2.png';
import Page3 from '../../assets/img/tutorial/anthem/page3.png';
import Page4 from '../../assets/img/tutorial/anthem/page4.png';
import Page5 from '../../assets/img/tutorial/anthem/page5.png';
import Page6 from '../../assets/img/tutorial/anthem/page6.png';
import Page7 from '../../assets/img/tutorial/anthem/page7.png';
import Page8 from '../../assets/img/tutorial/anthem/page8.png';

const data = {
  title: 'Welcome to Quote Anthem.',
  description: 'This tutorial will give you a brief overview of the features available through this portal.',
  pages: [
    {
      image: Page2,
      title: 'Clients Homepage',
      list: [
        {
          text: 'Try the pre-loaded sample client to get an idea of the information needed to submit an RFP.',
        },
        {
          text: 'To begin a new RFP, click Start New RFP.',
        },
      ],
    },
    {
      image: Page3,
      imagePosition: 'right',
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
      imagePosition: 'left',
      title: 'Sending RFP to Carrier',
      list: [
        {
          text: 'Select which lines of coverage to include in the RFP.',
        },
        {
          text: 'Submit the RFP directly to Anthem.',
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
          text: 'You will receive an instant Clear Value medical, dental, and vision quote (if your client qualifies).',
        },
        {
          text: 'Your standard quote will appear here once it is received from Anthem.',
        },
      ],
    },
    {
      image: Page6,
      title: 'View alternatives',
      list: [
        {
          text: 'Easily compare across all available Anthem plan options.',
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
