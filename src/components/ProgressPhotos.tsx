import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Camera, Image as ImageIcon, Trash2, Calendar, TrendingUp, Download } from 'lucide-react';
import { UserProfile } from '../App';
import { toast } from 'sonner@2.0.3';

interface ProgressPhoto {
  id: string;
  url: string;
  date: string;
  weight?: number;
  notes?: string;
}

interface ProgressPhotosProps {
  profile: UserProfile;
  onBack: () => void;
}

export function ProgressPhotos({ profile, onBack }: ProgressPhotosProps) {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const text = profile.language === 'sw' ? {
    title: 'Picha za Maendeleo',
    uploadPhoto: 'Pakia Picha',
    takePhoto: 'Chukua Picha',
    noPhotos: 'Hakuna picha bado',
    startTracking: 'Anza kufuatilia maendeleo yako',
    date: 'Tarehe',
    weight: 'Uzito',
    notes: 'Maelezo',
    save: 'Hifadhi',
    cancel: 'Ghairi',
    delete: 'Futa',
    compare: 'Linganisha',
    downloadReport: 'Pakua Ripoti',
    progress: 'Maendeleo',
    kg: 'kg',
    confirmDelete: 'Je, una uhakika unataka kufuta picha hii?',
    photosCount: 'picha',
  } : {
    title: 'Progress Photos',
    uploadPhoto: 'Upload Photo',
    takePhoto: 'Take Photo',
    noPhotos: 'No photos yet',
    startTracking: 'Start tracking your progress',
    date: 'Date',
    weight: 'Weight',
    notes: 'Notes',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    compare: 'Compare',
    downloadReport: 'Download Report',
    progress: 'Progress',
    kg: 'kg',
    confirmDelete: 'Are you sure you want to delete this photo?',
    photosCount: 'photos',
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setSelectedPhoto({
          id: Date.now().toString(),
          url,
          date: new Date().toISOString(),
          weight: weight ? parseFloat(weight) : undefined,
          notes: notes || undefined,
        });
        setShowUpload(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (selectedPhoto) {
      const photoToSave = {
        ...selectedPhoto,
        weight: weight ? parseFloat(weight) : undefined,
        notes: notes || undefined,
      };
      setPhotos([photoToSave, ...photos]);
      setSelectedPhoto(null);
      setShowUpload(false);
      setWeight('');
      setNotes('');
      toast.success(profile.language === 'sw' ? 'Picha imehifadhiwa!' : 'Photo saved!');
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    if (window.confirm(text.confirmDelete)) {
      setPhotos(photos.filter(p => p.id !== photoId));
      toast.success(profile.language === 'sw' ? 'Picha imefutwa' : 'Photo deleted');
    }
  };

  const getProgressStats = () => {
    if (photos.length < 2) return null;

    const photosWithWeight = photos.filter(p => p.weight);
    if (photosWithWeight.length < 2) return null;

    const earliest = photosWithWeight[photosWithWeight.length - 1];
    const latest = photosWithWeight[0];
    const weightChange = (latest.weight || 0) - (earliest.weight || 0);

    return {
      totalPhotos: photos.length,
      weightChange,
      daysTracking: Math.floor(
        (new Date(latest.date).getTime() - new Date(earliest.date).getTime()) / (1000 * 60 * 60 * 24)
      ),
    };
  };

  const stats = getProgressStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0A1F0F] to-[#000000] text-white pb-20">
      {/* Header */}
      <div className="bg-[#0A1F0F]/80 backdrop-blur-md border-b border-[#1EB53A]/20 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{text.title}</h1>
              <p className="text-sm text-white/60">
                {photos.length} {text.photosCount}
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-gradient-to-r from-[#1EB53A] to-emerald-500 rounded-2xl hover:shadow-lg transition-all"
            >
              <Camera className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Progress Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#1EB53A]/20 to-emerald-500/10 p-6 rounded-3xl border border-[#1EB53A]/30"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#1EB53A]" />
              <h3 className="text-lg font-bold text-white">{text.progress}</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalPhotos}</div>
                <div className="text-xs text-white/60">{text.photosCount}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)}
                </div>
                <div className="text-xs text-white/60">{text.kg}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.daysTracking}</div>
                <div className="text-xs text-white/60">
                  {profile.language === 'sw' ? 'siku' : 'days'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Upload Modal */}
        {showUpload && selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#0A1F0F] border border-white/10 rounded-3xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-white mb-4">{text.uploadPhoto}</h2>
              
              <img
                src={selectedPhoto.url}
                alt="Progress"
                className="w-full aspect-[3/4] object-cover rounded-2xl mb-4"
              />

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">{text.weight}</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="70"
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#1EB53A]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">{text.notes}</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={profile.language === 'sw' ? 'Ongeza maelezo...' : 'Add notes...'}
                    rows={3}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#1EB53A] resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowUpload(false);
                      setSelectedPhoto(null);
                      setWeight('');
                      setNotes('');
                    }}
                    className="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all"
                  >
                    {text.cancel}
                  </button>
                  <button
                    onClick={handleSavePhoto}
                    className="flex-1 py-3 bg-gradient-to-r from-[#1EB53A] to-emerald-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
                  >
                    {text.save}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Photo Grid */}
        {photos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#1EB53A]/20 to-emerald-500/10 rounded-full flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-[#1EB53A]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{text.noPhotos}</h3>
            <p className="text-white/60 mb-6">{text.startTracking}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 bg-gradient-to-r from-[#1EB53A] to-emerald-500 text-white rounded-full font-bold hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              {text.takePhoto}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-black/30 border border-white/10">
                  <img
                    src={photo.url}
                    alt={`Progress ${new Date(photo.date).toLocaleDateString()}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-xs text-white/80 mb-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(photo.date).toLocaleDateString()}
                      </div>
                      {photo.weight && (
                        <div className="text-sm font-bold text-white">
                          {photo.weight} {text.kg}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {photo.notes && (
                  <p className="text-xs text-white/60 mt-2 line-clamp-2">{photo.notes}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Compare Button */}
        {photos.length >= 2 && (
          <button
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
          >
            {text.compare}
          </button>
        )}
      </div>
    </div>
  );
}
