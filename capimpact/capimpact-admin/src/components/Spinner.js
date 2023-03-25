import React from 'react';
import Loader from 'react-loader-spinner';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const Spinner = ({ classes, ...props }) => (
  <div className="spinner">
    <Loader
      type="ThreeDots"
      color={'#094470'}
      height={80}
      width={80}
      timeout={60 * 1000}
      {...props}
    />
  </div>
);

export default Spinner;
