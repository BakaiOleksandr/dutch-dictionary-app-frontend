import {useNavigate} from 'react-router-dom';
import { FcLeft } from "react-icons/fc"
export default function BackButton() {
  const navigate = useNavigate();

  return <button style={{padding:'0.2rem 0.6rem'}} onClick={() => navigate('/')}><FcLeft size={30}/></button>;
}
