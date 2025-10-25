import axios from "axios";
import { useEffect, useState } from "react";

const PracticePage = () => {
  const [user, setUser] = useState<any>(null);
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/practice/protected`,
        { withCredentials: true }
      );
      console.log(response.data);
      setUser(response.data.user);
    } catch (error: any) {
      console.error("Error fetching user data:", error?.response?.data ?? error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Practice Page</h1>
      {/* User Profile Card */}
      {user && (
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <img
              src={user.imageUrl}
              alt={user.fullName}
              className="w-20 h-20 rounded-full"
            />
            <h2 className="text-2xl font-bold">{user.fullName}</h2>
            <p className="text-sm text-gray-500">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticePage;
