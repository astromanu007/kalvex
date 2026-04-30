import Link from "next/link";
import { Search, Filter, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock products data
const PRODUCTS = [
  { id: "1", name: "Raspberry Pi 5 4GB RAM", sku: "KVX-SBC-005", price: 6500, mrp: 7200, category: "Development Boards", stock: 15, rating: 4.8, image: "circuit" },
  { id: "2", name: "Arduino Uno R3 Compatible", sku: "KVX-SBC-001", price: 450, mrp: 600, category: "Development Boards", stock: 120, rating: 4.5, image: "cpu" },
  { id: "3", name: "ESP32 NodeMCU WiFi+BT", sku: "KVX-MOD-032", price: 350, mrp: 500, category: "Modules", stock: 0, rating: 4.7, image: "wifi" },
  { id: "4", name: "L298N Motor Driver Module", sku: "KVX-MOD-015", price: 150, mrp: 200, category: "Modules", stock: 45, rating: 4.2, image: "cpu" },
  { id: "5", name: "HC-SR04 Ultrasonic Sensor", sku: "KVX-SEN-004", price: 85, mrp: 120, category: "Sensors", stock: 200, rating: 4.6, image: "zap" },
  { id: "6", name: "0.96 inch OLED Display I2C", sku: "KVX-DIS-096", price: 250, mrp: 350, category: "Displays", stock: 30, rating: 4.9, image: "monitor" },
  { id: "7", name: "NEMA 17 Stepper Motor", sku: "KVX-MOT-017", price: 850, mrp: 1100, category: "Motors", stock: 12, rating: 4.4, image: "settings" },
  { id: "8", name: "3.7V 2000mAh Li-ion Battery", sku: "KVX-PWR-037", price: 120, mrp: 180, category: "Power Supply", stock: 500, rating: 4.1, image: "battery" },
];

const CATEGORIES = [
  "All Products",
  "Development Boards",
  "Modules",
  "Sensors",
  "Displays",
  "Motors & Drivers",
  "Power Supply",
  "Passive Components",
  "Hardware & Tools"
];

export default function ElectronicsStore() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-bg-primary">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-text-primary mb-2">Electronics Store</h1>
            <p className="text-text-secondary text-sm">Premium components for your next project</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-1 max-w-md relative">
            <input 
              type="text" 
              placeholder="Search components, SKUs..." 
              className="w-full bg-bg-input border border-border rounded-l-lg pl-10 pr-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-primary"
            />
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3.5" />
            <Button className="rounded-l-none bg-accent-primary hover:bg-accent-primary/90 text-white px-6">
              Search
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-bg-card border border-border rounded-xl p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <h3 className="font-heading font-semibold text-lg flex items-center">
                  <Filter className="w-4 h-4 mr-2" /> Filters
                </h3>
                <button className="text-xs text-accent-primary hover:underline">Clear All</button>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-sm text-text-primary mb-3">Categories</h4>
                <div className="space-y-2">
                  {CATEGORIES.map((cat, i) => (
                    <label key={i} className="flex items-center text-sm text-text-secondary cursor-pointer hover:text-accent-primary">
                      <input type="radio" name="category" className="mr-2 accent-accent-primary" defaultChecked={i===0} />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-sm text-text-primary mb-3">Price Range</h4>
                <div className="flex items-center gap-2 mb-2">
                  <input type="number" placeholder="Min" className="w-full bg-bg-input border border-border rounded px-2 py-1 text-xs" />
                  <span className="text-text-secondary">-</span>
                  <input type="number" placeholder="Max" className="w-full bg-bg-input border border-border rounded px-2 py-1 text-xs" />
                </div>
                <input type="range" className="w-full accent-accent-primary" />
              </div>

              <div>
                <h4 className="font-medium text-sm text-text-primary mb-3">Availability</h4>
                <label className="flex items-center text-sm text-text-secondary cursor-pointer hover:text-accent-primary">
                  <input type="checkbox" className="mr-2 rounded border-border accent-accent-primary" />
                  In Stock Only
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-text-secondary">Showing 1-8 of 124 products</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">Sort by:</span>
                <select className="bg-bg-input border border-border rounded-md px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary">
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {PRODUCTS.map((p) => {
                const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
                
                return (
                  <div key={p.id} className="bg-bg-card rounded-xl overflow-hidden border border-border group hover:shadow-card hover:border-accent-primary/30 transition-all duration-300 flex flex-col h-full">
                    {/* Image Area */}
                    <Link href={`/electronics/${p.id}`} className="block relative h-48 bg-white p-4 flex items-center justify-center overflow-hidden">
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-bg-surface/80 backdrop-blur text-text-primary border border-border/50 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          {p.category}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-text-secondary hover:text-accent-secondary hover:bg-white transition-colors shadow-sm">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Placeholder for actual product image */}
                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                         <span className="text-gray-400 font-mono text-xs">IMG_{p.image.toUpperCase()}</span>
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="p-4 flex flex-col flex-grow">
                      <Link href={`/electronics/${p.id}`} className="group-hover:text-accent-primary transition-colors">
                        <h3 className="font-medium text-text-primary text-sm line-clamp-2 mb-1" title={p.name}>{p.name}</h3>
                      </Link>
                      <p className="font-mono text-[10px] text-text-muted mb-3">{p.sku}</p>
                      
                      <div className="mt-auto">
                        <div className="flex items-end space-x-2 mb-1">
                          <span className="font-bold text-accent-primary text-lg">₹{p.price.toFixed(2)}</span>
                          <span className="text-xs text-text-muted line-through mb-1">₹{p.mrp.toFixed(2)}</span>
                          <span className="text-[10px] font-bold text-accent-secondary mb-1">({discount}% OFF)</span>
                        </div>
                        <p className="text-[10px] text-text-muted mb-3">Inclusive of all taxes</p>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                          {p.stock > 0 ? (
                            <span className="text-[10px] font-medium text-accent-success bg-accent-success/10 px-2 py-1 rounded-md flex items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent-success mr-1.5"></span>
                              In Stock
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-accent-danger bg-accent-danger/10 px-2 py-1 rounded-md flex items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent-danger mr-1.5"></span>
                              Out of Stock
                            </span>
                          )}
                          
                          <Button 
                            size="sm" 
                            disabled={p.stock === 0}
                            className={`${p.stock > 0 ? "bg-accent-primary hover:bg-accent-primary/90 text-white" : "bg-bg-surface text-text-muted"} h-8 px-3 rounded-lg flex items-center`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex justify-center">
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 border-border" disabled>&lt;</Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 border-accent-primary bg-accent-primary/10 text-accent-primary">1</Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 border-border hover:border-accent-primary">2</Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 border-border hover:border-accent-primary">3</Button>
                <span className="px-2 text-text-muted">...</span>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 border-border hover:border-accent-primary">12</Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 border-border hover:border-accent-primary">&gt;</Button>
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
