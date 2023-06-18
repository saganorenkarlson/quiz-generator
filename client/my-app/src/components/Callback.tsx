import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";


const Callback = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuth0();


  useEffect(() => {

    const getToken = async () => {
      const token  = await getAccessTokenSilently();
      return token;
    }

    const signUp = async () => {
    const token = await getToken();
    const userId = user ? user.sub : null;
    const createUserOptions = {
              method: 'POST',
              url: 'http://localhost:8000/api/users',
              data: { userId: userId },
              headers: { authorization: `Bearer ${token}` },

            };
            axios
              .request(createUserOptions)
              .then(function (createUserResponse) {
                navigate('/');
              })
              .catch(function (error) {
                console.error(error);
              });

    }

    if(user) {
      signUp();
    }

  }, [user]);

  return (
    <div>
      Loging you in
    </div>
  );
};

export default Callback;
