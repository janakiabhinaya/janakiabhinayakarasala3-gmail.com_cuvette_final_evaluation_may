import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {Home} from './components/homepage';
import {Tasks} from './components/jobpage';
import {SharedTask} from './components/share';
function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/homepage" element={<Home/>}/>
    <Route path="/" element={<Home/>}/>
    <Route path="/jobpage" element={<Tasks/>}/>
    <Route path="/shared-task/:id" element={<SharedTask />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App
