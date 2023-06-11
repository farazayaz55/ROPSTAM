/* eslint-disable react/prop-types */
import { useLocation } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import "./Layout.css"

const Layout = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const shouldShowSidebar = currentPath !== '/' && currentPath !== '/sign-up';

  return (
    <div className='main_div'>
      {shouldShowSidebar && <Sidebar />}
      <main className="main_main">{children}</main>
    </div>
  );
};

export default Layout;
