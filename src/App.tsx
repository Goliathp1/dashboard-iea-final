import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, Award, BarChart3, MessageSquare, Target, Activity, Brain, Lightbulb, Star
} from 'lucide-react';

// --- DEFINICIONES DE TYPESCRIPT PARA EVITAR ERRORES EN VERCEL ---
type ScoreData = Record<number, number>;

interface RawQuestionData {
  id: number;
  title: string;
  g1: ScoreData;
  g2: ScoreData;
}

// --- DATOS PROCESADOS ---
const kpis = {
  g1: { matriculados: 16, respuestas: 7, notaMedia: 9.14 },
  g2: { matriculados: 12, respuestas: 7, notaMedia: 8.29 },
};

// Radar chart convertido a base 10 (multiplicado por 2)
const radarData = [
  { subject: 'Módulo 1', G1: 7.72, G2: 7.42, full: 'Módulo 1: Introducción a las emociones' },
  { subject: 'Módulo 2', G1: 7.72, G2: 7.72, full: 'Módulo 2: Emociones básicas' },
  { subject: 'Módulo 3', G1: 8.86, G2: 7.14, full: 'Módulo 3: Sentimientos y comunicación' },
  { subject: 'Módulo 4', G1: 9.14, G2: 8.86, full: 'Módulo 4: Reuniones y negociación' },
];

const generalStatsData = [
  { question: 'Q1. Utilidad', G1: 4.57, G2: 4.14, full: '¿Cuán útil te ha resultado este taller?' },
  { question: 'Q2. Recomendación', G1: 4.57, G2: 4.14, full: '¿Cuánto lo recomendarías?' },
  { question: 'Q7. Tareas', G1: 3.71, G2: 3.29, full: '¿Cómo te has sentido al realizar las tareas?' },
];

// Datos de Distribución de la nota final (Área)
const distributionData = [
  { nota: '1 a 6', G1: 0, G2: 0 },
  { nota: 'Nota 7', G1: 0, G2: 2 },
  { nota: 'Nota 8', G1: 1, G2: 2 },
  { nota: 'Nota 9', G1: 4, G2: 2 },
  { nota: 'Nota 10', G1: 2, G2: 1 },
];

// Datos para el gráfico NPS (Net Promoter Score)
const npsData = [
  { name: 'Promotores (9-10)', value: 9, color: '#10B981' }, // Verde esmeralda
  { name: 'Neutros (7-8)', value: 5, color: '#F59E0B' }, // Ámbar
  { name: 'Detractores (1-6)', value: 0, color: '#EF4444' }, // Rojo (0)
];

const rawQuestionData: RawQuestionData[] = [
  { id: 1, title: '¿Cuán útil te ha resultado este taller?', g1: { 1: 0, 2: 0, 3: 0, 4: 3, 5: 4 }, g2: { 1: 0, 2: 0, 3: 1, 4: 4, 5: 2 } },
  { id: 2, title: '¿Cuánto lo recomendarías?', g1: { 1: 0, 2: 0, 3: 0, 4: 3, 5: 4 }, g2: { 1: 0, 2: 0, 3: 2, 4: 2, 5: 3 } },
  { id: 3, title: 'Módulo 1: Introducción a las emociones', g1: { 1: 0, 2: 2, 3: 0, 4: 2, 5: 3 }, g2: { 1: 0, 2: 1, 3: 2, 4: 2, 5: 2 } },
  { id: 4, title: 'Módulo 2: Emociones básicas', g1: { 1: 0, 2: 1, 3: 1, 4: 3, 5: 2 }, g2: { 1: 0, 2: 1, 3: 1, 4: 3, 5: 2 } },
  { id: 5, title: 'Módulo 3: Sentimientos y comunicación', g1: { 1: 0, 2: 0, 3: 1, 4: 2, 5: 4 }, g2: { 1: 1, 2: 0, 3: 2, 4: 2, 5: 2 } },
  { id: 6, title: 'Módulo 4: Reuniones y negociación', g1: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 5 }, g2: { 1: 0, 2: 0, 3: 0, 4: 4, 5: 3 } },
  { id: 7, title: '¿Cómo te has sentido al realizar las tareas?', g1: { 1: 0, 2: 0, 3: 3, 4: 3, 5: 1 }, g2: { 1: 1, 2: 1, 3: 1, 4: 3, 5: 1 } },
];

