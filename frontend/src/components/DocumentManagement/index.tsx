import caredashLogoWhite from '../../../public/images/caredash-logo-white.svg';
import userAvatar from '../../../public/images/user-avatar.png';
import dashboardIcon from '../../../public/images/dashboard-icon.svg';
import patientsIcon from '../../../public/images/patients-icon.svg';
import docsIcon from '../../../public/images/docs-icon.svg';
import archiveIcon from '../../../public/images/archive-icon.svg';
import editIcon from '../../../public/images/edit-icon.svg';
//import Upload from '../Upload';


export default function DocumentManagement({token}: {token: string}) {
    console.log(token)
    return (
        <>
            <div className="dashboard-container">
                <div className="top-bar">
                    <div className="menu-toggle">
                        &#9776;
                    </div>
                    <div className="logo-small">
                        <img src={caredashLogoWhite} alt="CareDash Logo" />
                    </div>
                    <div className="user-info">
                        <img src={userAvatar} alt="User Avatar" className="avatar" />
                        <span className="user-name">Tom Smith</span>
                    </div>
                </div>

                <div className="main-content">

                    <nav className="nav-panel">
                        <ul>
                            <li>
                                <a href="#">
                                    <i className="nav-icon">
                                        <img src={dashboardIcon} alt="Dashboard Icon" />
                                    </i>
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i className="nav-icon">
                                        <img src={patientsIcon} alt="Patients Icon" />
                                    </i>
                                    Patient Records
                                </a>
                            </li>
                            <li>
                                <a href="#" className="active">
                                    <i className="nav-icon">
                                        <img src={docsIcon} alt="Docs Icon" />
                                    </i>
                                    Document Management
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i className="nav-icon">
                                        <img src={docsIcon} alt="Docs Icon" />
                                    </i>
                                    Settings
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div className="view-content">

                        <div className="documents-management">
                       
                            <nav className="sub-nav">
                                <ul>
                                    <li><a href="#" className="active">RAG Active Documents</a></li>
                                    <li><a href="#">Archived Documents</a></li>
                                </ul>
                            </nav>


                            <div className="page-header">
                                <h2>Documents Management</h2>

                                <label htmlFor="modal-toggle" className="upload-button">Upload</label>
                            </div>

                            <div className="page-description">
                                <p>Manage and organize all clinic-related documents, including policy agreements, HIPAA authorizations, and medical intake forms. Easily add, update, or archive documents to streamline patient onboarding and ensure all necessary forms are readily available for each appointment.</p>
                            </div>


                            <table className="documents-table">
                                <thead>
                                    <tr>
                                        <th>Document Title</th>
                                        <th>Date Added</th>
                                        <th>Comments</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Clinic Policy: Patient Privacy Policy</td>
                                        <td>10/05/2024</td>
                                        <td>Standard HIPAA compliance document for all new patients.</td>
                                        <td className="actions">
                                            <a href="#" className="archive-icon">
                                                <img src={archiveIcon} alt="Archive" />
                                            </a>
                                            <a href="#" className="edit-icon">
                                                <img src={editIcon} alt="Edit" />
                                            </a>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Medical History Intake Form</td>
                                        <td>10/06/2024</td>
                                        <td>Updated form includes additional questions on family history.</td>
                                        <td className="actions">
                                            <a href="#" className="archive-icon">
                                                <img src={archiveIcon} alt="Archive" />
                                            </a>
                                            <a href="#" className="edit-icon">
                                                <img src={editIcon} alt="Edit" />
                                            </a>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>COVID-19 Vaccination Consent Form</td>
                                        <td>10/02/2024</td>
                                        <td>Required for patients receiving the COVID-19 vaccine.</td>
                                        <td className="actions">
                                            <a href="#" className="archive-icon">
                                                <img src={archiveIcon} alt="Archive" />
                                            </a>
                                            <a href="#" className="edit-icon">
                                                <img src={editIcon} alt="Edit" />
                                            </a>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>HIPAA Authorization Form</td>
                                        <td>10/01/2024</td>
                                        <td>Patients must sign to authorize data sharing with specialists.</td>
                                        <td className="actions">
                                            <a href="#" className="archive-icon">
                                                <img src={archiveIcon} alt="Archive" />
                                            </a>
                                            <a href="#" className="edit-icon">
                                                <img src={editIcon} alt="Edit" />
                                            </a>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Clinic Financial Policy</td>
                                        <td>10/03/2024</td>
                                        <td>Updated with new payment terms as of October 2024.</td>
                                        <td className="actions">
                                            <a href="#" className="archive-icon">
                                                <img src={archiveIcon} alt="Archive" />
                                            </a>
                                            <a href="#" className="edit-icon">
                                                <img src={editIcon} alt="Edit" />
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <input type="checkbox" id="modal-toggle" className="modal-toggle" style={{ visibility: "hidden" }} />

            
            <dialog className="modal" open>
            {/*<Upload token={token}/>*/}
                <form method="dialog" className="upload-form">
                    <h2>Upload Document</h2>
                    <input type="file" name="document" />
                    <div className="modal-buttons">
                        <button type="submit">Upload</button>
                        
                        <label htmlFor="modal-toggle" className="close-button">Cancel</label>
                    </div>
                </form>
            </dialog>


            <div className="overlay"></div>
        </>
    )
}
