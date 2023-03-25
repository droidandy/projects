import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import {
    map,
    concat,
    findIndex
} from 'lodash/fp';
import {
    DropdownButton
} from 'react-bootstrap';
import {
    CATEGORY_ALL
} from 'models/googlemap';
import {
    capitalize,
    pName,
    labelType,
    styleType,
    valueType
} from 'utils';
import CheckBoxItem from 'components/CheckBoxItem';
import Select from 'react-select';
import DateRangePickerItem from 'components/DateRangePickerItem';
import Autosuggest from 'components/Autosuggest';
import HeaderCategory from 'components/SubPanel/HeaderCategory';

function SubPanel(props) {
    return (
        <div styleName='sub_panel_row' style={{alignItems: 'center', flexWrap: 'wrap'}}>
            {
                props.title ? <div styleName='sub_panel_title'>{props.title}</div> : null
            }

            <div styleName='sub_panel_filter' style={{width: 200}}>
                <Autosuggest/>
            </div>
            <div styleName='sub_panel_filter'>
                <Select
                    style={{width: 200}}
                    multi={true}
                    options={props.listCategories.cata({
                        Nothing: () => ([]),
                        Just: fields => (
                            concat([{
                                value: CATEGORY_ALL,
                                label: capitalize(CATEGORY_ALL)
                            }],
                            map(field => ({ value: field.style, label: capitalize(field.name) }), fields))

                        )
                    })}
                    value={props.categories.getOrElse(null)}
                    onChange={props.onChangeCategory}
                    placeholder='Category'
                />
            </div>

            <div className='category_filter'>
                <DropdownButton title={<HeaderCategory data={props.categories} />} id={'dropdown-basic'}>
                    <div styleName='dropdown_content'>
                        <div styleName='dropdown_content_items'>
                            <div styleName='inline_items_all'>
                                <CheckBoxItem
                                    value={(!!~findIndex({
                                        value: CATEGORY_ALL,
                                        label: capitalize(CATEGORY_ALL)
                                    }, props.categories.getOrElse([])))}
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
                                                     styleName='inline_items_category'>
                                                    <CheckBoxItem
                                                        // style={{
                                                        //     display: 'flex',
                                                        //     flexDirection: 'column',
                                                        //     justifyContent: 'center'
                                                        // }}
                                                        value={(!!~findIndex({
                                                            value: valueType(field, subCat),
                                                            label: labelType(field, subCat)
                                                        }, props.categories.getOrElse([])))}
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
                    </div>
                </DropdownButton>
            </div>
            <div styleName=''>
                <DateRangePickerItem
                    dateRangePicker={props.dateRangePicker}
                    onRangeDate={props.onRangeDate}
                />
            </div>
        </div>
    );
}

SubPanel.propTypes = {
    commonCategories: PropTypes.object.isRequired,
    onCheckBox: PropTypes.func.isRequired,
    listCategories: PropTypes.object.isRequired,
    onChangeCategory: PropTypes.func.isRequired,
    categories: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    dateRangePicker: PropTypes.object.isRequired,
    onRangeDate: PropTypes.func.isRequired
};

export default CSSModules(SubPanel, styles);
