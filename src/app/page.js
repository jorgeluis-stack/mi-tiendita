"use client";
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ShoppingCart, Plus, Minus, X, Heart, CookingPot, Search } from 'lucide-react';

export default function Home() {
  const { cart, addToCart, updateQuantity, clearCart, total, isCartOpen, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Todos");

  // Productos de muestra por si la base de datos está vacía
  const sampleProducts = [
    { id: 'ex1', name: "Limón Colima (Ejemplo)", price: 35, unit: "kg", image: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=400", category: "Verduras", isSample: true, benefits: "Rico en Vitamina C, ayuda a la digestión y fortalece el sistema inmunológico.", recipe: "Pie de Limón Clásico: Mezcla leche condensada con jugo de limón, vierte sobre una base de galleta y refrigera. ¡Delicioso!" },
    { id: 'ex2', name: "Mango Ataulfo (Ejemplo)", price: 45, unit: "kg", image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400", category: "Frutas", isSample: true, benefits: "Alto contenido de fibra y vitamina A. Mejora la salud de la piel.", recipe: "Smoothie de Mango: Licúa mango congelado con yogurt griego y un toque de miel." },
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
    const numeroTienda = "529361111815";
    
    // Usamos caracteres de texto sólido que no se rompen
    const bullet = ">>"; 
    const line = "--------------------------";

    const mensaje =
      `*PEDIDO SUPER SMART*\n` +
      `${line}\n` +
      cart.map(i => `  ${i.quantity} ${i.unit} de ${i.name} ($${(i.price * i.quantity).toFixed(0)})`).join('\n') + `\n` +
      `${line}\n` +
      `*TOTAL: $${total.toFixed(2)}*\n\n` +
      `${bullet} *PAGO RÁPIDO (BBVA):* 0404040404\n\n` +
      `${bullet} *¡AHORRA TIEMPO!*\n` +
      `Compra en línea y recoge de inmediato en caja.\n\n` +
      `${bullet} *Sucursal:* San Carlos.`;

    const url = `https://wa.me/${numeroTienda}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');

    clearCart();
    setIsCartOpen(false);
  };

  const categories = ["Todos", "Frutas y Verduras", "Abarrotes", "Enfriadores", "Frituras"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 font-sans text-slate-900">
      
      {/* NAVBAR */}
      <nav className="bg-green-600 p-4 sticky top-0 z-20 shadow-lg">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex justify-between items-center text-white">
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none text-white">SUPER SMART</h1>
            <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 bg-green-500 rounded-2xl border border-green-400 shadow-inner">
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

      {/* CATEGORÍAS */}
      <div className="max-w-xl mx-auto overflow-x-auto p-4 flex gap-3 no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat} onClick={() => setCategory(cat)}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0
              ${category === cat ? "bg-green-600 text-white shadow-[0_8px_15px_rgba(22,163,74,0.4)] scale-105" : "bg-white text-slate-400 border border-slate-100 shadow-sm"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID DE PRODUCTOS */}
      <main className="max-w-xl mx-auto p-4 grid grid-cols-2 gap-4">
        {loading ? <div className="col-span-2 text-center py-20 font-black text-slate-300 animate-pulse">CARGANDO...</div> : (
          filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100 flex flex-col active:scale-95 transition-all relative">
              {p.isSample && <span className="absolute top-4 right-4 z-10 bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-full">MUESTRA</span>}
              <img src={p.image} className="h-28 w-full object-cover rounded-[1.5rem] mb-2" onClick={() => setSelectedProduct(p)} />
              <div className="px-1 flex-1 flex flex-col justify-between">
                <h3 className="font-bold text-slate-800 text-[10px] uppercase leading-tight h-8 line-clamp-2 cursor-pointer" onClick={() => setSelectedProduct(p)}>{p.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-black text-green-700 text-sm">${p.price}</span>
                  <button onClick={() => addToCart(p)} className="bg-green-600 text-white w-8 h-8 rounded-xl flex items-center justify-center shadow-md"><Plus size={16} strokeWidth={3} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* MODAL DETALLES OPTIMIZADO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          <div className="bg-white w-full max-w-md h-[90vh] rounded-t-[3rem] relative z-10 flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-1 shrink-0"></div>
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-6 bg-slate-100 p-1.5 rounded-full text-slate-500 z-20 border border-slate-200"><X size={18} strokeWidth={3} /></button>

            <div className="flex-1 overflow-y-auto px-6 pb-28 scroll-smooth">
                <img src={selectedProduct.image} className="w-full h-44 object-cover mt-2 mb-4 rounded-3xl shadow-md" />
                
                <div className="flex justify-between items-start mb-4 px-1">
                    <div className="max-w-[70%]">
                      <p className="text-[9px] font-black text-green-600 uppercase mb-1 tracking-widest">{selectedProduct.category}</p>
                      <h2 className="text-xl font-black text-slate-900 uppercase leading-tight">{selectedProduct.name}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-green-700 leading-none">${selectedProduct.price}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">por {selectedProduct.unit}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="bg-green-50/50 p-4 rounded-[2rem] border border-green-100 flex gap-3 items-start">
                        <Heart className="text-green-600 shrink-0 mt-1" size={18} fill="currentColor" />
                        <div>
                            <p className="text-[9px] font-black text-green-800 uppercase tracking-widest mb-0.5 italic">Beneficios</p>
                            <p className="text-[11px] text-green-700 font-semibold leading-snug">{selectedProduct.benefits}</p>
                        </div>
                    </div>

                    <div className="bg-orange-50/50 p-4 rounded-[2rem] border border-orange-100 flex gap-3 items-start">
                        <CookingPot className="text-orange-500 shrink-0 mt-1" size={18} />
                        <div>
                            <p className="text-[9px] font-black text-orange-800 uppercase tracking-widest mb-0.5 italic">Receta Sugerida</p>
                            <p className="text-[11px] text-orange-700 font-semibold leading-snug">{selectedProduct.recipe}</p>
                        </div>
                    </div>
                    
                    <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em] pt-4">↓ Desliza para leer más ↓</p>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-10">
                <button 
                  onClick={() => {addToCart(selectedProduct); setSelectedProduct(null)}} 
                  className="w-full bg-green-600 text-white py-4 rounded-[1.8rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-green-500/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} strokeWidth={3} /> Agregar a mi compra
                </button>
            </div>
          </div>
        </div>
      )}

      {/* CARRITO COMPACTO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsCartOpen(false)}></div>
          <div className="bg-white w-[85%] max-w-sm h-full relative z-10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-black text-xs text-slate-400 uppercase tracking-widest">Mi Pedido</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-200 text-black rounded-lg border border-gray-300"><X size={18} strokeWidth={3} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
              {cart.map(i => (
                <div key={i.id} className="flex gap-2 border-b border-gray-50 pb-2 items-center">
                  <img src={i.image} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-[10px] text-gray-800 uppercase truncate">{i.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-black text-sm text-gray-900">${(i.price*i.quantity).toFixed(0)}</span>
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                        <button onClick={() => updateQuantity(i.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white text-black rounded-md border border-gray-300"><Minus size={12} strokeWidth={3}/></button>
                        <span className="text-xs font-black w-6 text-center text-black">{i.quantity}</span>
                        <button onClick={() => updateQuantity(i.id, 1)} className="w-7 h-7 flex items-center justify-center bg-white text-black rounded-md border border-gray-300"><Plus size={12} strokeWidth={3}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t bg-gray-50 space-y-3 shadow-inner">
                <div className="flex justify-between items-center mb-2 px-1 font-black text-black leading-none text-black"><span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total:</span><span className="text-2xl">${total.toFixed(2)}</span></div>
                <button onClick={handleCheckout} className="w-full bg-[#25D366] text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-green-500/20 active:scale-95 transition-all">🛒 Pedir por WhatsApp</button>
                <button onClick={() => setIsCartOpen(false)} className="w-full bg-white text-gray-500 py-3 rounded-xl font-bold text-[10px] uppercase border border-gray-200 tracking-tighter">← Seguir comprando</button>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-xl mx-auto p-10 text-center"></footer>
    </div>
  );
}