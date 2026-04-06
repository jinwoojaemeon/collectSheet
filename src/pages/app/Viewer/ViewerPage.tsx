import React, {useMemo, useState} from 'react';
import {
  ArrowRight,
  Download,
  FileSpreadsheet,
  Filter,
  LayoutGrid,
  Link as LinkIcon,
  List,
  Search,
} from 'lucide-react';
import {VirtualScroll} from '@/components/common/VirtualScroll';
import {CATEGORY_FILTER_OPTIONS} from '@/constants/categories';
import {useElementHeight} from '@/hooks/useElementHeight';
import {useUiStore} from '@/store/uiStore';
import {generateMockData} from '@/utils/generateMockData';
import type {GridStyle, ViewMode} from '@/types/app';

export function ViewerPage() {
  const selectedFile = useUiStore((s) => s.selectedFile);
  const backFromViewer = useUiStore((s) => s.backFromViewer);

  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [gridStyle, setGridStyle] = useState<GridStyle>(selectedFile?.viewStyle ?? 'db');
  const [activeSheet, setActiveSheet] = useState('Sheet1');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('전체');
  const {wrapperRef, height: containerHeight} = useElementHeight(600);

  const allData = useMemo(() => generateMockData(), []);

  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.includes(searchQuery) ||
        item.subcategory.includes(searchQuery);
      const matchCategory = categoryFilter === '전체' || item.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [allData, searchQuery, categoryFilter]);

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={backFromViewer} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
            <ArrowRight className="rotate-180" size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileSpreadsheet className="text-emerald-600" size={24} />
              {selectedFile?.name ?? '2024_Q1_Sales_Data.xlsx'}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">총 {filteredData.length.toLocaleString()}건의 데이터</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-lg border border-slate-200 mr-4">
            {['Sheet1', 'Sheet2', 'Sheet3'].map((sheet) => (
              <button
                key={sheet}
                onClick={() => setActiveSheet(sheet)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeSheet === sheet ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                {sheet}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm">
            <LinkIcon size={16} />
            API URL 복사
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm shadow-sm">
            <Download size={16} />
            JSON 다운로드
          </button>
        </div>
      </header>

      <div className="px-6 py-4 flex flex-col gap-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <List size={16} /> 테이블 뷰
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'card' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <LayoutGrid size={16} /> 카드 뷰
              </button>
            </div>

            {viewMode === 'table' && (
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                <button
                  onClick={() => setGridStyle('db')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${gridStyle === 'db' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <List size={16} /> DB 스타일
                </button>
                <button
                  onClick={() => setGridStyle('excel')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${gridStyle === 'excel' ? 'bg-purple-50 text-purple-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <LayoutGrid size={16} /> 엑셀 원본 스타일
                </button>
              </div>
            )}
          </div>

          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="데이터 검색 (상품명, 분류 등)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-600 mr-2">카테고리 필터:</span>
          {CATEGORY_FILTER_OPTIONS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${categoryFilter === cat ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 min-h-0" ref={wrapperRef}>
        <VirtualScroll data={filteredData} viewMode={viewMode} gridStyle={gridStyle} containerHeight={containerHeight} />
      </div>
    </div>
  );
}