const q10Data: { title: string; g1: ScoreData; g2: ScoreData } = {
  title: '¿Qué nota le pones a este taller? (Escala 1-10)',
  g1: { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:1, 9:4, 10:2 },
  g2: { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:2, 8:2, 9:2, 10:1 }
};

const feedbackData = {
  q8: {
    title: '8. ¿Qué te llevas de este taller?',
    g1: [
      "Cosas a trabajar y mejorar. Y lo mas importante, herramientas de como trabajarlas y como orientarlas.",
      "Una buena experiencia, y el haber aprendido a darme cuenta de ciertas cosas más rápido que antes, las cual me costaba ver o apreciar.",
      "Me llevo varias cosas, pero sobre todo me quedo con como influyen nuestros pensamientos en nuestras emociones",
      "DIferenciar mejor mis emociones, ayudarme a gestionarlas de diferente forma y sobre todo a utilizar la energia negativa para impulsarme en lugar de encerrarme",
      "Me llevo entender mis emociones mejor y las explicaciones como comunicaodres",
      "Reflexión y cambio en alguna manera de actuar que tenía.",
      "Tarea y mucha. Es fundamental para mi integrar realmente que las cosas pasan quiera yo o no, y lo importante es cómo me lo tomo yo, cómo lo siento. A partir de ahí, tengo que evolucionar como persona."
    ],
    g2: [
      "Cuando algo no sale como yo quiero, aceptarlo, antes de enfadarme.",
      "Conocerme mejor, gestionar sentimientos, actuar ante situaciones de otra manera",
      "Identificar de manera clara las emociones, y ayudarnos mediante las tareas a hacer una mirada interna real de y como estas nos arrastran a ciertas situaciones cuando no las controlamos.",
      "Ver las cosas desde otro punto",
      "Muchas cosas pero sobre todo a conocerte más distinguir lo que pasa x tu mente y cuerpo y saber responder y canalizarlo !",
      "Conocerme a mí mismo",
      "La idea de que esta en nosotros cambiar las cosas"
    ]
  },
  q9: {
    title: '9. ¿Qué crees que necesitas ampliar y/o qué te gustaría trabajar (laboral o personal)?',
    g1: [
      "Personal",
      "laboral",
      "Quizás me hubiera gustado poder realizar el ejercicio de negociación una segunda vez en la que pudiéramos pulir los aspectos mejorables de la primera y ver que el resultado aplicando todo esto es el que se busca",
      "Me gustaria ampliar la parte de los modulos 3 y 4",
      "Me gustaria ampliar mis conocimientos en como gestionar equipos en funcion de las personalidades de cada uno",
      "Herramientas para no obsesionarme tanto en determinadas situaciones .",
      "Necesitaría un folio muy grande... quiero trabajar/ampliar todo. Estoy en un momento, sobre todo laboral, donde no encuentro sentido a mi función en la empresa... busco reorientarme o reinventarme..."
    ],
    g2: [
      "Madurar los conocimientos adquiridos.",
      "Sacar todos los sentimientos que están enquistados",
      "Que las emociones no me sobrepasen.",
      "Laboral",
      "Sobre todo a expresar mis sentimientos y emociones q no lo suelo hacer !",
      "Enfocarlo aún más a lo laboral",
      "mas módulos de negociación"
    ]
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const isRadarChart = payload[0].payload.subject !== undefined;
    const maxScore = isRadarChart ? 10 : 5;

    // Si es el gráfico NPS o de área, mostramos el formato normal
    if (payload[0].name === 'Promotores (9-10)' || payload[0].name === 'Neutros (7-8)' || payload[0].name === 'Detractores (1-6)') {
      return (
        <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-lg">
          <p className="font-semibold text-slate-800 mb-1">{payload[0].name}</p>
          <p style={{ color: payload[0].payload.color }} className="text-sm font-bold">
            {payload[0].value} participantes
          </p>
        </div>
      );
    }
    
    // Si es el gráfico de área (G1 y G2)
    if (payload[0].name === 'Grupo 1' && !isRadarChart && !payload[0].payload.question) {
       return (
        <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-lg">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {entry.value} persona(s)
            </p>
          ))}
        </div>
      );
    }

    return (
      <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-lg">
        <p className="font-semibold text-slate-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
            {entry.name}: {entry.value.toFixed(2)} / {maxScore}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const logoUrl = "https://aliadohumano.com/wp-content/uploads/2026/02/Logo-inteligencia-emocional-aplicada.png"; 

  // Cálculo de la nota media global
  const notaGlobal = ((kpis.g1.notaMedia + kpis.g2.notaMedia) / 2).toFixed(2);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      
      {/* Header Corporativo con Logo */}
      <header className="bg-[#1E3A8A] text-white py-6 px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="bg-white p-2 rounded-lg hidden md:block">
              <img src={logoUrl} alt="Logo Aliado Humano" className="h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard de Resultados</h1>
              <p className="text-blue-200 mt-1 text-sm md:text-base">Taller Inteligencia Emocional Aplicada (Nivel I)</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
              <p className="text-xs text-blue-200 uppercase tracking-wider">Total Respuestas</p>
              <p className="text-xl font-bold text-white text-right">14</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navegación por Pestañas */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 flex space-x-8">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`py-4 px-2 border-b-2 font-medium transition-colors flex items-center gap-2 ${activeTab === 'dashboard' ? 'border-[#B91C1C] text-[#B91C1C]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <BarChart3 className="w-4 h-4" /> Resumen Analítico
          </button>
          <button 
            onClick={() => setActiveTab('tables')}
            className={`py-4 px-2 border-b-2 font-medium transition-colors flex items-center gap-2 ${activeTab === 'tables' ? 'border-[#B91C1C] text-[#B91C1C]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Activity className="w-4 h-4" /> Tablas Comparativas
          </button>
          <button 
            onClick={() => setActiveTab('feedback')}
            className={`py-4 px-2 border-b-2 font-medium transition-colors flex items-center gap-2 ${activeTab === 'feedback' ? 'border-[#B91C1C] text-[#B91C1C]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <MessageSquare className="w-4 h-4" /> Feedback Cualitativo
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* --- PESTAÑA 1: DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* Tarjeta de Nota Media Global */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3b82f6] p-6 sm:p-8 rounded-2xl shadow-md text-white flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-medium text-sm uppercase tracking-wider mb-1">Nota Media Global del Taller</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold">{notaGlobal}</span>
                  <span className="text-2xl text-blue-200 font-medium">/ 10</span>
                </div>
              </div>
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-md border border-white/20 hidden sm:block">
                <Star className="w-10 h-10 text-yellow-300 fill-yellow-300" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Participación G1</p>
                  <p className="text-3xl font-bold text-[#1E3A8A] mt-2">43.7%</p>
                  <p className="text-xs text-slate-400 mt-1">7 de {kpis.g1.matriculados}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-[#1E3A8A]"><Users className="w-6 h-6" /></div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Participación G2</p>
                  <p className="text-3xl font-bold text-[#B91C1C] mt-2">58.3%</p>
                  <p className="text-xs text-slate-400 mt-1">7 de {kpis.g2.matriculados}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-[#B91C1C]"><Users className="w-6 h-6" /></div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Nota Taller G1</p>
                  <p className="text-3xl font-bold text-[#1E3A8A] mt-2">{kpis.g1.notaMedia}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-[#1E3A8A]"><Award className="w-6 h-6" /></div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Nota Taller G2</p>
                  <p className="text-3xl font-bold text-[#B91C1C] mt-2">{kpis.g2.notaMedia}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-[#B91C1C]"><Target className="w-6 h-6" /></div>
              </div>
            </div>

            {/* SECCIÓN NUEVA: GRÁFICOS EJECUTIVOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Gráfico 1: NPS (Métrica Ejecutiva) */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Índice de Excelencia (NPS)</h3>
                <p className="text-sm text-slate-500 mb-6">Basado en la nota global (0% Detractores)</p>
                <div className="h-64 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={npsData}
                        cx="50%"
                        cy="80%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {npsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Texto central del semicírculo */}
                  <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-3xl font-black text-emerald-500">64%</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">NPS Score</p>
                  </div>
                </div>
              </div>

              {/* Gráfico 2: Curva de Satisfacción (Área) */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Curva de Satisfacción (Nota Final)</h3>
                <p className="text-sm text-slate-500 mb-6">Acumulación de votos en el tramo de sobresaliente</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={distributionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorG1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorG2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#B91C1C" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#B91C1C" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="nota" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#475569' }} axisLine={false} tickLine={false} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36}/>
                      <Area type="monotone" dataKey="G1" name="Grupo 1" stroke="#1E3A8A" strokeWidth={3} fillOpacity={1} fill="url(#colorG1)" />
                      <Area type="monotone" dataKey="G2" name="Grupo 2" stroke="#B91C1C" strokeWidth={3} fillOpacity={1} fill="url(#colorG2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* GRÁFICOS ORIGINALES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Comparativa por Módulos (Base 10)</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#94a3b8' }} />
                      <Radar name="Grupo 1" dataKey="G1" stroke="#1E3A8A" fill="#1E3A8A" fillOpacity={0.4} />
                      <Radar name="Grupo 2" dataKey="G2" stroke="#B91C1C" fill="#B91C1C" fillOpacity={0.4} />
                      <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                      <RechartsTooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Preguntas Generales (Promedios 1-5)</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generalStatsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="question" tick={{ fill: '#475569', fontSize: 13 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 5]} tick={{ fill: '#475569' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                      <Bar dataKey="G1" name="Grupo 1" fill="#1E3A8A" radius={[4, 4, 0, 0]} barSize={40} />
                      <Bar dataKey="G2" name="Grupo 2" fill="#B91C1C" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- PESTAÑA 2: TABLAS COMPARATIVAS --- */}
        {activeTab === 'tables' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-xl font-bold text-[#1E3A8A]">Desglose de Puntuaciones (Escala 1 al 5)</h2>
                <p className="text-sm text-slate-500 mt-1">Número exacto de respuestas por cada opción.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-100 text-slate-800 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4 w-1/3">Pregunta / Módulo</th>
                      <th className="px-6 py-4 text-center border-l border-white bg-blue-100/50 text-[#1E3A8A]" colSpan={5}>Grupo 1 (7 Respuestas)</th>
                      <th className="px-6 py-4 text-center border-l border-white bg-red-100/50 text-[#B91C1C]" colSpan={5}>Grupo 2 (7 Respuestas)</th>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <th className="px-6 py-2 bg-white"></th>
                      <th className="px-2 py-2 text-center bg-blue-50/50 text-slate-400">1</th>
                      <th className="px-2 py-2 text-center bg-blue-50/50 text-slate-500">2</th>
                      <th className="px-2 py-2 text-center bg-blue-50/50 text-slate-600">3</th>
                      <th className="px-2 py-2 text-center bg-blue-50/50 text-[#1E3A8A] font-bold">4</th>
                      <th className="px-2 py-2 text-center bg-blue-50/50 text-[#1E3A8A] font-bold">5</th>
                      <th className="px-2 py-2 text-center bg-red-50/50 text-slate-400 border-l border-white">1</th>
                      <th className="px-2 py-2 text-center bg-red-50/50 text-slate-500">2</th>
                      <th className="px-2 py-2 text-center bg-red-50/50 text-slate-600">3</th>
                      <th className="px-2 py-2 text-center bg-red-50/50 text-[#B91C1C] font-bold">4</th>
                      <th className="px-2 py-2 text-center bg-red-50/50 text-[#B91C1C] font-bold">5</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rawQuestionData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{row.title}</td>
                        {[1,2,3,4,5].map(val => (
                          <td key={`g1-${val}`} className={`px-2 py-4 text-center ${row.g1[val] > 0 ? 'font-semibold text-slate-800' : 'text-slate-300'}`}>
                            {row.g1[val] > 0 ? row.g1[val] : '0'}
                          </td>
                        ))}
                        {[1,2,3,4,5].map(val => (
                          <td key={`g2-${val}`} className={`px-2 py-4 text-center border-l border-slate-100 ${row.g2[val] > 0 ? 'font-semibold text-slate-800' : 'text-slate-300'}`}>
                            {row.g2[val] > 0 ? row.g2[val] : '0'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-xl font-bold text-[#1E3A8A]">{q10Data.title}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-100 text-slate-800 uppercase text-xs font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 w-32">Grupo</th>
                      {[1,2,3,4,5,6,7,8,9,10].map(val => (
                         <th key={val} className="px-2 py-3 text-center">{val}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-blue-50/30">
                      <td className="px-6 py-4 font-bold text-[#1E3A8A]">Grupo 1</td>
                      {[1,2,3,4,5,6,7,8,9,10].map(val => (
                        <td key={`q10-g1-${val}`} className={`px-2 py-4 text-center ${q10Data.g1[val] > 0 ? 'font-bold text-[#1E3A8A] bg-blue-50 rounded' : 'text-slate-300'}`}>
                          {q10Data.g1[val] > 0 ? q10Data.g1[val] : '0'}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-red-50/30">
                      <td className="px-6 py-4 font-bold text-[#B91C1C]">Grupo 2</td>
                      {[1,2,3,4,5,6,7,8,9,10].map(val => (
                        <td key={`q10-g2-${val}`} className={`px-2 py-4 text-center ${q10Data.g2[val] > 0 ? 'font-bold text-[#B91C1C] bg-red-50 rounded' : 'text-slate-300'}`}>
                          {q10Data.g2[val] > 0 ? q10Data.g2[val] : '0'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- PESTAÑA 3: FEEDBACK CUALITATIVO --- */}
        {activeTab === 'feedback' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            
            <section>
              <h2 className="text-2xl font-bold text-[#1E3A8A] mb-8 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-[#B91C1C]" />
                {feedbackData.q8.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#1E3A8A]">
                    <div className="w-3 h-3 rounded-full bg-[#1E3A8A]"></div>
                    <h3 className="text-lg font-bold text-slate-800">Grupo 1</h3>
                  </div>
                  <div className="space-y-4">
                    {feedbackData.q8.g1.map((item, idx) => (
                      <div key={`q8-g1-${idx}`} className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 hover:border-blue-200 transition-all">
                        <p className="text-slate-600 leading-relaxed italic">"{item}"</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#B91C1C]">
                    <div className="w-3 h-3 rounded-full bg-[#B91C1C]"></div>
                    <h3 className="text-lg font-bold text-slate-800">Grupo 2</h3>
                  </div>
                  <div className="space-y-4">
                    {feedbackData.q8.g2.map((item, idx) => (
                      <div key={`q8-g2-${idx}`} className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 hover:border-red-200 transition-all">
                        <p className="text-slate-600 leading-relaxed italic">"{item}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            <section>
              <h2 className="text-2xl font-bold text-[#1E3A8A] mb-8 flex items-center gap-3">
                <Target className="w-6 h-6 text-[#B91C1C]" />
                {feedbackData.q9.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#1E3A8A]">
                    <div className="w-3 h-3 rounded-full bg-[#1E3A8A]"></div>
                    <h3 className="text-lg font-bold text-slate-800">Grupo 1</h3>
                  </div>
                  <div className="space-y-4">
                    {feedbackData.q9.g1.map((item, idx) => (
                      <div key={`q9-g1-${idx}`} className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 border-l-4 border-l-[#1E3A8A] transition-all">
                        <p className="text-slate-600 leading-relaxed">"{item}"</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#B91C1C]">
                    <div className="w-3 h-3 rounded-full bg-[#B91C1C]"></div>
                    <h3 className="text-lg font-bold text-slate-800">Grupo 2</h3>
                  </div>
                  <div className="space-y-4">
                    {feedbackData.q9.g2.map((item, idx) => (
                      <div key={`q9-g2-${idx}`} className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 border-l-4 border-l-[#B91C1C] transition-all">
                        <p className="text-slate-600 leading-relaxed">"{item}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Análisis Cualitativo Estático */}
            <section className="bg-gradient-to-br from-blue-50 to-slate-50 p-8 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Brain className="w-48 h-48" />
              </div>
              <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6 flex items-center gap-3 relative z-10">
                <Lightbulb className="w-7 h-7 text-[#B91C1C]" />
                Análisis Cualitativo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-800">Impacto y Consciencia (El "Darse Cuenta")</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Ambos grupos muestran un <strong>salto cualitativo en autoconsciencia</strong>. Se repiten patrones clave: pasar de la reacción a la proactividad (<em>"aceptar antes de enfadarme"</em>, <em>"utilizar la energía negativa para impulsarme"</em>). El taller ha logrado aterrizar conceptos teóricos en <strong>empoderamiento personal</strong> (<em>"la frase 'yo elijo, aquí y ahora'... toma toda su fuerza"</em>). Existe una clara asimilación de que la gestión emocional empieza por la responsabilidad individual.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-800">Áreas de Desarrollo y Necesidades Futuras</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Detectamos dos vertientes claras para el seguimiento: 
                    <br/>1. <strong>Profundización Personal:</strong> Necesidad de soltar bloqueos (<em>"sentimientos enquistados"</em>) y rebajar la rumiación o sobreanálisis (<em>"no obsesionarme tanto"</em>).
                    <br/>2. <strong>Aplicación Profesional (Liderazgo):</strong> Hay un apetito evidente por llevar esto a la gestión de equipos (entender personalidades), mejorar las reuniones (más role-play de negociación) e incluso resolver crisis de propósito laboral.
                  </p>
                </div>
              </div>
            </section>

          </div>
        )}

      </main>
    </div>
  );
}
