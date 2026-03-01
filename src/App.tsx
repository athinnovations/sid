import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Users, 
  IdCard, 
  QrCode, 
  Search, 
  Plus, 
  Download, 
  Printer, 
  ChevronRight,
  MapPin,
  Calendar,
  Phone,
  User,
  ShieldCheck,
  Camera,
  Upload,
  Trash2,
  Menu,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
interface Profile {
  id: string;
  name: string;
  akhada_name: string;
  title: string;
  guru_name: string;
  birth_place: string;
  joining_date: string;
  contact_number: string;
  photo_url: string;
  created_at: string;
}

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-orange-600 text-white shadow-lg sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-white p-1.5 rounded-full">
                <ShieldCheck className="h-6 w-6 text-orange-600" />
              </div>
              <span className="font-serif text-xl font-bold tracking-wider">AKHADA PORTAL</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-orange-200 transition-colors font-medium">Dashboard</Link>
            <Link to="/add" className="bg-orange-500 hover:bg-orange-400 px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Register New</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-orange-700 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-600">Dashboard</Link>
              <Link to="/add" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium bg-orange-500">Register New</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ProfileCard = ({ profile }: { profile: Profile }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow group"
    >
      <div className="flex p-4 gap-4">
        <div className="h-24 w-24 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
          <img 
            src={profile.photo_url || `https://picsum.photos/seed/${profile.id}/200/200`} 
            alt={profile.name}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-stone-900 truncate">{profile.name}</h3>
              <p className="text-orange-600 font-serif text-sm font-semibold">{profile.akhada_name}</p>
            </div>
            <span className="bg-stone-100 text-stone-600 text-[10px] font-mono px-2 py-1 rounded uppercase tracking-tighter">
              ID: {profile.id}
            </span>
          </div>
          <div className="mt-2 flex items-center text-stone-500 text-xs gap-3">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" /> {profile.title || 'Sadhu'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {new Date(profile.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-stone-50 px-4 py-3 border-t border-stone-100 flex justify-between items-center">
        <Link 
          to={`/profile/${profile.id}`} 
          className="text-stone-600 hover:text-orange-600 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          View Profile <ChevronRight className="h-4 w-4" />
        </Link>
        <Link 
          to={`/id-card/${profile.id}`}
          className="bg-white border border-stone-200 p-1.5 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all text-stone-600 hover:text-orange-600"
          title="Generate ID Card"
        >
          <IdCard className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

