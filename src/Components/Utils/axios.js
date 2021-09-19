import React, { Component } from 'react';
import Axios from 'axios';

var baseURL = '';
import { Cass_BaseURL} from '../Config/Server';

const base64 = require('base-64');
var headers = new Headers();
headers.append("Authorization", "Basic " + base64.encode("admin:admin@123"));

const client = Axios.create({
  baseURL: Cass_BaseURL,
  // baseURL: "https://www.cuddleconnect.com/api/",
  // baseURL: '192.168.1.98/cuddle/',
  headers: headers,
  responseType: 'json',
  timeout: 15000,

});

/**
 * Request Wrapper with default success/error actions
 */
const httpRequest = function (options) {

  const onSuccess = function (response) {
    console.log(options.url)
    console.debug('Request Successful!', response);
    return response.data;
  }

  const onError = function (error) {


    if (error.response) {

      // Server Error Like 404,500 Internal error //
      // Snackbar.show({
      //   // title: 'Please bare with us, we are improvising your experience !!',
      //   title: 'No internet connection available. Please try again later.',
      //   //  backgroundColor: 'red',
      //   duration: Snackbar.LENGTH_SHORT,

      // });
      console.warn('Status:', error.response.status);
      console.warn('Data:', error.response.data);
      console.warn('Headers:', error.response.headers);
      console.warn('Code Error', error.response.code)
    } else if (error.request) {
      // Server Error Like 404,500 Internal error //
      // Snackbar.show({
      //   title: 'Kindly Logout and Login !',
      //   backgroundColor: 'red',
      //   duration: Snackbar.LENGTH_SHORT,

      // });
      //  console.warn(error.request);
    }
    else {
      // Something else happened while setting up the request
      // triggered the error
      // Server Error Like 404,500 Internal error //
      // Snackbar.show({
      //   title: 'No internet connection available. Please try again later.',
      //   //  backgroundColor: 'red',
      //   duration: Snackbar.LENGTH_SHORT,

      // });
      //  console.warn('Error Message:', error.message);
    }
    // Server Error Like 404,500 Internal error //
    // Snackbar.show({
    //   title: 'No internet connection available. Please try again later.',
    //   //  backgroundColor: 'red',
    //   duration: Snackbar.LENGTH_SHORT,

    // });
    //  console.warn('Request Failed:', error.config);

    return Promise.reject(error.response || error.message
      || error.config || error.request);
  }

  return client(options)
  .then(onSuccess)
  .catch(onError);
}
export { httpRequest, client };