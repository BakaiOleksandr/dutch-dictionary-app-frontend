import { useNavigate } from 'react-router-dom';
import { FcLeft } from "react-icons/fc";

export default function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    // Если есть история, вернуться назад, иначе на главную
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/'); 
    }
  };

  return (
    <button
      style={{ padding: '0.2rem 0.6rem' }}
      onClick={handleBack}
    >
      <FcLeft size={30} />
    </button>
  );
}
