import { useState } from 'react';
import './index.css'; // Make sure your CSS is in index.css

// Access environment variables securely
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function App() {
  // State for managing the email input
  const [email, setEmail] = useState('');
  // State for managing button state during submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State for controlling the modal's visibility and content
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: ''
  });

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      // Check if email already exists
      const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/waitlist?email=eq.${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json'
          }
      });
      const existingEmails = await checkResponse.json();

      if (existingEmails.length > 0) {
        throw new Error('Email already exists');
      }

      // Add new email
      const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          email: email,
          source: 'website',
          user_agent: navigator.userAgent,
          referrer: document.referrer || 'direct'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Database error: ${errorData.message || 'Failed to add email'}`);
      }

      // Show success modal and reset form
      setModal({
        show: true,
        title: 'Successfully Added!',
        message: "Welcome to Interview Lens! You're now on our exclusive waitlist and will be the first to know when we launch."
      });
      setEmail('');
      console.log('✅ Email added to database:', email);

    } catch (error) {
      console.error('❌ Form submission error:', error);
      if (error.message === 'Email already exists') {
        setModal({
          show: true,
          title: 'Already Subscribed!',
          message: "You're already on our waitlist! We'll keep you updated."
        });
      } else {
        // Fallback for other errors
        setModal({
          show: true,
          title: 'Submission Error',
          message: 'Could not add your email at this time. Please try again later.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

  return (
    <>
      <div className="background-orbs">
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
      </div>

      <div className="container">
        <header className="header">
            <section className="hero">
                <h1>Master Every Interview</h1>
                <div className="subtitle">AI-Powered Interview Excellence</div>
            </section>
        </header>

        <section className="hero">
            <div className="logo">
                <div className="logo-icon">
                    <img src="/InterviewLensLogo.png" alt="Interview Lens Logo" />
                </div>
            </div>
        </section>

        <section className="features-section">
            <div className="features-grid">
                <div className="feature-card">
                    <h3>Computer Vision Analysis</h3>
                    <p>Advanced AI tracks your eye contact, posture, and facial expressions to perfect your presentation skills.</p>
                </div>
                <div className="feature-card">
                    <h3>Real-time Speech Analysis</h3>
                    <p>Get instant feedback on your vocal confidence, pacing, and clarity to master professional communication.</p>
                </div>
                <div className="feature-card">
                    <h3>AI-Powered Coaching</h3>
                    <p>Personalized scenarios and adaptive learning that evolves with your interview progress and goals.</p>
                </div>
            </div>
        </section>

        <section className="problem-solution">
            <div className="problem-section">
                <h2 className="section-title">The Problems</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '30px' }}>
                    <div style={{ textAlign: 'center', padding: '20px', borderRadius: '15px', background: 'rgba(168, 85, 247, 0.1)', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                        <div className="problem-stat">75%</div>
                        <p className="problem-text">of qualified candidates fail interviews due to poor presentation skills</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px', borderRadius: '15px', background: 'rgba(168, 85, 247, 0.1)', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                        <div className="problem-stat">68%</div>
                        <p className="problem-text">struggle with maintaining proper eye contact during video interviews</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px', borderRadius: '15px', background: 'rgba(168, 85, 247, 0.1)', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                        <div className="problem-stat">82%</div>
                        <p className="problem-text">report high anxiety and nervousness affecting their performance</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px', borderRadius: '15px', background: 'rgba(168, 85, 247, 0.1)', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                        <div className="problem-stat">71%</div>
                        <p className="problem-text">lack confidence in their speech pace and vocal delivery</p>
                    </div>
                </div>
            </div>
            <div className="solution-section">
                <h2 className="section-title">How Interview Lens Solves This</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginTop: '30px' }}>
                    <div style={{ padding: '30px', borderRadius: '20px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', transition: 'all 0.4s ease', cursor: 'pointer' }}>
                        <h4 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700', marginBottom: '15px', transition: 'all 0.3s ease', textShadow: '0 0 15px rgba(255, 255, 255, 0.2)' }}>
                            📊 Real-time Analytics
                        </h4>
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                            <li style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '10px', paddingLeft: '25px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: '#10b981', fontWeight: 'bold', textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}>✓</span>
                                Body language & speech pattern analysis
                            </li>
                            <li style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '10px', paddingLeft: '25px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: '#10b981', fontWeight: 'bold', textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}>✓</span>
                                Eye contact & posture tracking
                            </li>
                        </ul>
                    </div>
                    <div style={{ padding: '30px', borderRadius: '20px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', transition: 'all 0.4s ease', cursor: 'pointer' }}>
                        <h4 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700', marginBottom: '15px', transition: 'all 0.3s ease', textShadow: '0 0 15px rgba(255, 255, 255, 0.2)' }}>
                            🎯 Skill Building
                        </h4>
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                            <li style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '10px', paddingLeft: '25px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: '#10b981', fontWeight: 'bold', textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}>✓</span>
                                Perfect your elevator pitch & answers
                            </li>
                            <li style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '10px', paddingLeft: '25px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: '#10b981', fontWeight: 'bold', textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}>✓</span>
                                Company-specific interview scenarios
                            </li>
                        </ul>
                    </div>
                    <div style={{ padding: '30px', borderRadius: '20px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', transition: 'all 0.4s ease', cursor: 'pointer' }}>
                        <h4 style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '24px', fontWeight: '700', marginBottom: '15px', transition: 'all 0.3s ease' }}>
                            💪 Confidence Building
                        </h4>
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                            <li style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '10px', paddingLeft: '25px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: '#10b981', fontWeight: 'bold', textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}>✓</span>
                                AI-powered confidence exercises
                            </li>
                            <li style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '10px', paddingLeft: '25px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: '#10b981', fontWeight: 'bold', textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}>✓</span>
                                Vocal clarity & pacing optimization
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section className="waitlist-section">
            <h2>Join the Waitlist</h2>
            <p>Be among the first to experience the future of interview preparation. Get exclusive early access when we launch.</p>
            <form className="email-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    className="email-input"
                    placeholder="Enter your email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                />
                <button type="submit" className="join-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Join Waitlist'}
                </button>
            </form>
        </section>

        <footer className="footer">
            <p className="developer-credit">Being developed by FrameBros</p>
            <p className="release-date">Releasing August 2026</p>
        </footer>
      </div>

      {/* Success Modal using conditional rendering */}
      {modal.show && (
          <div className="modal-overlay show" onClick={closeModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-icon">✓</div>
                  <h3>{modal.title}</h3>
                  <p>{modal.message}</p>
                  <button className="modal-close" onClick={closeModal}>Awesome!</button>
              </div>
          </div>
      )}
    </>
  );
}

export default App;
