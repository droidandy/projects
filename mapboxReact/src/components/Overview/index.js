import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Substrate from 'components/Substrate';


function Overview() {
    return (
        <div>
            <div styleName='root'>
                <Substrate title={'TASK STATUS'}>
                </Substrate>
            </div>
        </div>
    );
}

Overview.propTypes = {


};

export default CSSModules(Overview, styles);
