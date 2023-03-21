import React from 'react';
import Spinner from './Spinner.svg';

const loading = ()=> {
    return (
      <div className='text-center'>
        <img className="my-3" src={Spinner} alt="loading" />
      </div>
    )
  }
export default loading