"use client";
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, Edit, Save, X, Tag, LayoutDashboard } from 'lucide-react';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', unit: 'kg', category: 'Frutas y Verduras', image: '', benefits: '', recipe: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const categoriasDisponibles = ["Frutas y Verduras", "Abarrotes", "Enfriadores", "Frituras"];

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, "productos", editingId), form);
      } else {
        await addDoc(collection(db, "productos"), form);
      }
      setForm({ name: '', price: '', unit: 'kg', category: 'Frutas', image: '', benefits: '', recipe: '' });
      setEditingId(null);
      fetchProducts();
      alert("¡Inventario actualizado!");
    } catch (e) { alert("Error: " + e.message); }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20 font-sans max-w-xl mx-auto text-black overflow-x-hidden">
      <div className="flex items-center justify-between mb-8 px-2">
        <h1 className="text-xl font-black uppercase tracking-tighter italic text-slate-800 flex items-center gap-2">
            <LayoutDashboard size={24} className="text-green-600" /> Control
        </h1>
        <a href="/" className="bg-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm border border-slate-200">← Tienda</a>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-[2.5rem] shadow-xl border-2 border-green-500 mb-8 space-y-4">
        <h2 className="font-black uppercase text-[10px] text-green-600 tracking-[0.3em] mb-2 px-1">
            {editingId ? '⚡ Editando' : '🍏 Nuevo Artículo'}
        </h2>
        
        {/* Nombre */}
        <input type="text" placeholder="Nombre del producto" className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-sm outline-none focus:ring-2 focus:ring-green-400" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        
        {/* PRECIO Y UNIDAD - CORREGIDO PARA MÓVIL */}
        <div className="grid grid-cols-3 gap-2">
          <input 
            type="number" 
            placeholder="Precio" 
            className="col-span-2 p-4 rounded-2xl bg-slate-50 border-none font-bold text-sm outline-none focus:ring-2 focus:ring-green-400" 
            value={form.price} 
            onChange={e => setForm({...form, price: e.target.value})} 
            required 
          />
          <select 
            className="col-span-1 p-4 rounded-2xl bg-slate-50 border-none font-bold text-xs bg-white outline-none focus:ring-2 focus:ring-green-400 appearance-none text-center" 
            value={form.unit} 
            onChange={e => setForm({...form, unit: e.target.value})}
          >
            <option value="kg">kg</option>
            <option value="pz">pz</option>
            <option value="litro">litro</option>
            <option value="manojo">manojo</option>
          </select>
        </div>

        {/* Clasificación */}
        <div className="space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase px-3 tracking-widest">Clasificación:</p>
          <select 
            className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-sm bg-white outline-none focus:ring-2 focus:ring-green-400" 
            value={form.category} 
            onChange={e => setForm({...form, category: e.target.value})}
          >
            {categoriasDisponibles.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Imagen */}
        <input type="text" placeholder="URL de la imagen" className="w-full p-4 rounded-2xl bg-slate-50 border-none text-[10px]" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required />
        
        {/* Salud y Receta */}
        <textarea placeholder="Beneficios..." className="w-full p-4 rounded-2xl bg-slate-50 border-none text-xs h-16" value={form.benefits} onChange={e => setForm({...form, benefits: e.target.value})} />
        <textarea placeholder="Receta..." className="w-full p-4 rounded-2xl bg-slate-50 border-none text-xs h-16" value={form.recipe} onChange={e => setForm({...form, recipe: e.target.value})} />
        
        <button type="submit" className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-green-200 active:scale-95 transition-all">
          {editingId ? 'Guardar Cambios' : 'Subir al Inventario'}
        </button>
      </form>

      {/* Lista de productos */}
      <div className="space-y-3 px-1">
        <h3 className="font-black text-slate-300 uppercase text-[9px] tracking-widest px-2 italic">Productos en línea ({products.length})</h3>
        {products.map(p => (
          <div key={p.id} className="bg-white p-3 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
            <img src={p.image} className="w-14 h-14 rounded-2xl object-cover bg-slate-100 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[8px] font-black text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded-full">{p.category}</span>
              <p className="font-black text-slate-800 text-xs mt-1 truncate">{p.name}</p>
              <p className="font-bold text-slate-400 text-[10px]">${p.price}/{p.unit}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => {setEditingId(p.id); setForm(p); window.scrollTo({top: 0, behavior: 'smooth'});}} className="p-2.5 text-blue-500 bg-blue-50 rounded-xl"><Edit size={16}/></button>
              <button onClick={() => { if(confirm("¿Borrar?")) deleteDoc(doc(db, "productos", p.id)).then(()=>fetchProducts()) }} className="p-2.5 text-red-500 bg-red-50 rounded-xl"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}