import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Input, Label, Button } from "@windmill/react-ui";
import axios from "axios";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    user_name: "",
    email: "",
    mobile_number: "",
    Address: "",
  });

  useEffect(() => {
    const storedData = {
      user_name: localStorage.getItem('user_name') || "",
      email: localStorage.getItem('email') || "",
      mobile_number: localStorage.getItem('mobile_number') || "",
      Address: localStorage.getItem('Address') || "",
    };
    setProfileData(storedData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Update the profile data in the database
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('user_id');

    try {
      const response = await axios.post(
        `https://thevesttobackend.vercel.app/web/user/update-user`,
        { ...profileData, user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('An error occurred while updating profile data.');
    }
  };

  return (
    <div>
      <PageTitle>Manage your Profile</PageTitle>
      <div className="my-4">
        <form onSubmit={handleFormSubmit}>
          <Label>
            <span>User Name</span>
            <Input
              className="mt-1"
              type="text"
              name="user_name"
              value={profileData.user_name}
              onChange={handleInputChange}
              required
            />
          </Label>
          <Label className="mt-4">
            <span>Email</span>
            <Input
              className="mt-1"
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              required
            />
          </Label>
          <Label className="mt-4">
            <span>Mobile Number</span>
            <Input
              className="mt-1"
              type="text"
              name="mobile_number"
              value={profileData.mobile_number}
              onChange={handleInputChange}
              required
            />
          </Label>
          {/* <Label className="mt-4">
            <span>Address</span>
            <Input
              className="mt-1"
              type="text"
              name="Address"
              value={profileData.Address}
              onChange={handleInputChange}
              required
            />
          </Label> */}
          <Button type="submit" className="mt-4">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
