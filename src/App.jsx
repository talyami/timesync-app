import { useState, useEffect } from 'react';
import { Clock, Globe2, Users, Sparkles, ArrowRight, Plus } from 'lucide-react';
import { useRooms } from './hooks/useRooms';
import RoomView from './components/RoomView';
import CreateRoomModal from './components/CreateRoomModal';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { rooms, createRoom, getRoom, importFromUrl, ...roomActions } = useRooms();

  // Handle URL routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      if (hash.startsWith('#/shared/')) {
        const encoded = hash.replace('#/shared/', '');
        const room = importFromUrl(encoded);
        if (room) {
          setCurrentRoomId(room.id);
          setCurrentView('room');
          // Clean up URL
          window.history.replaceState(null, '', window.location.pathname + '#/room/' + room.id);
        }
      } else if (hash.startsWith('#/room/')) {
        const roomId = hash.replace('#/room/', '');
        if (getRoom(roomId)) {
          setCurrentRoomId(roomId);
          setCurrentView('room');
        }
      } else if (hash === '#/dashboard' || rooms.length > 0) {
        if (rooms.length === 0) {
          setCurrentView('landing');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [importFromUrl, getRoom, rooms]);

  const handleCreateRoom = (name) => {
    const room = createRoom(name);
    setCurrentRoomId(room.id);
    setCurrentView('room');
    window.location.hash = '#/room/' + room.id;
    setShowCreateModal(false);
  };

  const handleOpenRoom = (roomId) => {
    setCurrentRoomId(roomId);
    setCurrentView('room');
    window.location.hash = '#/room/' + roomId;
  };

  const handleBackToDashboard = () => {
    setCurrentView(rooms.length > 0 ? 'dashboard' : 'landing');
    setCurrentRoomId(null);
    window.location.hash = rooms.length > 0 ? '#/dashboard' : '';
  };

  // Room view
  if (currentView === 'room' && currentRoomId) {
    const room = getRoom(currentRoomId);
    if (!room) {
      handleBackToDashboard();
      return null;
    }
    return (
      <RoomView 
        room={room} 
        onBack={handleBackToDashboard}
        {...roomActions}
      />
    );
  }

  // Dashboard view (when user has rooms)
  if (currentView === 'dashboard' || rooms.length > 0) {
    return (
      <>
        <div className="bg-gradient-animated" />
        <Header onCreateRoom={() => setShowCreateModal(true)} />
        
        <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 className="text-2xl font-bold">Your Teams</h2>
              <p className="text-secondary text-sm mt-2">Manage your timezone groups</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              <Plus size={18} /> New Team
            </button>
          </div>

          <div className="grid grid-cols-3">
            {rooms.map(room => (
              <div 
                key={room.id} 
                className="glass-card p-6"
                onClick={() => handleOpenRoom(room.id)}
                style={{ cursor: 'pointer' }}
              >
                <h3 className="font-semibold text-lg mb-2">{room.name}</h3>
                <p className="text-secondary text-sm mb-4">
                  {room.members.length} member{room.members.length !== 1 ? 's' : ''}
                </p>
                {room.members.length > 0 && (
                  <div className="flex" style={{ marginLeft: '-8px' }}>
                    {room.members.slice(0, 5).map((member, i) => (
                      <div
                        key={member.id}
                        className="avatar"
                        style={{ 
                          backgroundColor: member.color,
                          marginLeft: i > 0 ? '-12px' : '0',
                          border: '2px solid var(--bg-card)',
                          zIndex: 5 - i,
                        }}
                      >
                        {member.name[0]}
                      </div>
                    ))}
                    {room.members.length > 5 && (
                      <div
                        className="avatar"
                        style={{ 
                          backgroundColor: 'var(--bg-secondary)',
                          marginLeft: '-12px',
                          border: '2px solid var(--bg-card)',
                          fontSize: '0.75rem',
                        }}
                      >
                        +{room.members.length - 5}
                      </div>
                    )}
                  </div>
                )}
                {room.members.length === 0 && (
                  <p className="text-muted text-sm">Click to add team members</p>
                )}
              </div>
            ))}
          </div>
        </main>

        {showCreateModal && (
          <CreateRoomModal 
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateRoom}
          />
        )}
      </>
    );
  }

  // Landing page
  return (
    <>
      <div className="bg-gradient-animated" />
      <Header onCreateRoom={() => setShowCreateModal(true)} />
      
      <main className="container">
        <section className="hero">
          <h1>TimeSync</h1>
          <p>Never ask "what time is it for you?" again. Coordinate effortlessly across timezones with your distributed team.</p>
          <button className="btn btn-primary btn-lg" onClick={() => setShowCreateModal(true)}>
            Get Started Free <ArrowRight size={20} />
          </button>
        </section>

        <section className="grid grid-cols-3 mt-8 mb-6" style={{ maxWidth: '900px', margin: '4rem auto' }}>
          <div className="glass-card feature-card">
            <div className="feature-icon">
              <Clock size={28} />
            </div>
            <h3>Live Time View</h3>
            <p>See everyone's local time updating in real-time. Know when teammates are available.</p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon">
              <Users size={28} />
            </div>
            <h3>Team Rooms</h3>
            <p>Create rooms for different teams or projects. Add members with their timezones.</p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon">
              <Sparkles size={28} />
            </div>
            <h3>Meeting Finder</h3>
            <p>Find optimal meeting times that work for everyone. No more timezone math.</p>
          </div>
        </section>
      </main>

      {showCreateModal && (
        <CreateRoomModal 
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRoom}
        />
      )}
    </>
  );
}

function Header({ onCreateRoom }) {
  return (
    <header className="header">
      <div className="container header-content">
        <a href="/" className="logo">
          <div className="logo-icon">
            <Globe2 size={18} color="white" />
          </div>
          TimeSync
        </a>
        <button className="btn btn-secondary btn-sm" onClick={onCreateRoom}>
          <Plus size={16} /> New Team
        </button>
      </div>
    </header>
  );
}

export default App;
