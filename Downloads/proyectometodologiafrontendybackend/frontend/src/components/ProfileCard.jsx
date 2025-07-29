import "@styles/profile.css";

const ProfileCard = ({ user }) => {
  return (
    <div className="profile-card">
      <h1 className="profile-header">Tu Perfil</h1>
      <div className="profile-content">
        <div className="profile-image">
          <img
            src={
              "https://images.steamusercontent.com/ugc/2022718494180581437/E0F54AADECA0EA87D7E429C3FF5C7660AC79510F/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false"
            }
            alt={`${user.username}'s profile`}
          />
        </div>
        <div className="profile-info">
          <p>
            <strong>Nombre:</strong> {user.username}
          </p>
          <p>
            <strong>Correo:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong> {user.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
