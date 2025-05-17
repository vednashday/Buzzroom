import { Search } from "lucide-react";
import { Link } from "react-router";

const NoFriendsFound = () => {
  return (
    <div className="card bg-base-200 p-6 items-center space-y-6 text-center">
      <h3 className="font-semibold text-lg mb-2">No friends yet</h3>
      <p className="text-base-content opacity-70">
        Connect with language partners below to start practicing together!
      </p>
      <Link
          to="/search"
          className="btn btn-primary btn-sm w-[10%] rounded-full"
          >
          <Search/>
        </Link>
    </div>
  );
};

export default NoFriendsFound;