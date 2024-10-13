import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Container } from "@mui/material";
import Login from "./components/Login";
import Home from "./components/Home";
import api from "./scripts/api";

function App() {
  const { data } = api.useAuth();

  return (
    <Container sx={{ m: 0, p: 1, maxWidth: "100vw" }} maxWidth={false}>
      <Router>
        {data === true && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
        {data === false && (
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="*" element={<Navigate to="/login" />}></Route>
          </Routes>
        )}
      </Router>
    </Container>
  );
}

export default App;
