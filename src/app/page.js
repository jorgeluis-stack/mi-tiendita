"use client";
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus, Minus, X, Heart, CookingPot, ArrowLeft } from 'lucide-react';

export default function Home() {
  const { cart, addToCart, updateQuantity, total, isCartOpen, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const dummyProducts = [
    { 
        id: 1, name: "Tomate Saladette", price: 25, unit: "kg", 
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80", 
        category: "Verduras",
        benefits: "Protege tu corazón y es rico en antioxidantes (licopeno).",
        recipe: "Pícalo con cebolla y cilantro para un 'Pico de Gallo' fresco y saludable."
    },
    { 
        id: 2, name: "Plátano Chiapas", price: 18, unit: "kg", 
        image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=300&q=80", 
        category: "Frutas",
        benefits: "Excelente fuente de potasio para evitar calambres y darte energía.",
        recipe: "Licuado energético: 1 plátano, avena y leche fría. ¡Desayuno listo!"
    },
    { 
        id: 3, name: "Aguacate Hass", price: 65, unit: "kg", 
        image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300&q=80", 
        category: "Verduras",
        benefits: "Grasas saludables que ayudan a reducir el colesterol malo.",
        recipe: "Guacamole Super Smart: Machácalo con limón, sal y un toque de chile."
    },
    { 
        id: 4, name: "Leche Entera 1L", price: 28, unit: "pz", 
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=300&q=80", 
        category: "Abarrotes",
        benefits: "Fortalece tus huesos con calcio y proteínas de alta calidad.",
        recipe: "Ideal para preparar un arroz con leche cremoso este fin de semana."
    }
  ];

  useEffect(() => {
    setTimeout(() => { setProducts(dummyProducts); setLoading(false); }, 500);
  }, []);

  const handleCheckout = () => {
    const numeroTienda = "5215555555555"; 
    let mensaje = "Hola Super Smart! Quiero este pedido:\n\n";
    cart.forEach(item => {
      mensaje += `- ${item.quantity} ${item.unit} de ${item.name}\n`;
    });
    mensaje += `\n*Total: $${total.toFixed(2)}*`;
    window.open(`https://wa.me/${numeroTienda}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* NAVBAR */}
      <nav className="bg-green-600 p-3 sticky top-0 z-20 shadow-md">
        <div className="max-w-xl mx-auto flex justify-between items-center text-white">
          <div className="flex flex-col">
            <h1 className="text-lg font-black uppercase leading-none">Super Smart</h1>
            <span className="text-[9px] font-bold text-green-100 uppercase mt-1 tracking-widest">Salud y Frescura</span>
          </div>
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-green-700 rounded-xl border border-green-500 shadow-lg">
            <ShoppingCart size={22} strokeWidth={2.5} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-black border-2 border-white shadow-md">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-4">
        <p className="text-[10px] font-black text-gray-400 uppercase text-center mb-4 tracking-widest italic">Toca la foto para ver beneficios y recetas</p>
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col active:scale-95 transition-all">
              <img src={product.image} className="h-28 w-full object-cover cursor-pointer" onClick={() => setSelectedProduct(product)} />
              <div className="p-2 flex-1 flex flex-col justify-between">
                <h3 onClick={() => setSelectedProduct(product)} className="font-bold text-gray-800 text-[11px] uppercase leading-tight">{product.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-black text-green-700 text-sm">${product.price}</span>
                  <button onClick={() => addToCart(product)} className="bg-green-600 text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-md">
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL DE DETALLES (BENEFICIOS) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          <div className="bg-white w-full max-w-md rounded-t-[2rem] relative z-10 overflow-hidden animate-in slide-in-from-bottom duration-300 shadow-2xl">
            
            {/* BOTÓN CERRAR ARRIBA - MUY VISIBLE */}
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center z-20 shadow-xl border-2 border-white"
            >
              <X size={24} strokeWidth={3} />
            </button>

            <img src={selectedProduct.image} className="w-full h-48 object-cover" />
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black text-gray-900 uppercase leading-none">{selectedProduct.name}</h2>
                <span className="text-xl font-black text-green-700">${selectedProduct.price}/{selectedProduct.unit}</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex gap-3">
                  <Heart className="text-green-600 shrink-0" size={20} fill="currentColor" />
                  <p className="text-xs text-green-800 font-medium leading-snug">{selectedProduct.benefits}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex gap-3">
                  <CookingPot className="text-orange-500 shrink-0" size={20} />
                  <p className="text-xs text-orange-800 font-medium leading-snug">{selectedProduct.recipe}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-green-500/30"
                >
                  Agregar a mi compra
                </button>
                {/* BOTÓN REGRESAR DENTRO DEL DETALLE */}
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-xs uppercase tracking-widest"
                >
                  ← Seguir viendo productos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CARRITO MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="bg-white w-[85%] max-w-sm h-full relative z-10 flex flex-col shadow-2xl">
            
            {/* HEADER CARRITO - X MUY VISIBLE */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-black text-xs text-gray-400 uppercase tracking-[0.2em]">Mi Pedido</h2>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="p-2 bg-gray-200 text-black rounded-lg border border-gray-300 shadow-sm"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-2 border-b border-gray-100 pb-2 items-center">
                  <img src={item.image} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-[10px] text-gray-800 uppercase truncate">{item.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-black text-sm text-gray-900">${(item.price * item.quantity).toFixed(0)}</span>
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white text-black rounded-md border border-gray-300 shadow-sm">
                          <Minus size={14} strokeWidth={3} />
                        </button>
                        <span className="text-xs font-black w-6 text-center text-black">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-white text-black rounded-md border border-gray-300 shadow-sm">
                          <Plus size={14} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-gray-50 space-y-2">
                <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Total:</span>
                    <span className="text-2xl font-black text-black">${total.toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} className="w-full bg-[#25D366] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-500/20">
                    Pedir por WhatsApp
                </button>
                {/* BOTÓN REGRESAR EN EL CARRITO */}
                <button onClick={() => setIsCartOpen(false)} className="w-full bg-white text-gray-500 py-3 rounded-xl font-bold text-[10px] uppercase border border-gray-200">
                    ← Seguir comprando
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}