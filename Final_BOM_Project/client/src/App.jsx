import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import RegisterTest from "./components/RegisterTest";
import LoginTest from "./components/LoginTest";

import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Workspace from "./components/Workspace";
import WorkspaceVersions from "./components/WorkspaceVersions";
import './components/enhanced-styles.css'
import Profile from "./components/Profile";
import Plans from "./components/Plans";

function App() {
  const [username, setUsername] = useState(null);
  const [productRefreshKey, setProductRefreshKey] = useState(0);



  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUsername(storedUser);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
  };

  return (
    <div>
      {/* <Home /> */}
      {/* <h2>BOM Test UI</h2>

      <nav>
        <Link to="/">Home</Link> |{" "}
        {!username && (
          <>
            <Link to="/login">Login</Link> |{" "}
            <Link to="/register">Register</Link>
          </>
        )}
        {username && (
          <button onClick={logout} style={{ marginLeft: "10px" }}>
            Logout
          </button>
        )}
      </nav> */}

      {/* <Routes> */}

      {/* <Route
          path="/"
          element={
            <div>
              <h3>Home</h3>
              <p>
                {username
                  ? `Logged in as ${username}`
                  : "Not logged in"}
              </p>

              {username && (
                <>
                  <CreateProductTest
                    onCreated={() =>
                      setProductRefreshKey((prev) => prev + 1)
                    }
                    onUnauthorized={logout}
                  />

                  <ProductListTest
                    refreshTrigger={productRefreshKey}
                    onUnauthorized={logout}
                  />
                </>
              )}
            </div>
          }
        /> */}


      {/* <Route
          path="/login"
          element={<LoginTest onLogin={setUsername} />}
        />

        <Route path="/register" element={<RegisterTest />} />
      </Routes> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginTest />} />
        <Route path="/register" element={<RegisterTest />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workspace/:productId" element={<Workspace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/plans" element={<Plans />} />

        <Route
          path="/workspace/:productId/versions"
          element={<WorkspaceVersions />}
        />

      </Routes>


    </div>

  );
}

export default App;
