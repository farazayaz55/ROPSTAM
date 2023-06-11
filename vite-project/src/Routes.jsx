import { Routes, Route,Navigate } from "react-router-dom";
import SignUpSide from "./Pages/Signup/Signup";
import SignInSide from "./Pages/Signin/Signin";
import Categories from "./Pages/Categories/Categories";
import Cars from "./Pages/Cars/Cars";
import { useSelector } from "react-redux";

const Paths = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <Routes>
      <Route path="/sign-up" element={isLoggedIn ? <Navigate replace to="/Dashboard" /> : <SignUpSide />} />
      <Route path="/" element={isLoggedIn ? <Navigate replace to="/Dashboard" /> : <SignInSide />} />
      <Route path="/categories" element={isLoggedIn?<Categories /> : <Navigate replace to="/" />  } />
      <Route path="/Dashboard" element={isLoggedIn?<Cars /> : <Navigate replace to="/" />  } />
    </Routes>
  );
};

export default Paths;
