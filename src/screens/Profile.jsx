import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Avatar from "../components/Avatar";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:py-20">
      <div className="rounded-xl border border-line bg-ink p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <Avatar name={currentUser?.name} className="size-16 text-xl" />
          <div className="min-w-0">
            <h1 className="truncate font-display text-4xl font-black leading-none">{currentUser?.name}</h1>
            <p className="mt-1 truncate text-muted">{currentUser?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 h-11 w-full rounded-md border border-line font-medium transition-colors hover:border-danger hover:text-danger"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Profile;
