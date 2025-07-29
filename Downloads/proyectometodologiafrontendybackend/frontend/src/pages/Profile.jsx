import { useEffect, useState } from "react";
import { useGetProfile } from "@hooks/profile/useGetProfile.jsx";
import ProfileCard from "@components/ProfileCard.jsx";
import "@styles/profile.css";

const Profile = () => {
  const { fetchProfile } = useGetProfile();
  const [profileData, setProfileData] = useState(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const getProfileData = async () => {
      const profileData = await fetchProfile();
      setProfileData(profileData.data);
    };
    getProfileData();
  }, []);

  return (
    <div>
      {profileData ? (
        <div className="profile-container">
          <ProfileCard user={profileData} />
        </div>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  );
};

export default Profile;
