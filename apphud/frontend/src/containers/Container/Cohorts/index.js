import React, {useEffect, useState} from "react";
import styles from "../Charts/Charts/styles.module.scss";
import List from "../Charts/Charts/List";
import axios from "axios";
import {Route, Switch, useRouteMatch} from "react-router";
import Cohorts from "./Cohorts";
import {connect} from "react-redux";
import {filterStorage} from "../Charts";

function Charts(props) {
  const { path } = useRouteMatch();
  const [list, setList] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/chart/list").then(({data}) => {
      setList((data.chart_groups || []).filter(v => v.name === "Cohorts"))
    });
  }, []);

  return (
    <div className={styles.charts}>
      <div className={styles.wrapper}>
        <List subRoute="cohorts" list={list} onResetFilter={() => {}} chartId={null} user={props.user} />
        <Switch>
          {list.map((group) => group?.charts.map((chart, _key) => {
            const storageKey = filterStorage[chart.id] || chart.type;
            const props = {...chart, storageKey}
            return (
              <Route path={`${path}/${chart.id}`} key={_key}>
                <Cohorts list={list} chart={props} />
              </Route>
            );
          }))}
        </Switch>
      </div>
    </div>
  );
}

const select = (state) => ({user: state.user});

export default connect(select)(Charts);
