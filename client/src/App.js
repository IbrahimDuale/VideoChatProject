import { Outlet } from "react-router-dom"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function App() {
    return (
        <Box >
            <AppBar >
                <Toolbar>
                    <Typography align="center" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Video Chat App
                    </Typography>
                </Toolbar>
            </AppBar>
            <Outlet />
        </Box>
    );
}
