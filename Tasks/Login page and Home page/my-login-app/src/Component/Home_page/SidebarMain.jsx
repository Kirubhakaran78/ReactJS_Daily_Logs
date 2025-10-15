import React from 'react';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { FaHome, FaCog, FaUser } from 'react-icons/fa';
import { BiLock } from 'react-icons/bi';
import { RiCalendarScheduleFill } from 'react-icons/ri';
import "./SidebarMain.css"
import { LuNetwork } from 'react-icons/lu';
import { FaFolderOpen } from 'react-icons/fa6';
import { AiOutlineCloudServer } from 'react-icons/ai';
import { MdFindInPage } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';

export default function SidebarMain({ setActiveMenu }) {
  return (
    <Stack className="d-flex flex-column justify-content-between align-items-center py-3 sidebar-main"
  style={{ height: '100vh', width: '70px' }}>

     <div className="d-flex flex-column gap-3">
      <Button variant="link" onClick={() => setActiveMenu('FTP_Data_View')}>
        <FaFolderOpen size={28} className="sidebar-btn" />
      </Button>
  
      <Button variant="link" onClick={() => setActiveMenu('lock_settings')}>
        <BiLock size={28} className="sidebar-btn" />
      </Button>
      <Button variant="link" onClick={() => setActiveMenu('Schedular')}>
        <RiCalendarScheduleFill size={30} className="sidebar-btn" />
      </Button>
      <Button variant="link" onClick={() => setActiveMenu('Masters')}>
        <LuNetwork size={28} className="sidebar-btn" />
      </Button>

      <Button variant="link" onClick={() => setActiveMenu('Storage')}>
        <AiOutlineCloudServer size={28} className="sidebar-btn" />
      </Button>

      <Button variant="link" onClick={() => setActiveMenu('User_Management')}>
        <FaRegUser size={28} className="sidebar-btn" />
      </Button>


      <Button variant="link" onClick={() => setActiveMenu('Log_History')}>
        <MdFindInPage size={28} className="sidebar-btn" />
      </Button>

      <Button variant="link" onClick={() => setActiveMenu('settings')}>
        <FaCog size={28} className="sidebar-btn" />
      </Button>
      </div>

      {/* Botton icon */}
      <div className="d-flex flex-column gap-3">
        <Button variant="link" onClick={() => setActiveMenu('User_Management')} className="p-0 sidebar-btn">
          <FaUser size={28} />
        </Button>
      </div>

    </Stack>
  );
}
