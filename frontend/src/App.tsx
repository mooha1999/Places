import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import { lazy, Suspense } from "react";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

const NewPlace = lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = lazy(() => import("./places/pages/UpdatePlace"));
const Auth = lazy(() => import("./user/pages/Auth"));
const Users = lazy(() => import("./user/pages/Users"));

const App = () => {
  const { userId, token, login, logout } = useAuth();

  const MyRoutes = () =>
    token ? (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="/places/:placeId" element={<UpdatePlace />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    ) : (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    );

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        userId,
        login,
        logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner asOverlay />
              </div>
            }
          >
            <MyRoutes />
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
