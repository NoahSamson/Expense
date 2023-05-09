import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";

function Dashboard() {
  // const navigate = useNavigate();
  // const [isLoggedIn, setIsLoggedIn] = useState();

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate("/login");
  //   }
  // });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Dashboard;
