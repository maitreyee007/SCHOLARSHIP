import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle2, FileText, FolderOpen, ShieldCheck, Sparkles, ArrowRight, LogOut, Check, Search, MessageSquareText, FileCheck2, CircleDashed, CircleUserRound, BriefcaseBusiness, ChevronRight, House, Clock3, BadgeCheck, Wallet, ClipboardList, LayoutDashboard, Menu, X } from 'lucide-react';

type Role = 'student' | 'admin';

type DocumentItem = {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending';
};

type Scholarship = {
  id: string;
  name: string;
  amount: number;
  provider: string;
  deadline: string;
  category: string;
  description: string;
  eligible: boolean;
  tags: string[];
  requirements: string[];
  dueSoon?: boolean;
};

type ApplicationStatus = 'Draft' | 'Submitted' | 'Under review' | 'Approved' | 'Rejected';

type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

type ChatMessage = {
  id: number;
  role: 'bot' | 'user';
  text: string;
};

type DocumentWallet = {
  [key: string]: DocumentItem[];
};

const demoDocuments: DocumentWallet = {
  student: [
    { id: 'doc-1', name: 'Aadhaar Card', type: 'Identity', uploadedAt: '2026-09-01', status: 'Verified' },
    { id: 'doc-2', name: 'Income Certificate', type: 'Income', uploadedAt: '2026-09-10', status: 'Verified' },
    { id: 'doc-3', name: '10th Marksheet', type: 'Academic', uploadedAt: '2026-09-12', status: 'Verified' },
    { id: 'doc-4', name: 'Caste Certificate', type: 'Category', uploadedAt: '2026-09-12', status: 'Pending' },
  ],
};

const scholarships: Scholarship[] = [
  {
    id: 'sch-1',
    name: 'Merit Excellence Scholarship',
    amount: 35000,
    provider: 'National Education Trust',
    deadline: '2026-10-15',
    category: 'Merit',
    description: 'For students with strong academic performance and lower-income households.',
    eligible: true,
    tags: ['Merit', 'Academic', 'Need-based'],
    requirements: ['Annual family income below ₹3L', 'Minimum 85% in previous exam', 'Aadhaar + income proof']
  },
  {
    id: 'sch-2',
    name: 'Rural Talent Support Grant',
    amount: 20000,
    provider: 'State Higher Education Dept',
    deadline: '2026-10-25',
    category: 'Rural',
    description: 'Support for students from rural areas continuing higher education.',
    eligible: true,
    tags: ['Rural', 'Support'],
    requirements: ['Resident of rural district', 'Enrollment in recognized institution', 'Income certificate']
  },
  {
    id: 'sch-3',
    name: 'Digital Inclusion Fellowship',
    amount: 28000,
    provider: 'Tech Access Foundation',
    deadline: '2026-11-02',
    category: 'Digital',
    description: 'For students from digitally underserved communities in STEM pathways.',
    eligible: false,
    tags: ['STEM', 'Digital'],
    requirements: ['Stream in STEM', 'Need proof of digital access issue', 'Recommendation letter']
  }
];

const initialNotifications: NotificationItem[] = [
  { id: 1, title: 'Application review started', description: 'Your Merit Excellence Scholarship application is under review.', time: '2h ago', read: false },
  { id: 2, title: 'Document reminder', description: 'Your caste certificate needs final verification.', time: '1d ago', read: false },
  { id: 3, title: 'Eligibility update', description: 'You are eligible for two new scholarships.', time: '2d ago', read: true },
];

const demoUser = {
  name: 'Ananya Sharma',
  email: 'ananya.demo@student.in',
  course: 'B.Tech Computer Science',
  college: 'NIT Patna',
  year: '2nd Year',
  state: 'Bihar',
  income: '₹2.4L / year',
  category: 'General',
};

const demoAdmin = {
  name: 'Sakshi Verma',
  email: 'admin@scholarrise.in',
  role: 'Verification Officer',
};

