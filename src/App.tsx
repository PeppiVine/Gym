import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import CustomerList from './components/CustomerList';
import TrainingList from './components/TrainingList';
import CalendarView from './components/CalendarView';
import BarChart from './components/BarChart';

function App() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ mr: 4 }}>
            Personal Trainer
          </Typography>
          {/* OSA 1: Ylänavigaatio, jolla voi siirtyä eri listasivujen ja muiden sivujen välillä. */}
          <Tabs
            value={tabValue}
            onChange={(_e, newValue: number) => setTabValue(newValue)}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Customers" component={Link} to="/" />
            <Tab label="Trainings" component={Link} to="/trainings" />
            <Tab label="Calendar" component={Link} to="/calendar" />
            <Tab label="Statistics" component={Link} to="/statistics" />
          </Tabs>
        </Toolbar>
      </AppBar>
      {/* OSA 1: Reitit määrittävät omat sivut asiakas- ja harjoituslistoille. */}
      <Routes>
        <Route path="/" element={<CustomerList />} />
        <Route path="/trainings" element={<TrainingList />} />
        <Route path="/calendar" element={<CalendarView />} />
        {/* OSA 4: Tilastosivu näyttää activity-kohtaiset kokonaisminuutit kuvaajana. */}
        <Route path="/statistics" element={<BarChart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
