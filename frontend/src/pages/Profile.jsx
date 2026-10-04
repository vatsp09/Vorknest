import { useAuth } from "../context/AuthContext";
import FreelancerProfile from "./FreelancerProfile";
import ClientProfile from "./ClientProfile";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <FreelancerProfile />; // shows the "please log in" state

  return user.mode === "client" ? <ClientProfile /> : <FreelancerProfile />;
};

export default Profile;