import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Settings, DollarSign, MapPin, BookOpen, Bell, Download, Upload, FolderSync as Sync, LogOut, Save, Plus, CreditCard as Edit, Trash2, Eye, EyeOff, User, Lock, AlertCircle, CheckCircle, Info, X, Globe, Calendar, Monitor, Image, Camera, FileText, Smartphone, Send, Phone } from 'lucide-react';

export function AdminPanel() {
  const { 
    state, 
    login, 
    logout, 
    updatePrices, 
    addDeliveryZone, 
    updateDeliveryZone, 
    deleteDeliveryZone,
    addNovel,
    updateNovel,
    deleteNovel,
    clearNotifications,
    exportSystemConfig,
    importSystemConfig,
    exportCompleteSourceCode,
    syncWithRemote,
    syncAllSections
  } = useAdmin();

  const [isLoggedIn, setIsLoggedIn] = useState(state.isAuthenticated);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'prices' | 'delivery' | 'novels' | 'notifications' | 'system'>('prices');
  const [editingPrices, setEditingPrices] = useState(state.prices);
  const [editingZone, setEditingZone] = useState<any>(null);
  const [newZone, setNewZone] = useState({ name: '', cost: 0 });
  const [editingNovel, setEditingNovel] = useState<any>(null);
  const [newNovel, setNewNovel] = useState({
    titulo: '',
    genero: '',
    capitulos: 1,
    año: new Date().getFullYear(),
    descripcion: '',
    pais: '',
    imagen: '',
    estado: 'finalizada' as 'transmision' | 'finalizada'
  });
  const [showNewZoneForm, setShowNewZoneForm] = useState(false);
  const [showNewNovelForm, setShowNewNovelForm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Lista completa de países incluyendo Cuba
  const countries = [
    'Cuba',
    'Turquía',
    'México',
    'Brasil',
    'Colombia',
    'Argentina',
    'España',
    'Estados Unidos',
    'Corea del Sur',
    'India',
    'Reino Unido',
    'Francia',
    'Italia',
    'Alemania',
    'Japón',
    'China',
    'Rusia',
    'Venezuela',
    'Chile',
    'Perú',
    'Ecuador',
    'Uruguay',
    'Paraguay',
    'Bolivia',
    'Panamá',
    'Costa Rica',
    'Nicaragua',
    'Honduras',
    'Guatemala',
    'El Salvador',
    'República Dominicana',
    'Puerto Rico',
    'Canadá',
    'Australia',
    'Nueva Zelanda',
    'Sudáfrica',
    'Egipto',
    'Marruecos',
    'Nigeria',
    'Kenia',
    'Tailandia',
    'Filipinas',
    'Indonesia',
    'Malasia',
    'Singapur',
    'Vietnam',
    'Pakistán',
    'Bangladesh',
    'Sri Lanka',
    'Nepal',
    'Afganistán',
    'Irán',
    'Irak',
    'Israel',
    'Jordania',
    'Líbano',
    'Siria',
    'Arabia Saudí',
    'Emiratos Árabes Unidos',
    'Qatar',
    'Kuwait',
    'Bahréin',
    'Omán',
    'Yemen',
    'Grecia',
    'Portugal',
    'Países Bajos',
    'Bélgica',
    'Suiza',
    'Austria',
    'Polonia',
    'República Checa',
    'Hungría',
    'Rumania',
    'Bulgaria',
    'Croacia',
    'Serbia',
    'Bosnia y Herzegovina',
    'Montenegro',
    'Macedonia del Norte',
    'Albania',
    'Eslovenia',
    'Eslovaquia',
    'Estonia',
    'Letonia',
    'Lituania',
    'Finlandia',
    'Suecia',
    'Noruega',
    'Dinamarca',
    'Islandia',
    'Irlanda',
    'Ucrania',
    'Bielorrusia',
    'Moldavia',
    'Georgia',
    'Armenia',
    'Azerbaiyán',
    'Kazajistán',
    'Uzbekistán',
    'Turkmenistán',
    'Kirguistán',
    'Tayikistán',
    'Mongolia',
    'No especificado'
  ].sort();

  const genres = [
    'Drama',
    'Romance',
    'Comedia',
    'Acción',
    'Thriller',
    'Misterio',
    'Familia',
    'Histórico',
    'Fantasía',
    'Ciencia Ficción',
    'Terror',
    'Aventura',
    'Musical',
    'Documental',
    'Biografía',
    'Crimen',
    'Guerra',
    'Western',
    'Deportes',
    'Animación'
  ];

  useEffect(() => {
    setIsLoggedIn(state.isAuthenticated);
  }, [state.isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(loginForm.username, loginForm.password);
    if (!success) {
      alert('Credenciales incorrectas');
    }
  };

  const handlePricesUpdate = () => {
    updatePrices(editingPrices);
  };

  const handleAddZone = () => {
    if (newZone.name && newZone.cost >= 0) {
      addDeliveryZone(newZone);
      setNewZone({ name: '', cost: 0 });
      setShowNewZoneForm(false);
    }
  };

  const handleUpdateZone = () => {
    if (editingZone) {
      updateDeliveryZone(editingZone);
      setEditingZone(null);
    }
  };

  const handleAddNovel = () => {
    if (newNovel.titulo && newNovel.genero && newNovel.capitulos > 0) {
      addNovel(newNovel);
      setNewNovel({
        titulo: '',
        genero: '',
        capitulos: 1,
        año: new Date().getFullYear(),
        descripcion: '',
        pais: '',
        imagen: '',
        estado: 'finalizada'
      });
      setShowNewNovelForm(false);
    }
  };

  const handleUpdateNovel = () => {
    if (editingNovel) {
      updateNovel(editingNovel);
      setEditingNovel(null);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          importSystemConfig(config);
        } catch (error) {
          alert('Error al importar el archivo de configuración');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await syncAllSections();
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Cuba': '🇨🇺',
      'Turquía': '🇹🇷',
      'México': '🇲🇽',
      'Brasil': '🇧🇷',
      'Colombia': '🇨🇴',
      'Argentina': '🇦🇷',
      'España': '🇪🇸',
      'Estados Unidos': '🇺🇸',
      'Corea del Sur': '🇰🇷',
      'India': '🇮🇳',
      'Reino Unido': '🇬🇧',
      'Francia': '🇫🇷',
      'Italia': '🇮🇹',
      'Alemania': '🇩🇪',
      'Japón': '🇯🇵',
      'China': '🇨🇳',
      'Rusia': '🇷🇺',
      'Venezuela': '🇻🇪',
      'Chile': '🇨🇱',
      'Perú': '🇵🇪',
      'Ecuador': '🇪🇨',
      'Uruguay': '🇺🇾',
      'Paraguay': '🇵🇾',
      'Bolivia': '🇧🇴',
      'Panamá': '🇵🇦',
      'Costa Rica': '🇨🇷',
      'Nicaragua': '🇳🇮',
      'Honduras': '🇭🇳',
      'Guatemala': '🇬🇹',
      'El Salvador': '🇸🇻',
      'República Dominicana': '🇩🇴',
      'Puerto Rico': '🇵🇷',
      'Canadá': '🇨🇦',
      'Australia': '🇦🇺',
      'Nueva Zelanda': '🇳🇿',
      'Sudáfrica': '🇿🇦',
      'No especificado': '🌍'
    };
    return flags[country] || '🌍';
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
            <div className="bg-white/20 p-4 rounded-full w-fit mx-auto mb-4">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-blue-100">TV a la Carta</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa tu usuario"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSyncAll}
                disabled={isSyncing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Sync className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sincronizando...' : 'Sincronizar Todo'}
              </button>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-red-600 flex items-center"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'prices', label: 'Precios', icon: DollarSign },
                { id: 'delivery', label: 'Zonas de Entrega', icon: MapPin },
                { id: 'novels', label: 'Gestión de Novelas', icon: BookOpen },
                { id: 'notifications', label: 'Notificaciones', icon: Bell },
                { id: 'system', label: 'Sistema', icon: Settings }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Prices Tab */}
        {activeTab === 'prices' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Precios</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio de Películas (CUP)
                </label>
                <input
                  type="number"
                  value={editingPrices.moviePrice}
                  onChange={(e) => setEditingPrices(prev => ({ ...prev, moviePrice: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio de Series por Temporada (CUP)
                </label>
                <input
                  type="number"
                  value={editingPrices.seriesPrice}
                  onChange={(e) => setEditingPrices(prev => ({ ...prev, seriesPrice: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recargo por Transferencia (%)
                </label>
                <input
                  type="number"
                  value={editingPrices.transferFeePercentage}
                  onChange={(e) => setEditingPrices(prev => ({ ...prev, transferFeePercentage: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio de Novelas por Capítulo (CUP)
                </label>
                <input
                  type="number"
                  value={editingPrices.novelPricePerChapter}
                  onChange={(e) => setEditingPrices(prev => ({ ...prev, novelPricePerChapter: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handlePricesUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Precios
              </button>
            </div>
          </div>
        )}

        {/* Delivery Zones Tab */}
        {activeTab === 'delivery' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Zonas de Entrega</h2>
              <button
                onClick={() => setShowNewZoneForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Zona
              </button>
            </div>

            {/* New Zone Form */}
            {showNewZoneForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Zona de Entrega</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Zona
                    </label>
                    <input
                      type="text"
                      value={newZone.name}
                      onChange={(e) => setNewZone(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ej: Santiago de Cuba > Centro"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Costo de Entrega (CUP)
                    </label>
                    <input
                      type="number"
                      value={newZone.cost}
                      onChange={(e) => setNewZone(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={handleAddZone}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Agregar
                  </button>
                  <button
                    onClick={() => setShowNewZoneForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Zones List */}
            <div className="space-y-4">
              {state.deliveryZones.map(zone => (
                <div key={zone.id} className="border border-gray-200 rounded-lg p-4">
                  {editingZone?.id === zone.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          value={editingZone.name}
                          onChange={(e) => setEditingZone(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={editingZone.cost}
                          onChange={(e) => setEditingZone(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateZone}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingZone(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{zone.name}</h3>
                        <p className="text-sm text-gray-600">${zone.cost.toLocaleString()} CUP</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingZone(zone)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteDeliveryZone(zone.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Novels Tab */}
        {activeTab === 'novels' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Novelas</h2>
              <button
                onClick={() => setShowNewNovelForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Novela
              </button>
            </div>

            {/* New Novel Form */}
            {showNewNovelForm && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Novela</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={newNovel.titulo}
                      onChange={(e) => setNewNovel(prev => ({ ...prev, titulo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Título de la novela"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Género *
                    </label>
                    <select
                      value={newNovel.genero}
                      onChange={(e) => setNewNovel(prev => ({ ...prev, genero: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seleccionar género</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País
                    </label>
                    <select
                      value={newNovel.pais}
                      onChange={(e) => setNewNovel(prev => ({ ...prev, pais: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seleccionar país</option>
                      {countries.map(country => (
                        <option key={country} value={country}>
                          {getCountryFlag(country)} {country}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capítulos *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newNovel.capitulos}
                      onChange={(e) => setNewNovel(prev => ({ ...prev, capitulos: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Año *
                    </label>
                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 5}
                      value={newNovel.año}
                      onChange={(e) => setNewNovel(prev => ({ ...prev, año: parseInt(e.target.value) || new Date().getFullYear() }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={newNovel.estado}
                      onChange={(e) => setNewNovel(prev => ({ ...prev, estado: e.target.value as 'transmision' | 'finalizada' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="finalizada">✅ Finalizada</option>
                      <option value="transmision">📡 En Transmisión</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de Imagen (opcional)
                    </label>
                    <input
                      type="url"
                      value={newNovel.imagen}
                      onChange={(e) => setNewNovel(prev => ({ ...prev, imagen: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={newNovel.descripcion}
                      onChange={(e) => setNewNovel(prev => ({ ...prev, descripcion: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Descripción de la novela..."
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleAddNovel}
                    disabled={!newNovel.titulo || !newNovel.genero || newNovel.capitulos <= 0}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Agregar Novela
                  </button>
                  <button
                    onClick={() => setShowNewNovelForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Novels List */}
            <div className="space-y-4">
              {state.novels.map(novel => (
                <div key={novel.id} className="border border-gray-200 rounded-lg p-4">
                  {editingNovel?.id === novel.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                          <input
                            type="text"
                            value={editingNovel.titulo}
                            onChange={(e) => setEditingNovel(prev => ({ ...prev, titulo: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                          <select
                            value={editingNovel.genero}
                            onChange={(e) => setEditingNovel(prev => ({ ...prev, genero: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {genres.map(genre => (
                              <option key={genre} value={genre}>{genre}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                          <select
                            value={editingNovel.pais || ''}
                            onChange={(e) => setEditingNovel(prev => ({ ...prev, pais: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Seleccionar país</option>
                            {countries.map(country => (
                              <option key={country} value={country}>
                                {getCountryFlag(country)} {country}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Capítulos</label>
                          <input
                            type="number"
                            min="1"
                            value={editingNovel.capitulos}
                            onChange={(e) => setEditingNovel(prev => ({ ...prev, capitulos: parseInt(e.target.value) || 1 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                          <input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear() + 5}
                            value={editingNovel.año}
                            onChange={(e) => setEditingNovel(prev => ({ ...prev, año: parseInt(e.target.value) || new Date().getFullYear() }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                          <select
                            value={editingNovel.estado}
                            onChange={(e) => setEditingNovel(prev => ({ ...prev, estado: e.target.value as 'transmision' | 'finalizada' }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="finalizada">✅ Finalizada</option>
                            <option value="transmision">📡 En Transmisión</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
                          <input
                            type="url"
                            value={editingNovel.imagen || ''}
                            onChange={(e) => setEditingNovel(prev => ({ ...prev, imagen: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://ejemplo.com/imagen.jpg"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                          <textarea
                            value={editingNovel.descripcion || ''}
                            onChange={(e) => setEditingNovel(prev => ({ ...prev, descripcion: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateNovel}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Guardar Cambios
                        </button>
                        <button
                          onClick={() => setEditingNovel(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-medium text-gray-900 text-lg mr-3">{novel.titulo}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            novel.estado === 'transmision' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {novel.estado === 'transmision' ? '📡 En Transmisión' : '✅ Finalizada'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Género:</span> {novel.genero}
                          </div>
                          <div>
                            <span className="font-medium">País:</span> {getCountryFlag(novel.pais || 'No especificado')} {novel.pais || 'No especificado'}
                          </div>
                          <div>
                            <span className="font-medium">Capítulos:</span> {novel.capitulos}
                          </div>
                          <div>
                            <span className="font-medium">Año:</span> {novel.año}
                          </div>
                        </div>
                        {novel.descripcion && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{novel.descripcion}</p>
                        )}
                        <div className="mt-2 text-sm">
                          <span className="font-medium text-purple-600">
                            Precio: ${(novel.capitulos * state.prices.novelPricePerChapter).toLocaleString()} CUP
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setEditingNovel(novel)}
                          className="text-blue-600 hover:text-blue-800 p-2"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteNovel(novel.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {state.novels.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No hay novelas registradas</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Notificaciones del Sistema</h2>
              <button
                onClick={clearNotifications}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar Todas
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {state.notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    notification.type === 'success' ? 'bg-green-50 border-green-400' :
                    notification.type === 'error' ? 'bg-red-50 border-red-400' :
                    notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                    'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {notification.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
                      {notification.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600" />}
                      {notification.type === 'info' && <Info className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded-full mr-2">{notification.section}</span>
                        <span>{new Date(notification.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {state.notifications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No hay notificaciones</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            {/* System Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Información del Sistema</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Versión</h3>
                  <p className="text-2xl font-bold text-blue-600">{state.systemConfig.version}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">Última Sincronización</h3>
                  <p className="text-sm text-green-600">
                    {new Date(state.syncStatus.lastSync).toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900 mb-2">Estado</h3>
                  <p className={`text-sm font-medium ${state.syncStatus.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {state.syncStatus.isOnline ? '🟢 En línea' : '🔴 Desconectado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Export/Import */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestión de Configuración</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={exportSystemConfig}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Exportar Configuración
                </button>
                
                <label className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center cursor-pointer">
                  <Upload className="h-5 w-5 mr-2" />
                  Importar Configuración
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </label>
                
                <button
                  onClick={exportCompleteSourceCode}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center md:col-span-2"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Exportar Código Fuente Completo
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de Contacto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center mb-3">
                    <Smartphone className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-medium text-gray-900">WhatsApp</h3>
                  </div>
                  <p className="text-lg font-bold text-green-600">+53 5469 0878</p>
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => window.open('tel:+5354690878', '_self')}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Llamar
                    </button>
                    <button
                      onClick={() => window.open('https://wa.me/5354690878', '_blank')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      WhatsApp
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center mb-3">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Ubicación</h3>
                  </div>
                  <p className="text-sm text-gray-600">Reparto Nuevo Vista Alegre</p>
                  <p className="text-sm text-gray-600">Santiago de Cuba, Cuba</p>
                  <button
                    onClick={() => window.open('https://www.google.com/maps/place/20%C2%B002\'22.5%22N+75%C2%B050\'58.8%22W/@20.0394604,-75.8495414,180m/data=!3m1!1e3!4m4!3m3!8m2!3d20.039585!4d-75.849663?entry=ttu&g_ep=EgoyMDI1MDczMC4wIKXMDSoASAFQAw%3D%3D', '_blank')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center mt-3"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    Ver en Mapa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}