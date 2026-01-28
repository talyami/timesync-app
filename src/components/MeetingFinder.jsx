import { useState, useMemo } from 'react';
import { X, Clock, Check, Sun, Moon, Sunrise } from 'lucide-react';
import { getHourInZone, formatTimeInZone, getInitials } from '../utils/timezones';

export default function MeetingFinder({ members, onClose }) {
  const [meetingDuration, setMeetingDuration] = useState(60); // minutes
  
  // Generate time slots for the next 24 hours
  const timeSlots = useMemo(() => {
    const slots = [];
    const now = new Date();
    
    // Start from next hour
    const startTime = new Date(now);
    startTime.setMinutes(0, 0, 0);
    startTime.setHours(startTime.getHours() + 1);
    
    // Generate slots for 24 hours
    for (let i = 0; i < 24; i++) {
      const slotTime = new Date(startTime.getTime() + i * 60 * 60 * 1000);
      
      // Check working hours for each member
      const memberStatuses = members.map(member => {
        const hour = getHourInZone(slotTime, member.timezone);
        const isWorkingHours = hour >= 9 && hour < 17;
        const isReasonable = hour >= 8 && hour < 20;
        const isNight = hour >= 22 || hour < 6;
        
        return {
          member,
          hour,
          localTime: formatTimeInZone(slotTime, member.timezone),
          isWorkingHours,
          isReasonable,
          isNight,
        };
      });
      
      // Calculate slot quality
      const allWorking = memberStatuses.every(s => s.isWorkingHours);
      const allReasonable = memberStatuses.every(s => s.isReasonable);
      const anyNight = memberStatuses.some(s => s.isNight);
      
      let quality = 'poor';
      if (allWorking) quality = 'optimal';
      else if (allReasonable) quality = 'good';
      else if (!anyNight) quality = 'fair';
      
      slots.push({
        time: slotTime,
        memberStatuses,
        quality,
        score: allWorking ? 3 : allReasonable ? 2 : !anyNight ? 1 : 0,
      });
    }
    
    return slots;
  }, [members]);

  // Find best slots
  const bestSlots = useMemo(() => {
    return [...timeSlots]
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [timeSlots]);

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '600px' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Find Meeting Time</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="text-secondary mb-4">
          Best meeting times for all {members.length} team members in the next 24 hours:
        </p>

        {/* Best slots */}
        <div className="flex flex-col gap-3">
          {bestSlots.map((slot, index) => (
            <div 
              key={index}
              className={`time-slot ${slot.quality}`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  {slot.quality === 'optimal' ? (
                    <Sun size={18} style={{ color: 'var(--success)' }} />
                  ) : slot.quality === 'good' ? (
                    <Sunrise size={18} style={{ color: 'var(--warning)' }} />
                  ) : (
                    <Moon size={18} style={{ color: 'var(--text-muted)' }} />
                  )}
                  <div>
                    <span className="font-semibold">
                      {formatTimeInZone(slot.time, userTimezone)}
                    </span>
                    <span className="text-secondary text-sm ml-2">
                      your time
                    </span>
                  </div>
                </div>
                <span className={`offset-badge ${
                  slot.quality === 'optimal' ? 'ahead' : 
                  slot.quality === 'good' ? '' : ''
                }`} style={{
                  background: slot.quality === 'optimal' ? 'rgba(34, 197, 94, 0.15)' :
                              slot.quality === 'good' ? 'rgba(245, 158, 11, 0.15)' :
                              'var(--bg-secondary)',
                  color: slot.quality === 'optimal' ? 'var(--success)' :
                         slot.quality === 'good' ? 'var(--warning)' :
                         'var(--text-muted)',
                }}>
                  {slot.quality === 'optimal' ? 'All in work hours' :
                   slot.quality === 'good' ? 'Reasonable for all' :
                   slot.quality === 'fair' ? 'Some early/late' : 'Not ideal'}
                </span>
              </div>

              {/* Member times */}
              <div className="flex flex-wrap gap-2">
                {slot.memberStatuses.map(({ member, localTime, isWorkingHours }) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2"
                    style={{
                      background: 'var(--bg-primary)',
                      padding: '0.35rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                    }}
                  >
                    <div 
                      className="avatar" 
                      style={{ 
                        backgroundColor: member.color, 
                        width: 22, 
                        height: 22, 
                        fontSize: '0.65rem' 
                      }}
                    >
                      {getInitials(member.name)}
                    </div>
                    <span className={isWorkingHours ? '' : 'text-muted'}>
                      {localTime}
                    </span>
                    {isWorkingHours && (
                      <Check size={12} style={{ color: 'var(--success)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {bestSlots[0]?.quality !== 'optimal' && (
          <p className="text-muted text-sm text-center mt-4">
            ⚠️ No perfect overlap found. Consider async communication or rotating meeting times.
          </p>
        )}

        <button 
          className="btn btn-secondary mt-6" 
          style={{ width: '100%' }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
