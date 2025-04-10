import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);


  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a file.');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post('https://agri-1-2ijr.onrender.com/upload', formData);
      setMessage(res.data.message);
      await fetchUploadedFiles();
    } catch (err) {
      setMessage('Upload failed.');
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const res = await axios.get('https://agri-1-2ijr.onrender.com/files');
      const filesWithBlobs = await Promise.all(
        res.data.map(async (file) => {
          const response = await axios.get(`https://agri-1-2ijr.onrender.com/file/${file._id}`, {
            responseType: 'arraybuffer'
          });
          const blob = new Blob([response.data], { type: 'application/pdf' });
          return {
            ...file,
            blobUrl: URL.createObjectURL(blob)
          };
        })
      );
      setUploadedFiles(filesWithBlobs);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
    return () => {
      // Cleanup blob URLs
      uploadedFiles.forEach(file => URL.revokeObjectURL(file.blobUrl));
    };
  }, []);

  return (
    <div className=" container-fluid  krishi-portal">
      {/* Accessibility Header */}
      <div className="accessibility-bar">
        <a href="#maincontent" className="skip-nav">Skip to main content</a>
        <span className="screen-reader">Screen Reader Access</span>
      </div>

      {/* Government Header */}
      <header className="karnataka-header">
        <div className="header-top">
          <div className="container">
            <div className="d-flex align-items-center">
              <img src="/agri logo.png" alt="State Emblem" className="state-emblem" />
              <div className="header-titles">
                <h1>Department of Agriculture</h1>
                <h2>Government of Karnataka</h2>
                <p>ಕೃಷಿ ಸಚಿವಾಲಯ, ಕರ್ನಾಟಕ ಸರ್ಕಾರ</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="govt-nav">
          <div className="container">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/schemes">Schemes</a></li>
              <li><a href="/announcements">Announcements</a></li>
              <li><a href="/mandi-prices">Mandi Prices</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/rti">RTI</a></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Karnataka Tricolor Bar */}
      <div className="karnataka-tricolor">
        <div className="red-band"></div>
        <div className="white-band"></div>
        <div className="yellow-band"></div>
      </div>
     
     {/* Farmer Images Carousel */}
     <div className="farmer-carousel">
        <Carousel interval={3000} pause={false}>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/farmer1.jpg"
              alt="Farmer in field"
            />
            <Carousel.Caption>
              <h3>ಕೃಷಿ ಕರ್ಣಾಟಕದ ಬೆನ್ನುಮೂಳೆ</h3>
              <p>Agriculture - Backbone of Karnataka</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/farmer2.webp"
              alt="Organic farming"
            />
            <Carousel.Caption>
              <h3>ಸಾವಯವ ಕೃಷಿ ಪ್ರೋತ್ಸಾಹ</h3>
              <p>Promoting Organic Farming</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/farmer3.webp"
              alt="Farmers market"
            />
            <Carousel.Caption>
              <h3>ಮಾರುಕಟ್ಟೆ ಸೌಲಭ್ಯಗಳು</h3>
              <p>Direct Market Access for Farmers</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>

      <main className="container main-content" id="maincontent">
        <div className="row">
          {/* Left Navigation */}
          <div className="col-md-3 left-nav">
            <div className="nav-section">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="/e-krishi">e-Krishi Portal</a></li>
                <li><a href="/crop-insurance">Crop Insurance</a></li>
                <li><a href="/soil-health">Soil Health Card</a></li>
                <li><a href="/farmers-schemes">Farmers Schemes</a></li>
                <li><a href="/weather-updates">Weather Updates</a></li>
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-md-9">
            {/* File Upload Section */}
            <div className="govt-card">
              <h2 className="section-title">
             
                Upload New Scheme Document
              </h2>
              <form onSubmit={handleUpload}>
                <div className="form-group">
                  <label>Select PDF Document (Max 5MB)</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="form-control-file"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
                <button className="btn-govt" type="submit">
                  Upload Document
                </button>
              </form>
              {message && <div className="govt-alert">{message}</div>}
            </div>

            {/* Uploaded Documents */}
            <div className="govt-card">
              <h2 className="section-title">
              <img src="/docag.jpg" alt="Documents" className="small-doc-img" />

                Active Government Schemes
              </h2>
              <div className="document-list">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="document-item">
                    <div className="doc-info">
                      <h4>{file.name}</h4>
                      <div className="doc-meta">
                        
                        
                      </div>
                    </div>
                    <a
                      href={file.blobUrl}
                      download={file.name}
                      className="download-btn"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Government Footer */}
      <footer className="karnataka-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h4>Contact Details</h4>
              <p>Farmer Helpline: 080-22255555</p>
              <p>Email: krishi.kar@nic.in</p>
            </div>
            <div className="footer-section">
              <h4>Important Links</h4>
              <ul>
                <li><a href="/disclaimer">Disclaimer</a></li>
                <li><a href="/terms">Terms of Use</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="copyright">
            © 2024 Agriculture Department, Government of Karnataka. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;