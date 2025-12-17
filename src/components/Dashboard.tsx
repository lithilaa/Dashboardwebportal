import { useEffect, useState } from 'react';
import { MoreVertical, ChevronDown, ArrowUp, Equal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Project, Status, Priority } from '../types/project';

export function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, statusFilter, priorityFilter]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    if (statusFilter) {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter((p) => p.priority === priorityFilter);
    }

    setFilteredProjects(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusStyles = (status: Status) => {
    switch (status) {
      case 'TO DO':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'PAUSED':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'IN PROGRESS':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'High':
        return <ArrowUp className="w-4 h-4 text-orange-500" />;
      case 'Medium':
        return <Equal className="w-4 h-4 text-orange-500" />;
      case 'Low':
        return <Equal className="w-4 h-4 text-gray-400" />;
      default:
        return <Equal className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
          Project Management Dashboard
        </h1>

        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-colors"
            >
              <option value="">Status</option>
              <option value="TO DO">TO DO</option>
              <option value="PAUSED">PAUSED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="IN PROGRESS">IN PROGRESS</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-colors"
            >
              <option value="">Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 lg:px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Work
                  </th>
                  <th className="text-left px-4 lg:px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="text-left px-4 lg:px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 lg:px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="text-left px-4 lg:px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Updated By
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">
                      {project.work}
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="inline-flex items-center gap-2">
                        {getPriorityIcon(project.priority)}
                        <span className="text-sm text-gray-700">{project.priority}</span>
                        <ChevronDown className="w-3 h-3 text-gray-500" />
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-md border text-xs font-medium ${getStatusStyles(project.status)}`}>
                        <span>{project.status}</span>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">
                      {formatDate(project.created_at)}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">
                      {formatDate(project.updated_at)}
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:hidden space-y-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-semibold text-gray-900 flex-1 pr-2">
                  {project.work}
                </h3>
                <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Priority:</span>
                  <div className="inline-flex items-center gap-2">
                    {getPriorityIcon(project.priority)}
                    <span className="text-sm text-gray-700">{project.priority}</span>
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Status:</span>
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-md border text-xs font-medium ${getStatusStyles(project.status)}`}>
                    <span>{project.status}</span>
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Created:</span>
                  <span className="text-xs text-gray-600">
                    {formatDate(project.created_at)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Updated:</span>
                  <span className="text-xs text-gray-600">
                    {formatDate(project.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <p className="text-gray-500">No projects found matching the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
