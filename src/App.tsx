import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Box,
  Clock,
  ListTodo,
  PackageCheck,
  Settings,
  Users,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
} from 'lucide-react';
import { Menu } from '@headlessui/react';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  quantity: number;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  assignee: string;
  department: string;
}

function App() {
  const [tasks] = useState<Task[]>([
    {
      id: 'T1',
      title: 'Electronics Assembly',
      dueDate: '2024-03-25',
      priority: 'high',
      quantity: 75,
      status: 'in-progress',
      progress: 45,
      assignee: 'Sarah Chen',
      department: 'Assembly',
    },
    {
      id: 'T2',
      title: 'Package Components',
      dueDate: '2024-03-24',
      priority: 'medium',
      quantity: 120,
      status: 'pending',
      progress: 0,
      assignee: 'Mike Rodriguez',
      department: 'Packaging',
    },
    {
      id: 'T3',
      title: 'Quality Check',
      dueDate: '2024-03-23',
      priority: 'high',
      quantity: 50,
      status: 'completed',
      progress: 100,
      assignee: 'Alex Thompson',
      department: 'QA',
    },
  ]);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Task;
    direction: 'asc' | 'desc';
  }>({ key: 'dueDate', direction: 'asc' });

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const metrics = {
    throughput: 142,
    maxCapacity: 150,
    activeHighPriority: 2,
    efficiency: 94.7,
  };

  const sortedAndFilteredTasks = useMemo(() => {
    let filteredTasks = tasks;

    // Apply search filter
    if (searchTerm) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filteredTasks = filteredTasks.filter((task) => task.status === filterStatus);
    }

    // Apply sorting
    return [...filteredTasks].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [tasks, sortConfig, filterStatus, searchTerm]);

  const handleSort = (key: keyof Task) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PackageCheck className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-semibold text-gray-900">
                Fulfillment Optimizer
              </h1>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
            title="Current Throughput"
            value={`${metrics.throughput}/${metrics.maxCapacity}`}
            subtitle="units per hour"
            progress={(metrics.throughput / metrics.maxCapacity) * 100}
          />
          <MetricCard
            icon={<ListTodo className="h-6 w-6 text-green-600" />}
            title="High Priority Tasks"
            value={`${metrics.activeHighPriority}/3`}
            subtitle="active tasks"
            progress={(metrics.activeHighPriority / 3) * 100}
          />
          <MetricCard
            icon={<Users className="h-6 w-6 text-purple-600" />}
            title="Staff Utilization"
            value={`${metrics.efficiency}%`}
            subtitle="efficiency rate"
            progress={metrics.efficiency}
          />
          <MetricCard
            icon={<Clock className="h-6 w-6 text-orange-600" />}
            title="Next Due Task"
            value="23h 45m"
            subtitle="remaining time"
            progress={75}
          />
        </div>

        {/* Tasks Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-lg font-medium text-gray-900">Active Tasks</h2>
              <div className="flex space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {filterStatus === 'all'
                        ? 'All Status'
                        : filterStatus.charAt(0).toUpperCase() +
                          filterStatus.slice(1)}
                    </span>
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 focus:outline-none">
                    <div className="py-1">
                      {['all', 'pending', 'in-progress', 'completed'].map(
                        (status) => (
                          <Menu.Item key={status}>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                                onClick={() => setFilterStatus(status)}
                              >
                                {status === 'all'
                                  ? 'All Status'
                                  : status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                              </button>
                            )}
                          </Menu.Item>
                        )
                      )}
                    </div>
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Task
                      {sortConfig.key === 'title' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('dueDate')}
                  >
                    <div className="flex items-center">
                      Due Date
                      {sortConfig.key === 'dueDate' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center">
                      Priority
                      {sortConfig.key === 'priority' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignee
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === 'status' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAndFilteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {task.title}
                      </div>
                      <div className="text-sm text-gray-500">#{task.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{task.dueDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            task.progress === 100
                              ? 'bg-green-600'
                              : task.progress >= 50
                              ? 'bg-blue-600'
                              : 'bg-yellow-600'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {task.progress}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{task.assignee}</div>
                      <div className="text-sm text-gray-500">
                        {task.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : task.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  progress: number;
}

function MetricCard({ icon, title, value, subtitle, progress }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-4 flex-1">
          <div className="text-sm font-medium text-gray-500">{title}</div>
          <div className="mt-1 text-xl font-semibold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{subtitle}</div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-blue-600"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;