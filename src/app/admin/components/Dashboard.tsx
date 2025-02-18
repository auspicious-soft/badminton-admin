import React from 'react';

const StatCard = ({ value, label }) => (
  <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
    <div className="bg-orange-100 p-2 rounded-full">
      <div className="w-3 h-3 bg-orange-500 rounded-full" />
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
);

const ScheduleItem = ({ time, name, game, duration }) => (
  <div className="flex items-center gap-4 py-3 border-b border-gray-100">
    <div className="text-sm text-gray-500 w-16">{time}</div>
    <div className="flex-1">
      <div className="font-medium text-gray-900">{name}</div>
      <div className="text-sm text-gray-500">{game}</div>
    </div>
    <div className="text-sm text-gray-500">{duration}</div>
  </div>
);

const BookingRow = ({ name, game, city, date }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gray-200 rounded-full" />
      <div>
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-sm text-gray-500">{game}</div>
      </div>
    </div>
    <div className="text-sm text-gray-500">{city}</div>
    <div className="text-sm text-gray-500">{date}</div>
    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24">
      <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  </div>
);

const SimpleChart = () => (
  <div className="relative h-64 mt-4">
    <div className="absolute inset-0 flex items-end justify-between px-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
        <div key={month} className="flex flex-col items-center">
          <div className="h-32 w-2 bg-blue-500 rounded-t opacity-75" 
               style={{ height: `${3 * 100 + 20}px` }} />
          <div className="mt-2 text-xs text-gray-500">M{month}</div>
        </div>
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const scheduleData = Array.from({ length: 5 }, (_, i) => ({
    time: `${9 + i}:00`,
    name: 'Neil Melendez',
    game: 'Padel Match',
    duration: '120 Mins'
  }));

  const bookingsData = [
    { name: 'Tracy Martin', game: 'Padel', city: 'Chandigarh', date: '22-01-2024' },
    { name: 'Jordan Lee', game: 'Pickleball', city: 'Chandigarh', date: '22-01-2024' },
    { name: 'Alan Parker', game: 'Padel', city: 'Chandigarh', date: '22-01-2024' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome to Barnton Park LTC
        </h1>
        <div className="flex items-center gap-4">
          <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" 
                  fill="currentColor" />
          </svg>
          <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" 
                  fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard value="240" label="Total matches this month" />
        <StatCard value="120" label="Pickleball matches this month" />
        <StatCard value="120" label="Padel matches this month" />
        <StatCard value="₹22,300" label="Income this month" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schedule Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Today Schedule</h2>
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="space-y-1">
            {scheduleData.map((item, index) => (
              <ScheduleItem key={index} {...item} />
            ))}
          </div>
        </div>

        {/* Bookings Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="space-y-1">
            {bookingsData.map((booking, index) => (
              <BookingRow key={index} {...booking} />
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Statistics</h2>
        <SimpleChart />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Ongoing Matches */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Ongoing Matches</h2>
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-orange-500">4</div>
            <div className="text-sm text-gray-500">Padel</div>
            <div className="text-4xl font-bold text-blue-500 mt-4">3</div>
            <div className="text-sm text-gray-500">Pickleball</div>
          </div>
        </div>

        {/* Game Booking Composition */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Game Booking Composition</h2>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500">66%</div>
              <div className="text-sm text-gray-500">Padel</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500">34%</div>
              <div className="text-sm text-gray-500">Pickleball</div>
            </div>
          </div>
          <div className="text-sm text-gray-500 text-center mt-4">
            People love to play Padel at your court!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;