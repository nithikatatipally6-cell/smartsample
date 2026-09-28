import React, { useState, useMemo } from 'react';
import { X, Search, Filter, Download, Users } from 'lucide-react';
import { Student, Department } from '../types';

interface StudentDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
}

export const StudentDataModal: React.FC<StudentDataModalProps> = ({
  isOpen,
  onClose,
  students,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState<'ALL' | Department>('ALL');
  const [yearFilter, setYearFilter] = useState<'ALL' | number>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = s.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
      const matchesYear = yearFilter === 'ALL' || s.year === yearFilter;
      return matchesSearch && matchesDept && matchesYear;
    });
  }, [students, searchTerm, deptFilter, yearFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Simulated College Population Database
              </h3>
              <p className="text-xs text-slate-500">
                Viewing {students.length.toLocaleString()} individual student records generated in-browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters bar */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Student ID (e.g. STU-1025)..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>

            {/* Department filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 font-medium">Dept:</span>
              <select
                value={deptFilter}
                onChange={(e) => {
                  setDeptFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
              </select>
            </div>

            {/* Year filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 font-medium">Year:</span>
              <select
                value={yearFilter}
                onChange={(e) => {
                  setYearFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Years</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-800">{filtered.length}</span> students matching filter
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto flex-1 p-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Student ID</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3 text-right">Attendance (%)</th>
                <th className="py-2.5 px-3 text-right">Study Hours/Day</th>
                <th className="py-2.5 px-3 text-right">Exam Marks</th>
                <th className="py-2.5 px-3 text-right">Sleep Hours</th>
                <th className="py-2.5 px-3 text-right">Commute (min)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-medium text-indigo-700">{student.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">{student.department}</td>
                  <td className="py-2.5 px-3 text-slate-600">Year {student.year}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-800 font-medium">
                    {student.attendance}%
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-800">
                    {student.studyHours} h
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-slate-900">
                    {student.examMarks}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-800">
                    {student.sleepHours} h
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-800">
                    {student.commuteTime} min
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No student records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <span>
            Page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
