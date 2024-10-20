import caredashLogoWhite from '../../../public/images/caredash-logo-white.svg';
import userAvatar from '../../../public/images/user-avatar.png';
import dashboardIcon from '../../../public/images/dashboard-icon.svg';
import patientsIcon from '../../../public/images/patients-icon.svg';
import docsIcon from '../../../public/images/docs-icon.svg';
import archiveIcon from '../../../public/images/archive-icon.svg';
import editIcon from '../../../public/images/edit-icon.svg';

export default function PatientRecords() {
    return (
        <div className="dashboard-container">
    
        <div className="top-bar">
            <div className="menu-toggle">
                &#9776; 
            </div>
            <div className="logo-small">
                <img src={caredashLogoWhite} alt="CareDash Logo"/>
            </div>
            <div className="user-info">
                <img src={userAvatar} alt="User Avatar" className="avatar"/>
                <span className="user-name">Tony Stark</span>
            </div>
        </div>

        <div className="main-content">
     
            <nav className="nav-panel">
                <ul>
                    <li>
                        <a href="#">
                            <i className="nav-icon">
                                <img src={dashboardIcon} alt="Docs Icon"/>
                            </i>
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="#" className="active">
                            <i className="nav-icon">
                                <img src={patientsIcon} alt="Patients Icon"/>
                            </i>
                            Patient Records
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="nav-icon">
                                <img src={docsIcon} alt="Docs Icon"/>
                            </i>
                            Document Management
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="nav-icon">
                                <img src={docsIcon} alt="Docs Icon"/>
                            </i>
                            Settings
                        </a>
                    </li>
                </ul>
            </nav>
       
            <div className="view-content">
               
                <div className="documents-management">
                  
                    <div className="page-header">
                        <h2>Patient Records</h2>
                    </div>

                    <div className="page-description">
                        <p>View and track patient records as they progress through the medical onboarding process. Access detailed information on each patient's status, including completed forms, pending tasks, and document approvals to ensure a smooth and efficient intake experience.</p>
                    </div>

             
                    <table className="documents-table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Date Added</th>
                                <th>Comments</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>John</td>
                                <td>Doe</td>
                                <td>2023-09-25</td>
                                <td>Sample comment</td>
                                <td className="actions">
                                    <a href="#" className="archive-icon">
                                        <img src={archiveIcon} alt="Archive"/>
                                    </a>
                                    <a href="#" className="edit-icon">
                                        <img src={editIcon} alt="Edit"/>
                                    </a>
                                </td>
                            </tr>

                            <tr>
                                <td>John</td>
                                <td>Doe</td>
                                <td>2023-09-25</td>
                                <td>Sample comment</td>
                                <td className="actions">
                                    <a href="#" className="archive-icon">
                                        <img src={archiveIcon} alt="Archive"/>
                                    </a>
                                    <a href="#" className="edit-icon">
                                        <img src={editIcon} alt="Edit"/>
                                    </a>
                                </td>
                            </tr>

                            <tr>
                                <td>John</td>
                                <td>Doe</td>
                                <td>2023-09-25</td>
                                <td>Sample comment</td>
                                <td className="actions">
                                    <a href="#" className="archive-icon">
                                        <img src={archiveIcon} alt="Archive"/>
                                    </a>
                                    <a href="#" className="edit-icon">
                                        <img src={editIcon} alt="Edit"/>
                                    </a>
                                </td>
                            </tr>

                            <tr>
                                <td>John</td>
                                <td>Doe</td>
                                <td>2023-09-25</td>
                                <td>Sample comment</td>
                                <td className="actions">
                                    <a href="#" className="archive-icon">
                                        <img src={archiveIcon} alt="Archive"/>
                                    </a>
                                    <a href="#" className="edit-icon">
                                        <img src={editIcon} alt="Edit"/>
                                    </a>
                                </td>
                            </tr>

                            <tr>
                                <td>John</td>
                                <td>Doe</td>
                                <td>2023-09-25</td>
                                <td>Sample comment</td>
                                <td className="actions">
                                    <a href="#" className="archive-icon">
                                        <img src={archiveIcon} alt="Archive"/>
                                    </a>
                                    <a href="#" className="edit-icon">
                                        <img src={editIcon} alt="Edit"/>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    )
}