const IDCard = ({ profile }: { profile: Profile }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const profileUrl = `${window.location.origin}/profile/${profile.id}`;

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <div 
        ref={cardRef}
        className="w-[400px] h-[250px] id-card-gradient rounded-xl shadow-2xl border-4 saffron-border relative overflow-hidden flex font-sans"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-orange-600 flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-white" />
            <span className="text-white font-serif font-bold text-sm tracking-widest">AKHADA PARISHAD</span>
          </div>
          <span className="text-orange-100 text-[10px] font-bold">OFFICIAL IDENTITY</span>
        </div>

        {/* Content */}
        <div className="mt-12 p-4 flex w-full gap-4">
          {/* Photo */}
          <div className="w-28 flex flex-col items-center gap-2">
            <div className="w-24 h-28 bg-white border-2 border-orange-200 rounded-md overflow-hidden shadow-inner">
              <img 
                src={profile.photo_url || `https://picsum.photos/seed/${profile.id}/200/200`} 
                alt={profile.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {profile.title || 'Sadhu'}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between py-1">
            <div>
              <h2 className="text-xl font-bold text-stone-900 leading-tight">{profile.name}</h2>
              <p className="text-orange-700 font-serif font-bold text-xs mt-0.5">{profile.akhada_name}</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-col">
                <span className="text-[8px] text-stone-500 uppercase font-bold leading-none">Guru Name</span>
                <span className="text-xs font-semibold text-stone-800">{profile.guru_name || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-stone-500 uppercase font-bold leading-none">ID Number</span>
                <span className="text-xs font-mono font-bold text-stone-800">{profile.id}</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="w-20 flex flex-col items-center justify-end pb-2">
            <div className="bg-white p-1 rounded-md shadow-sm border border-stone-200">
              <QRCodeSVG 
                value={profileUrl} 
                size={64} 
                level="H"
                includeMargin={false}
              />
            </div>
            <span className="text-[8px] text-stone-400 mt-1 font-mono">SCAN TO VERIFY</span>
          </div>
        </div>

        {/* Verification Badge */}
        <div className="absolute bottom-3 left-4 flex items-center gap-1 opacity-40">
          <ShieldCheck className="h-3 w-3 text-orange-800" />
          <span className="text-[7px] font-bold text-orange-900 uppercase tracking-widest">Verified Monastic Identity</span>
        </div>

        {/* Footer Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-orange-600"></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 no-print">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition-colors font-medium shadow-lg shadow-orange-600/20"
        >
          <Printer className="h-4 w-4" /> Print ID Card
        </button>
        <Link 
          to={`/profile/${profile.id}`}
          className="flex items-center gap-2 bg-white border border-stone-200 text-stone-700 px-6 py-2.5 rounded-xl hover:bg-stone-50 transition-colors font-medium"
        >
          <User className="h-4 w-4" /> View Digital Profile
        </Link>
      </div>
    </div>
  );
};

// --- Pages ---

const Dashboard = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTitle, setFilterTitle] = useState('All');
  const [filterAkhada, setFilterAkhada] = useState('All');

  useEffect(() => {
    fetch('/api/profiles')
      .then(res => res.json())
      .then(data => {
        setProfiles(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const uniqueAkhadas = ['All', ...new Set(profiles.map(p => p.akhada_name))];
  const uniqueTitles = ['All', 'Sadhu', 'Aghori', 'Mahant', 'Shri Mahant', 'Naga Sadhu'];

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.akhada_name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      (p.guru_name && p.guru_name.toLowerCase().includes(search.toLowerCase()));
    
    const matchesTitle = filterTitle === 'All' || p.title === filterTitle;
    const matchesAkhada = filterAkhada === 'All' || p.akhada_name === filterAkhada;

    return matchesSearch && matchesTitle && matchesAkhada;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-serif font-bold text-stone-900">Administration Portal</h1>
          <p className="text-stone-500 mt-1">Manage monastic profiles and identity verification</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 flex-1 lg:max-w-3xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
            <input 
              type="text"
              placeholder="Search by name, guru, or ID..."
              className="pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              className="px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
            >
              {uniqueTitles.map(t => <option key={t} value={t}>{t === 'All' ? 'All Titles' : t}</option>)}
            </select>
            
            <select 
              className="px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 max-w-[150px]"
              value={filterAkhada}
              onChange={(e) => setFilterAkhada(e.target.value)}
            >
              {uniqueAkhadas.map(a => <option key={a} value={a}>{a === 'All' ? 'All Akhadas' : a}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : (
        <>
          {filteredProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map(profile => (
                <div key={profile.id}>
                  <ProfileCard profile={profile} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-stone-200">
              <Users className="h-12 w-12 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900">No profiles found</h3>
              <p className="text-stone-500 mt-1">Try adjusting your search or register a new member.</p>
              <Link to="/add" className="mt-6 inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-500 transition-colors font-medium">
                <Plus className="h-4 w-4" /> Register New Member
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const AddProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    akhada_name: '',
    title: 'Sadhu',
    guru_name: '',
    birth_place: '',
    joining_date: '',
    contact_number: '',
    photo_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const newProfile = await res.json();
        navigate(`/id-card/${newProfile.id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
        <div className="bg-orange-600 px-8 py-6">
          <h1 className="text-2xl font-serif font-bold text-white">Member Registration</h1>
          <p className="text-orange-100 text-sm mt-1">Enter details to generate a new monastic identity</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Full Name</label>
              <input 
                required
                type="text"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="e.g. Swami Atmananda"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Akhada Name</label>
              <input 
                required
                type="text"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="e.g. Juna Akhada"
                value={formData.akhada_name}
                onChange={e => setFormData({...formData, akhada_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Title / Designation</label>
              <select 
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              >
                <option value="Sadhu">Sadhu</option>
                <option value="Aghori">Aghori</option>
                <option value="Mahant">Mahant</option>
                <option value="Shri Mahant">Shri Mahant</option>
                <option value="Naga Sadhu">Naga Sadhu</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Guru Name</label>
              <input 
                type="text"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="Name of Diksha Guru"
                value={formData.guru_name}
                onChange={e => setFormData({...formData, guru_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Birth Place / Origin</label>
              <input 
                type="text"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="City, State"
                value={formData.birth_place}
                onChange={e => setFormData({...formData, birth_place: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Joining Date</label>
              <input 
                type="date"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                value={formData.joining_date}
                onChange={e => setFormData({...formData, joining_date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Contact Number</label>
              <input 
                type="tel"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="+91 XXXXX XXXXX"
                value={formData.contact_number}
                onChange={e => setFormData({...formData, contact_number: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <PhotoSelection 
                value={formData.photo_url} 
                onChange={(val) => setFormData({ ...formData, photo_url: val })} 
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" /> Register & Generate ID
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfileView = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/profiles/${id}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>;
  if (!profile) return <div className="text-center py-20">Profile not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100">
        <div className="h-48 bg-orange-600 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="h-32 w-32 rounded-3xl bg-white p-1.5 shadow-xl">
              <img 
                src={profile.photo_url || `https://picsum.photos/seed/${profile.id}/200/200`} 
                alt={profile.name}
                className="h-full w-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="absolute bottom-4 right-8 flex gap-2 no-print">
            <Link to={`/id-card/${profile.id}`} className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all font-medium flex items-center gap-2">
              <IdCard className="h-4 w-4" /> ID Card
            </Link>
          </div>
        </div>

        <div className="pt-20 px-8 pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-stone-900">{profile.name}</h1>
              <p className="text-xl text-orange-600 font-serif font-semibold mt-1">{profile.akhada_name}</p>
            </div>
            <div className="bg-stone-100 px-4 py-2 rounded-xl text-stone-600 font-mono text-sm">
              VERIFIED ID: {profile.id}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">Monastic Details</h3>
              <div className="space-y-4">
                <DetailItem icon={<User className="h-4 w-4" />} label="Title" value={profile.title || 'Sadhu'} />
                <DetailItem icon={<Users className="h-4 w-4" />} label="Guru" value={profile.guru_name || 'N/A'} />
                <DetailItem icon={<Calendar className="h-4 w-4" />} label="Joined" value={profile.joining_date ? new Date(profile.joining_date).toLocaleDateString() : 'N/A'} />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">Personal Details</h3>
              <div className="space-y-4">
                <DetailItem icon={<MapPin className="h-4 w-4" />} label="Origin" value={profile.birth_place || 'N/A'} />
                <DetailItem icon={<Phone className="h-4 w-4" />} label="Contact" value={profile.contact_number || 'N/A'} />
                <DetailItem icon={<Calendar className="h-4 w-4" />} label="Registered" value={new Date(profile.created_at).toLocaleDateString()} />
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <QRCodeSVG value={window.location.href} size={120} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-orange-900">Digital Verification</h4>
              <p className="text-orange-700 mt-1">This QR code links directly to this official profile. Authorities can scan this to verify the identity and credentials of the member.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PhotoSelection = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCameraOpen(false);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onChange(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-stone-700">Member Photo</label>
      
      {value ? (
        <div className="relative w-full aspect-square max-w-[200px] mx-auto rounded-2xl overflow-hidden border-2 border-orange-200 shadow-inner group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <button 
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50 transition-all group"
          >
            <Upload className="h-8 w-8 text-stone-400 group-hover:text-orange-500 mb-2" />
            <span className="text-sm font-medium text-stone-600 group-hover:text-orange-700">Upload Photo</span>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </button>

          <button
            type="button"
            onClick={startCamera}
            className="flex flex-col items-center justify-center p-6 bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50 transition-all group"
          >
            <Camera className="h-8 w-8 text-stone-400 group-hover:text-orange-500 mb-2" />
            <span className="text-sm font-medium text-stone-600 group-hover:text-orange-700">Capture Photo</span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {isCameraOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md aspect-[3/4] bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
                <button 
                  type="button"
                  onClick={stopCamera}
                  className="p-4 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
                <button 
                  type="button"
                  onClick={capturePhoto}
                  className="p-6 bg-orange-600 text-white rounded-full hover:bg-orange-500 transition-all shadow-xl shadow-orange-600/40"
                >
                  <Camera className="h-8 w-8" />
                </button>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-orange-500">{icon}</div>
    <div>
      <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider leading-none mb-1">{label}</p>
      <p className="text-stone-800 font-medium">{value}</p>
    </div>
  </div>
);

const IDCardPage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/profiles/${id}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>;
  if (!profile) return <div className="text-center py-20">Profile not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 no-print">
        <Link to="/" className="text-stone-500 hover:text-orange-600 flex items-center gap-1 transition-colors">
          <ChevronRight className="h-4 w-4 rotate-180" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-serif font-bold text-stone-900 mt-4">Identity Card Generation</h1>
        <p className="text-stone-500">Official identity document for {profile.name}</p>
      </div>
      
      <IDCard profile={profile} />
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddProfile />} />
            <Route path="/profile/:id" element={<ProfileView />} />
            <Route path="/id-card/:id" element={<IDCardPage />} />
          </Routes>
        </main>
        
        <footer className="bg-stone-900 text-stone-400 py-12 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-6 w-6 text-orange-500" />
                <span className="font-serif text-white text-lg font-bold tracking-wider">AKHADA PORTAL</span>
              </div>
              <div className="text-sm text-center md:text-right">
                <p>© {new Date().getFullYear()} Akhada Parishad Administration.</p>
                <p className="mt-1">Digital Identity & Verification System.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
