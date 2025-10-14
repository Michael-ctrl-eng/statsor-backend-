import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bot, 
  Send, 
  Database, 
  BarChart3, 
  Target, 
  Shield, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  FileText,
  Search,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Clock,
  History,
  Eye,
  MessageSquare,
  Zap,
  Sparkles,
  Activity,
  Plus,
  Minus,
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'analysis' | 'prediction' | 'success' | 'error' | 'data';
  confidence?: number;
  priority?: 'low' | 'medium' | 'high';
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}

const AIAssistant: React.FC = () => {
  useTheme(); // Just call the hook without destructuring since we don't use the values
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI Assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    { id: '1', title: 'Team Formation Analysis', timestamp: new Date(Date.now() - 86400000), preview: 'Analyzed our 4-3-3 formation...' },
    { id: '2', title: 'Player Performance Review', timestamp: new Date(Date.now() - 172800000), preview: 'Reviewed player statistics...' },
    { id: '3', title: 'Match Strategy Discussion', timestamp: new Date(Date.now() - 259200000), preview: 'Discussed tactics for...' }
  ]);
  const [activeTab, setActiveTab] = useState('chat');
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Settings state
  const [responseDepth, setResponseDepth] = useState<number>(2);
  const [autoAnalysis, setAutoAnalysis] = useState<boolean>(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState<boolean>(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number[]>([75]);
  const [enableSuggestions, setEnableSuggestions] = useState<boolean>(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('aiAssistantSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setResponseDepth(settings.responseDepth || 2);
        setAutoAnalysis(settings.autoAnalysis ?? true);
        setRealTimeUpdates(settings.realTimeUpdates ?? true);
        setConfidenceThreshold(settings.confidenceThreshold || [75]);
        setEnableSuggestions(settings.enableSuggestions ?? true);
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      responseDepth,
      autoAnalysis,
      realTimeUpdates,
      confidenceThreshold,
      enableSuggestions
    };
    localStorage.setItem('aiAssistantSettings', JSON.stringify(settings));
  }, [responseDepth, autoAnalysis, realTimeUpdates, confidenceThreshold, enableSuggestions]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let aiResponse = '';
      let responseType: 'text' | 'analysis' | 'prediction' | 'success' | 'error' | 'data' = 'text';
      let confidence = 85;
      let priority: 'low' | 'medium' | 'high' = 'medium';
      
      if (currentInput.toLowerCase().includes('hello') || currentInput.toLowerCase().includes('hi')) {
        aiResponse = 'Hello there! How can I assist you with your football team management today?';
      } else if (currentInput.toLowerCase().includes('analyze') || currentInput.toLowerCase().includes('performance')) {
        responseType = 'analysis';
        aiResponse = `## Team Performance Analysis

**Current Form:** Excellent (72% win rate)
**Top Scorer:** Torres (5 goals)
**Best Passer:** Silva (12 assists)
**Defensive Record:** Strong (0.92 goals against per game)

**Recommendations:**
• Focus on set piece training
• Maintain current attacking momentum
• Monitor player fitness levels`;
        confidence = 92;
        priority = 'high';
      } else if (currentInput.toLowerCase().includes('predict') || currentInput.toLowerCase().includes('match')) {
        responseType = 'prediction';
        aiResponse = `## Match Prediction: vs Real Madrid

**Probability Analysis:**
• Win: 35%
• Draw: 28%
• Loss: 37%

**Expected Performance:**
• Expected Goals: 1.8
• Recommended Formation: 4-3-3

**Key Factors:**
• Away disadvantage
• Strong opponent
• Recent form

**Recommended Starting XI:**
1. Martinez (GK)
2. Silva (CM)
3. Torres (ST)`;
        confidence = 88;
        priority = 'high';
      } else if (currentInput.toLowerCase().includes('add') && currentInput.toLowerCase().includes('player')) {
        responseType = 'success';
        aiResponse = 'Successfully added new player to your squad. The player has been assigned to the training group and is ready for selection.';
        confidence = 95;
        priority = 'high';
      } else {
        aiResponse = `I understand you're asking about "${currentInput}". As your AI assistant, I can help with various aspects of football management including tactical analysis, player performance insights, match predictions, and strategic recommendations. What specific information would you like to explore?`;
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: responseType,
        confidence,
        priority
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'error',
        confidence: 30,
        priority: 'high'
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Connection issue - please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const loadChatHistory = (chatId: string) => {
    // In a real implementation, this would load the actual chat history
    setActiveChat(chatId);
    toast.info('Loading chat history...');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'analysis': return <BarChart3 className="h-4 w-4 text-blue-500" />;
      case 'prediction': return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case 'data': return <Database className="h-4 w-4 text-indigo-500" />;
      default: return <Bot className="h-4 w-4 text-gray-500" />;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Quick actions for chat
  const quickActions = [
    { label: 'Analyze team performance', icon: BarChart3 },
    { label: 'Predict next match', icon: TrendingUp },
    { label: 'Show player stats', icon: Users },
    { label: 'Create training plan', icon: Target }
  ];

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    // Auto-send after a short delay to simulate selection
    setTimeout(() => {
      handleSendMessage();
    }, 300);
  };

  return (
    <div className={`min-h-screen bg-white`}>
      {/* Fullscreen header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-sm text-gray-500">Your intelligent football management companion</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="h-3 w-3 mr-1" />
            Online
          </Badge>
        </div>
      </div>

      <div className={`px-4 ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'py-6'} flex flex-col`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white border border-gray-200 rounded-lg p-1">
            <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-md">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-md">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-md">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col mt-0 h-full">
            <div className={`grid grid-cols-1 ${isFullscreen ? 'lg:grid-cols-1 xl:grid-cols-4' : 'lg:grid-cols-4'} gap-6 h-full`}>
              {/* Chat History Sidebar - Hidden in full screen on smaller screens */}
              {!isFullscreen || window.innerWidth >= 1280 ? (
                <div className="lg:col-span-1 h-full">
                  <Card className="bg-white border-gray-200 h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-base">
                        <span>Chat History</span>
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                          {chatHistory.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                      <div className="space-y-3">
                        {chatHistory.map((chat) => (
                          <div 
                            key={chat.id} 
                            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => loadChatHistory(chat.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate text-sm">{chat.title}</h3>
                                <p className="text-xs text-gray-500 truncate mt-1">{chat.preview}</p>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="p-1 ml-2 h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  loadChatHistory(chat.id);
                                }}
                              >
                                <Eye className="h-3 w-3 text-gray-500" />
                              </Button>
                            </div>
                            <div className="flex items-center mt-2 text-xs text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              {chat.timestamp.toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : null}

              {/* Main Chat Interface */}
              <div className={`${!isFullscreen || window.innerWidth >= 1280 ? 'lg:col-span-3' : 'lg:col-span-4'} flex flex-col h-full`}>
                <Card className="bg-white border-gray-200 flex-1 flex flex-col h-full">
                  <CardContent className="flex-1 flex flex-col p-0 h-full">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                              message.sender === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md'
                                : 'bg-gray-50 border border-gray-200 text-gray-900 rounded-bl-md shadow-sm'
                            }`}
                          >
                            {message.sender !== 'user' && (
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="p-1 rounded bg-white border">
                                  {getMessageIcon(message.type || 'text')}
                                </div>
                                <span className="text-xs font-medium text-gray-500">
                                  AI Assistant
                                </span>
                                {message.confidence && (
                                  <Badge variant="outline" className={`text-xs ${
                                    message.confidence >= 80 
                                      ? 'border-green-500 text-green-600' 
                                      : message.confidence >= 60
                                        ? 'border-yellow-500 text-yellow-600'
                                        : 'border-red-500 text-red-600'
                                  }`}>
                                    {message.confidence}% confident
                                  </Badge>
                                )}
                              </div>
                            )}
                            <div className="whitespace-pre-wrap text-sm">
                              {message.content}
                            </div>
                            <p className="text-xs mt-2 opacity-70">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-sm text-gray-600">AI is thinking</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                      <div className="flex flex-wrap gap-2">
                        {quickActions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs rounded-full"
                            onClick={() => handleQuickAction(action.label)}
                          >
                            <action.icon className="h-3 w-3 mr-1" />
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <Textarea
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Ask me anything about football tactics, player management, or team strategy..."
                          className="flex-1 border-gray-300 focus:border-blue-500 min-h-[44px] max-h-32 resize-none"
                          disabled={isLoading}
                          onKeyDown={handleKeyPress}
                        />
                        <Button 
                          onClick={handleSendMessage}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4"
                          disabled={isLoading || !inputMessage.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Team Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Win Rate</span>
                        <span className="text-sm font-medium">72%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Goals Scored</span>
                        <span className="text-sm font-medium">52</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Clean Sheets</span>
                        <span className="text-sm font-medium">12</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-green-500" />
                    Top Players
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                          T
                        </div>
                        <div>
                          <div className="font-medium">Torres</div>
                          <div className="text-sm text-gray-500">ST</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">8.4</div>
                        <div className="text-sm text-gray-500">Rating</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                          S
                        </div>
                        <div>
                          <div className="font-medium">Silva</div>
                          <div className="text-sm text-gray-500">CM</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">8.1</div>
                        <div className="text-sm text-gray-500">Rating</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                          R
                        </div>
                        <div>
                          <div className="font-medium">Rodriguez</div>
                          <div className="text-sm text-gray-500">CB</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">7.8</div>
                        <div className="text-sm text-gray-500">Rating</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-purple-500" />
                    Upcoming Match
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="font-bold text-xl mb-2">vs Real Madrid</div>
                    <div className="text-sm text-gray-600 mb-4">Feb 15, 2024 • Away</div>
                    <div className="flex justify-center space-x-6 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">35%</div>
                        <div className="text-xs text-gray-500">Win Chance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-500">28%</div>
                        <div className="text-xs text-gray-500">Draw Chance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">37%</div>
                        <div className="text-xs text-gray-500">Loss Chance</div>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                      Prepare Strategy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 mt-0">
            <div className="grid grid-cols-1 gap-6 h-full">
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5" />
                    Assistant Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Response Depth</label>
                        <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                          {responseDepth === 1 ? 'Brief' : responseDepth === 2 ? 'Medium' : 'Detailed'}
                        </span>
                      </div>
                      <Slider
                        value={[responseDepth]}
                        onValueChange={(value) => setResponseDepth(value[0] ?? 2)}
                        max={3}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Brief</span>
                        <span>Medium</span>
                        <span>Detailed</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Auto Analysis</h3>
                        <p className="text-sm text-gray-500">Automatically analyze team data</p>
                      </div>
                      <Switch
                        checked={autoAnalysis}
                        onCheckedChange={setAutoAnalysis}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Real-time Updates</h3>
                        <p className="text-sm text-gray-500">Get live data updates</p>
                      </div>
                      <Switch
                        checked={realTimeUpdates}
                        onCheckedChange={setRealTimeUpdates}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Confidence Threshold</h3>
                        <p className="text-sm text-gray-500">Minimum confidence level for AI responses</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Slider
                          value={confidenceThreshold}
                          onValueChange={(value) => setConfidenceThreshold(value)}
                          max={100}
                          min={0}
                        step={5}
                        className="w-32"
                      />
                      <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                        {confidenceThreshold[0]}%
                      </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAssistant;