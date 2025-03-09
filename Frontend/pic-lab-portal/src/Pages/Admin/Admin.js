import { FaUsers, FaFlask, FaCalendarCheck, FaQuestionCircle } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import "../../Components/assets/admin.css"; // Import styles for the whole page

const Admin = () => {
  return (
    <div className="admin-container">
      {/* Main Content */}
      <main className="main-content">
        <header className="admin-header">
          <h2>Welcome, <span>Admin!</span></h2>
          <div className="header-right">
            <IoMdNotificationsOutline className="icon" />
            <div className="dropdown">Quick Actions ▾</div>
            <div className="user">username</div>
          </div>
        </header>

        {/* Dashboard Stats */}
        <section className="dashboard-stats">
          <div className="stat-card red"><FaUsers /><p>Total Students</p><h3>1024</h3></div>
          <div className="stat-card blue"><FaFlask /><p>Total Labs</p><h3>36</h3></div>
          <div className="stat-card green"><FaCalendarCheck /><p>Ongoing Events</p><h3>7</h3></div>
          <div className="stat-card yellow"><FaQuestionCircle /><p>Pending Requests</p><h3>11</h3></div>
        </section>

        {/* Report Section */}
        <section className="report">
          <h3>Report</h3>
          <div className="report-card">(Graph Placeholder)</div>
        </section>

        {/* Notifications */}
        <section className="notifications">
          <h3>Notifications</h3>
          <ul>
            <li>5 lab change requests pending approval.</li>
            <li>System maintenance on 30th Jan from 12:00 AM to 3:00 AM.</li>
            <li>3 new lab registration requests awaiting review.</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Admin;
