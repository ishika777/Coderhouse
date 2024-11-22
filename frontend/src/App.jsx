import './App.css'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Home from './pages/Home/Home'
import Naviagtion from './components/shared/navigation/Naviagtion'
import Authenticate from './pages/authenticate/Authenticate'
import Activate from './pages/activate/Activate'
import Rooms from './pages/rooms/Rooms'
import { useSelector } from 'react-redux'
import useLoadingWithRefresh from "./hooks/useLoadingWithRefresh"
import Loader from './components/shared/Loader/Loader'
import Room from './pages/Room/Room'
import Search from './pages/search/Search'


function App() {

    const {user, isAuth} = useSelector((state) => state.auth);

    const {loading} = useLoadingWithRefresh()

  return loading ? (<Loader message="Loading, please wait..." />) : ( <BrowserRouter>
        {/* <BrowserRouter> */}
    <Naviagtion />
    <Routes>

        <Route path='/' element={
            isAuth ? <Navigate to="/rooms" replace /> : <Home />
        } />


        {/* guest route */}
        <Route 
          path="/authenticate" 
          element={
            isAuth ? <Navigate to="/rooms" replace /> : <Authenticate />
          } 
        />


        {/* semi-protected route */}
        <Route 
          path="/activate" 
          element={
            !isAuth ? <Navigate to="/" replace /> :  isAuth && !user.activated ? <Activate /> : <Navigate to="/rooms" replace />
          } 
        />


        {/* protected route */}
        <Route 
          path="/rooms" 
          element={
            !isAuth ? <Navigate to="/" replace /> :  isAuth && !user.activated ? <Navigate to="/activate" replace /> : <Rooms />
          } 
        />

        <Route 
          path="/room/:id" 
          element={
            !isAuth ? <Navigate to="/" replace /> :  isAuth && !user.activated ? <Navigate to="/activate" replace /> : <Room />
          } 
        />

        <Route 
          path="/room/search" 
          element={
            !isAuth ? <Navigate to="/" replace /> :  isAuth && !user.activated ? <Navigate to="/activate" replace /> : <Search />
          } 
        />

        


    </Routes>
  </BrowserRouter>
  )
}

export default App
