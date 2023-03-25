import * as React from 'react';
import styled from 'styled-components';
import { Input } from 'src/components/FormInput';
import { Button } from 'src/components/Button';
import { Card } from 'src/components/Card';
import { useTranslation } from 'react-i18next';
import { TreeItemData } from 'src/types-next';
import { TreeItem } from './TreeItem';
import { getTrans } from 'src/common/utils';
import { useLanguage } from 'src/hooks/useLanguage';

interface TreeSidebarProps {
  className?: string;
  searchTerm: string;
  search: (searchTerm: string) => any;
  toggleExpanded?: (key: string) => any;
  onClick?: (key: string) => any;
  addNewItem?: () => any;
  expandAll?: () => any;
  isAdding?: boolean;
  items: TreeItemData[];
  overrideSelectedTitle?: string;
  wrapItem?: (element: React.ReactNode, item: TreeItemData) => React.ReactNode;
  disabledMap?: { [x: string]: boolean };
}

const AddNewItemButton = styled(Button)`
  margin-top: 20px;
  margin-bottom: 10px;
`;

const Scroll = styled.div`
  flex: 1 0 0;
  margin-bottom: 5px;
`;

const _TreeSidebar = (props: TreeSidebarProps) => {
  const {
    className,
    searchTerm,
    search,
    isAdding,
    items,
    toggleExpanded,
    addNewItem,
    expandAll,
    overrideSelectedTitle,
    onClick,
    wrapItem,
    disabledMap,
  } = props;
  const { t } = useTranslation();
  const lang = useLanguage();

  return (
    <Card className={className}>
      <Input
        placeholder={t('Search')}
        value={searchTerm}
        onChange={e => search(e.target.value)}
      />
      {addNewItem && (
        <AddNewItemButton
          disabled={isAdding}
          iconSize="lg"
          block
          onClick={() => {
            const active = items.find(x => x.isActive)!;
            if (active && !active.isExpanded) {
              toggleExpanded!(active.key);
            }
            addNewItem!();
          }}
        >
          <i className="flaticon2-plus" />
          {t('Add new item')}
        </AddNewItemButton>
      )}
      <Scroll>
        {items.map(item => {
          const isDisabled = disabledMap && disabledMap[item.key];
          const treeItem = (
            <TreeItem
              key={item.key}
              onToggleExpanded={() => {
                if (toggleExpanded) {
                  toggleExpanded(item.key);
                }
              }}
              onClick={() => {
                if (onClick) {
                  onClick(item.key);
                }
              }}
              href={item.href}
              active={item.isActive}
              depth={item.depth}
              isExpanded={item.isExpanded}
              hasChildren={item.hasChildren}
              clickable={item.clickable}
              isDisabled={isDisabled}
            >
              {item.isActive && overrideSelectedTitle
                ? overrideSelectedTitle
                : getTrans(lang, item.name)}
            </TreeItem>
          );
          return wrapItem ? wrapItem(treeItem, item) : treeItem;
        })}
      </Scroll>
      {expandAll && <Button onClick={expandAll}>{t('Expand All')}</Button>}
    </Card>
  );
};

export const TreeSidebar = styled(_TreeSidebar)`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
`;
