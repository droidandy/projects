import React from 'react';
import { useActions } from 'typeless';
import { useTranslation } from 'react-i18next';
import { TableView } from 'src/components/TableView';
import { FilterToggle } from 'src/components/FilterToggle';
import { FilterContainer } from 'src/components/FilterContainer';
import { Row, Col } from 'src/components/Grid';
import { getListingProjectState, ListingProjectActions } from '../interface';
import { TableRow } from '../../common/Table/TableRow'
import { Input } from '../../common/FormInput/Input'
import {
  IconButton,
} from '../../common/style'
import { 
  StatusLabel,
  Label, 
  CircleLabel,
  Column,
} from './style';
import { 
  getListingPageSetting, 
  formatDate,
} from './const'
import { PlusIcon } from '../../icons';

import DateRangePicker from './DateRangePicker';
import ProgressBar from './ProgressBar'
import ProgressBarToolTip from './ProgressBarToolTip'
import Pagination from './Pagination'

export const ListingProjectView = () => {
  const { t } = useTranslation();
  const { newProject, changeFilter, changePage, setIsFilterExpanded, clearFilter, applyFilter } = useActions(ListingProjectActions);
  const { units, projects, options, filter, currentPage, pageCnt, isFilterExpanded, isLoading } = getListingProjectState.useState();

  return (
    <TableView
      flex
      title={t('Initiatives')}
      titleAppend={
        <Col style={{display: 'flex', placeContent: 'flex-end'}}>
          <IconButton
            styling="primary"
            width="120px"
            fontSize="15px"
            style={{marginLeft: '30px'}}
            onClick={(e) => {
              e.preventDefault();
              newProject();
            }}
          >
            {t('Add New')}
            <PlusIcon color="white" />
          </IconButton>
          <FilterToggle
            isFilterExpanded={isFilterExpanded}
            setIsFilterExpanded={setIsFilterExpanded}
          />
        </Col>
      }
      header={
        <>
          <FilterContainer isExpanded={isFilterExpanded} clearFilter={clearFilter} applyFilter={applyFilter}>
            <Row>
              <Col>{t('Unit')}</Col>
              <Col>{t('Type')}</Col>
              <Col>{t('Date Period')}</Col>
              <Col>{t('Status')}</Col>
            </Row>
            <Row>
              <Col>
                <Input
                  name="unit"
                  type="select"
                  options={options.unit}
                  isMulti={false}
                  showIndicators={true}
                  value={filter.unit}
                  placeholder={t('Select')}
                  onBlur = {() => {}}
                  onChange = {val => {
                    if (filter.unit === val) return;

                    changeFilter({
                      ...filter,
                      unit: val,
                    });
                  }}
                />
              </Col>
              <Col>
                <Input
                  name="type"
                  type="select"
                  options={options.type}
                  isMulti={false}
                  showIndicators={true}
                  value={filter.type}
                  placeholder={t('Select')}
                  onBlur = {() => {}}
                  onChange = {val => {
                    if (filter.type === val) return;
                    
                    changeFilter({
                      ...filter,
                      type: val,
                    });
                  }}
                />
              </Col>
              <Col style={{position: 'relative'}}>
                <DateRangePicker
                  name="date"
                  value={filter.date}
                  onChange = {(val: Date[]) => {
                    if (filter.date === val) return;
                    
                    changeFilter({
                      ...filter,
                      date: val,
                    });
                  }}
                />
              </Col>
              <Col>
                <Input
                  name="status"
                  type="select"
                  options={options.status}
                  isMulti={false}
                  showIndicators={true}
                  value={filter.status}
                  placeholder={t('Select')}
                  onBlur = {() => {}}
                  onChange = {val => {
                    if (filter.status === val) return;
                    
                    changeFilter({
                      ...filter,
                      status: val,
                    });
                  }}
                />
              </Col>
            </Row>
          </FilterContainer>
        </>
      }
      isLoading={isLoading}
    >
      <TableRow 
        fontWeight="bold"
        background='#F7F9FC'
        color='#6C7293'
        headers={
        getListingPageSetting([
          t('Title'),
          t('Unit'),
          t('Budget'),
          t('Start Date'),
          t('End Date'),
          t('Status'),
          t('Progress'),
        ])
      }/>

      {
        projects.map( (item, index) => {
          return (
            <TableRow 
              key={index}
              headers={
              getListingPageSetting([
                <Column>
                  <Label fontSize="14px" fontWeight="bold">
                    {item.name}
                  </Label>
                </Column>,
                <>
                  <Label fontSize="15px">
                    {item.unit.type}
                  </Label>
                  {
                    item.unit.username.map( (item, index) => {
                      return (
                        <Label fontSize="12px" key={index}>
                          {item}
                        </Label>
                      )
                    })
                  }
                </>,
                '$' + (item.budget / 1000.0) + 'K',
                formatDate(item.startDate),
                formatDate(item.endDate),
                <StatusLabel color={item.color}>{t(options.status.find( sub => {return sub.value === item.color}).label)}</StatusLabel>,
                <ProgressBarToolTip
                  percent={item.progress.percent}
                  date={
                    [
                      new Date(), 
                      new Date(), 
                      new Date(), 
                      new Date(), 
                      new Date(), 
                    ]
                  }
                >
                  <ProgressBar 
                    title={t(item.progress.title)}
                    percent={item.progress.percent}
                    showPercent={true}
                  />
                </ProgressBarToolTip>,
              ])
            }/>
          )
        })
      }
      { pageCnt > 1 && 
        <Col>
          <Pagination
            total={pageCnt}
            cur={currentPage}
            onChange={cur => changePage(cur)}
          />
        </Col>
      }
    </TableView>
  )

};
