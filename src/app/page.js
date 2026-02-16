"use client";
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';

export default function Home() {
  const { cart, addToCart, updateQuantity, total, isCartOpen, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dummyProducts = [
    { id: 1, name: "Tomate Saladette", price: 25, unit: "kg", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80", category: "Verduras" },
    { id: 2, name: "Plátano Chiapas", price: 18, unit: "kg", image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=300&q=80", category: "Frutas" },
    { id: 3, name: "Aguacate Hass", price: 65, unit: "kg", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300&q=80", category: "Verduras" },
    { id: 4, name: "Leche Entera 1L", price: 28, unit: "pz", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=300&q=80", category: "Abarrotes" },
    { id: 5, name: "Manzana Roja", price: 45, unit: "kg", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80", category: "Frutas" },
    { id: 6, name: "Coca Cola 2.5L", price: 38, unit: "pz", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80", category: "Bebidas" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setProducts(dummyProducts);
      setLoading(false);
    }, 500);
  }, []);

  const handleCheckout = () => {
    const numeroTienda = "5215555555555"; // TU NÚMERO
    let mensaje = "Hola Super Smart! Quiero hacer el siguiente pedido:\n\n";
    cart.forEach(item => {
      mensaje += `- ${item.quantity} ${item.unit} de ${item.name} ($${(item.price * item.quantity).toFixed(2)})\n`;
    });
    mensaje += `\n*Total a pagar: $${total.toFixed(2)}*`;
    const url = `https://wa.me/${numeroTienda}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* Navbar - Más compacto */}
      <nav className="bg-green-600 p-3 sticky top-0 z-20 shadow-md">
        <div className="max-w-xl mx-auto flex justify-between items-center text-white">
          <div className="flex flex-col">
            <h1 className="text-lg font-black uppercase leading-none">Super Smart</h1>
            <span className="text-[9px] font-bold text-green-100 uppercase tracking-widest mt-1">Frescura total</span>
          </div>
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-green-700 rounded-xl active:scale-95 transition-all">
            <ShoppingCart size={20} strokeWidth={2.5} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-black border-2 border-white">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-4">
        {loading ? (
          <div className="flex justify-center mt-20 font-bold text-gray-400 animate-pulse uppercase text-xs tracking-widest text-center">Cargando...</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col active:scale-95 transition-transform">
                <img src={product.image} className="h-28 w-full object-cover" />
                <div className="p-2 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-gray-800 text-[11px] leading-tight line-clamp-2 mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-green-700 text-sm">${product.price}</span>
                    <button onClick={() => addToCart(product)} className="bg-green-600 text-white w-7 h-7 rounded-lg flex items-center justify-center shadow-md active:scale-90 transition-all">
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Carrito Modal - VERSIÓN COMPACTA (La clave de tu pedido) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="bg-white w-[85%] max-w-sm h-full relative z-10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            {/* Header Reducido */}
            <div className="p-3 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="font-black text-sm text-gray-900 uppercase">Mi Pedido</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">{cart.length} productos</p>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-1.5 bg-white border border-gray-200 text-gray-900 rounded-lg shadow-sm">
                <X size={18} strokeWidth={3} />
              </button>
            </div>
            
            {/* Lista de Productos - MUCHO MÁS COMPACTA */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 p-10 text-center">
                  <ShoppingCart size={40} className="mb-2 opacity-20" />
                  <p className="font-bold text-xs uppercase">Carrito Vacío</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-2 border-b border-gray-50 pb-2">
                    {/* Imagen más pequeña */}
                    <img src={item.image} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-800 text-[11px] leading-none uppercase">{item.name}</h4>
                        <span className="font-black text-gray-900 text-xs leading-none">${(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-[9px] font-bold text-gray-400 tracking-tighter">${item.price}/{item.unit}</p>
                        
                        {/* CONTROLES MÁS PEQUEÑOS Y FINOS */}
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white text-gray-900 rounded-md shadow-sm border border-gray-100">
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="text-xs font-black w-5 text-center text-gray-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white text-gray-900 rounded-md shadow-sm border border-gray-100">
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Compacto */}
            <div className="p-4 border-t bg-gray-50 shadow-inner">
              <div className="flex justify-between items-center mb-3 px-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total:</span>
                <span className="text-xl font-black text-gray-900 leading-none">${total.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full bg-[#25D366] text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#128C7E] active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-green-500/20"
                >
                  <span className="text-lg">🛒</span> 
                  Pedir por WhatsApp
                </button>

                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-white text-gray-400 py-2 rounded-lg font-bold text-[9px] uppercase tracking-[0.2em] border border-gray-200 active:scale-95 transition-all"
                >
                  ← Seguir comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}