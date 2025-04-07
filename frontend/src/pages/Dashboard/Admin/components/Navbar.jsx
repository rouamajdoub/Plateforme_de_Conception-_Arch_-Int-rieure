import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch({ type: "auth/logout" }); // Action pour supprimer l'utilisateur du store
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Mon App
      </Link>

      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-lg">Bienvenue, {user.firstName}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600"
          >
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
