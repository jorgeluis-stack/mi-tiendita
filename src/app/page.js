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

  // Productos de ejemplo por si la base de datos está vacía
  const sampleProducts = [
    { id: 'ex1', name: "Tomate (Ejemplo)", price: 0, unit: "kg", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300", category: "Verduras", isSample: true, benefits: "Ejemplo de beneficio", recipe: "Ejemplo de receta" },
    { id: 'ex2', name: "Plátano (Ejemplo)", price: 0, unit: "kg", image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300", category: "Frutas", isSample: true, benefits: "Ejemplo de beneficio", recipe: "Ejemplo de receta" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Si no hay productos en Firebase, usamos los de ejemplo
        const finalProducts = items.length > 0 ? items : sampleProducts;
        setProducts(finalProducts);
        setFilteredProducts(finalProducts);
      } catch (error) {
        setProducts(sampleProducts);
      }
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
    let mensaje = `Hola Super Smart! Mi pedido:\n${cart.map(i => `- ${i.quantity} ${i.unit} de ${i.name}`).join('\n')}\n*Total: $${total}*`;
    window.open(`https://wa.me/${numeroTienda}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const categories = ["Todos", "Frutas", "Verduras", "Abarrotes", "Lácteos", "Bebidas"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 font-sans text-slate-900">
      
      {/* Navbar con profundidad */}
      <nav className="bg-green-600 p-4 sticky top-0 z-20 shadow-[0_4px_20px_rgba(22,163,74,0.3)]">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex justify-between items-center text-white">
            <div>
              <h1 className="text-2xl font-black tracking-tighter italic">SUPER SMART</h1>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-[0.3em]">El súper en tu mano</p>
            </div>
            <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-green-500 rounded-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] border border-green-400">
              <ShoppingCart size={24} strokeWidth={2.5} />
              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-6 w-6 flex items-center justify-center font-black border-2 border-white animate-pulse">{cart.length}</span>}
            </button>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-green-600 transition-colors" size={18} />
            <input 
              type="text" placeholder="¿Qué estás buscando hoy?" 
              className="w-full bg-white p-3 pl-12 rounded-2xl text-sm font-medium shadow-[0_2px_10px_rgba(0,0,0,0.05)] outline-none focus:ring-2 focus:ring-green-400 transition-all text-black"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </nav>

      {/* Categorías con Relieve y Scroll Hint */}
      <div className="max-w-xl mx-auto overflow-x-auto p-4 flex gap-3 no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex-shrink-0
              ${category === cat 
                ? "bg-green-600 text-white shadow-[0_10px_20px_rgba(22,163,74,0.4)] scale-105 translate-y-[-2px]" 
                : "bg-white text-slate-400 shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-green-200"
              }`}
          >
            {cat}
          </button>
        ))}
        {/* Espaciador invisible para forzar el scroll al final */}
        <div className="flex-shrink-0 w-4"></div>
      </div>

      <main className="max-w-xl mx-auto p-4">
        {loading ? <div className="text-center py-20 font-black text-slate-300 animate-pulse">PREPARANDO FRESCHURA...</div> : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-[2.5rem] p-2 shadow-[0_8px_15px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col active:scale-95 transition-all relative">
                {p.isSample && <span className="absolute top-4 right-4 z-10 bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg">EJEMPLO</span>}
                <img src={p.image} className="h-32 w-full object-cover rounded-[2rem] mb-2" onClick={() => setSelectedProduct(p)} />
                <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-slate-800 text-[11px] uppercase leading-tight h-8 overflow-hidden line-clamp-2" onClick={() => setSelectedProduct(p)}>{p.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-black text-green-700 text-base">${p.price}<span className="text-[10px] opacity-50 font-bold">/{p.unit}</span></span>
                    <button onClick={() => addToCart(p)} className="bg-green-600 text-white w-9 h-9 rounded-2xl flex items-center justify-center shadow-[0_4px_10px_rgba(22,163,74,0.3)] active:bg-green-700"><Plus size={20} strokeWidth={3} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Discreto con acceso al Admin */}
      <footer className="max-w-xl mx-auto p-10 text-center space-y-4">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">Super Smart • Frescura Garantizada</p>
        <div className="flex justify-center items-center gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
            <a href="/admin" className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 px-3 py-1 rounded-full">
                <Settings size={12} /> Acceso Administrador
            </a>
        </div>
      </footer>

      {/* Los modales de Detalle y Carrito se mantienen igual (con los estilos mejorados de antes) */}
      {/* ... (Sección de selectedProduct y Carrito Modal que ya teníamos) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedProduct(null)}></div>
          <div className="bg-white w-full max-w-md rounded-t-[3rem] relative z-10 overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <img src={selectedProduct.image} className="w-full h-64 object-cover" />
            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white p-2 rounded-full border-2 border-white/50"><X size={24} strokeWidth={3} /></button>
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{selectedProduct.name}</h2>
                    <p className="text-2xl font-black text-green-600">${selectedProduct.price}/{selectedProduct.unit}</p>
                </div>
                <div className="space-y-4 mb-8">
                    <div className="bg-green-50 p-4 rounded-3xl border border-green-100 flex gap-4">
                        <Heart className="text-green-600 shrink-0" fill="currentColor" />
                        <div>
                            <p className="text-[10px] font-black text-green-800 uppercase mb-1">Beneficios</p>
                            <p className="text-xs text-green-700 font-medium leading-relaxed">{selectedProduct.benefits}</p>
                        </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-3xl border border-orange-100 flex gap-4">
                        <CookingPot className="text-orange-500 shrink-0" />
                        <div>
                            <p className="text-[10px] font-black text-orange-800 uppercase mb-1">Receta sugerida</p>
                            <p className="text-xs text-orange-700 font-medium leading-relaxed">{selectedProduct.recipe}</p>
                        </div>
                    </div>
                </div>
                <button onClick={() => {addToCart(selectedProduct); setSelectedProduct(null)}} className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-green-500/30">Agregar a mi compra</button>
            </div>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsCartOpen(false)}></div>
          <div className="bg-white w-[88%] max-w-sm h-full relative z-10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="font-black text-xl text-slate-900 tracking-tighter uppercase underline decoration-green-500 decoration-4">Mi Pedido</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 bg-slate-100 rounded-2xl"><X size={20} strokeWidth={3} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map(i => (
                <div key={i.id} className="flex gap-3 bg-slate-50 p-3 rounded-3xl border border-slate-100">
                  <img src={i.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-[11px] uppercase text-slate-700 leading-none">{i.name}</h4>
                        <span className="font-black text-slate-900">${(i.price*i.quantity).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2 bg-white rounded-xl px-2 py-1 shadow-sm border border-slate-100">
                            <button onClick={() => updateQuantity(i.id, -1)} className="text-slate-400 hover:text-red-500"><Minus size={14} strokeWidth={3} /></button>
                            <span className="text-xs font-black w-4 text-center">{i.quantity}</span>
                            <button onClick={() => updateQuantity(i.id, 1)} className="text-slate-400 hover:text-green-600"><Plus size={14} strokeWidth={3} /></button>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 border-t bg-white space-y-4">
                <div className="flex justify-between items-end"><span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total estimado</span><span className="text-3xl font-black text-slate-900 leading-none">${total.toFixed(2)}</span></div>
                <button onClick={handleCheckout} className="w-full bg-[#25D366] text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-green-500/40">Pedir por WhatsApp</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}