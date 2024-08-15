import React from "react";
import { AppBar, Toolbar, Box, Typography } from "@mui/material";

export default function AppBarHeader() {
  return (
    <AppBar position="fixed" sx={{ background: "linear-gradient(100deg, #010101, #013b84)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box
          component="img"
          src="//i.namu.wiki/i/LHVI1-ZqvPjJexTB4QGxDaT-h5O4Eez6LAbKGJC7iWzdS-itHbWrS9-OjXkRLtZBcIV0S6CXdP23Avay4mXkFr6YX5IyIRxJAUgdQGHMHMc8suxrU5IB8_XQJOG8__gLclYX4Pnbsok2IZaqTxPA6A.webp"
          alt="SASA White2"
          sx={{ height: 50, mr: 2 }}
        />
        <Typography variant="h7" component="div" sx={{ textAlign: "center" }}>
          급식 메뉴는?
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
