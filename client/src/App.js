import { Outlet } from "react-router-dom"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function App() {
    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography align="center" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Video Chat App
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <Outlet />
        </div>
    );
}
