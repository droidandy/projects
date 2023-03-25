import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import {
    isArray
} from 'lodash/fp';
import CircularChartItem from 'components/CircularChart/CircularChartItem';

function CategoryItem(props) {
    return (
        <div styleName='container_category_item' style={{minWidth: 450}}>
            <div styleName='container_header_sub'>
                {(props.category && props.category.name) ? props.category.name.toString().toUpperCase() : ''}
            </div>
            <div styleName='container_middle'>
                {isArray(props.subCategories) ? props.subCategories.map((subCat, item) => (
                    <CircularChartItem key={item} {...subCat} />
                )) : null}
            </div>
            <div styleName='container_bottom'/>
        </div>
    );
}

CategoryItem.propTypes = {
    category: PropTypes.object.isRequired,
    subCategories: PropTypes.array.isRequired
};

export default CSSModules(CategoryItem, styles);
