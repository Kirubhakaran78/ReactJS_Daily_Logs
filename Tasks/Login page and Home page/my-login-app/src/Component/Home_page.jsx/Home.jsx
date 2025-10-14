import React, { useState } from "react";
import { FaHome, FaUser, FaCog, FaChartBar, FaEnvelope, FaBell } from "react-icons/fa";

function Home() {
  const [activeIcon, setActiveIcon] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);

  const mainIcons = [
    { id: 1, icon: <FaHome />, name: "Home" },
    { id: 2, icon: <FaUser />, name: "Users" },
    { id: 3, icon: <FaCog />, name: "Settings" },
    { id: 4, icon: <FaChartBar />, name: "Reports" },
    { id: 5, icon: <FaEnvelope />, name: "Messages" },
    { id: 6, icon: <FaBell />, name: "Notifications" },
  ];

  const subItems = {
    1: ["Dashboard", "Activity", "Statistics"],
    2: ["All Users", "Add User", "Roles"],
    3: ["Preferences", "Security", "Integrations"],
    4: ["Sales", "Expenses", "Revenue"],
    5: ["Inbox", "Sent", "Drafts"],
    6: ["Alerts", "Events", "Reminders"],
  };

  return (
    <div className="flex h-screen">
      {/* Main Sidebar */}
      <div className="bg-gray-800 text-white w-16 flex flex-col items-center py-4 space-y-6">
        {mainIcons.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveIcon(item.id)}
            className={`text-2xl p-2 rounded hover:bg-gray-700 ${
              activeIcon === item.id ? "bg-gray-700" : ""
            }`}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* Secondary Sidebar */}
      {activeIcon && (
        <div className="bg-gray-700 text-white w-48 py-4 px-2">
          <h3 className="font-bold mb-4">{mainIcons.find(i => i.id === activeIcon).name}</h3>
          <ul>
            {subItems[activeIcon].map((subItem, idx) => (
              <li
                key={idx}
                className={`p-2 rounded hover:bg-gray-600 cursor-pointer ${
                  activeSubItem === subItem ? "bg-gray-600" : ""
                }`}
                onClick={() => setActiveSubItem(subItem)}
              >
                {subItem}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-8">
        {activeSubItem ? (
          <h1 className="text-3xl font-bold">{activeSubItem} View</h1>
        ) : (
          <h1 className="text-3xl font-bold">Select an icon to see details</h1>
        )}
      </div>
    </div>
  );
}

export default Home