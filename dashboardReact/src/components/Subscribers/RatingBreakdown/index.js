import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import IconLoop from 'components/IconLoop';
import ListRow from 'components/ListItem/ListRow';
import Placeholder from 'components/Placeholder';

function SubscribersRatingBreakdown(props) {
    return (
        <div styleName='container-rating'>
            <div styleName='sub_container_header'>RATING BREAKDOWN</div>
            <div styleName="reparate_item"
                 style={{flexWrap: 'wrap', justifyContent: 'space-around'}}>
                <div styleName="list_column"
                     style={{margin: 10, minWidth: 140, flexWrap: 'wrap', justifyContent: 'space-around'}}>
                    {props.data.errors.cata({
                        Nothing: () => props.data.results.cata({
                            Nothing: () => (
                                <Placeholder
                                    style={{ width: 138, height: 125}}
                                    busy={props.data.busy}
                                    size={[ '100%', '100%' ]} />
                            ),
                            Just: fields => (
                                <div>
                                    <ListRow
                                        leftItem={<IconLoop number={5} name={'star'} />}
                                        item={fields.star_5 ? fields.star_5 : '0'}
                                    />
                                    <ListRow
                                        leftItem={<IconLoop number={4} name={'star'} />}
                                        item={fields.star_4 ? fields.star_4 : '0'}
                                    />
                                    <ListRow
                                        leftItem={<IconLoop number={3} name={'star'} />}
                                        item={fields.star_3 ? fields.star_3 : '0'}
                                    />
                                    <ListRow
                                        leftItem={<IconLoop number={2} name={'star'} />}
                                        item={fields.star_2 ? fields.star_2 : '0'}
                                    />
                                    <ListRow
                                        leftItem={<IconLoop name={'star'} />}
                                        item={fields.star_1 ? fields.star_1 : '0'}
                                    />
                                </div>
                            )
                        }),
                        Just: errors => (
                            <div>{errors}</div>
                        )
                    })}
                </div>
                <div styleName="list_column" style={{margin: 10, minWidth: 255}}>
                    {props.data.errors.cata({
                        Nothing: () => props.data.results.cata({
                            Nothing: () => (
                                <Placeholder
                                    style={{ width: 253, height: 95}}
                                    busy={props.data.busy}
                                    size={[ '100%', '100%' ]} />
                            ),
                            Just: fields => (
                                <div>
                                    <ListRow
                                        leftItem={fields.subscribersLifetime ? fields.subscribersLifetime : '0'}
                                        item={'LIFETIME NUMBER OF SUBSCRIBERS'}
                                    />
                                    <ListRow
                                        leftItem={fields.avgTasksPosted ? fields.avgTasksPosted : '0'}
                                        item={'AVERAGE NUMBER OF POSTED TASKS'}
                                        subItem={'(PER SUBSCRIBER)'}
                                    />
                                    <ListRow
                                        styleLeftItem={{color: '#ed1967'}}
                                        leftItem={fields.serviceTime ? fields.serviceTime : '0'}
                                        item={'PREFERED TIME FOR SERVICE'}
                                    />
                                </div>
                            )
                        }),
                        Just: errors => (
                            <div>{errors}</div>
                        )
                    })}

                </div>
            </div>
        </div>
    );
}

SubscribersRatingBreakdown.propTypes = {
    data: PropTypes.object.isRequired
};

export default CSSModules(SubscribersRatingBreakdown, styles);
