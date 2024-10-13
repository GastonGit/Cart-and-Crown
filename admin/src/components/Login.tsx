import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { setPassword, setUsername } from "../features/loginSlice";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setCookie } from "../scripts/cookie";
import { RootState } from "../store";
import api from "../scripts/api";
import { useState } from "react";

function Login() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const username = useSelector((state: RootState) => state.login.username);
  const password = useSelector((state: RootState) => state.login.password);

  const [error, setError] = useState<string>("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = await api.getToken(username, password);
      setCookie("authToken", token);
      queryClient.invalidateQueries({ queryKey: ["isAuthenticated"] });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.";
      setError(message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <Box component="form" onSubmit={handleLogin} sx={{}}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => dispatch(setUsername(e.target.value))}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
          fullWidth
          required
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Log In
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

export default Login;
