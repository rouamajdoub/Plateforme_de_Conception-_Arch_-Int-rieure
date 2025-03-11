import { FaBell, FaUserCircle } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-white shadow-md flex justify-between items-center px-6 py-3">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <FaBell className="text-gray-600 cursor-pointer" size={20} />
        <FaUserCircle className="text-gray-600 cursor-pointer" size={25} />
      </div>
    </header>
  );
};

export default Header;
