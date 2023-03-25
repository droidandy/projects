import React from 'react';
import { TreeWrapper } from 'src/components/TreeWrapper';
import SortableTree, { TreeItem } from 'react-sortable-tree';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { Button } from 'src/components/Button';
import styled from 'styled-components';
import {
  getOrganizationStructureState,
  OrganizationStructureActions,
} from '../interface';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import { OrganizationStructure, UnitTypes, OrgStructureTree } from 'src/types';
import i18n from 'src/i18n';
import { useLanguage } from 'src/hooks/useLanguage';
import { useActions } from 'typeless';
import { AddButton } from 'src/components/AddButton';
import { ActionButtons } from 'src/components/ActionButtons';
import { OrganizationStructureModal } from './OrganizationStructureModal';
import {
  OrganizationUnitModal,
  OrganizationUnitModalActions,
} from './OrganizationUnitModal';
import { OnPermission } from 'src/components/OnPermission';
import { OrganizationUnit } from 'src/types-next';
import { CustomTooltip } from 'src/components/Tooltip';
import { getGlobalState, GlobalActions } from 'src/features/global/interface';
import { usePrevious } from 'src/hooks/usePrevious';

const ActionButton = styled(Button)`
  width: 30px;
  height: 30px;
  margin: 0 2px;
  &&& {
    i {
      margin: 0;
      font-size: 0.8em;
      line-height: 1;
    }
  }
`;

function transform(items: OrganizationStructure[]): TreeItem[] {
  return items.map(item => ({
    title: item.id + ' - ' + item.name[i18n.language],
    id: item.id,
    expanded: true,
    children: transform(item.children),
  }));
}

function transformBack(
  items: any[],
  treeData: TreeItem[]
): OrganizationStructure[] {
  const map: { [x: string]: OrganizationUnit } = {};
  const travelMap = (orgItems: OrganizationUnit[]) => {
    orgItems.forEach((item: any) => {
      map[item.id] = item;
      travelMap(item.children);
    });
  };
  travelMap(items);

  const mapRecursive = (data: TreeItem[]): any[] => {
    return data.map(item => ({
      ...map[item.id],
      name: map[item.id].name,
      description: map[item.id].description,
      children: mapRecursive(item.children || []),
    }));
  };

  return mapRecursive(treeData);
}

const changeTypes = (data: TreeItem[], type: UnitTypes | string): any[] => {
  return data.map(item => {
    let itemType;
    switch (type) {
      case '':
        itemType = 'Division';
        break;
      case 'Division':
        itemType = 'Department';
        break;
      case 'Department':
        itemType = 'Section';
        break;
      case 'Section':
        itemType = null;
        break;
      default:
        return;
    }

    if (itemType === null) {
      return false;
    } else {
      return {
        ...item,
        type: itemType,
        children: changeTypes(item.children!, itemType) || [],
      };
    }
  });
};

const updateChildUnits = (data: TreeItem[]): any[] | boolean => {
  if (!data.length || data[0]) {
    let arr = data.map(el => {
      if (!el.children!.length || el.children![0]) {
        return {
          id: el.id,
          parentId: el.parentId,
          type: el.type,
          children: updateChildUnits(el.children || []),
        };
      } else return false;
    });
    return arr[0] ? arr : false;
  } else {
    return false;
  }
};

