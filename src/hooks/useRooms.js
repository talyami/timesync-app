import { useState, useEffect, useCallback } from 'react';
import { generateId, encodeRoomData, decodeRoomData } from '../utils/timezones';

const STORAGE_KEY = 'timesync_rooms';

export function useRooms() {
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  }, [rooms]);

  const createRoom = useCallback((name) => {
    const room = {
      id: generateId(),
      name,
      members: [],
      createdAt: new Date().toISOString(),
    };
    setRooms(prev => [...prev, room]);
    return room;
  }, []);

  const updateRoom = useCallback((roomId, updates) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, ...updates } : room
    ));
  }, []);

  const deleteRoom = useCallback((roomId) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
  }, []);

  const getRoom = useCallback((roomId) => {
    return rooms.find(room => room.id === roomId);
  }, [rooms]);

  const addMember = useCallback((roomId, member) => {
    const newMember = { ...member, id: generateId() };
    setRooms(prev => prev.map(room => 
      room.id === roomId 
        ? { ...room, members: [...room.members, newMember] }
        : room
    ));
    return newMember;
  }, []);

  const updateMember = useCallback((roomId, memberId, updates) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId 
        ? {
            ...room,
            members: room.members.map(m => 
              m.id === memberId ? { ...m, ...updates } : m
            ),
          }
        : room
    ));
  }, []);

  const removeMember = useCallback((roomId, memberId) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId 
        ? { ...room, members: room.members.filter(m => m.id !== memberId) }
        : room
    ));
  }, []);

  const generateShareUrl = useCallback((roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return null;
    const encoded = encodeRoomData(room);
    return `${window.location.origin}${window.location.pathname}#/shared/${encoded}`;
  }, [rooms]);

  const importFromUrl = useCallback((encoded) => {
    const room = decodeRoomData(encoded);
    if (!room) return null;
    
    // Check if room already exists
    const existing = rooms.find(r => r.id === room.id);
    if (existing) {
      // Update existing room
      setRooms(prev => prev.map(r => r.id === room.id ? room : r));
    } else {
      // Add new room
      setRooms(prev => [...prev, room]);
    }
    return room;
  }, [rooms]);

  return {
    rooms,
    createRoom,
    updateRoom,
    deleteRoom,
    getRoom,
    addMember,
    updateMember,
    removeMember,
    generateShareUrl,
    importFromUrl,
  };
}
