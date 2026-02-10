// src/app/page.js
"use client";
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
// import { collection, getDocs } from 'firebase/firestore'; 
// import { db } from '../lib/firebase';

export default function Home() {
  const { cart, addToCart, updateQuantity, total, isCartOpen, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // DATOS DE PRUEBA (Para que le enseñes al cliente YA, sin configurar BD aún)
  const dummyProducts = [
    { id: 1, name: "Tomate Saladette", price: 25, unit: "kg", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80", category: "Verduras" },
    { id: 2, name: "Plátano Chiapas", price: 18, unit: "kg", image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=300&q=80", category: "Frutas" },
    { id: 3, name: "Aguacate Hass", price: 65, unit: "kg", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300&q=80", category: "Verduras" },
    { id: 4, name: "Leche Entera 1L", price: 28, unit: "pz", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=300&q=80", category: "Abarrotes" },
    { id: 5, name: "Manzana Roja", price: 45, unit: "kg", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80", category: "Frutas" },
    { id: 6, name: "Coca Cola 2.5L", price: 38, unit: "pz", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80", category: "Bebidas" },
  ];

  useEffect(() => {
    // Simulamos carga de datos
    setTimeout(() => {
      setProducts(dummyProducts);
      setLoading(false);
    }, 500);
  }, []);

  const handleCheckout = () => {
    // CAMBIA ESTE NÚMERO POR EL TUYO PARA PROBAR
    const numeroTienda = "529361111815"; 
    
    let mensaje = "Hola! Quiero hacer el siguiente pedido:\n\n";
    cart.forEach(item => {
      mensaje += `- ${item.quantity}${item.unit} de ${item.name} ($${item.price * item.quantity})\n`;
    });
    mensaje += `\n*Total a pagar: $${total}*`;
    mensaje += "\n\nMi dirección de entrega es: ";

    const url = `https://wa.me/${numeroTienda}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Navbar */}
      <nav className="bg-green-600 p-4 sticky top-0 z-20 shadow-lg">
        <div className="max-w-xl mx-auto flex justify-between items-center text-white">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight">Super Smart</h1>
            <span className="text-xs text-green-100">Envíos a domicilio</span>
          </div>
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-green-700 rounded-full transition">
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm animate-bounce">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Grid de Productos */}
      <main className="max-w-xl mx-auto p-4">
        {loading ? (
          <div className="flex justify-center mt-20 text-gray-400 animate-pulse">Cargando productos...</div>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
              🔥 Ofertas de hoy
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition">
                  <div className="h-32 bg-gray-100 relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight">{product.name}</h3>
                      <p className="text-gray-400 text-xs mt-1">{product.category}</p>
                    </div>
                    <div className="flex justify-between items-end mt-3">
                      <span className="font-bold text-green-700 text-lg">${product.price}<span className="text-xs font-normal text-gray-500">/{product.unit}</span></span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition active:scale-90"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Carrito Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="bg-white w-full max-w-sm h-full relative z-10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-lg text-gray-800">Tu Canasta</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <ShoppingCart size={64} className="mb-4 opacity-20" />
                  <p>Tu canasta está vacía</p>
                  <button onClick={() => setIsCartOpen(false)} className="mt-4 text-green-600 font-medium">Volver a la tienda</button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-4 last:border-0">
                    <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                        <span className="font-bold text-gray-800">${item.price * item.quantity}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">${item.price}/{item.unit}</p>
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-red-500"><Minus size={14} /></button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-green-600"><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 safe-area-pb">
              <div className="flex justify-between mb-4 text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-green-600/30 transition-all"
              >
                <span>Pedir por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}