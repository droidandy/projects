import { createSelector } from 'reselect';

const selectState = (state) => state;

const selectAccount = createSelector(
  selectState,
  (state) => {
    const formInfo = state.get('ga').get('form').toJS();
    const fn = state.get('profile').get('firstName');
    const ln = state.get('profile').get('lastName');
    const email = state.get('profile').get('email');
    formInfo.agentName = `${fn} ${ln}`;
    formInfo.agentEmail = email;
    return formInfo;
  }
);

const selectGAStatus = createSelector(
  selectState,
  (state) => state.get('profile').get('isGA')
);

const selectAnthemPreSales = createSelector(
  () => {
    const data = [
      'Alejandra Lam',
      'Blake Billinger',
      'Christine Mouanoutoua',
      'Crystal Shepard',
      'Jennifer Scott',
      'Jessie Gonzalez',
      'Jillian Young',
      'Kelly Hoomalu',
      'Nicholas Ralph',
      'Nicole Kharrat',
      'Olaf Pacheco',
      'Samuel Williams',
      'Stacie Thomason',
      'Susan Ellman',
      'Tasia Mead',
      'Vanessa Rabay',
    ];

    return createList(data);
  }
);

const selectAnthemSales = createSelector(
  () => {
    const data = [
      'Anita Vincent',
      'Ashlee Johnson',
      'Asuncion Sanchez',
      'Cynthia Khan',
      'Debra Feuerman',
      'Eric Windsor',
      'Jeff Koprivetz',
      'Jerry Connolly',
      'Kerri DiCicco',
      'Kristin Fortney',
      'Kristyn Nelms',
      'Nicholas Shuck',
      'Steve Cleeland',
      'Tanya Coty',
      'Yanet Galindo',
    ];

    return createList(data);
  }
);

function createList(data) {
  const final = [];
  for (let i = 0; i < data.length; i += 1) {
    const listItem = data[i];
    final.push({
      key: listItem,
      value: listItem,
      text: listItem,
    });
  }
  return final;
}

const selectBrokerage = createSelector(
  selectState,
  (state) => state.get('profile').get('brokerage')
);

export {
  selectAnthemPreSales,
  selectAnthemSales,
  selectAccount,
  selectGAStatus,
  selectBrokerage,
};
