import React from 'react';
import { Link, Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import { Button, Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem, Badge } from 'reactstrap';
import classNames from 'classnames';
import { getTreeFromFlatData } from 'react-sortable-tree';

import { getGroupfiltersAction } from 'api/actions';
import GroupFilterAdd from './GroupFilterAdd';
import SubGroupFilterAdd from './SubGroupFilterAdd';
import GroupFilterUpdate from './GroupFilterUpdate';

import './styles.scss';

const GroupFilters = ({ company, onComplete }) => {
  const history = useHistory();
  const match = useRouteMatch();
  //const location = useLocation();
  const { payload: groups = [], query: refetch } = useQuery(
    getGroupfiltersAction({ companyId: company.id })
  );

  const toggle = async () => {
    await onComplete();
    history.push(`/companies/${company.id}/edit/filters`);
  };

  const data = getTreeFromFlatData({
    flatData: groups,
    getKey: node => node.id,
    getParentKey: node => node.parentId,
    rootKey: null,
  });

  const onCompleteGroup = async () => {
    await refetch();
    history.push(match.url);
  };

  const onCancelGroup = () => {
    history.push(match.url);
  };

  return (
    <Modal isOpen toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Manage Filters</ModalHeader>
      <ModalBody>
        <div className="row">
          <div className="col-5">
            <div className="d-flex justify-content-end mb-2">
              <Button tag={Link} color="primary" to={`${match.url}/add`}>
                Add Group
              </Button>
            </div>
            <ListGroup>
              {data.map(group => (
                <ListGroupItem
                  key={group.id}
                  className={classNames({
                    //groupItemActive: Number(location.pathname.split('/')[6]) === group.id,
                  })}
                  style={
                    {
                      //cursor: 'pointer',
                    }
                  }
                  //active={Number(location.pathname.split('/')[6]) === group.id}
                  //onClick={() => history.push(`${match.url}/${group.id}`)}
                >
                  <React.Fragment>
                    <div className="d-flex align-items-center justify-content-between">
                      <Link to={`${match.url}/${group.id}`}>
                        <strong>{group.name}</strong>
                      </Link>
                      <Button
                        tag={Link}
                        className="text-primary"
                        color="link"
                        outline
                        to={`${match.url}/add-sub/${group.id}`}
                      >
                        Add Subgroup
                      </Button>
                    </div>
                    {group.children && (
                      <ListGroup>
                        {Array.from(group.children || []).map(subgroup => (
                          <ListGroupItem key={subgroup.id}>
                            <div className="d-flex align-items-center justify-content-between">
                              <Link to={`${match.url}/${subgroup.id}`}>
                                <strong>{subgroup.name}</strong>
                              </Link>
                              <Badge pill>{Array.from(subgroup.filters || []).length}</Badge>
                            </div>
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    )}
                  </React.Fragment>
                </ListGroupItem>
              ))}
              {data.length === 0 && <ListGroupItem>No Groups</ListGroupItem>}
            </ListGroup>
          </div>
          <div className="col-7">
            <Switch>
              <Route path={`${match.path}/add`}>
                <GroupFilterAdd onComplete={onCompleteGroup} onCancel={onCancelGroup} />
              </Route>
              <Route path={`${match.path}/add-sub/:parentId`}>
                <SubGroupFilterAdd onComplete={onCompleteGroup} onCancel={onCancelGroup} />
              </Route>
              <Route path={`${match.path}/:groupfilterId`}>
                <GroupFilterUpdate
                  onComplete={onCompleteGroup}
                  onCancel={onCancelGroup}
                  onDeleted={onCompleteGroup}
                />
              </Route>
              <Route>Select Group</Route>
            </Switch>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default GroupFilters;
