import { Navigate,Outlet } from 'react-router-dom';
import { getIdUser, getRole } from '../utils/authStorage';

export const ProtectedRoute = () => {
    const id_user = getIdUser();
    if(!id_user){
        return <Navigate to='/login' replace />
    }
    return <Outlet />
}

export const PublicRoute = () => {
    const id_user = getIdUser();
    if(id_user){
        return <Navigate to='/dashboard' replace />
    }
    return <Outlet />
}

export const AdminRoute = () => {
    const role = getRole();
    if(role !== 'admin'){
        return <Navigate to='/dashboard' replace />
    }
    return <Outlet />
}