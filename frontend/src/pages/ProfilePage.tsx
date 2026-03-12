import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../services/auth.api";
import { Skeleton } from "../components/ui/skeleton";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useAuth();
  const [visible, setVisible] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  useEffect(() => {
    if (!isLoading && user) {
      setVisible(true);
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-4 transition-opacity duration-500">
          <Skeleton className="h-8 w-1/2 mx-auto" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      </div>
    );
  }

  if (isError || !user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        className={`bg-white shadow-lg rounded-xl p-8 w-full max-w-md transition-all duration-300 hover:shadow-xl ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>

        <p className="mb-2">
          <strong>Name:</strong> {user.name}
        </p>

        <p className="mb-4">
          <strong>Email:</strong> {user.email}
        </p>

        {user.addresses && user.addresses.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Addresses</h3>
            <ul className="space-y-2">
              {user.addresses?.map((addr: Address) => (
                <li key={addr.id} className="text-sm">
                  {addr.street}, {addr.city}, {addr.state}, {addr.country}{" "}
                  {addr.zipCode}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
