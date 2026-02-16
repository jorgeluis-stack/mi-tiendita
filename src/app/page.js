"use client";
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus, Minus, X, Heart, CookingPot, Info } from 'lucide-react';

export default function Home() {
  const { cart, addToCart, updateQuantity, total, isCartOpen, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); // Para ver el detalle

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
    setTimeout(() => {
      setProducts(dummyProducts);
      setLoading(false);
    }, 500);
  }, []);

  const handleCheckout = () => {
    const numeroTienda = "5215555555555"; 
    let mensaje = "Hola Super Smart! Quiero hacer este pedido:\n\n";
    cart.forEach(item => {
      mensaje += `- ${item.quantity} ${item.unit} de ${item.name} ($${(item.price * item.quantity).toFixed(2)})\n`;
    });
    mensaje += `\n*Total a pagar: $${total.toFixed(2)}*`;
    window.open(`https://wa.me/${numeroTienda}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* Navbar */}
      <nav className="bg-green-600 p-3 sticky top-0 z-20 shadow-md">
        <div className="max-w-xl mx-auto flex justify-between items-center text-white">
          <div className="flex flex-col">
            <h1 className="text-lg font-black uppercase">Super Smart</h1>
            <span className="text-[9px] font-bold text-green-100 uppercase tracking-widest">Salud y Frescura</span>
          </div>
          <button onClick={() => setIsCartOpen(true)} className="p-2 bg-green-700 rounded-xl">
            <ShoppingCart size={20} strokeWidth={2.5} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-black border-2 border-white">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Grid de Productos */}
      <main className="max-w-xl mx-auto p-4">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center italic italic">Toca el producto para ver beneficios</h2>
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col active:scale-95 transition-all">
              {/* Al hacer clic en la imagen se abre el detalle */}
              <img 
                src={product.image} 
                className="h-28 w-full object-cover cursor-pointer" 
                onClick={() => setSelectedProduct(product)}
              />
              <div className="p-2 flex-1 flex flex-col justify-between">
                <h3 onClick={() => setSelectedProduct(product)} className="font-bold text-gray-800 text-[11px] uppercase cursor-pointer leading-tight">{product.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-black text-green-700 text-sm">${product.price}</span>
                  <button onClick={() => addToCart(product)} className="bg-green-600 text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-md active:bg-green-700 transition-colors">
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL DE DETALLES (BENEFICIOS Y RECETAS) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] relative z-10 overflow-hidden animate-in slide-in-from-bottom duration-300">
            <img src={selectedProduct.image} className="w-full h-56 object-cover" />
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40">
                <X size={24} strokeWidth={3} />
            </button>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-green-600 font-black text-[10px] uppercase tracking-widest">{selectedProduct.category}</span>
                    <h2 className="text-2xl font-black text-gray-900 leading-none uppercase">{selectedProduct.name}</h2>
                </div>
                <span className="text-2xl font-black text-green-700">${selectedProduct.price}/{selectedProduct.unit}</span>
              </div>

              {/* Sección de Salud */}
              <div className="bg-green-50 rounded-2xl p-4 mb-4 flex gap-3 items-start border border-green-100">
                <div className="bg-green-600 p-2 rounded-xl text-white"><Heart size={20} fill="currentColor" /></div>
                <div>
                    <h4 className="font-black text-xs text-green-800 uppercase tracking-tight">Beneficios de Salud</h4>
                    <p className="text-[13px] text-green-700 leading-snug">{selectedProduct.benefits}</p>
                </div>
              </div>

              {/* Sección de Receta */}
              <div className="bg-orange-50 rounded-2xl p-4 mb-6 flex gap-3 items-start border border-orange-100">
                <div className="bg-orange-500 p-2 rounded-xl text-white"><CookingPot size={20} /></div>
                <div>
                    <h4 className="font-black text-xs text-orange-800 uppercase tracking-tight">Idea de Receta</h4>
                    <p className="text-[13px] text-orange-700 leading-snug">{selectedProduct.recipe}</p>
                </div>
              </div>

              <button 
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg uppercase tracking-tight shadow-xl shadow-green-600/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                Agregar a mi compra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Carrito Modal (Compacto) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="bg-white w-[85%] max-w-sm h-full relative z-10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-black text-sm text-gray-900 uppercase">Mi Carrito</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-1 bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-2 border-b border-gray-50 pb-2">
                  <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-[11px] text-gray-800 uppercase">{item.name}</h4>
                        <span className="font-black text-xs text-gray-900">${(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-md border border-gray-100 shadow-sm"><Minus size={12} strokeWidth={3} /></button>
                        <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-md border border-gray-100 shadow-sm"><Plus size={12} strokeWidth={3} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between mb-4"><span className="text-[10px] font-bold text-gray-400">TOTAL:</span><span className="text-xl font-black text-gray-900">${total.toFixed(2)}</span></div>
                <button onClick={handleCheckout} className="w-full bg-[#25D366] text-white py-3 rounded-xl font-black text-xs uppercase shadow-lg shadow-green-500/20">Pedir por WhatsApp</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}