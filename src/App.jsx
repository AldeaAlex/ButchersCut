
import { useState } from 'react';
import HeroPage from './pages/HeroPage';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';

export default function App(){
  const [page,setPage]=useState('hero');
  if(page==='booking') return <BookingPage onBack={()=>setPage('hero')} />;
  if(page==='admin') return <AdminPage onBack={()=>setPage('hero')} />;
  return <HeroPage onBook={()=>setPage('booking')} onAdmin={()=>setPage('admin')} />;
}
