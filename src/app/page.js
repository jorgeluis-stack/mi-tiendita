"use client";
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus, Minus, Trash2, X, ChevronLeft } from 'lucide-react';
// import { collection, getDocs } from 'firebase/firestore'; 
// import { db } from '../lib/firebase';

export default function Home() {
  const { cart, addToCart, updateQuantity, total, isCartOpen, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // DATOS DE PRUEBA (Dummy Data)
  const dummyProducts = [
    { id: 1, name: "Tomate Saladette", price: 25, unit: "kg", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80", category: "Verduras" },
    { id: 2, name: "Plátano Chiapas", price: 18, unit: "kg", image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=300&q=80", category: "Frutas" },
    { id: 3, name: "Aguacate Hass", price: 65, unit: "kg", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300&q=80", category: "Verduras" },
    { id: 4, name: "Leche Entera 1L", price: 28, unit: "pz", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=300&q=80", category: "Abarrotes" },
    { id: 5, name: "Manzana Roja", price: 45, unit: "kg", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80", category: "Frutas" },
    { id: 6, name: "Coca Cola 2.5L", price: 38, unit: "pz", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80", category: "Bebidas" },
  ];

  useEffect(() => {
    // Simulamos carga de datos inicial
    setTimeout(() => {
      setProducts(dummyProducts);
      setLoading(false);
    }, 500);
  }, []);

  const handleCheckout = () => {
    // RECUERDA CAMBIAR ESTE NÚMERO POR EL TUYO REAL
    const numeroTienda = "5215555555555"; 
    
    let mensaje = "Hola Super Smart! Quiero hacer el siguiente pedido:\n\n";
    cart.forEach(item => {
      mensaje += `- ${item.quantity} ${item.unit} de ${item.name} ($${(item.price * item.quantity).toFixed(2)})\n`;
    });
    mensaje += `\n*Total a pagar: $${total.toFixed(2)}*`;
    mensaje += "\n\nMi dirección de entrega es: ";

    const url = `https://wa.me/${numeroTienda}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* Navbar Superior */}
      <nav className="bg-green-600 p-4 sticky top-0 z-20 shadow-lg">
        <div className="max-w-xl mx-auto flex justify-between items-center text-white">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight uppercase">Super Smart</h1>
            <span className="text-[10px] font-bold text-green-100 uppercase tracking-widest leading-none">Abarrotes • Frutas • Verduras</span>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative p-3 bg-green-700 rounded-2xl border border-green-500 active:scale-95 transition-all shadow-inner"
          >
            <ShoppingCart size={24} strokeWidth={2.5} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] rounded-full h-6 w-6 flex items-center justify-center font-black shadow-lg animate-bounce border-2 border-white">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Cuerpo Principal */}
      <main className="max-w-xl mx-auto p-4 mt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold">Cargando productos frescos...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🔥</span>
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Ofertas de hoy</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 flex flex-col active:scale-[0.98] transition-transform">
                  <div className="h-36 bg-gray-100 relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{product.category}</p>
                    </div>
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm leading-tight h-8 overflow-hidden">{product.name}</h3>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex flex-col">
                        <span className="font-black text-green-700 text-xl">${product.price}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase -mt-1">por {product.unit}</span>
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-green-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-green-700 shadow-md shadow-green-200 active:scale-90 transition-all"
                      >
                        <Plus size={20} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Carrito Modal - UI MEJORADA */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsCartOpen(false)}></div>
          
          <div className="bg-white w-full max-w-sm h-full relative z-10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            {/* Header del Carrito */}
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="font-black text-2xl text-gray-900 uppercase">Tu Pedido</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{cart.length} artículos</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl transition-all active:scale-90"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>
            
            {/* Lista de Productos en el Carrito */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-300">
                  <ShoppingCart size={80} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="font-bold text-lg">Tu canasta está vacía</p>
                  <button 
                    onClick={() => setIsCartOpen(false)} 
                    className="mt-4 text-green-600 font-black uppercase text-sm border-b-2 border-green-600 pb-1"
                  >
                    Regresar a la tienda
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <img src={item.image} className="w-20 h-20 rounded-2xl object-cover bg-gray-50 shadow-sm border border-gray-100" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-gray-800 text-base leading-none pr-2">{item.name}</h4>
                        <span className="font-black text-gray-900 text-lg leading-none">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${item.price} / {item.unit}</p>
                        
                        {/* CONTROLES DE CANTIDAD - ALTO CONTRASTE */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1 border border-gray-200">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            className="w-9 h-9 flex items-center justify-center bg-white text-gray-900 rounded-xl shadow-sm border border-gray-200 active:bg-red-50 active:scale-90 transition-all"
                          >
                            <Minus size={18} strokeWidth={3} />
                          </button>
                          
                          <span className="text-base font-black w-10 text-center text-gray-900">{item.quantity}</span>
                          
                          <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="w-9 h-9 flex items-center justify-center bg-white text-gray-900 rounded-xl shadow-sm border border-gray-200 active:bg-green-50 active:scale-90 transition-all"
                          >
                            <Plus size={18} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer con Resumen y Botón de WhatsApp */}
            <div className="p-6 border-t bg-gray-50/80 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Total del pedido:</span>
                <span className="text-3xl font-black text-gray-900">${total.toFixed(2)}</span>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full bg-[#25D366] text-white py-5 rounded-3xl font-black text-lg uppercase tracking-tight hover:bg-[#128C7E] active:scale-95 disabled:opacity-50 flex justify-center items-center gap-3 shadow-2xl shadow-green-500/40 transition-all"
                >
                  <span className="text-2xl">🛒</span> 
                  Pedir por WhatsApp
                </button>

                {/* Botón Seguir Comprando */}
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-white text-gray-500 py-4 rounded-3xl font-black text-xs uppercase tracking-widest border-2 border-gray-200 hover:bg-gray-100 transition-all active:scale-95"
                >
                  ← Seguir comprando
                </button>
              </div>
              
              <p className="text-[9px] text-center text-gray-400 mt-6 font-bold uppercase tracking-[0.2em]">
                Super Smart • Frescura garantizada
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}