const appStatusSeed: Record<string, ApplicationStatus> = {
  'Merit Excellence Scholarship': 'Under review',
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Eligibility', path: '/check-eligibility', icon: Search },
    { label: 'Applications', path: '/application-tracking', icon: ClipboardList },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'JAGO AI', path: '/jago', icon: MessageSquareText },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand-row">
          <div className="brand-badge">SR</div>
          <div>
            <div className="brand-title">ScholarRise</div>
            <div className="brand-subtitle">Demo Portal</div>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              className={`nav-item ${location.pathname === path ? 'active' : ''}`}
              onClick={() => navigate(path)}
              type="button"
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="ghost-button" onClick={() => navigate('/login')}>
            <LogOut size={16} />
            Demo logout
          </button>
        </div>
      </aside>

      <main className="content-panel">
        <header className="topbar">
          <div className="topbar-left">
            <button type="button" className="icon-button mobile-only" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <p className="eyebrow">Student Portal</p>
              <h1 className="page-title">{pageTitleByRoute(location.pathname)}</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <button type="button" className="icon-button" onClick={() => navigate('/notifications')} aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div className="user-pill" onClick={() => navigate('/profile')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/profile'); }}>
              <div className="avatar-mini">A</div>
              <div>
                <strong>{demoUser.name}</strong>
                <span>{demoUser.course}</span>
              </div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

function pageTitleByRoute(path: string) {
  const map: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/check-eligibility': 'Check Eligibility',
    '/scholarships': 'Scholarships',
    '/application-tracking': 'Application Tracking',
    '/notifications': 'Notifications',
    '/jago': 'JAGO AI',
    '/profile': 'Profile',
    '/wallet': 'Document Wallet',
    '/admin': 'Verification Desk',
  };
  return map[path] || 'Dashboard';
}

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('student');

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-badge large">SR</div>
          <div>
            <p className="eyebrow accent">Scholarship access</p>
            <h1>ScholarRise</h1>
          </div>
        </div>

        <div className="segment-control">
          <button className={role === 'student' ? 'active' : ''} type="button" onClick={() => setRole('student')}>Student</button>
          <button className={role === 'admin' ? 'active' : ''} type="button" onClick={() => setRole('admin')}>Admin</button>
        </div>

        <div className="auth-form">
          <label>
            <span>Email</span>
            <input defaultValue={role === 'admin' ? demoAdmin.email : demoUser.email} readOnly />
          </label>
          <label>
            <span>Password</span>
            <input type="password" defaultValue="demo123" readOnly />
          </label>
          <button type="button" className="primary-button" onClick={() => {
            if (role === 'admin') navigate('/admin');
            else navigate('/dashboard');
          }}>
            Demo Login
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const eligible = scholarships.filter(item => item.eligible);

  return (
    <AppShell>
      <div className="page-grid">
        <section className="card hero-card">
          <div>
            <p className="eyebrow accent">Welcome back</p>
            <h2>{demoUser.name}</h2>
            <p className="subtle-text">You are eligible for {eligible.length} scholarship opportunities this cycle.</p>
          </div>
          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={() => navigate('/check-eligibility')}>Check eligibility</button>
            <button type="button" className="secondary-button" onClick={() => navigate('/application-tracking')}>Track application</button>
          </div>
        </section>

        <section className="stats-grid">
          <StatCard label="Eligible scholarships" value={String(eligible.length)} tone="green" icon={<BadgeCheck size={18} />} />
          <StatCard label="Pending docs" value="2" tone="amber" icon={<FileText size={18} />} />
          <StatCard label="Applications" value="1" tone="blue" icon={<ClipboardList size={18} />} />
          <StatCard label="Wallet items" value="4" tone="purple" icon={<Wallet size={18} />} />
        </section>

        <section className="card list-card">
          <div className="section-heading">
            <h3>Recommended scholarships</h3>
            <button type="button" className="text-button" onClick={() => navigate('/check-eligibility')}>View all</button>
          </div>
          <div className="scholarship-list">
            {eligible.map((scholarship) => (
              <div key={scholarship.id} className="scholarship-item">
                <div>
                  <div className="tag-row">
                    <span className="chip green">Eligible</span>
                    <span className="chip muted">{scholarship.category}</span>
                  </div>
                  <h4>{scholarship.name}</h4>
                  <p>{scholarship.provider}</p>
                </div>
                <div className="scholarship-meta">
                  <strong>{formatCurrency(scholarship.amount)}</strong>
                  <button type="button" className="text-button" onClick={() => navigate(`/scholarships/${scholarship.id}`)}>Open</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, tone, icon }: { label: string; value: string; tone: string; icon: React.ReactNode }) {
  return (
    <div className="card stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function EligibilityPage() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <div className="page-grid">
        <section className="card list-card">
          <div className="section-heading">
            <h3>Scholarship suitability</h3>
            <span className="chip green">Auto-assessed</span>
          </div>
          <div className="eligibility-panel">
            {scholarships.map((scholarship) => (
              <div key={scholarship.id} className="eligibility-row">
                <div>
                  <h4>{scholarship.name}</h4>
                  <p>{scholarship.provider}</p>
                </div>
                <div className="match-details">
                  <span className={scholarship.eligible ? 'chip green' : 'chip muted'}>{scholarship.eligible ? 'Eligible' : 'Not eligible'}</span>
                  <button type="button" className="text-button" onClick={() => navigate(`/scholarships/${scholarship.id}`)}>View details</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function ScholarshipDetailsPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'sch-1';
  const scholarship = scholarships.find((item) => item.id === id) ?? scholarships[0];
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>(['doc-1', 'doc-2', 'doc-3']);

  const toggleDocument = (docId: string) => {
    setSelectedDocIds((prev) => prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]);
  };

  return (
    <AppShell>
      <div className="page-grid details-layout">
        <section className="card details-card">
          <div className="tag-row">
            <span className={`chip ${scholarship.eligible ? 'green' : 'muted'}`}>{scholarship.eligible ? 'Eligible' : 'Not eligible'}</span>
            <span className="chip muted">{scholarship.category}</span>
          </div>

          <h2>{scholarship.name}</h2>
          <div className="detail-header">
            <div>
              <p className="muted-label">Provider</p>
              <strong>{scholarship.provider}</strong>
            </div>
            <div>
              <p className="muted-label">Award</p>
              <strong>{formatCurrency(scholarship.amount)}</strong>
            </div>
            <div>
              <p className="muted-label">Deadline</p>
              <strong>{scholarship.deadline}</strong>
            </div>
          </div>

          <p className="description-text">{scholarship.description}</p>

          <div className="two-col-list">
            <div>
              <h4>Eligibility requirements</h4>
              <ul>
                {scholarship.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Included documents</h4>
              <ul>
                {['Aadhaar', 'Income proof', 'Academic marks', 'Caste certificate'].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="action-row">
            <button type="button" className="secondary-button" onClick={() => navigate('/check-eligibility')}>Back</button>
            <button type="button" className="primary-button" onClick={() => navigate('/wallet?next=' + encodeURIComponent(`/scholarships/${scholarship.id}`))}>Apply</button>
          </div>
        </section>

        <aside className="card side-card">
          <div className="section-heading compact">
            <h3>Document wallet</h3>
            <FolderOpen size={18} />
          </div>
          <div className="wallet-list">
            {demoDocuments.student.map((doc) => (
              <button
                key={doc.id}
                type="button"
                className={`wallet-item ${selectedDocIds.includes(doc.id) ? 'selected' : ''}`}
                onClick={() => toggleDocument(doc.id)}
              >
                <div className="wallet-icon"><FileText size={16} /></div>
                <div>
                  <strong>{doc.name}</strong>
                  <span>{doc.type}</span>
                </div>
                <CheckCircle2 size={16} className={selectedDocIds.includes(doc.id) ? 'checked' : 'muted-icon'} />
              </button>
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function WalletPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get('next') || '/dashboard';
  const [selected, setSelected] = useState<string[]>(['doc-1', 'doc-2', 'doc-3']);

  const toggle = (docId: string) => {
    setSelected((prev) => prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]);
  };

  const submit = () => {
    navigate('/application-submitted?next=' + encodeURIComponent(next));
  };

  return (
    <AppShell>
      <div className="page-grid">
        <section className="card list-card">
          <div className="section-heading">
            <h3>Select documents for this application</h3>
            <button type="button" className="text-button" onClick={() => navigate(next)}>Skip</button>
          </div>

          <div className="wallet-grid">
            {demoDocuments.student.map((doc) => (
              <button
                key={doc.id}
                type="button"
                className={`wallet-card ${selected.includes(doc.id) ? 'selected' : ''}`}
                onClick={() => toggle(doc.id)}
              >
                <div className="wallet-card-top">
                  <div className="wallet-mini"><FileCheck2 size={18} /></div>
                  <span className={`chip ${doc.status === 'Verified' ? 'green' : 'muted'}`}>{doc.status}</span>
                </div>
                <h4>{doc.name}</h4>
                <p>{doc.type}</p>
                <small>{doc.uploadedAt}</small>
              </button>
            ))}
          </div>

          <div className="action-row">
            <button type="button" className="secondary-button" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="button" className="primary-button" onClick={submit}>Submit application</button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function ApplicationSubmittedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<ApplicationStatus>('Submitted');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('Under review');
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppShell>
      <div className="page-grid centered-layout">
        <section className="card confirmation-card">
          <div className="success-circle"><Check size={36} /></div>
          <p className="eyebrow accent">Application submitted</p>
          <h2>Merit Excellence Scholarship</h2>
          <p className="subtle-text">Selected documents were reused from the wallet and submitted successfully.</p>
          <div className="status-badge large">{status}</div>
          <div className="action-row center-row">
            <button type="button" className="primary-button" onClick={() => navigate('/application-tracking')}>View tracking</button>
            <button type="button" className="secondary-button" onClick={() => navigate('/dashboard')}>Back to dashboard</button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function ApplicationTrackingPage() {
  const [status, setStatus] = useState<Record<string, ApplicationStatus>>({
    'Merit Excellence Scholarship': 'Under review',
    'Rural Talent Support Grant': 'Submitted',
  });

  return (
    <AppShell>
      <div className="page-grid">
        <section className="card list-card">
          <div className="section-heading">
            <h3>Application tracking</h3>
            <span className="chip green">Live status</span>
          </div>
          <div className="track-list">
            {Object.entries(status).map(([name, state]) => (
              <div key={name} className="track-item">
                <div>
                  <h4>{name}</h4>
                  <p>Last updated today</p>
                </div>
                <span className={`status-badge ${state.toLowerCase().replace(/\s+/g,'-')}`}>{state}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function NotificationPage() {
  const [items, setItems] = useState(initialNotifications);

  const markRead = (id: number) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, read: true } : item));
  };

  return (
    <AppShell>
      <div className="page-grid">
        <section className="card list-card">
          <div className="section-heading">
            <h3>Notifications</h3>
            <span className="chip muted">{items.filter((n) => !n.read).length} unread</span>
          </div>
          <div className="notification-list">
            {items.map((item) => (
              <button key={item.id} type="button" className={`notification-item ${item.read ? '' : 'unread'}`} onClick={() => markRead(item.id)}>
                <div className="notification-dot" />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                  <small>{item.time}</small>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function JagoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'bot', text: 'Hi Ananya! I can help you find scholarships, explain eligibility, and guide your application.' },
  ]);
  const [input, setInput] = useState('What scholarships am I eligible for?');

  const ask = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { id: Date.now(), role: 'user', text: input };
    const prompt = input.toLowerCase();

    let reply = 'I found a few options for you based on your profile.';
    if (prompt.includes('eligible')) {
      reply = 'You are eligible for Merit Excellence Scholarship and Rural Talent Support Grant. Both match your academic performance and income profile.';
    } else if (prompt.includes('apply')) {
      reply = 'You can apply from the scholarships list. The system will reuse verified documents from your wallet.';
    } else if (prompt.includes('document')) {
      reply = 'Your wallet contains Aadhaar, income certificate, 10th marksheet, and caste certificate. Most documents are already verified.';
    }

    setMessages((prev) => [...prev, userMessage, { id: Date.now() + 1, role: 'bot', text: reply }]);
    setInput('');
  };

  return (
    <AppShell>
      <div className="page-grid">
        <section className="card chat-card">
          <div className="section-heading">
            <h3>JAGO AI Assistant</h3>
            <span className="chip green">Online</span>
          </div>

          <div className="chat-window">
            {messages.map((message) => (
              <div key={message.id} className={`chat-bubble ${message.role}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="chat-input-row">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask JAGO..." />
            <button type="button" className="primary-button" onClick={ask}>Send</button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function AdminPage() {
  const [applications, setApplications] = useState([
    { id: 'A-1024', student: 'Ananya Sharma', scholarship: 'Merit Excellence Scholarship', status: 'Under review', score: 92 },
    { id: 'A-1025', student: 'Ritika Kumar', scholarship: 'Rural Talent Support Grant', status: 'Verified', score: 88 },
  ]);

  const approve = (id: string) => {
    setApplications((prev) => prev.map((app) => app.id === id ? { ...app, status: 'Verified' } : app));
  };

  const runSimulation = () => {
    setApplications((prev) => prev.map((app, idx) => idx === 0 ? { ...app, status: 'Decision ready' } : app));
  };

  return (
    <AppShell>
      <div className="page-grid">
        <section className="card list-card admin-card">
          <div className="section-heading">
            <h3>Verification desk</h3>
            <button type="button" className="primary-button small" onClick={runSimulation}>Run simulated verification</button>
          </div>

          <div className="admin-table">
            {applications.map((app) => (
              <div key={app.id} className="admin-row">
                <div>
                  <strong>{app.student}</strong>
                  <span>{app.scholarship}</span>
                </div>
                <div className="admin-center">
                  <span className="status-badge review">{app.status}</span>
                  <span className="score">Score: {app.score}</span>
                </div>
                <button type="button" className="secondary-button small" onClick={() => approve(app.id)}>Approve</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function ProfilePage() {
  return (
    <AppShell>
      <div className="page-grid">
        <section className="card profile-card">
          <div className="profile-top">
            <div className="avatar-large">A</div>
            <div>
              <h2>{demoUser.name}</h2>
              <p>{demoUser.course}</p>
            </div>
          </div>

          <div className="profile-grid">
            <div><span>Email</span><strong>{demoUser.email}</strong></div>
            <div><span>College</span><strong>{demoUser.college}</strong></div>
            <div><span>Year</span><strong>{demoUser.year}</strong></div>
            <div><span>State</span><strong>{demoUser.state}</strong></div>
            <div><span>Annual income</span><strong>{demoUser.income}</strong></div>
            <div><span>Category</span><strong>{demoUser.category}</strong></div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/check-eligibility" element={<EligibilityPage />} />
      <Route path="/scholarships/:id" element={<ScholarshipDetailsPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/application-submitted" element={<ApplicationSubmittedPage />} />
      <Route path="/application-tracking" element={<ApplicationTrackingPage />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/jago" element={<JagoPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
