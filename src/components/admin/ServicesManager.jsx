import React, { useState } from 'react';
import PrimaryButton from '../common/PrimaryButton';
import { Plus, Edit2, Check, Trash2, Power, Scissors } from 'lucide-react';

export default function ServicesManager({ services = [], onAddService, onUpdateService, onDeleteService }) {
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState(30);
  const [newServicePrice, setNewServicePrice] = useState(50);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;

    const newService = {
      id: Date.now(),
      name: newServiceName,
      description: newServiceDesc,
      dur: `${newServiceDuration} min`,
      durationMinutes: Number(newServiceDuration),
      price: Number(newServicePrice),
      isActive: true
    };

    onAddService(newService);
    setNewServiceName('');
    setNewServiceDesc('');
    setNewServiceDuration(30);
    setNewServicePrice(50);
  };

  const startEdit = (service) => {
    setEditingId(service.id);
    setEditForm({
      name: service.name,
      description: service.description || '',
      durationMinutes: service.durationMinutes || 30,
      price: service.price || 50
    });
  };

  const saveEdit = (id) => {
    onUpdateService(id, {
      ...editForm,
      dur: `${editForm.durationMinutes} min`,
      durationMinutes: Number(editForm.durationMinutes),
      price: Number(editForm.price)
    });
    setEditingId(null);
  };

  const toggleActive = (service) => {
    onUpdateService(service.id, {
      isActive: service.isActive !== false ? false : true
    });
  };

  return (
    <div className="space-y-8">
      {/* Secțiunea 1: Adăugare Serviciu Nou */}
      <div className="bg-[#181818] border border-white/10 rounded-sm p-6 sm:p-8 shadow-xl">
        <div className="border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2 text-[#c59d5f] text-xs font-semibold uppercase tracking-wider mb-1">
            <Plus size={15} /> Configurare
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">
            Adaugă serviciu nou
          </h3>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Serviciul va fi disponibil instantaneu clienților în formularul de programare online.
          </p>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                Nume serviciu *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Tuns + Spălat + Barbă"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                className="w-full bg-[#222222] border border-white/10 rounded-sm py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#c59d5f]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                  Durată (min) *
                </label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  required
                  value={newServiceDuration}
                  onChange={(e) => setNewServiceDuration(e.target.value)}
                  className="w-full bg-[#222222] border border-white/10 rounded-sm py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#c59d5f]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                  Preț (lei) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  className="w-full bg-[#222222] border border-white/10 rounded-sm py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#c59d5f]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
              Descriere
            </label>
            <input
              type="text"
              placeholder="Ex: Tuns complet, aranjat barbă cu prosop cald și finisare..."
              value={newServiceDesc}
              onChange={(e) => setNewServiceDesc(e.target.value)}
              className="w-full bg-[#222222] border border-white/10 rounded-sm py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#c59d5f]"
            />
          </div>

          <div className="pt-2">
            <PrimaryButton type="submit" size="sm">
              <Plus size={15} className="mr-1.5" /> ADAUGĂ SERVICIUL
            </PrimaryButton>
          </div>
        </form>
      </div>

      {/* Secțiunea 2: Servicii Existente */}
      <div className="bg-[#181818] border border-white/10 rounded-sm p-4 sm:p-8 shadow-xl space-y-5 sm:space-y-6">
        <div className="border-b border-white/10 pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">
              Servicii existente
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 font-light">
              Modifică tarifele, duratele sau activează/dezactivează serviciile oferite.
            </p>
          </div>
          <span className="text-xs font-mono text-[#c59d5f] shrink-0">
            {services.length} servicii
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
          {services.map((srv) => {
            const isEditing = editingId === srv.id;
            const isActive = srv.isActive !== false;

            return (
              <div
                key={srv.id}
                className={`border p-4 sm:p-5 rounded-md transition-all ${
                  isActive
                    ? 'bg-[#1c1c1c] border-white/10'
                    : 'bg-[#151515] border-white/5 opacity-60'
                }`}
              >
                {isEditing ? (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Nume serviciu</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full bg-[#242424] border border-white/20 p-2 text-sm text-white rounded min-h-[40px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Durată (min)</label>
                          <input
                            type="number"
                            value={editForm.durationMinutes}
                            onChange={(e) => setEditForm({ ...editForm, durationMinutes: e.target.value })}
                            className="w-full bg-[#242424] border border-white/20 p-2 text-sm text-white rounded min-h-[40px]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Preț (lei)</label>
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            className="w-full bg-[#242424] border border-white/20 p-2 text-sm text-white rounded min-h-[40px]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Descriere</label>
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full bg-[#242424] border border-white/20 p-2 text-sm text-white rounded min-h-[40px]"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => saveEdit(srv.id)}
                        className="px-4 py-2 bg-[#c59d5f] text-black font-bold text-xs rounded hover:bg-[#b08745] active:scale-95"
                      >
                        Salvează
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-white/10 text-white text-xs rounded hover:bg-white/20 active:scale-95"
                      >
                        Anulează
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Scissors size={14} className="text-[#c59d5f] -rotate-45 shrink-0" />
                        <h4 className="font-serif text-base sm:text-lg font-bold text-white">
                          {srv.name}
                        </h4>
                        <span
                          className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold ${
                            isActive
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {isActive ? 'Activ' : 'Inactiv'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 font-light">
                        {srv.description || 'Fără descriere specificată.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <span className="font-serif text-lg sm:text-xl font-bold text-[#c59d5f] block leading-none">
                          {srv.price} lei
                        </span>
                        <span className="text-[11px] text-gray-400 mt-0.5 block">
                          {srv.dur || `${srv.durationMinutes} min`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                        <button
                          onClick={() => startEdit(srv)}
                          className="p-2 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                          title="Editează serviciul"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => toggleActive(srv)}
                          className={`p-2 rounded transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
                            isActive
                              ? 'text-emerald-400 hover:text-amber-400'
                              : 'text-gray-500 hover:text-emerald-400'
                          }`}
                          title={isActive ? 'Dezactivează serviciul' : 'Activează serviciul'}
                        >
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteService(srv.id)}
                          className="p-2 rounded text-gray-500 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                          title="Șterge definitiv"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
