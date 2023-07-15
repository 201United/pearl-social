import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      const response = await makeRequest.get(`/search/users?q=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/:${userId}`);
    setSearchQuery("");
    setSearchResults([]);
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      await makeRequest.post("/auth/logout");
      localStorage.clear();
      // Redirect the user to the login page or any other page after logout
      navigate(`/login`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileClick = () => {
    navigate(`/profile/:${currentUser.userid}`);
    window.location.reload();
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="left">
        <span onClick={handleHomeClick}>PearlSocial</span>
        <HomeOutlinedIcon />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result) => (
                <div className="search-result" key={result.userid}>
                  <div onClick={() => handleUserClick(result.userid)}>
                    {result.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="right">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        <div className="user" onClick={handleProfileClick}>
          <img src={"/upload/" + currentUser.profilePic} alt="" />
          <span>{currentUser.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
