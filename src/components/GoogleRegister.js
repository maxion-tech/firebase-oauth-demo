import React from "react";
import axios from 'axios'

const GoogleRegister = () => {
  const handleRegister = async ({token}) => {
      try {
        console.log('token for register: ', token);
         const res = await axios.post(
        'http://localhost:5000/user/createUser',
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      alert(res.data.massage)
      } catch (error) {
        console.log(error);
      }
  };

  return (
    <div>
      <br></br>
      <button onClick={handleRegister}>Register with Google</button>
    </div>
  )
};

export default GoogleRegister;
