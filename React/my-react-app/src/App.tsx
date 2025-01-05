import { BrowserRouter as Router } from 'react-router-dom';
import { MainLayout } from './Layouts/MainLayout';

// Main App component
const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

export default App;