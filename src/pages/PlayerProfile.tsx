import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Target, 
  Activity, 
  Heart, 
  Award,
  User,
  Phone,
  Mail,
  Edit,
  Save,
  Camera,
  X
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { uploadService } from '../services/uploadService';
import { toast } from 'sonner';
import { dataManagementService, Player as DataPlayer } from '../services/dataManagementService';

// Define our extended player interface
interface ExtendedPlayer extends DataPlayer {
  // Extended properties
  nickname?: string;
  dominantFoot?: string;
  birthDate?: Date;
  games?: number;
  yellowCards?: number;
  redCards?: number;
  shots?: number;
  shotsOnTarget?: number;
  passes?: number;
  passAccuracy?: number;
  foulsCommitted?: number;
  foulsReceived?: number;
  ballsLost?: number;
  ballsRecovered?: number;
  duelsWon?: number;
  duelsLost?: number;
  crosses?: number;
  saves?: number;
  photo?: string;
  height?: number;
  weight?: number;
}

const PlayerProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [player, setPlayer] = useState<ExtendedPlayer | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editedPlayer, setEditedPlayer] = useState<ExtendedPlayer | null>(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);

  // Mock performance data for the chart
  const performanceData = [
    { game: 'Match 1', goals: 1, assists: 0 },
    { game: 'Match 2', goals: 0, assists: 1 },
    { game: 'Match 3', goals: 2, assists: 1 },
    { game: 'Match 4', goals: 0, assists: 2 },
    { game: 'Match 5', goals: 1, assists: 0 },
  ];

  useEffect(() => {
    const loadPlayer = async () => {
      if (!id) {
        navigate('/players');
        return;
      }
      
      try {
        setLoading(true);
        const players = await dataManagementService.getPlayers();
        const foundPlayer = players.find(p => p.id === id);
        
        if (foundPlayer) {
          // Transform the player data to match our interface
          const transformedPlayer: ExtendedPlayer = {
            ...foundPlayer,
            number: foundPlayer.number || Math.floor(Math.random() * 99) + 1,
            nickname: foundPlayer.nickname || '',
            dominantFoot: foundPlayer.dominantFoot || 'Right',
            birthDate: foundPlayer.date_of_birth ? new Date(foundPlayer.date_of_birth) : new Date('1990-01-01'),
            games: foundPlayer.games || 0,
            yellowCards: foundPlayer.yellowCards || 0,
            redCards: foundPlayer.redCards || 0,
            shots: foundPlayer.shots || 0,
            shotsOnTarget: foundPlayer.shotsOnTarget || 0,
            passes: foundPlayer.passes || 0,
            passAccuracy: foundPlayer.passAccuracy || 0,
            foulsCommitted: foundPlayer.foulsCommitted || 0,
            foulsReceived: foundPlayer.foulsReceived || 0,
            ballsLost: foundPlayer.ballsLost || 0,
            ballsRecovered: foundPlayer.ballsRecovered || 0,
            duelsWon: foundPlayer.duelsWon || 0,
            duelsLost: foundPlayer.duelsLost || 0,
            crosses: foundPlayer.crosses || 0,
            saves: foundPlayer.saves || 0,
            photo: foundPlayer.photo || '/placeholder.svg',
            height: foundPlayer.height || 0,
            weight: foundPlayer.weight || 0
          };
          
          setPlayer(transformedPlayer);
          setEditedPlayer(transformedPlayer);
        } else {
          toast.error('Player not found');
          navigate('/players');
        }
      } catch (error) {
        console.error('Error loading player:', error);
        toast.error('Failed to load player data');
        navigate('/players');
      } finally {
        setLoading(false);
      }
    };
    
    loadPlayer();
    
    // Subscribe to player updates
    dataManagementService.setPlayersUpdateCallback((updatedPlayers) => {
      if (id) {
        const foundPlayer = updatedPlayers.find(p => p.id === id);
        if (foundPlayer) {
          // Transform the player data to match our interface
          const transformedPlayer: ExtendedPlayer = {
            ...foundPlayer,
            number: foundPlayer.number || Math.floor(Math.random() * 99) + 1,
            nickname: foundPlayer.nickname || '',
            dominantFoot: foundPlayer.dominantFoot || 'Right',
            birthDate: foundPlayer.date_of_birth ? new Date(foundPlayer.date_of_birth) : new Date('1990-01-01'),
            games: foundPlayer.games || 0,
            yellowCards: foundPlayer.yellowCards || 0,
            redCards: foundPlayer.redCards || 0,
            shots: foundPlayer.shots || 0,
            shotsOnTarget: foundPlayer.shotsOnTarget || 0,
            passes: foundPlayer.passes || 0,
            passAccuracy: foundPlayer.passAccuracy || 0,
            foulsCommitted: foundPlayer.foulsCommitted || 0,
            foulsReceived: foundPlayer.foulsReceived || 0,
            ballsLost: foundPlayer.ballsLost || 0,
            ballsRecovered: foundPlayer.ballsRecovered || 0,
            duelsWon: foundPlayer.duelsWon || 0,
            duelsLost: foundPlayer.duelsLost || 0,
            crosses: foundPlayer.crosses || 0,
            saves: foundPlayer.saves || 0,
            photo: foundPlayer.photo || '/placeholder.svg',
            height: foundPlayer.height || 0,
            weight: foundPlayer.weight || 0
          };
          
          setPlayer(transformedPlayer);
          setEditedPlayer(transformedPlayer);
        }
      }
    });
    
    return () => {
      dataManagementService.setPlayersUpdateCallback(null);
    };
  }, [id, navigate]);

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'DEL': return 'bg-red-100 text-red-800';
      case 'CEN': return 'bg-blue-100 text-blue-800';
      case 'DEF': return 'bg-green-100 text-green-800';
      case 'POR': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPlayer(player);
  };

  const handleSave = async () => {
    if (!editedPlayer || !player || !player.id) {
      toast.error('Invalid player data');
      return;
    }

    const loadingToast = toast.loading('Updating player profile...');

    try {
      const playerData: Partial<DataPlayer> = {
        name: editedPlayer.name,
        position: editedPlayer.position,
        number: editedPlayer.number,
        age: editedPlayer.age,
        nationality: editedPlayer.nationality,
        goals: editedPlayer.goals,
        assists: editedPlayer.assists,
      };

      if (editedPlayer.birthDate) {
        playerData.date_of_birth = editedPlayer.birthDate.toISOString().split('T')[0];
      }

      console.log('Saving player data:', playerData);

      const updatedPlayer = await dataManagementService.updatePlayer(player.id, playerData);

      if (updatedPlayer) {
        const transformedPlayer: ExtendedPlayer = {
          ...updatedPlayer,
          number: updatedPlayer.number || editedPlayer.number,
          nickname: editedPlayer.nickname || '',
          dominantFoot: editedPlayer.dominantFoot || 'Right',
          birthDate: updatedPlayer.date_of_birth ? new Date(updatedPlayer.date_of_birth) : editedPlayer.birthDate,
          games: updatedPlayer.games || editedPlayer.games || 0,
          yellowCards: editedPlayer.yellowCards || 0,
          redCards: editedPlayer.redCards || 0,
          shots: editedPlayer.shots || 0,
          shotsOnTarget: editedPlayer.shotsOnTarget || 0,
          passes: editedPlayer.passes || 0,
          passAccuracy: editedPlayer.passAccuracy || 0,
          foulsCommitted: editedPlayer.foulsCommitted || 0,
          foulsReceived: editedPlayer.foulsReceived || 0,
          ballsLost: editedPlayer.ballsLost || 0,
          ballsRecovered: editedPlayer.ballsRecovered || 0,
          duelsWon: editedPlayer.duelsWon || 0,
          duelsLost: editedPlayer.duelsLost || 0,
          crosses: editedPlayer.crosses || 0,
          saves: editedPlayer.saves || 0,
          photo: editedPlayer.photo || '/placeholder.svg',
          height: editedPlayer.height || 0,
          weight: editedPlayer.weight || 0
        };

        setPlayer(transformedPlayer);
        setEditedPlayer(transformedPlayer);
        setIsEditing(false);

        if (tempPhoto) {
          const playerPhotos = JSON.parse(localStorage.getItem('player_photos') || '{}');
          playerPhotos[player.id] = tempPhoto;
          localStorage.setItem('player_photos', JSON.stringify(playerPhotos));
          setPlayer(prev => prev ? { ...prev, photo: tempPhoto } : null);
          setEditedPlayer(prev => prev ? { ...prev, photo: tempPhoto } : null);
          setTempPhoto(null);
        }

        toast.dismiss(loadingToast);
        toast.success('Player profile updated successfully!');
      } else {
        toast.dismiss(loadingToast);
        toast.error('Failed to update player profile - no response from server');
      }
    } catch (error: any) {
      console.error('Error updating player:', error);
      toast.dismiss(loadingToast);
      toast.error(error?.message || 'Failed to update player profile. Please check your connection and try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPlayer(player);
    setTempPhoto(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = (uploadService as any).validateFile(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }

      uploadService.fileToBase64(file).then(base64 => {
        setTempPhoto(base64);
        setEditedPlayer(prev => prev ? { ...prev, photo: base64 } : null);
      }).catch(error => {
        console.error('Preview generation failed:', error);
        toast.error('Failed to generate preview');
      });
    }
  };

  const triggerFileInput = () => {
    document.getElementById('photo-upload')?.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/players')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Players
        </Button>
        {!isEditing ? (
          <Button onClick={handleEdit} className="flex items-center gap-2">
            <Edit size={16} />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save size={16} />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player Info Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={tempPhoto || editedPlayer?.photo || '/placeholder.svg'} alt={editedPlayer?.name || 'Player'} />
                    <AvatarFallback className="text-2xl bg-blue-500 text-white">
                      {(editedPlayer?.name || '?').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      onClick={triggerFileInput}
                      className="absolute bottom-4 right-0 w-8 h-8 p-0 rounded-full"
                      size="sm"
                    >
                      <Camera size={16} />
                    </Button>
                  )}
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                {isEditing && editedPlayer ? (
                  <Input
                    value={editedPlayer.name || ''}
                    onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="text-2xl text-center font-bold"
                  />
                ) : (
                  <CardTitle className="text-2xl text-center">{player?.name || 'Loading...'}</CardTitle>
                )}
                {isEditing && editedPlayer ? (
                  <Input
                    value={editedPlayer.nickname || ''}
                    onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, nickname: e.target.value } : null)}
                    placeholder="Nickname"
                    className="text-muted-foreground text-center"
                  />
                ) : (
                  player?.nickname && (
                    <p className="text-muted-foreground text-center">"{player.nickname}"</p>
                  )
                )}
                <div className="flex items-center gap-2 mt-2">
                  {isEditing && editedPlayer ? (
                    <Select 
                      value={editedPlayer.position || ''} 
                      onValueChange={(value) => setEditedPlayer(prev => prev ? { ...prev, position: value } : null)}
                    >
                      <SelectTrigger className={getPositionColor(editedPlayer.position || '')}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DEL">DEL</SelectItem>
                        <SelectItem value="CEN">CEN</SelectItem>
                        <SelectItem value="DEF">DEF</SelectItem>
                        <SelectItem value="POR">POR</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    player && (
                      <Badge className={getPositionColor(player.position || '')}>
                        {player.position}
                      </Badge>
                    )
                  )}
                  {isEditing && editedPlayer ? (
                    <Input
                      type="number"
                      value={editedPlayer.number || ''}
                      onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, number: parseInt(e.target.value) || 0 } : null)}
                      className="w-20"
                    />
                  ) : (
                    player && (
                      <Badge variant="outline">
                        #{player.number}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isEditing && editedPlayer ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Age</Label>
                      <Input
                        type="number"
                        value={editedPlayer.age || ''}
                        onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, age: parseInt(e.target.value) || 0 } : null)}
                      />
                    </div>
                    <div>
                      <Label>Nationality</Label>
                      <Input
                        value={editedPlayer.nationality || ''}
                        onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, nationality: e.target.value } : null)}
                      />
                    </div>
                    <div>
                      <Label>Height (cm)</Label>
                      <Input
                        type="number"
                        value={editedPlayer.height || ''}
                        onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, height: parseInt(e.target.value) || 0 } : null)}
                      />
                    </div>
                    <div>
                      <Label>Weight (kg)</Label>
                      <Input
                        type="number"
                        value={editedPlayer.weight || ''}
                        onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, weight: parseInt(e.target.value) || 0 } : null)}
                      />
                    </div>
                  </div>
                ) : (
                  player && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span>{player.age} years</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-muted-foreground" />
                        <span>{player.nationality}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity size={16} className="text-muted-foreground" />
                        <span>{player.height || 0} cm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart size={16} className="text-muted-foreground" />
                        <span>{player.weight || 0} kg</span>
                      </div>
                    </div>
                  )
                )}
                
                <Separator />
                
                {player && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Season Stats</h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-blue-50 p-2 rounded">
                        <div className="text-lg font-bold text-blue-600">{player.goals || 0}</div>
                        <div className="text-xs text-muted-foreground">Goals</div>
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        <div className="text-lg font-bold text-green-600">{player.assists || 0}</div>
                        <div className="text-xs text-muted-foreground">Assists</div>
                      </div>
                      <div className="bg-purple-50 p-2 rounded">
                        <div className="text-lg font-bold text-purple-600">{player.games || 0}</div>
                        <div className="text-xs text-muted-foreground">Games</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Stats */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="game" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="goals" fill="#3b82f6" name="Goals" />
                    <Bar dataKey="assists" fill="#10b981" name="Assists" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Offensive Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditing && editedPlayer ? (
                  <>
                    <div className="flex justify-between items-center">
                      <Label>Goals</Label>
                      <Input
                        type="number"
                        value={editedPlayer.goals || ''}
                        onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, goals: parseInt(e.target.value) || 0 } : null)}
                        className="w-20"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Assists</Label>
                      <Input
                        type="number"
                        value={editedPlayer.assists || ''}
                        onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, assists: parseInt(e.target.value) || 0 } : null)}
                        className="w-20"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Shots</Label>
                      <Input
                        type="number"
                        value={editedPlayer.shots || ''}
                        onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, shots: parseInt(e.target.value) || 0 } : null)}
                        className="w-20"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Shots on Target</Label>
                      <Input
                        type="number"
                        value={editedPlayer.shotsOnTarget || ''}
                        onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, shotsOnTarget: parseInt(e.target.value) || 0 } : null)}
                        className="w-20"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Shot Accuracy</Label>
                      <span className="font-bold">
                        {(editedPlayer.shots || 0) > 0 && editedPlayer.shotsOnTarget ? 
                          Math.round((editedPlayer.shotsOnTarget / (editedPlayer.shots || 1)) * 100) : 0}%
                      </span>
                    </div>
                  </>
                ) : (
                  player && (
                    <>
                      <div className="flex justify-between">
                        <span>Goals</span>
                        <span className="font-bold">{player.goals || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assists</span>
                        <span className="font-bold">{player.assists || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shots</span>
                        <span className="font-bold">{player.shots || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shots on Target</span>
                        <span className="font-bold">{player.shotsOnTarget || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shot Accuracy</span>
                        <span className="font-bold">
                          {player.shots && player.shots > 0 ? 
                            Math.round(((player.shotsOnTarget || 0) / player.shots) * 100) : 0}%
                        </span>
                      </div>
                    </>
                  )
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Defensive Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditing && editedPlayer ? (
                  <>
                    <div className="flex justify-between items-center">
                      <Label>Balls Recovered</Label>
                      <Input
                        type="number"
                        value={editedPlayer.ballsRecovered || ''}
                        onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, ballsRecovered: parseInt(e.target.value) || 0 } : null)}
                        className="w-20"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Duels Won</Label>
                      <Input
                        type="number"
                        value={editedPlayer.duelsWon || ''}
                        onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, duelsWon: parseInt(e.target.value) || 0 } : null)}
                        className="w-20"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Fouls Committed</Label>
                      <Input
                        type="number"
                        value={editedPlayer.foulsCommitted || ''}
                        onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, foulsCommitted: parseInt(e.target.value) || 0 } : null)}
                        className="w-20"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Yellow Cards</Label>
                      <Input
                        type="number"
                        value={editedPlayer.yellowCards || ''}
                        onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, yellowCards: parseInt(e.target.value) || 0 } : null)}
                        className="w-20"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Red Cards</Label>
                      <Input
                        type="number"
                        value={editedPlayer.redCards || ''}
                        onChange={(e) => setEditedPlayer(prev => prev ? { ...prev, redCards: parseInt(e.target.value) || 0 } : null)}
                        className="w-20"
                      />
                    </div>
                  </>
                ) : (
                  player && (
                    <>
                      <div className="flex justify-between">
                        <span>Balls Recovered</span>
                        <span className="font-bold">{player.ballsRecovered || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duels Won</span>
                        <span className="font-bold">{player.duelsWon || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fouls Committed</span>
                        <span className="font-bold">{player.foulsCommitted || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Yellow Cards</span>
                        <span className="font-bold">{player.yellowCards || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Red Cards</span>
                        <span className="font-bold">{player.redCards || 0}</span>
                      </div>
                    </>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;