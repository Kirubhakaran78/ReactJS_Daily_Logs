import React, { useState } from 'react';
import LayoutContainer from './LayoutContainer';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SidebarSub from './SidebarSub';
import SidebarMain from './SidebarMain';
import "./SidebarMain.css"
import TopBar from './TopBar';


function HomeMain() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  const handleMainMenuClick = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(null); // close sidebar if same menu clicked
      setActiveSub(null); // reset submenu
    }
    else {
      setActiveMenu(menu); // open new menu
      setActiveSub(null);  // reset submenu
    }
  }

  return (
    <Container fluid className="vh-100">
      <Row className="h-100">
        <Col xs="auto" className="sidebar-main p-0">
          <SidebarMain setActiveMenu={handleMainMenuClick} />
        </Col>

        {activeMenu && (
          <Col xs="auto" className="sidebar-sub p-0">
            <SidebarSub menu={activeMenu} setActiveSub={setActiveSub} />
          </Col>
        )}

        <Col className="bg-light">

          <LayoutContainer activeMenu={activeMenu} activeSub={activeSub} />
        </Col>
      </Row>
    </Container>
  );
}

export default HomeMain;
