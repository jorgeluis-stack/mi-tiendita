"use client";
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ShoppingCart, Plus, Minus, X, Heart, CookingPot, Search, Settings } from 'lucide-react';

export default function Home() {
  const { cart, addToCart, updateQuantity, total, isCartOpen, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Todos");

  const sampleProducts = [
    { id: 'ex1', name: "Tomate (Ejemplo)", price: 25, unit: "kg", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300", category: "Verduras", isSample: true, benefits: "Rico en antioxidantes y protege tu corazón.", recipe: "Pícalo con cebolla y cilantro para un Pico de Gallo fresco. También puedes asarlo para una salsa casera deliciosa y saludable." },
    { id: 'ex2', name: "Plátano (Ejemplo)", price: 18, unit: "kg", image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300", category: "Frutas", isSample: true, benefits: "Energía inmediata y alto en potasio.", recipe: "Pícalo en tu avena matutina o haz un licuado con leche fría y canela para empezar el día con toda la fuerza." },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const finalProducts = items.length > 0 ? items : sampleProducts;
        setProducts(finalProducts);
        setFilteredProducts(finalProducts);
      } catch (error) { setProducts(sampleProducts); }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (category !== "Todos") result = result.filter(p => p.category === category);
    if (searchTerm) result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredProducts(result);
  }, [searchTerm, category, products]);

  const handleCheckout = () => {
    const numeroTienda = "5215555555555"; 
    let mensaje = `Hola! Mi pedido:\n${cart.map(i => `- ${i.quantity} ${i.unit} de ${i.name}`).join('\n')}\n*Total: $${total}*`;
    window.open(`https://wa.me/${numeroTienda}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const categories = ["Todos", "Frutas", "Verduras", "Abarrotes", "Lácteos", "Bebidas"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 font-sans text-slate-900">
      
      {/* Navbar Superior */}
      <nav className="bg-green-600 p-4 sticky top-0 z-20 shadow-lg">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex justify-between items-center text-white">
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">SUPER SMART</h1>
            <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 bg-green-500 rounded-2xl shadow-inner border border-green-400">
              <ShoppingCart size={22} strokeWidth={2.5} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full h-5 w-5 flex items-center justify-center font-black border-2 border-white">{cart.length}</span>}
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-3 text-slate-400" size={16} />
            <input 
              type="text" placeholder="¿Qué necesitas hoy?" 
              className="w-full bg-white p-2.5 pl-11 rounded-2xl text-sm font-medium shadow-sm outline-none text-black"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </nav>

      {/* Categorías */}
      <div className="max-w-xl mx-auto overflow-x-auto p-4 flex gap-3 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat} onClick={() => setCategory(cat)}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0
              ${category === cat ? "bg-green-600 text-white shadow-lg scale-105" : "bg-white text-slate-400 border border-slate-100"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Productos */}
      <main className="max-w-xl mx-auto p-4 grid grid-cols-2 gap-4">
        {loading ? <div className="col-span-2 text-center py-20 font-black text-slate-300 animate-pulse uppercase">Cargando...</div> : (
          filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100 flex flex-col active:scale-95 transition-all relative">
              {p.isSample && <span className="absolute top-4 right-4 z-10 bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-full">MUESTRA</span>}
              <img src={p.image} className="h-28 w-full object-cover rounded-[1.5rem] mb-2" onClick={() => setSelectedProduct(p)} />
              <div className="px-1 pb-1 flex-1 flex flex-col justify-between text-center">
                <h3 className="font-bold text-slate-800 text-[10px] uppercase leading-tight h-8 line-clamp-2" onClick={() => setSelectedProduct(p)}>{p.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-black text-green-700 text-sm">${p.price}</span>
                  <button onClick={() => addToCart(p)} className="bg-green-600 text-white w-8 h-8 rounded-xl flex items-center justify-center shadow-md active:bg-green-700"><Plus size={16} strokeWidth={3} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* MODAL DETALLES - CORREGIDO CON SCROLL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          
          <div className="bg-white w-full max-w-md h-[85vh] rounded-t-[3rem] relative z-10 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Indicador visual de deslizar (Handle) */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-4 shrink-0"></div>
            
            {/* Botón cerrar flotante */}
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-6 bg-slate-100 p-2 rounded-full text-slate-800 z-20"><X size={20} strokeWidth={3} /></button>

            {/* AREA DESLIZABLE (SCROLL) */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 scroll-smooth">
                <img src={selectedProduct.image} className="w-full h-56 object-cover rounded-3xl shadow-sm" />
                
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-slate-900 uppercase leading-none">{selectedProduct.name}</h2>
                    <p className="text-2xl font-black text-green-600">${selectedProduct.price}/{selectedProduct.unit}</p>
                </div>

                <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-3xl border border-green-100 flex gap-4">
                        <Heart className="text-green-600 shrink-0" fill="currentColor" size={20} />
                        <div>
                            <p className="text-[10px] font-black text-green-800 uppercase mb-1">Beneficios</p>
                            <p className="text-xs text-green-700 font-medium leading-relaxed">{selectedProduct.benefits || "Cargando información..."}</p>
                        </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-3xl border border-orange-100 flex gap-4">
                        <CookingPot className="text-orange-500 shrink-0" size={20} />
                        <div>
                            <p className="text-[10px] font-black text-orange-800 uppercase mb-1">Receta sugerida</p>
                            <p className="text-xs text-orange-700 font-medium leading-relaxed">{selectedProduct.recipe || "Cargando receta..."}</p>
                        </div>
                    </div>
                    {/* Espacio extra para asegurar que el scroll pase debajo del botón fijo */}
                    <div className="h-20"></div>
                </div>
            </div>

            {/* BOTÓN AGREGAR FIJO ABAJO */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-10">
                <button 
                  onClick={() => {addToCart(selectedProduct); setSelectedProduct(null)}} 
                  className="w-full bg-green-600 text-white py-4 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-green-500/40 active:scale-95 transition-all"
                >
                  Agregar a mi compra
                </button>
            </div>
          </div>
        </div>
      )}

      {/* CARRITO MODAL (Mantenemos tu diseño compacto) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsCartOpen(false)}></div>
          <div className="bg-white w-[85%] max-w-sm h-full relative z-10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-black text-sm text-gray-900 uppercase">Mi Carrito</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 bg-white rounded-xl border border-gray-200"><X size={18} strokeWidth={3} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
              {cart.map(i => (
                <div key={i.id} className="flex gap-2 border-b border-gray-50 pb-2">
                  <img src={i.image} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-[10px] text-gray-800 uppercase">{i.name}</h4>
                        <span className="font-black text-gray-900 text-xs">${(i.price*i.quantity).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                            <button onClick={() => updateQuantity(i.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-md border border-gray-100 shadow-sm"><Minus size={12} strokeWidth={3} /></button>
                            <span className="text-xs font-black w-5 text-center">{i.quantity}</span>
                            <button onClick={() => updateQuantity(i.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-md border border-gray-100 shadow-sm"><Plus size={12} strokeWidth={3} /></button>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t bg-gray-50 space-y-3">
                <div className="flex justify-between items-center mb-2 px-1 font-black text-black"><span className="text-[10px] text-gray-400 font-bold uppercase">Total:</span><span className="text-xl">${total.toFixed(2)}</span></div>
                <button onClick={handleCheckout} className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-green-500/20 active:scale-95 transition-all">Pedir por WhatsApp</button>
                <button onClick={() => setIsCartOpen(false)} className="w-full bg-white text-gray-500 py-3 rounded-xl font-bold text-[10px] uppercase border border-gray-200">← Seguir comprando</button>
            </div>
          </div>
        </div>
      )}

      {/* Acceso al Admin */}
      <footer className="max-w-xl mx-auto p-10 text-center">
        <a href="/admin" className="opacity-20 flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:opacity-100 transition-all">
          <Settings size={12} /> Acceso Administrador
        </a>
      </footer>

    </div>
  );
}