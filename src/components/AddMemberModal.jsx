import { useState } from 'react';
import { X, User } from 'lucide-react';
import { TIMEZONES, getRandomColor } from '../utils/timezones';

export default function AddMemberModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [color] = useState(getRandomColor);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && timezone) {
      onAdd({
        name: name.trim(),
        timezone,
        color,
      });
    }
  };

  // Group timezones by region for easier navigation
  const groupedTimezones = TIMEZONES.reduce((acc, tz) => {
    const region = tz.value.split('/')[0];
    if (!acc[region]) acc[region] = [];
    acc[region].push(tz);
    return acc;
  }, {});

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Team Member</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Preview */}
          <div className="flex items-center gap-4 mb-6 p-4 glass-card">
            <div 
              className="avatar" 
              style={{ backgroundColor: color, width: 56, height: 56, fontSize: '1.25rem' }}
            >
              {name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : <User size={24} />}
            </div>
            <div>
              <p className="font-medium">{name || 'Team Member'}</p>
              <p className="text-secondary text-sm">
                {TIMEZONES.find(tz => tz.value === timezone)?.label || timezone}
              </p>
            </div>
          </div>

          <div className="form-group">
            <label className="label">Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g., John Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="label">Timezone</label>
            <select
              className="select"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              {Object.entries(groupedTimezones).map(([region, zones]) => (
                <optgroup key={region} label={region.replace('_', ' ')}>
                  {zones.map(tz => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ flex: 1 }}
              disabled={!name.trim() || !timezone}
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
