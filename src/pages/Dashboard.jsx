import React from 'react';
import FMPlayer from './fmPage';
import RecordUpload from './RecordUpload';
import Conversion from './Conversion';
import '../styles/Dashboard.css';
import Avatar from '@mui/material/Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { Typography, Card, CardContent, Box } from '@mui/material';
import { User } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Card className="user-profile-card">
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: deepPurple[500], width: 40, height: 40 }}>
              <User />
            </Avatar>
            <div className="user-info">
              <Typography variant="h6">Welcome, Umma musa</Typography>
              <Typography variant="body3">Senior Producer, Hausa Department</Typography>
            </div>
          </Box>
        </CardContent>
      </Card>

      <FMPlayer />

      <RecordUpload />
      <Conversion />

      <footer className="dashboard-footer">
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © Radio Nigeria '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </footer>
    </div>
  );
};

export default Dashboard;
