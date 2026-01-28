import { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Share2, 
  Clock, 
  Trash2, 
  Check, 
  Copy,
  Calendar,
  Users,
  Globe2
} from 'lucide-react';
import AddMemberModal from './AddMemberModal';
import MeetingFinder from './MeetingFinder';
import { 
  formatTimeInZone, 
  formatDateInZone, 
  getHourInZone, 
  getWorkingStatus,
  getInitials,
  getOffsetFromUTC
} from '../utils/timezones';

export default function RoomView({ 
  room, 
  onBack, 
  addMember, 
  updateMember, 
  removeMember, 
  updateRoom,
  deleteRoom,
  generateShareUrl 
}) {
  const [showAddMember, setShowAddMember] = useState(false);
  const [showMeetingFinder, setShowMeetingFinder] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate user's local timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userOffset = getOffsetFromUTC(userTimezone);

  const handleAddMember = (memberData) => {
    addMember(room.id, memberData);
    setShowAddMember(false);
  };

  const handleRemoveMember = (memberId) => {
    if (confirm('Remove this team member?')) {
      removeMember(room.id, memberId);
    }
  };

  const handleShare = async () => {
    const url = generateShareUrl(room.id);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 2000);
    }
  };

  // Sort members by current hour (working hours first)
  const sortedMembers = useMemo(() => {
    return [...room.members].sort((a, b) => {
      const hourA = getHourInZone(currentTime, a.timezone);
      const hourB = getHourInZone(currentTime, b.timezone);
      const statusA = getWorkingStatus(hourA);
      const statusB = getWorkingStatus(hourB);
      
      const priority = { working: 0, late: 1, sleeping: 2 };
      return priority[statusA.status] - priority[statusB.status];
    });
  }, [room.members, currentTime]);

  return (
    <>
      <div className="bg-gradient-animated" />
      
      <header className="header">
        <div className="container header-content">
          <button className="btn btn-ghost btn-sm" onClick={onBack}>
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex gap-2">
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={handleShare}
            >
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* Room Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
          <p className="text-secondary">
            {room.members.length} team member{room.members.length !== 1 ? 's' : ''} across{' '}
            {new Set(room.members.map(m => m.timezone)).size} timezone{new Set(room.members.map(m => m.timezone)).size !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Your Local Time */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Globe2 size={20} className="text-secondary" />
            <span className="text-secondary text-sm">Your Local Time</span>
          </div>
          <div className="time-display">
            {formatTimeInZone(currentTime, userTimezone)}
          </div>
          <p className="text-muted text-sm mt-1">
            {formatDateInZone(currentTime, userTimezone)} · {userTimezone}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button className="btn btn-primary" onClick={() => setShowAddMember(true)}>
            <Plus size={18} /> Add Member
          </button>
          {room.members.length >= 2 && (
            <button className="btn btn-secondary" onClick={() => setShowMeetingFinder(true)}>
              <Calendar size={18} /> Find Meeting Time
            </button>
          )}
        </div>

        {/* Members Grid */}
        {room.members.length === 0 ? (
          <div className="empty-state glass-card">
            <Users size={80} className="empty-state-icon" />
            <h3 className="text-xl font-semibold mb-2">No team members yet</h3>
            <p className="text-secondary mb-4">Add your first team member to see their local time</p>
            <button className="btn btn-primary" onClick={() => setShowAddMember(true)}>
              <Plus size={18} /> Add First Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2">
            {sortedMembers.map(member => (
              <MemberCard
                key={member.id}
                member={member}
                currentTime={currentTime}
                userOffset={userOffset}
                onRemove={() => handleRemoveMember(member.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Toast */}
      {showToast && (
        <div className="toast">
          <Check size={18} style={{ color: 'var(--success)' }} />
          <span>Share link copied to clipboard!</span>
        </div>
      )}

      {/* Modals */}
      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onAdd={handleAddMember}
        />
      )}

      {showMeetingFinder && (
        <MeetingFinder
          members={room.members}
          onClose={() => setShowMeetingFinder(false)}
        />
      )}
    </>
  );
}

function MemberCard({ member, currentTime, userOffset, onRemove }) {
  const hour = getHourInZone(currentTime, member.timezone);
  const { status, label } = getWorkingStatus(hour);
  const memberOffset = getOffsetFromUTC(member.timezone);
  const offsetDiff = memberOffset - userOffset;

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div 
            className="avatar" 
            style={{ backgroundColor: member.color, width: 48, height: 48, fontSize: '1.1rem' }}
          >
            {getInitials(member.name)}
          </div>
          <div>
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-secondary text-sm flex items-center gap-2">
              <span className={`status-dot ${status}`} />
              {label}
            </p>
          </div>
        </div>
        <button 
          className="btn btn-ghost btn-sm"
          onClick={onRemove}
          title="Remove member"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-4">
        <div className="time-display time-display-sm">
          {formatTimeInZone(currentTime, member.timezone)}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-muted text-sm">
            {formatDateInZone(currentTime, member.timezone)}
          </span>
          <span className={`offset-badge ${offsetDiff > 0 ? 'ahead' : offsetDiff < 0 ? 'behind' : ''}`}>
            {offsetDiff === 0 ? 'Same time' : 
              `${offsetDiff > 0 ? '+' : ''}${offsetDiff}h ${offsetDiff > 0 ? 'ahead' : 'behind'}`}
          </span>
        </div>
      </div>

      {/* Working hours visualization */}
      <div className="mt-4">
        <div className="hours-bar">
          <div 
            className="hours-bar-fill"
            style={{
              left: `${(9 / 24) * 100}%`,
              width: `${(8 / 24) * 100}%`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${(hour / 24) * 100}%`,
              top: '-4px',
              width: '2px',
              height: '14px',
              background: 'var(--text-primary)',
              borderRadius: '1px',
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted">12am</span>
          <span className="text-xs text-muted">9am-5pm</span>
          <span className="text-xs text-muted">12am</span>
        </div>
      </div>
    </div>
  );
}
