import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';


export default function SidebarSub({ menu, setActiveSub }) {
    const subMenus = {
        FTP_Data_View: ['Data Explorer',
            'Search Server Data'],
        lock_settings: ['Instrument Lock Settings'],
        Schedular: ['Data schedular',
            'View Edit Scheduler',
            'Monitor Scheduler',
            'Local File Delete Scheduler',
            'Server File Delete Scheduler',
            'Download Scheduler',
            'Client Service Monitor'],
        Masters: ['Base Master',
            'Tags and Templates',
            'Parent Parser Key'],
        Storage: ['Configuration',
            'Rights'],
        User_Management: ['User Management',
            'Password Policy'],
        Log_History: ['Audit Trail History',
            'Download Logs',
            'Upload Logs',
            'Restore Logs',
            'Server & Local File Delete Logs',
            'Scheduler Config. Logs',
            'Instrument logs'],
        settings: ['Preferences',
            'License Information',
            'Workflow Setup',
            'Audit Trail Configuration',
            'Maintenance']
    };

    return (
        <ListGroup variant="flush" style={{ width: '180px' }}>
            <ListGroup.Item className="sidebar-sub-title text-black" disabled>
                {menu.toUpperCase()}
            </ListGroup.Item>
            {subMenus[menu].map((item) => (
                <ListGroup.Item
                    key={item}
                    action
                    onClick={() => setActiveSub(item)}
                    className="border-0"
                >
                    {item}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}
