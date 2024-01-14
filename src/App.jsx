import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Homepage from "./pages/Homepage";
import Clients from "./pages/Clients";
import Designs from "./pages/Designs";
import NotFound from "./pages/NotFound";
import AuthForm from "./components/AuthForm";
import ProtectedRoute from "./pages/ProtectedRoute";
import IsAdmin from "./pages/IsAdmin";
import CreateDesign from "./components/CreateDesign";
import OneDesign from "./pages/OneDesign";
// import { useContext } from "react"
// import { AuthContext } from "./context/authContext"
function App() {
  // const values = useContext(AuthContext)
  // console.log(values)
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<AuthForm mode="Log in" />}></Route>
          <Route element={<IsAdmin />}>
            <Route path="/Clients" element={<Clients />}></Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/designs" element={<Designs />}></Route>
            <Route path="/designs/create" element={<CreateDesign />} />
            <Route path="/designs/:id" element={<OneDesign />} />
            <Route path="/designs/:id/:section" element={<OneDesign />} />
            <Route path="/profile" element={<AuthForm mode="Update" />}></Route>
          </Route>

          <Route path="/auth">
            <Route path="login" element={<AuthForm mode="Log in" />} />
            <Route path="create" element={<AuthForm mode="Create" />} />
            <Route path="reset" element={<AuthForm mode="Reset" />}></Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
