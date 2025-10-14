import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useSport } from '../contexts/SportContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { toast } from 'sonner';

const SelectSport = () => {
  const [selectedSport, setSelectedSport] = useState<'soccer' | 'futsal' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateSportPreference } = useAuth();
  const { setSport, completeSportSelection } = useSport();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSportSelection = async () => {
    if (!selectedSport || !user) {
      toast.error('Please select a sport');
      return;
    }

    setIsLoading(true);
    
    try {
      // Update sport preference in auth context
      const { error } = await updateSportPreference(selectedSport);
      
      if (error) {
        throw new Error(error);
      }

      // Update sport context
      setSport(selectedSport);
      completeSportSelection();
      
      toast.success(`${selectedSport === 'soccer' ? 'Football' : 'Futsal'} selected successfully!`);
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Sport selection error:', error);
      toast.error('Failed to save sport preference. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sports = [
    {
      id: 'soccer' as const,
      name: t('sport.soccer'),
      description: t('sport.soccer.description'),
      features: [
        t('sport.soccer.feature1'),
        t('sport.soccer.feature2'),
        t('sport.soccer.feature3'),
        t('sport.soccer.feature4')
      ],
      icon: '⚽',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'futsal' as const,
      name: t('sport.futsal'),
      description: t('sport.futsal.description'),
      features: [
        t('sport.futsal.feature1'),
        t('sport.futsal.feature2'),
        t('sport.futsal.feature3'),
        t('sport.futsal.feature4')
      ],
      icon: '🏟️',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/01b5bf86-f2e7-42cd-9465-4d0bb347d2ea.png" 
            alt="Statsor" 
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold text-gray-900">Statsor</span>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('sport.selection.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('sport.selection.subtitle')}
            </p>
            {user && (
              <p className="text-lg text-gray-500 mt-4">
                Welcome back, <span className="font-semibold">{user.name}</span>!
              </p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {sports.map((sport, index) => (
              <motion.div
                key={sport.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    selectedSport === sport.id
                      ? `ring-4 ring-primary shadow-xl scale-105 ${sport.bgColor} ${sport.borderColor} border-2`
                      : 'hover:scale-102 border-gray-200'
                  }`}
                  onClick={() => setSelectedSport(sport.id)}
                >
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${sport.color} flex items-center justify-center text-4xl shadow-lg`}>
                        {sport.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {sport.name}
                      </h3>
                      <p className="text-gray-600">
                        {sport.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {sport.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${sport.color} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {selectedSport === sport.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20"
                      >
                        <p className="text-sm text-primary font-medium text-center">
                          {t('sport.selection.selected')}
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Button
              onClick={handleSportSelection}
              disabled={!selectedSport || isLoading}
              className="px-12 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                t('sport.selection.confirm')
              )}
            </Button>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500">
              Don't worry, you can change this later in your settings
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SelectSport;