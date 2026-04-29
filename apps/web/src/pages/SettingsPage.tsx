import { useNavigate } from 'react-router-dom';
import { SettingsModal } from '@/components/SettingsModal';

export function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="ambient-shell h-screen w-screen">
      <SettingsModal open onClose={() => navigate('/')} />
    </div>
  );
}
