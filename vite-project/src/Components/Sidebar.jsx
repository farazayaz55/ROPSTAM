import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css'

const SidebarComponent = () => {
  const navigate=useNavigate()
  return (
    <Sidebar>
  <Menu>

    <MenuItem onClick={()=>{
      navigate("categories")
    }}> Categories </MenuItem>
    <MenuItem onClick={()=>{
      navigate("/Dashboard")
    }} > Cars </MenuItem>
  </Menu>
</Sidebar>
  )
}

export default SidebarComponent