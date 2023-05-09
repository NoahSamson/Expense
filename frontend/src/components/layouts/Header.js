import { Link } from "react-router-dom";
import { userContext } from "../../userContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
function Header() {
  const navigate = useNavigate();

  const user = useContext(userContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <header className="bg-blue-500">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
          <img className="h-8 w-8" src="/logo.svg" alt="Logo" />
            {/* <img className="h-8 w-8" src={user?.data.profile || "/logo.svg"} alt="Logo" /> */}
          </div>
          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900"
              >
                Home
              </Link>

              <Link
                to="/Dashboard/profile"
                className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
