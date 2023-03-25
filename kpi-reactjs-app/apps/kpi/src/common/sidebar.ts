import * as R from 'remeda';
import {
  BalancedScorecardItemWithChildren,
  BalancedScorecardItemType,
  Resource,
  Initiative,
  TreeItemData,
  BalancedScorecard,
} from 'src/types-next';
import { UnreachableCaseError } from './helper';
import i18n from 'src/i18n';

type ItemType = keyof typeof BalancedScorecardItemType;

export function groupItems(items: BalancedScorecardItemWithChildren[]) {
  return Object.entries(
    R.groupBy(items, x => BalancedScorecardItemType[x.typeId] as ItemType)
  ) as Array<[ItemType, BalancedScorecardItemWithChildren[]]>;
}

export function getGroupName(type: ItemType) {
  switch (type) {
    case 'DevelopmentGoal':
      return i18n.t('Sustainable Development Goals');
    case 'MofaGoal':
      return i18n.t('UAE MOFA Goals');
    case 'Goal':
      return i18n.t('Abu Dhabi Plan Goals');
    case 'Enabler':
      return i18n.t('Abu Dhabi Plan Programs/ADFD Enablers');
    case 'Outcome':
      return i18n.t('Outcomes');
    case 'Theme':
      return i18n.t('Themes');
    case 'Operation':
      return i18n.t('Department Processes');
    case 'Objective':
      return i18n.t('Department Objectives');
    case 'KPI':
      return i18n.t('KPIs');
    case 'GenericItem':
      return i18n.t('Generic Items');
    case 'Link':
      return i18n.t('Links');
    default:
      throw new UnreachableCaseError(type);
  }
}

function getItemType(item: Resource) {
  return BalancedScorecardItemType[item.typeId] as ItemType;
}

export function getResourceKey(item: Resource) {
  const type = getItemType(item);
  return `${type}_${item.id}`;
}

export function getInitiativeKey(item: Initiative) {
  return `InitiativeItem_${item.id}`;
}

export function getAllExpandedMap(
  resources: Resource[] | null,
  initiatives: Initiative[] | null,
  rootKey = 'root'
) {
  const map: { [x: string]: true } = {
    [rootKey]: true,
  };
  if (resources) {
    resources.forEach(item => {
      map[getResourceKey(item)] = true;
    });
  }
  if (initiatives) {
    initiatives.forEach(item => {
      map[getInitiativeKey(item)] = true;
    });
  }
  return map;
}

export type ExpandedMap = {
  [x: string]: true;
};

export function toggleExpandedKey(expandedMap: ExpandedMap, key: string) {
  const copy = { ...expandedMap };
  if (copy[key]) {
    delete copy[key];
  } else {
    copy[key] = true;
  }
  return copy;
}

interface InitiativeWithChildren extends Initiative {
  children: InitiativeWithChildren[];
}

interface GetInitiativeTreeOptions {
  initiatives: Initiative[];
  lang: string;
  expandedMap: ExpandedMap;
  selectedKey: string | null;
  isAdding: boolean;
  searchTerm: string;
  noHref?: boolean;
  isNext?: boolean;
}

export function getInitiativeTree(options: GetInitiativeTreeOptions) {
  const {
    initiatives,
    lang,
    expandedMap,
    selectedKey,
    isAdding,
    searchTerm,
    noHref,
    isNext,
  } = options;

  const ret: TreeItemData[] = [];

  const getUrl = (id: number) =>
    isNext ? `/initiatives-next/${id}` : `/initiatives/${id}`;

  const insertNewItem = () => {
    if (!isAdding) {
      return;
    }
    for (let i = 0; i < ret.length; i++) {
      const item = ret[i];
      if (item.isActive) {
        item.isActive = false;
        if (searchTerm) {
          item.hasChildren = true;
          item.isExpanded = true;
        }
        ret.splice(
          i + 1,
          0,
          getNewItem(searchTerm ? 1 : isNext ? 0 : item.depth + 1)
        );
        break;
      }
    }
  };

  if (searchTerm) {
    initiatives
      .filter(item =>
        item.name[lang].toLowerCase().includes(searchTerm.toLowerCase())
      )
      .forEach(item => {
        const key = getInitiativeKey(item);
        ret.push({
          href: noHref ? null : getUrl(item.id),
          key,
          name: item.name,
          depth: 0,
          isExpanded: false,
          isActive: selectedKey === key,
          hasChildren: false,
          clickable: true,
        });
      });
    insertNewItem();
    return ret;
  }

  const initiativesWithChildren: InitiativeWithChildren[] = initiatives.map(
    item => ({
      ...item,
      children: [],
    })
  );

  const idMap = R.indexBy(initiativesWithChildren, x => x.id);
  initiativesWithChildren.forEach(item => {
    if (item.parentId) {
      const parent = idMap[item.parentId];
      if (parent) {
        parent.children.push(item);
      }
    }
  });

  const travel = (item: InitiativeWithChildren, depth: number) => {
    const key = getInitiativeKey(item);
    const isExpanded = expandedMap[key];
    ret.push({
      href: noHref ? null : getUrl(item.id),
      key,
      name: item.name,
      depth,
      isExpanded: expandedMap[key],
      isActive: selectedKey === key,
      hasChildren: item.children.length > 0,
      clickable: true,
    });
    if (isExpanded) {
      item.children.forEach(child => {
        travel(child, depth + 1);
      });
    }
  };
  initiativesWithChildren
    .filter(item => !item.parentId)
    .forEach(item => {
      travel(item, 0);
    });

  insertNewItem();

  if (isAdding && !selectedKey) {
    ret.unshift(getNewItem(0));
  }

  return ret;
}

