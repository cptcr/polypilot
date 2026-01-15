import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Calculators from './pages/Calculators';
import Machines from './pages/Machines';
import Buttons from './pages/Buttons';
import Materials from './pages/Materials';
import ProcessSheet from './pages/ProcessSheet';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="process" element={<ProcessSheet />} />
          <Route path="calculators" element={<Calculators />} />
          <Route path="machines" element={<Machines />} />
          <Route path="materials" element={<Materials />} />
          <Route path="buttons" element={<Buttons />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;