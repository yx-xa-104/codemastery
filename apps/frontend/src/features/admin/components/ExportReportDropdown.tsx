"use client";

import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ExportReportDropdownProps {
  token: string;
}

export function ExportReportDropdown({ token }: ExportReportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exportOptions = [
    { label: "Tuần vừa qua", value: "week" },
    { label: "Tháng trước", value: "month" },
    { label: "Quý trước", value: "quarter" },
    { label: "Năm qua", value: "year" },
  ];

  const handleExport = async (range: string) => {
    setIsOpen(false);
    setIsExporting(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/reports/export?range=${range}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CodeMastery_Report_${range}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Export error:", error);
      alert("Đã có lỗi xảy ra khi xuất báo cáo.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-navy-800 text-sm font-medium rounded-lg transition-all h-auto"
      >
        {isExporting ? (
          <span className="w-4 h-4 border-2 border-slate-400 border-t-current rounded-full animate-spin"></span>
        ) : (
          <Download className="w-4 h-4" />
        )}
        {isExporting ? "Đang tạo..." : "Xuất báo cáo"}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-700 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {exportOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleExport(option.value)}
                className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