interface GetScorecardTreeOptions {
  scorecard: BalancedScorecard;
  scorecardItems: Resource[];
  lang: string;
  expandedMap: ExpandedMap;
  selectedKey: string | null | ((key: string) => boolean);
  isAdding: boolean;
  searchTerm: string;
  noHref?: boolean;
  noRootSelect?: boolean;
  rootKey?: string;
}

export function getScorecardTree(options: GetScorecardTreeOptions) {
  const {
    scorecard,
    scorecardItems,
    lang,
    expandedMap,
    selectedKey,
    isAdding,
    searchTerm,
    noHref,
    noRootSelect,
    rootKey = 'root',
  } = options;

  const ret: TreeItemData[] = [];
  if (!scorecard) {
    return ret;
  }
  const isSelected = (key: string) => {
    if (typeof selectedKey === 'function') {
      return selectedKey(key);
    }
    return key === selectedKey;
  };

  const root: TreeItemData = {
    href: noHref ? null : '/scorecards',
    key: rootKey,
    name: scorecard.name,
    depth: 0,
    isExpanded: expandedMap[rootKey],
    isActive: isSelected(rootKey),
    hasChildren: scorecardItems.length > 0,
    clickable: true,
  };
  if (noRootSelect) {
    root.clickable = false;
    root.isActive = false;
    root.isExpanded = true;
  }

  if (searchTerm) {
    if (root.name[lang].toLowerCase().includes(searchTerm.toLowerCase())) {
      ret.push(root);
    }
    scorecardItems
      .filter(item =>
        item.name[lang].toLowerCase().includes(searchTerm.toLowerCase())
      )
      .forEach(item => {
        const key = getResourceKey(item);
        const added = {
          href: noHref
            ? null
            : `/scorecards/${BalancedScorecardItemType[item.typeId!]}/${
                item.id
              }`,
          key,
          name: item.name,
          depth: 0,
          isExpanded: false,
          isActive: isSelected(key),
          hasChildren: false,
          clickable: true,
        };
        ret.push(added);
        if (isAdding && added.isActive) {
          added.isActive = false;
          ret.push(getNewItem(0));
        }
      });
    ret.forEach(item => {
      item.depth = 0;
      item.hasChildren = false;
    });
    return ret;
  }

  ret.push(root);

  const scorecardItemsWithChildren: BalancedScorecardItemWithChildren[] = scorecardItems.map(
    item =>
      ({
        ...item,
        children: [],
      } as BalancedScorecardItemWithChildren)
  );

  const idMap = R.indexBy(scorecardItemsWithChildren, x => x.id);
  scorecardItemsWithChildren.forEach(item => {
    if (item.parentId) {
      const parent = idMap[item.parentId];
      if (!parent) {
        return;
      }

      parent.children.push(item);
    }
  });

  const travelMany = (
    parentId: string | number,
    items: BalancedScorecardItemWithChildren[],
    depth: number
  ) => {
    groupItems(items).forEach(([type, groupedItems]) => {
      const name = getGroupName(type);
      ret.push({
        key: `${parentId}_${name}`,
        href: null,
        name: {
          en: name,
          ar: name,
        },
        depth,
        isExpanded: true,
        isActive: true,
        hasChildren: true,
        clickable: false,
      });
      groupedItems.forEach(child => {
        travel(child, depth + 1);
      });
    });
  };

  const travel = (item: BalancedScorecardItemWithChildren, depth: number) => {
    const key = getResourceKey(item);
    const isExpanded = expandedMap[key];
    const added = {
      href: noHref
        ? null
        : `/scorecards/${BalancedScorecardItemType[item.typeId!]}/${item.id}`,
      key,
      name: item.name,
      depth,
      isExpanded: expandedMap[key],
      isActive: isSelected(key),
      hasChildren: item.children.length > 0,
      clickable: true,
    };
    ret.push(added);
    if (isAdding && added.isActive) {
      added.isActive = false;
      ret.push(getNewItem(added.depth + 1));
    }
    if (isExpanded) {
      travelMany(item.id, item.children, depth);
    }
  };
  if (root.isExpanded) {
    const rootItems = scorecardItemsWithChildren.filter(
      x => !x.parentId || !idMap[x.parentId]
    );
    if (isAdding && root.isActive) {
      root.isActive = false;
      ret.push(getNewItem(1));
    }
    travelMany(rootKey, rootItems, 1);
  }

  return ret;
}

function getNewItem(depth: number): TreeItemData {
  return {
    href: null,
    key: 'new',
    name: {
      en: i18n.t('New Item'),
      ar: i18n.t('New Item'),
    },
    isActive: true,
    hasChildren: false,
    isExpanded: false,
    depth,
    clickable: true,
  };
}
