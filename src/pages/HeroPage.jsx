
import PrimaryButton from '../components/common/PrimaryButton';
export default function HeroPage({onBook,onAdmin}){
 return <div><h1>Hero</h1><PrimaryButton onClick={onBook}>Rezervă</PrimaryButton></div>;
}
