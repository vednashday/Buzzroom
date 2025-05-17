import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, LogOutIcon, MessageCircleCode } from "lucide-react";

import useLogout from "../hooks/useLogout";
import ThemeSelector from "./ThemeSelector";
import Searchbtn from "./Searchbtn";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { logoutMutation } = useLogout();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          
          {/* Logo and nav links (shown only on small screens) */}
          <div className="flex items-center gap-4 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <MessageCircleCode className="size-7 text-primary" />
              <span className="text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                BUZZROOM
              </span>
            </Link>

            <div className="flex gap-2">
              <Link to="/" className={`btn btn-ghost btn-sm ${currentPath === "/" ? "btn-active" : ""}`}>
                <HomeIcon className="size-4" />
              </Link>

              <Link to="/notifications" className={`btn btn-ghost btn-sm ${currentPath === "/notifications" ? "btn-active" : ""}`}>
                <BellIcon className="size-4" />
              </Link>
            </div>
          </div>

          {/* Right controls - always shown */}
          <div className='flex items-center justify-center'>
            <Searchbtn />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="hidden lg:block">
              <Link to={"/notifications"}>
                <button className="btn btn-ghost btn-circle">
                  <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                </button>
              </Link>
            </div>

            <ThemeSelector />

            <div className="avatar">
              <div className="w-9 rounded-full">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>

            <button className="btn btn-ghost btn-circle" onClick={() => logoutMutation()}>
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
