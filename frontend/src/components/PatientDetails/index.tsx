import caredashLogoWhite from '../../../public/images/caredash-logo-white.svg';
import userAvatar from '../../../public/images/user-avatar.png';
import dashboardIcon from '../../../public/images/dashboard-icon.svg';
import patientsIcon from '../../../public/images/patients-icon.svg';
import docsIcon from '../../../public/images/docs-icon.svg';
import settingsIcon from '../../../public/images/settings-icon.svg';

export default function PatientDetails() {
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
                <a href="#" className="active">
                  <i className="nav-icon">
                    <img src={patientsIcon} alt="Patients Icon" />
                  </i>
                  My Records
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="nav-icon">
                    <img src={docsIcon} alt="Docs Icon" />
                  </i>
                  Intake Assistant
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="nav-icon">
                    <img src={settingsIcon} alt="Settings Icon" />
                  </i>
                  Settings
                </a>
              </li>
                </ul>
            </nav>
            <div className="view-content">
                <div className="documents-management">
                    <div className="page-header">
                        <h2>Medical Records for Tom Smith</h2>
                    </div>
                    <div className="important-fields">
                        <div className="field-group">
                            <h4>Weight</h4>
                            <p>182 lbs</p>
                        </div>
                        <div className="field-group">
                            <h4>Height</h4>
                            <p>6"</p>
                        </div>
                        <div className="field-group">
                            <h4>Age</h4>
                            <p>35</p>
                        </div>
                        <div className="field-group">
                            <h4>Blood Type</h4>
                            <p>O+ Positive</p>
                        </div>
                        <div className="field-group">
                            <h4>Smoking Status</h4>
                            <p>Non-Smoker</p>
                        </div>
                    </div>

                    <div className="patient-details">
                        <h2>Patient Information</h2>
                        <form className="patient-form">
                        <div className="form-row">
                            <div className="form-group">
                            <label htmlFor="first-name">First Name</label>
                            <input type="text" id="first-name" name="first-name" defaultValue={"Tom"} />
                            </div>
                            <div className="form-group">
                            <label htmlFor="last-name">Last Name</label>
                            <input type="text" id="last-name" name="last-name" defaultValue={"Smith"} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                            <label htmlFor="date-of-birth">Date of Birth</label>
                            <input type="date" id="date-of-birth" name="date-of-birth" value={"1990-01-01"} />
                            </div>
                            <div className="form-group">
                            <label htmlFor="date-added">Date Added</label>
                            <input type="date" id="date-added" name="date-added" value={"2024-10-24"} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input type="text" id="address" name="address" defaultValue={"123 Main St, Anytown, USA"} />
                            </div>
                            <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select id="status" name="status">
                                <option value="not-started">Not Started</option>
                                <option value="intake-completed" selected>Intake Completed</option>
                                <option value="patient-verified">Patient Verified</option>
                            </select>
                            </div>
                        </div>
                        </form>
                    </div>
                    <div className="medical-history">
                        <h2>Intake Data Overview</h2>
                        <h3>Thursday, October 24, 2024</h3>
                        <div className="medical-grid">
                        <div className="medical-column">
                            <div className="medical-field">
                            <h4>Do you have any allergies?</h4>
                            <p>Yes, Penicillin</p>
                            </div>
                            <div className="medical-field">
                            <h4>Have you had any surgeries?</h4>
                            <p>Appendectomy in 2010</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you have a history of asthma?</h4>
                            <p>No</p>
                            </div>
                            <div className="medical-field">
                            <h4>Have you experienced chest pain?</h4>
                            <p>Occasionally during exercise</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you have high blood pressure?</h4>
                            <p>Yes</p>
                            </div>
                            <div className="medical-field">
                            <h4>Have you ever had a stroke?</h4>
                            <p>No</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you suffer from migraines?</h4>
                            <p>Yes</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you have any vision problems?</h4>
                            <p>Wear glasses for reading</p>
                            </div>
                            <div className="medical-field">
                            <h4>Have you been diagnosed with kidney disease?</h4>
                            <p>No</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you have any skin conditions?</h4>
                            <p>Eczema</p>
                            </div>
                        </div>
                        <div className="medical-column">
                            <div className="medical-field">
                            <h4>Are you currently taking any medications?</h4>
                            <p>Yes, Metformin</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you have diabetes?</h4>
                            <p>Type 2 Diabetes</p>
                            </div>
                            <div className="medical-field">
                            <h4>Have you had any recent infections?</h4>
                            <p>No</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you have thyroid problems?</h4>
                            <p>No</p>
                            </div>
                            <div className="medical-field">
                            <h4>Have you been hospitalized recently?</h4>
                            <p>No</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you have any hearing loss?</h4>
                            <p>Slight in left ear</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you have sleep apnea?</h4>
                            <p>No</p>
                            </div>
                            <div className="medical-field">
                            <h4>Have you had any fractures?</h4>
                            <p>Broke right arm in 2005</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you have any dental issues?</h4>
                            <p>Cavities filled</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you have a family history of cancer?</h4>
                            <p>No</p>
                            </div>
                        </div>
                   
                        <div className="medical-column">
                            <div className="medical-field">
                            <h4>Do you have a family history of heart disease?</h4>
                            <p>No</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you consume alcohol?</h4>
                            <p>Occasionally</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you exercise regularly?</h4>
                            <p>Yes, 3 times a week</p>
                            </div>
                            <div className="medical-field">
                            <h4>Have you experienced depression?</h4>
                            <p>Yes, in 2018</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you have any digestive issues?</h4>
                            <p>Occasional heartburn</p>
                            </div>
                            <div className="medical-field">
                            <h4>Have you been vaccinated for flu?</h4>
                            <p>Yes</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you have chronic back pain?</h4>
                            <p>No</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you have anemia?</h4>
                            <p>No</p>
                            </div>
                            <div className="medical-field">
                            <h4>Have you traveled abroad recently?</h4>
                            <p>Yes, to Europe in 2022</p>
                            </div>
                            <div className="medical-field">
                            <h4>Do you have any neurological disorders?</h4>
                            <p>No</p>
                            </div>
                        </div>
                        </div>
                    </div>
  
                </div>
            </div>
        </div>
    </div>
    )
}

