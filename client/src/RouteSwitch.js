import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import App from './Routes/App';
import Home from './Routes/Home'

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/users/:id' element={<h1>Test</h1>} />
                <Route path='/users/:id/:pid' element={<User/>} />
            </Routes>
        </BrowserRouter>
    );
};

function User() {
    var { id, pid } = useParams()
    return (
        <div>
            <h3> {id} . {pid} </h3>
        </div>
    );
}

export default RouteSwitch;