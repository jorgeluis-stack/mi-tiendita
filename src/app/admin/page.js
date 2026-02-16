"use client";
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase'; // Ajustamos la ruta para llegar a lib
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', unit: 'kg', category: 'Abarrotes', image: '', benefits: '', recipe: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error("Error al leer productos: ", e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, "productos", editingId), form);
        alert("¡Producto actualizado!");
      } else {
        await addDoc(collection(db, "productos"), form);
        alert("¡Producto agregado!");
      }
      setForm({ name: '', price: '', unit: 'kg', category: 'Abarrotes', image: '', benefits: '', recipe: '' });
      setEditingId(null);
      fetchProducts();
    } catch (e) {
      alert("Error al guardar: " + e.message);
    }
  };

  const deleteProduct = async (id) => {
    if (confirm("¿Seguro que quieres borrar este producto?")) {
      await deleteDoc(doc(db, "productos", id));
      fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-20 font-sans max-w-2xl mx-auto text-black">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black uppercase tracking-tighter">Panel de Inventario</h1>
        <a href="/" className="text-xs font-bold text-green-600 border-b-2 border-green-600">Ver Tienda →</a>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-green-500 mb-8 space-y-4">
        <h2 className="font-black uppercase text-[10px] text-green-600 tracking-[0.2em]">
            {editingId ? '⚡ Editando Producto' : '🍏 Agregar Nuevo'}
        </h2>
        
        <input type="text" placeholder="Nombre del producto" className="w-full p-3 rounded-xl bg-gray-50 border-none text-sm font-bold" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        
        <div className="flex gap-2">
          <input type="number" placeholder="Precio" className="flex-1 p-3 rounded-xl bg-gray-50 border-none text-sm font-bold" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          <select className="p-3 rounded-xl bg-gray-50 border-none text-sm font-bold" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
            <option value="kg">kg</option>
            <option value="pz">pz</option>
            <option value="litro">litro</option>
          </select>
        </div>

        <input type="text" placeholder="URL de la imagen (Link)" className="w-full p-3 rounded-xl bg-gray-50 border-none text-[10px]" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required />
        <textarea placeholder="Beneficios (salud)..." className="w-full p-3 rounded-xl bg-gray-50 border-none text-xs h-16" value={form.benefits} onChange={e => setForm({...form, benefits: e.target.value})} />
        <textarea placeholder="Receta sugerida..." className="w-full p-3 rounded-xl bg-gray-50 border-none text-xs h-16" value={form.recipe} onChange={e => setForm({...form, recipe: e.target.value})} />
        
        <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase shadow-lg active:scale-95 transition-all text-xs tracking-widest">
          {editingId ? 'Guardar Cambios' : 'Publicar en la Tienda'}
        </button>
      </form>

      {/* Lista de productos en la base de datos */}
      <div className="space-y-3">
        <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-widest px-2">Productos actuales</h3>
        {loading ? <p className="text-center font-bold text-gray-400">Cargando base de datos...</p> : 
          products.map(p => (
            <div key={p.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
              <div className="flex-1">
                <p className="font-bold text-[10px] uppercase text-gray-800 leading-none">{p.name}</p>
                <p className="font-black text-green-600 text-sm">${p.price}/{p.unit}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => {setEditingId(p.id); setForm(p)}} className="p-2 text-blue-500 bg-blue-50 rounded-lg"><Edit size={16}/></button>
                <button onClick={() => deleteProduct(p.id)} className="p-2 text-red-500 bg-red-50 rounded-lg"><Trash2 size={16}/></button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}