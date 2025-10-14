import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Users, Calendar, Plus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
}

interface AttendanceRecord {
  id: string;
  playerId: string;
  playerName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

const Attendance: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Fernando Torres', number: 9, position: 'DEL' },
    { id: '2', name: 'Pablo Sánchez', number: 8, position: 'CEN' },
    { id: '3', name: 'Juan Pérez', number: 4, position: 'DEL' },
    { id: '4', name: 'Alejandro Martínez', number: 1, position: 'POR' },
    { id: '5', name: 'David González', number: 2, position: 'DEF' }
  ]);
  
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0] || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all');
  const [newRecord, setNewRecord] = useState({
    playerId: '',
    status: 'present' as 'present' | 'absent' | 'late',
    notes: ''
  });

  // Load attendance records from localStorage
  useEffect(() => {
    const savedRecords = localStorage.getItem('statsor_attendance');
    if (savedRecords) {
      try {
        setAttendanceRecords(JSON.parse(savedRecords));
      } catch (error) {
        console.error('Error parsing attendance records:', error);
        setAttendanceRecords([]);
      }
    }
  }, []);

  // Save attendance records to localStorage
  useEffect(() => {
    localStorage.setItem('statsor_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  const handleAddRecord = () => {
    if (!newRecord.playerId) {
      toast.error('Please select a player');
      return;
    }

    const player = players.find(p => p.id === newRecord.playerId);
    if (!player) {
      toast.error('Player not found');
      return;
    }

    // Check if record already exists for this player and date
    const existingRecord = attendanceRecords.find(
      record => record.playerId === newRecord.playerId && record.date === selectedDate
    );

    if (existingRecord) {
      toast.error('Attendance record already exists for this player on this date');
      return;
    }

    const record: AttendanceRecord = {
      id: Date.now().toString(),
      playerId: newRecord.playerId,
      playerName: player.name,
      date: selectedDate,
      status: newRecord.status,
      notes: newRecord.notes
    };

    setAttendanceRecords(prev => [...prev, record]);
    setNewRecord({ playerId: '', status: 'present', notes: '' });
    toast.success('Attendance record added successfully!');
  };

  const handleDeleteRecord = (id: string) => {
    setAttendanceRecords(prev => prev.filter(record => record.id !== id));
    toast.success('Attendance record deleted successfully!');
  };

  // Filter records based on date, search, and status
  const filteredRecords = attendanceRecords
    .filter(record => record.date === selectedDate)
    .filter(record => 
      record.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.notes && record.notes.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(record => statusFilter === 'all' || record.status === statusFilter);

  // Get attendance summary
  const presentCount = filteredRecords.filter(r => r.status === 'present').length;
  const absentCount = filteredRecords.filter(r => r.status === 'absent').length;
  const lateCount = filteredRecords.filter(r => r.status === 'late').length;
  const totalCount = filteredRecords.length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Users className="mr-3 h-8 w-8 text-blue-600" />
          Attendance
        </h1>
      </div>

      {/* Date Selection and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{presentCount}</div>
              <div className="text-sm text-green-600">Present</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-700">{absentCount}</div>
              <div className="text-sm text-red-600">Absent</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-700">{lateCount}</div>
              <div className="text-sm text-yellow-600">Late</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Attendance Record */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Add Attendance Record
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Player</label>
            <Select 
              value={newRecord.playerId} 
              onValueChange={(value) => setNewRecord(prev => ({ ...prev, playerId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select player" />
              </SelectTrigger>
              <SelectContent>
                {players
                  .filter(player => 
                    !attendanceRecords.some(record => 
                      record.playerId === player.id && record.date === selectedDate
                    )
                  )
                  .map(player => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.number}. {player.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select 
              value={newRecord.status} 
              onValueChange={(value) => setNewRecord(prev => ({ ...prev, status: value as 'present' | 'absent' | 'late' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Notes</label>
            <Input
              placeholder="Optional notes"
              value={newRecord.notes}
              onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          
          <div className="flex items-end">
            <Button onClick={handleAddRecord} className="w-full">
              Add Record
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search players or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as 'all' | 'present' | 'absent' | 'late')}
          >
            <SelectTrigger>
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="late">Late</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records for {new Date(selectedDate).toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Player</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Notes</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map(record => {
                    const player = players.find(p => p.id === record.playerId);
                    return (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="py-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
                              {player?.number || '0'}
                            </div>
                            {record.playerName}
                          </div>
                        </td>
                        <td className="py-2">
                          <Badge 
                            className={
                              record.status === 'present' ? 'bg-green-500' : 
                              record.status === 'absent' ? 'bg-red-500' : 
                              'bg-yellow-500'
                            }
                          >
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-2">{record.notes || '-'}</td>
                        <td className="py-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRecord(record.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>No attendance records for this date</p>
              <p className="text-sm">Add attendance records using the form above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
