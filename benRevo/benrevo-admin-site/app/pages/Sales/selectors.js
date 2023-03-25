import { createSelector } from 'reselect';

const selectSales = (state) => state.get('sales');

const selectBrokerage = createSelector(
  selectSales,
  (substate) => substate.get('brokerage').toJS()
);

const selectPersonOfInterest = createSelector(
  selectSales,
  (substate) => substate.get('personOfInterest').toJS()
);

const selectBrokerageList = createSelector(
  selectSales,
  (substate) => {
    const brokerages = substate.get('brokerages').toJS();
    const finalBrokerages = [];

    for (let i = 0; i < brokerages.length; i += 1) {
      const item = brokerages[i];
      finalBrokerages.push({
        key: item.id,
        value: item.id,
        text: item.name,
      });
    }
    return finalBrokerages;
  }
);

const selectChanges = createSelector(
  selectSales,
  (substate) => {
    const personOfInterest = substate.get('personOfInterest').toJS();
    const editBool = substate.get('edit');
    const deleteBool = substate.get('delete');
    const currentChildren = substate.get('currentChildren').toJS();
    const deleted = [];
    const updated = [];
    const removedChildren = [];
    const addedChildren = [];

    if (editBool) {
      updated.push(personOfInterest);
    } else if (deleteBool) {
      deleted.push(personOfInterest);
    }
    const reassignList = personOfInterest.newBrokerageList;

    for (let i = 0; i < currentChildren.length; i += 1) {
      if (currentChildren[i].removed) removedChildren.push({ parentId: personOfInterest.personId, childId: currentChildren[i].personId });
      else if (currentChildren[i].added) addedChildren.push({ parentId: personOfInterest.personId, childId: currentChildren[i].personId });
    }

    return {
      deleted,
      updated,
      reassignList,
      removedChildren,
      addedChildren,
    };
  }
);

const selectAdditions = createSelector(
  selectSales,
  (substate) => {
    const newPeople = substate.get('newPeople').toJS();
    for (let i = 0; i < newPeople.length; i += 1) {
      newPeople[i].type = newPeople[i].type.toUpperCase();
      newPeople[i].fullName = `${newPeople[i].firstName} ${newPeople[i].lastName}`;
    }
    let added = [];

    added = added.concat(newPeople);

    return {
      added,
    };
  }
);

const selectSalesList = createSelector(
  selectSales,
  (substate) => {
    const data = substate.get('sales').toJS();
    const final = [];

    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      final.push({
        value: item.email,
        text: item.fullName,
      });
    }
    return final;
  }
);

const selectPreSalesList = createSelector(
  selectSales,
  (substate) => {
    const data = substate.get('presales').toJS();
    const final = [];

    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      final.push({
        value: item.email,
        text: item.fullName,
      });
    }
    return final;
  }
);

const selectFullPersonnelList = createSelector(
  selectSales,
  (substate) => {
    const sales = substate.get('sales').toJS();
    const presales = substate.get('presales').toJS();
    const managers = substate.get('managers').toJS();
    const renewalManagers = substate.get('renewalManagers').toJS();
    const renewalSales = substate.get('renewalSales').toJS();
    return sales.concat(presales).concat(managers).concat(renewalManagers).concat(renewalSales);
  }
);

const selectPersonnelList = createSelector(
  selectSales,
  (substate) => {
    const sales = substate.get('sales').toJS();
    const presales = substate.get('presales').toJS();
    const managers = substate.get('managers').toJS();
    const renewalManagers = substate.get('renewalManagers').toJS();
    const renewalSales = substate.get('renewalSales').toJS();
    const searchText = substate.get('searchText');
    let personnelList = [];

    personnelList = sales.concat(presales).concat(managers).concat(renewalManagers).concat(renewalSales).filter((person) => {
      if (
        (person.firstName && person.firstName.toLowerCase().indexOf(searchText) !== -1)
        || (person.lastName && person.lastName.toLowerCase().indexOf(searchText) !== -1)
        || (person.firstName && person.lastName && `${person.firstName} ${person.lastName}`.toLowerCase().indexOf(searchText) !== -1)
      ) {
        return true;
      }
      return false;
    });

    personnelList = personnelList.sort((a, b) => {
      if (a.firstName > b.firstName) {
        return 1;
      } else if (a.firstName < b.firstName) {
        return -1;
      }
      if (a.lastName > b.lastName) {
        return 1;
      } else if (a.lastName < b.lastName) {
        return -1;
      }
      return 0;
    });

    return personnelList;
  }
);

function getBrokerageById(id, data) {
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    if (item.id === id) {
      return item;
    }
  }

  return true;
}

function getSalesByEmail(email, data) {
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    if (item.email === email) {
      return item;
    }
  }

  return true;
}

function findPersons(brokerage, data) {
  const final = [];

  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    let found = false;
    for (let j = 0; j < item.brokerageList.length; j += 1) {
      const itemBrokerage = item.brokerageList[j];

      if (itemBrokerage.id === brokerage.get('id') && !item.deleted) {
        found = true;
        break;
      }
    }

    if (found) final.push(item);
  }

  return final;
}

export {
  selectAdditions,
  selectPersonOfInterest,
  selectBrokerage,
  selectBrokerageList,
  selectFullPersonnelList,
  selectPersonnelList,
  selectChanges,
  selectSalesList,
  selectPreSalesList,
  findPersons,
  getBrokerageById,
  getSalesByEmail,
};