export const OrganizationStructureView = () => {
  const [tooltipName, setTooltipName] = React.useState('');
  const { isLoading, items } = getOrganizationStructureState.useState();
  const { organizationUnits } = getGlobalState.useState();
  const { update, updateItem, removeItem, showForm } = useActions(
    OrganizationStructureActions
  );
  const { showNotification } = useActions(GlobalActions);
  const [state, setState] = React.useState();
  const prevStateItems = usePrevious(items);
  const { show: showUsers } = useActions(OrganizationUnitModalActions);
  const language = useLanguage();
  const treeData = React.useMemo(() => {
    return items ? transform(items) : [];
  }, [items, language]);

  const dragUnit = (
    nextParentNode: OrgStructureTree[] | null,
    node: OrgStructureTree[]
  ) => {
    const updatedArray = transformBack(items!, state);
    const nextParentNodeId = nextParentNode === null ? null : nextParentNode.id;
    const parentItem = organizationUnits!.find(el => el.id == nextParentNodeId);
    const item = transformBack(updatedArray, [node])[0];
    if (!parentItem || (parentItem && parentItem.type !== 'Section')) {
      const resultArray = changeTypes(
        [item],
        parentItem ? parentItem.type! : ''
      );
      const childUnits = resultArray[0].children.length
        ? updateChildUnits(resultArray[0].children)
        : [];
      const updatedItem = {
        ...resultArray[0],
        parentId: nextParentNodeId,
        children: [],
        hierarchy: childUnits,
      };
      return childUnits
        ? [update(updatedArray), updateItem(updatedItem, prevStateItems!)]
        : showNotification('error', 'Something went wrong!');
    } else {
      return showNotification('error', 'Parent type can not be "Section"');
    }
  };

  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <>
        <OnPermission permission="organization-structure:add">
          <ActionButtons style={{ marginBottom: 20 }}>
            <AddButton onClick={() => showForm(null)}>Add Unit</AddButton>
          </ActionButtons>
        </OnPermission>
        <TreeWrapper>
          <SortableTree
            onMoveNode={({ nextParentNode, node }) => {
              const parentNode: any = nextParentNode;
              const currentNode: any = node;
              dragUnit(parentNode, currentNode);
            }}
            treeData={treeData}
            onChange={tree => {
              setState(tree);
            }}
            rowDirection={language === 'ar' ? 'rtl' : 'ltr'}
            canDrag={({ node }) => !node.noDragging}
            canDrop={({ nextParent }) => !nextParent || !nextParent.noChildren}
            isVirtualized={false}
            generateNodeProps={rowInfo => ({
              buttons: [
                <OnPermission
                  key="1"
                  permission="organization-structure:delete"
                >
                  <ActionButton
                    data-tip
                    data-for={`${rowInfo.node.id}`}
                    onMouseEnter={() => setTooltipName('Delete Unit')}
                    onClick={() =>
                      removeItem(
                        transformBack(items!, [rowInfo.node])[0] as any
                      )
                    }
                    small
                    styling="secondary"
                  >
                    <i className="flaticon2-trash" />
                  </ActionButton>
                </OnPermission>,
                <OnPermission key="2" permission="organization-structure:edit">
                  <ActionButton
                    data-tip
                    data-for={`${rowInfo.node.id}`}
                    onMouseEnter={() => setTooltipName('Edit Unit')}
                    onClick={() =>
                      showForm(transformBack(items!, [rowInfo.node])[0] as any)
                    }
                    small
                    styling="secondary"
                  >
                    <i className="flaticon2-edit" />
                  </ActionButton>
                </OnPermission>,
                <OnPermission key="3" permission="organization-structure:view">
                  <ActionButton
                    data-tip
                    data-for={`${rowInfo.node.id}`}
                    onMouseEnter={() => setTooltipName('Manage Users')}
                    onClick={() =>
                      showUsers(transformBack(items!, [rowInfo.node])[0] as any)
                    }
                    small
                    styling="secondary"
                  >
                    <i className="flaticon2-user" />
                  </ActionButton>
                </OnPermission>,
                <CustomTooltip
                  id={`${rowInfo.node.id}`}
                  type="info"
                  effect="solid"
                  place="bottom"
                >
                  <span>{tooltipName}</span>
                </CustomTooltip>,
              ],
            })}
          />
        </TreeWrapper>
      </>
    );
  };

  return (
    <>
      <OrganizationStructureModal />
      <OrganizationUnitModal />
      <Page>
        <Portlet padding>{renderDetails()}</Portlet>
      </Page>
    </>
  );
};
