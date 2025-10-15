import React from 'react';
import Card from 'react-bootstrap/Card';
import TopBar from './TopBar';
import UserMaster from './user_management/UserMaster';

export default function LayoutContainer({ activeMenu, activeSub }) {
    return (
        <>
            
                <TopBar />

                <div className='p-4'>
                    <UserMaster/>
                </div>
                
       
            <div className="p-4">

                <Card>
                    <Card.Body>
                        {!activeSub ? (
                            <Card.Text>Select an option from {activeMenu || 'the sidebar'}...</Card.Text>
                        ) : (
                            <>
                                <Card.Title>{activeSub}</Card.Title>
                                <Card.Text>
                                    You opened the <strong>{activeSub}</strong> layout under{' '}
                                    <strong>{activeMenu}</strong>.
                                </Card.Text>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}
