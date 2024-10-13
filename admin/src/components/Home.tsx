import { Container, Button, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { removeCookie } from "../scripts/cookie";

function Home() {
  const queryClient = useQueryClient();

  const handleLogout = () => {
    removeCookie("authToken");
    queryClient.invalidateQueries({ queryKey: ["isAuthenticated"] });
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Home
      </Typography>
      <Typography>You are logged in!</Typography>
      <Button
        onClick={handleLogout}
        variant="contained"
        color="secondary"
        sx={{ mt: 3 }}
      >
        Log Out
      </Button>
    </Container>
  );
}

export default Home;
