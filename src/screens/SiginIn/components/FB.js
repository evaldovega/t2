import React, {useEffect, useRef} from 'react';
var {FBLogin, FBLoginManager} = require('react-native-facebook-login');

const FBLoginButton = () => {
  const fbLogin = useRef();

  useEffect(() => {});

  return (
    <FBLogin
      style={{marginBottom: 10}}
      permissions={['email', 'user_friends']}
      loginBehavior={FBLoginManager.LoginBehaviors.Native}
      onLogin={function (data) {
        console.log('Logged in!');
        console.log(data);
      }}
      onLogout={function () {
        console.log('Logged out.');
      }}
      onLoginFound={function (data) {
        console.log('Existing login found.');
        console.log(data);
      }}
      onLoginNotFound={function () {
        console.log('No user logged in.');
      }}
      onError={function (data) {
        console.log('ERROR');
        console.log(data);
      }}
      onCancel={function () {
        console.log('User cancelled.');
      }}
      onPermissionsMissing={function (data) {
        console.log('Check permissions!');
        console.log(data);
      }}
    />
  );
};

export default FBLoginButton;
