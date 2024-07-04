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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('user_id');
    console.log("Fetching profile data for user_id:", userId);

    try {
      const response = await axios.post(
        `http://localhost:3000/user/get-user-by-id`,
        { user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json,text/plain,*/*',
            'Content-Type': 'application/json;charset=UTF-8'
          },
        }
      );

      console.log("Response received:", response);
      if (response.status === 200 && response.data.data) {
        // const { user_name, email, mobile_number, Address } = response.data.data;
        // setProfileData({ user_name, email, mobile_number, Address });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError('An error occurred while fetching profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('user_id');
    console.log("Updating profile data for user_id:", userId, "with data:", profileData);

    try {
      const response = await axios.post(
        `http://localhost:3000/user/update-user`,
        { ...profileData, user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Profile updated successfully:", response.data);
      // Optionally, you can show a success message or redirect after successful update
    } catch (error) {
      console.error("Error updating profile:", error);
      setError('An error occurred while updating profile data.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
          <Label className="mt-4">
            <span>Address</span>
            <Input
              className="mt-1"
              type="text"
              name="Address"
              value={profileData.Address}
              onChange={handleInputChange}
              required
            />
          </Label>
          <Button type="submit" className="mt-4">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
