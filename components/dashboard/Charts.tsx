'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface ChartsProps {
  data: any[];
}

export function Charts({ data }: ChartsProps) {
  // Process data for Plan Distribution
  const planDistribution = data.reduce((acc: any, user) => {
    const plan = user.plan || 'free';
    acc[plan] = (acc[plan] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(planDistribution).map(name => ({
    name: name.toUpperCase(),
    value: planDistribution[name]
  }));

  const COLORS = ['#6366f1', '#a855f7', '#ec4899'];

  // Mock data for Growth Trend (since we might not have enough real dates)
  const trendData = [
    { name: 'Mon', signups: 4 },
    { name: 'Tue', signups: 7 },
    { name: 'Wed', signups: 5 },
    { name: 'Thu', signups: 12 },
    { name: 'Fri', signups: 9 },
    { name: 'Sat', signups: 15 },
    { name: 'Sun', signups: 10 },
  ];

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-12">
      <motion.div variants={item}>
        <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Signup Trend</CardTitle>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">Weekly Growth</h3>
          </CardHeader>
          <CardContent className="p-8 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 800,
                    backgroundColor: '#fff'
                  }}
                />
                <Bar 
                  dataKey="signups" 
                  fill="#6366f1" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                >
                  {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === trendData.length - 1 ? '#6366f1' : '#e0e7ff'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Plan Interest</CardTitle>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">Market Distribution</h3>
          </CardHeader>
          <CardContent className="p-8 h-[300px] flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                      fontWeight: 800
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-4 pl-8">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{entry.name}</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">{entry.value} signups</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
