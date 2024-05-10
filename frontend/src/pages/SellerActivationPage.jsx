import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { server } from '../server';
import axios from 'axios';

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const [ error, setError ] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post(`${server}/shop/activation`, {
            activation_token,
          });
          console.log(res.data.message);
        } catch (error) {
          console.log(error.response.data.message);
          setError(true);
        };
      };
      activationEmail();
    }
  }, [activation_token]);
  return (
    <div style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>

      {
        error ? (
          <p>Your Token has Expired!</p>
        ):(
          <p>Your Shop has been created successfully!</p>
        )
      }
    </div>
  )
}

export default SellerActivationPage