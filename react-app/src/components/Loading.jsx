import React, { Component } from 'react';
import { useLoading, Audio } from '@agney/react-loading';

const Loading = (props) => {

    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <Audio width="50" />,
      });
    
      return (
        <section {...containerProps}>
          {indicatorEl} 
        </section>
      );
}
 
export default Loading;