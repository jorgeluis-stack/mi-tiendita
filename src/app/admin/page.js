"use client";
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, Edit, Save, X, Tag } from 'lucide-react';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', unit: 'kg', category: 'Frutas', image: '', benefits: '', recipe: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lista de categorías exactas para que coincidan con la tienda
  const categoriasDisponibles = ["Frutas", "Verduras", "Abarrotes", "Lácteos", "Bebidas"];

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
      alert("¡Guardado correctamente!");
    } catch (e) { alert("Error: " + e.message); }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20 font-sans max-w-xl mx-auto text-black text-black">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tighter italic text-slate-800">Panel de Control</h1>
        <a href="/" className="bg-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-200">← Ir a la Tienda</a>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-xl border-2 border-green-500 mb-8 space-y-4">
        <h2 className="font-black uppercase text-[10px] text-green-600 tracking-[0.3em] mb-4 flex items-center gap-2">
            <Tag size={14} /> {editingId ? 'Editando Artículo' : 'Nuevo Artículo'}
        </h2>
        
        {/* Nombre */}
        <input type="text" placeholder="Nombre (Ej: Tomate Saladette)" className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        
        {/* Precio y Unidad */}
        <div className="flex gap-2 text-black">
          <input type="number" placeholder="Precio" className="flex-1 p-4 rounded-2xl bg-slate-50 border-none font-bold text-sm" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          <select className="p-4 rounded-2xl bg-slate-50 border-none font-bold text-sm bg-white" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
            <option value="kg">kg</option>
            <option value="pz">pz</option>
            <option value="litro">litro</option>
            <option value="manojo">manojo</option>
          </select>
        </div>

        {/* SELECTOR DE CATEGORÍA - AQUÍ ESTÁ LA CLAVE */}
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase px-2 tracking-widest text-black">Clasificación:</p>
          <select 
            className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-sm bg-white" 
            value={form.category} 
            onChange={e => setForm({...form, category: e.target.value})}
          >
            {categoriasDisponibles.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Imagen */}
        <input type="text" placeholder="URL de la imagen (Link)" className="w-full p-4 rounded-2xl bg-slate-50 border-none text-[10px]" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required />
        
        {/* Salud y Receta */}
        <textarea placeholder="Beneficios saludables..." className="w-full p-4 rounded-2xl bg-slate-50 border-none text-xs h-16" value={form.benefits} onChange={e => setForm({...form, benefits: e.target.value})} />
        <textarea placeholder="Receta paso a paso..." className="w-full p-4 rounded-2xl bg-slate-50 border-none text-xs h-16" value={form.recipe} onChange={e => setForm({...form, recipe: e.target.value})} />
        
        <button type="submit" className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-green-200 active:scale-95 transition-all">
          {editingId ? 'Guardar Cambios' : 'Subir al Inventario'}
        </button>
      </form>

      {/* Lista de productos actuales */}
      <div className="space-y-3">
        <h3 className="font-black text-slate-300 uppercase text-[10px] tracking-widest px-2">Inventario en Vivo</h3>
        {products.map(p => (
          <div key={p.id} className="bg-white p-3 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
            <img src={p.image} className="w-14 h-14 rounded-2xl object-cover bg-slate-100" />
            <div className="flex-1">
              <span className="text-[9px] font-black text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded-full">{p.category}</span>
              <p className="font-black text-slate-800 text-sm mt-1">{p.name}</p>
              <p className="font-bold text-slate-400 text-xs">${p.price}/{p.unit}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => {setEditingId(p.id); setForm(p)}} className="p-2.5 text-blue-500 bg-blue-50 rounded-xl"><Edit size={16}/></button>
              <button onClick={() => { if(confirm("¿Borrar?")) deleteDoc(doc(db, "productos", p.id)).then(()=>fetchProducts()) }} className="p-2.5 text-red-500 bg-red-50 rounded-xl"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}