import React, {useEffect, useState} from "react";
import styles from "./Charts/styles.module.scss";
import List from "./Charts/List";
import axios from "axios";
import {Route, Switch, useRouteMatch} from "react-router";
import CohortsContainer from "./Cohorts";
import {connect} from "react-redux";
import LineChartContainer from "./Line";
import ConversionsContainer from "./Conversions";
import ColumnContainer from "./Column";

export const filterStorage = {
  "mrr": "money_1",
  "revenue": "money_1",
  "sales": "money_1",
  "proceeds": "money_1",
  "refunds": "money_1",
  "arpu": "money_2",
  "arppu": "money_2",
  "churn_subscriptions": "churn_1",
  "churn_revenue": "churn_1",
  "subscribers_retention": "cohorts_1",
  "revenue_retention": "cohorts_1",
  "new_users": "users_1",
  "trial_conversions": "conversions_1",
  "regular_conversions": "conversions_1",
  "paid_intro_conversions": "conversions_1",
  "promo_conversions": "conversions_1",
  "non_renewing_conversions": "conversions_1",
  "trial_subs_events": "event_1",
  "regular_subs_events": "event_1",
  "paid_intro_offers_events": "event_1",
  "promo_offers_events": "event_1",
  "non_renewing_purchases": "event_1",
  "other_events": "event_1"
};

const renderChartContainer = (list, chart) => {
    switch (chart.id) {
        case "trial_conversions":
        case "regular_conversions":
        case "paid_intro_conversions":
        case "promo_conversions":
        case "non_renewing_conversions":
            return <ConversionsContainer list={list} chart={chart} />
        case "revenue_retention":
        case "subscribers_retention":
            return <CohortsContainer list={list} chart={chart} />
        case "arpu":
        case "arppu":
            return <ColumnContainer list={list} chart={chart} />
        default:
            return <LineChartContainer list={list} chart={chart} />
    }
}

function Charts(props) {
    const { path, url } = useRouteMatch();
    const [list, setList] = useState([]);
    useEffect(() => {
        axios.get("/api/v1/chart/list").then(({data}) => {
            setList((data.chart_groups || []).filter(v => v.name !== "Cohorts"))
        });
    }, []);
    return <>
        <div className={styles.charts}>
            <div className={styles.wrapper}>
                <List list={list} onResetFilter={() => {}} chartId={null} user={props.user} />
                <Switch>
                    {list.map((group) => group?.charts.map((chart, _key) => {
                      const storageKey = filterStorage[chart.id] || chart.type;
                      const props = {...chart, storageKey}
                      return (
                        <Route path={`${path}/${chart.id}`} key={_key}>
                          {renderChartContainer(list, props)}
                        </Route>
                      );
                    }))}
                </Switch>
            </div>
        </div>
    </>
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Charts);
