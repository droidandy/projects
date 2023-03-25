import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import {
    findIndex
} from 'lodash/fp';
import Placeholder from 'components/Placeholder';
import GoogleMapSegment from 'components/GoogleMap';
import CheckBoxItem from 'components/CheckBoxItem';
import {
    CATEGORY_ALL
} from 'models/googlemap';
import {
    capitalize,
    filterCategory,
    pName,
    labelType,
    styleType,
    valueType
} from 'utils';
const itemWidth = ['125px', '165px', '140px'];

function CategoriesMap(props) {
    return (
        <div>
            <div styleName='container'>
                <div styleName='inline_items' style={{alignSelf: 'auto'}}>
                    <CheckBoxItem
                        value={(!!~findIndex({
                            value: CATEGORY_ALL,
                            label: capitalize(CATEGORY_ALL)
                        }, props.value.getOrElse([])))}
                        onChange={f =>
                            props.onCheckBox({
                                value: CATEGORY_ALL,
                                label: capitalize(CATEGORY_ALL)
                            }, f)}
                    >
                        {capitalize(CATEGORY_ALL)}
                    </CheckBoxItem>
                </div>
                {props.commonCategories.errors.cata({
                    Nothing: () => props.commonCategories.results.cata({
                        Nothing: () => (
                            <div />
                        ),
                        Just: fields => (
                            fields.categoryGroups.map(field => (
                                field.children.map((subCat, subIndex) => (
                                    <div key={subIndex}
                                         styleName='inline_items'
                                         style={{
                                             width: itemWidth[subIndex]}}>
                                        <CheckBoxItem
                                            // style={{
                                            //     display: 'flex',
                                            //     flexDirection: 'column',
                                            //     justifyContent: 'center'
                                            // }}
                                            value={(!!~findIndex({
                                                value: valueType(field, subCat),
                                                label: labelType(field, subCat)
                                            }, props.value.getOrElse([])))}
                                            // inline={true}
                                            onChange={f =>
                                                props.onCheckBox({
                                                    value: valueType(field, subCat),
                                                    label: labelType(field, subCat)
                                                }, f)
                                            }
                                        >
                                            <div styleName='inner_column'>
                                                <div>
                                                    {`${capitalize(pName(subCat))}`}
                                                </div>
                                                <div styleName="label_small">
                                                    {`${capitalize(pName(field))}`}
                                                </div>
                                            </div>

                                        </CheckBoxItem>
                                        <div styleName={styleType(field, subCat)} />
                                    </div>
                                ))
                            ))
                        )
                    }),
                    Just: errors => (
                        <div>{errors}</div>
                    )
                })}

            </div>
            {props.data.errors.cata({
                Nothing: () => props.data.results.cata({
                    Nothing: () => (
                        <Placeholder busy={props.data.busy} size={[ '100%', '300px' ]} />
                    ),
                    Just: () => (
                        <GoogleMapSegment
                            mapSettings={props.mapSettings}
                            data={props.data.results.getOrElse([])}
                            filterData={filterCategory(props.value)}
                        />
                    )
                }),
                Just: errors => (
                    <div>{errors}</div>
                )
            })}
        </div>
    );
}

CategoriesMap.propTypes = {
    mapSettings: PropTypes.object.isRequired,
    commonCategories: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onCheckBox: PropTypes.func.isRequired
};

export default CSSModules(CategoriesMap, styles);

