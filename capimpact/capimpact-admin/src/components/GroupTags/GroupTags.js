import React from 'react';
import { Link, Switch, Route, useHistory, useRouteMatch, useLocation } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import { Button, Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem, Badge } from 'reactstrap';

import { getGrouptagsAction } from 'api/actions';
import GroupTagAdd from './GroupTagAdd';
import GroupTagUpdate from './GroupTagUpdate';

const GroupTags = ({ company, onComplete }) => {
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const { payload: groups = [], query: refetch } = useQuery(
    getGrouptagsAction({ companyId: company.id })
  );

  const toggle = async () => {
    await onComplete();
    history.push(`/companies/${company.id}/edit/tags`);
  };

  return (
    <Modal isOpen toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Manage Tags</ModalHeader>
      <ModalBody>
        <div className="row">
          <div className="col-3">
            <div className="d-flex justify-content-end mb-2">
              <Button tag={Link} color="primary" to={`${match.url}/add`}>
                Add group
              </Button>
            </div>
            <ListGroup>
              {groups.map(group => (
                <ListGroupItem
                  key={group.id}
                  active={Number(location.pathname.split('/')[6]) === group.id}
                  onClick={() => history.push(`${match.url}/${group.id}`)}
                >
                  {group.name} <Badge pill>{Array.from(group.tags || []).length}</Badge>
                </ListGroupItem>
              ))}
              {groups.length === 0 && <ListGroupItem>No Groups</ListGroupItem>}
            </ListGroup>
          </div>
          <div className="col-9">
            <Switch>
              <Route path={`${match.path}/add`}>
                <GroupTagAdd
                  initialValues={{ companyId: company.id }}
                  onSubmitSuccess={async () => {
                    await refetch();
                    history.push(match.url);
                  }}
                />
              </Route>
              <Route path={`${match.path}/:grouptagId`}>
                <GroupTagUpdate
                  onSubmitSuccess={async () => {
                    await refetch();
                    history.push(match.url);
                  }}
                  onDeleted={async () => {
                    await refetch();
                    history.push(match.url);
                  }}
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

export default GroupTags;
