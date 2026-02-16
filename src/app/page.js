"use client";
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ShoppingCart, Plus, Minus, X, Heart, CookingPot, Search } from 'lucide-react';

export default function Home() {
  const { cart, addToCart, updateQuantity, total, isCartOpen, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Para filtros y búsqueda
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Todos");

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
      setFilteredProducts(items);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Lógica de Búsqueda y Filtro
  useEffect(() => {
    let result = products;
    if (category !== "Todos") {
      result = result.filter(p => p.category === category);
    }
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [searchTerm, category, products]);

  const handleCheckout = () => {
    const numeroTienda = "5215555555555"; 
    let mensaje = "Hola Super Smart! Mi pedido es:\n\n";
    cart.forEach(item => mensaje += `- ${item.quantity} ${item.unit} de ${item.name} ($${(item.price * item.quantity).toFixed(0)})\n`);
    mensaje += `\n*TOTAL: $${total.toFixed(2)}*`;
    window.open(`https://wa.me/${numeroTienda}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const categories = ["Todos", "Frutas", "Verduras", "Abarrotes", "Lácteos", "Bebidas"];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Navbar con Buscador */}
      <nav className="bg-green-600 p-3 sticky top-0 z-20 shadow-md">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="flex justify-between items-center text-white">
            <div className="flex flex-col">
              <h1 className="text-xl font-black uppercase leading-none">Super Smart</h1>
              <span className="text-[9px] font-bold text-green-100 uppercase tracking-widest mt-1">El súper en tu mano</span>
            </div>
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-green-700 rounded-xl">
              <ShoppingCart size={22} strokeWidth={2.5} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] rounded-full h-5 w-5 flex items-center justify-center font-black border-2 border-white">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
            </button>
          </div>
          
          {/* BARRA DE BÚSQUEDA */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              className="w-full bg-white p-2 pl-10 rounded-xl text-sm outline-none text-black font-medium shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </nav>

      {/* FILTROS DE CATEGORÍA */}
      <div className="max-w-xl mx-auto overflow-x-auto whitespace-nowrap p-4 flex gap-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              category === cat ? "bg-green-600 text-white shadow-lg shadow-green-200 scale-105" : "bg-white text-gray-400 border border-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <main className="max-w-xl mx-auto p-4 pt-0">
        {loading ? <div className="text-center py-20 font-black text-gray-300 animate-pulse">Cargando...</div> : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col active:scale-95 transition-all">
                <img src={product.image} className="h-32 w-full object-cover cursor-pointer" onClick={() => setSelectedProduct(product)} />
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-gray-800 text-[11px] uppercase leading-tight h-8 overflow-hidden" onClick={() => setSelectedProduct(product)}>{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-black text-green-700 text-sm">${product.price}</span>
                    <button onClick={() => addToCart(product)} className="bg-green-600 text-white w-8 h-8 rounded-xl flex items-center justify-center shadow-md"><Plus size={18} strokeWidth={3} /></button>
                  </div>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && <p className="col-span-2 text-center py-20 text-gray-400 font-bold">No encontramos ese producto...</p>}
          </div>
        )}
      </main>

      {/* MODAL DETALLES (Mismo de antes) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] relative z-10 overflow-hidden animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full border-2 border-white z-20"><X size={20} strokeWidth={3} /></button>
            <img src={selectedProduct.image} className="w-full h-56 object-cover" />
            <div className="p-6">
              <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-black text-gray-900 uppercase">{selectedProduct.name}</h2><span className="text-2xl font-black text-green-700">${selectedProduct.price}/{selectedProduct.unit}</span></div>
              <div className="space-y-3 mb-6">
                <div className="bg-green-50 p-3 rounded-2xl border border-green-100 flex gap-3 text-black font-medium text-xs leading-snug items-start">
                    <Heart size={20} className="text-green-600 shrink-0" fill="currentColor" />
                    <p>{selectedProduct.benefits}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-2xl border border-orange-100 flex gap-3 text-black font-medium text-xs leading-snug items-start">
                    <CookingPot size={20} className="text-orange-500 shrink-0" />
                    <p>{selectedProduct.recipe}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full bg-green-600 text-white py-4 rounded-3xl font-black uppercase text-sm tracking-widest shadow-xl shadow-green-600/30 active:scale-95 transition-all">Agregar a mi compra</button>
                <button onClick={() => setSelectedProduct(null)} className="w-full bg-gray-100 text-gray-500 py-3 rounded-3xl font-bold text-xs uppercase">← Volver</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CARRITO (Mismo de antes) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="bg-white w-[85%] max-w-sm h-full relative z-10 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-black text-sm text-gray-900 uppercase tracking-tighter">Mi Pedido</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 bg-white rounded-xl text-black border border-gray-200"><X size={18} strokeWidth={3} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-2 border-b border-gray-50 pb-2 items-center">
                  <img src={item.image} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-black text-[10px] text-gray-800 uppercase">{item.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-black text-sm text-gray-900">${(item.price * item.quantity).toFixed(0)}</span>
                      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-0.5">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg border border-gray-200"><Minus size={14} strokeWidth={3}/></button>
                        <span className="text-xs font-black w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg border border-gray-200"><Plus size={14} strokeWidth={3}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t bg-gray-50 space-y-3 shadow-inner">
                <div className="flex justify-between items-center mb-2 px-1 text-black font-black"><span className="text-[10px] text-gray-400">TOTAL:</span><span className="text-2xl">${total.toFixed(2)}</span></div>
                <button onClick={handleCheckout} className="w-full bg-[#25D366] text-white py-4 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-green-500/20 active:scale-95 transition-all">Pedir por WhatsApp</button>
                <button onClick={() => setIsCartOpen(false)} className="w-full bg-white text-gray-500 py-3 rounded-2xl font-bold text-[10px] uppercase border border-gray-200">← Seguir comprando</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}