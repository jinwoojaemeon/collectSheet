import React, {useRef, useState} from 'react';
import type {GridStyle, MockDataRow, ViewMode} from '@/types/app';

type VirtualScrollProps = {
  data: MockDataRow[];
  viewMode: ViewMode;
  gridStyle?: GridStyle;
  containerHeight?: number;
};

export function VirtualScroll({
  data,
  viewMode,
  gridStyle = 'db',
  containerHeight = 600,
}: VirtualScrollProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const itemHeight = viewMode === 'table' ? 56 : 220;
  const itemsPerRow = viewMode === 'table' ? 1 : 3;

  const rowCount = Math.ceil(data.length / itemsPerRow);
  const totalHeight = rowCount * itemHeight;

  const overscan = 5;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    rowCount,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan,
  );

  const visibleRows: number[] = [];
  for (let i = startIndex; i < endIndex; i++) {
    visibleRows.push(i);
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="w-full overflow-y-auto bg-white rounded-xl shadow-sm border border-slate-200"
      style={{height: containerHeight}}
    >
      {viewMode === 'table' && gridStyle === 'db' && (
        <div className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 flex items-center px-6 py-3 text-sm font-semibold text-slate-600">
          <div className="w-20">ID</div>
          <div className="w-32">카테고리</div>
          <div className="w-32">품목</div>
          <div className="flex-1">상품명</div>
          <div className="w-32 text-right">가격</div>
          <div className="w-24 text-right">재고</div>
          <div className="w-24 text-center">상태</div>
          <div className="w-32 text-right">등록일</div>
        </div>
      )}

      {viewMode === 'table' && gridStyle === 'excel' && (
        <div className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600 flex flex-col">
          <div className="flex items-center px-6 border-b border-slate-200">
            <div className="w-20 py-2 border-r border-slate-200 flex items-center justify-center h-16">ID</div>
            <div className="w-64 py-2 border-r border-slate-200 flex flex-col h-16">
              <div className="flex-1 flex items-center justify-center border-b border-slate-200 w-full">상품 분류</div>
              <div className="flex-1 flex items-center w-full">
                <div className="w-1/2 text-center border-r border-slate-200 h-full flex items-center justify-center">카테고리</div>
                <div className="w-1/2 text-center h-full flex items-center justify-center">품목</div>
              </div>
            </div>
            <div className="flex-1 py-2 border-r border-slate-200 flex items-center justify-center h-16">상품명</div>
            <div className="w-80 py-2 border-r border-slate-200 flex flex-col h-16">
              <div className="flex-1 flex items-center justify-center border-b border-slate-200 w-full">판매 정보</div>
              <div className="flex-1 flex items-center w-full">
                <div className="w-32 text-center border-r border-slate-200 h-full flex items-center justify-center">가격</div>
                <div className="w-24 text-center border-r border-slate-200 h-full flex items-center justify-center">재고</div>
                <div className="w-24 text-center h-full flex items-center justify-center">상태</div>
              </div>
            </div>
            <div className="w-32 py-2 flex items-center justify-center h-16">등록일</div>
          </div>
        </div>
      )}

      <div style={{height: totalHeight, position: 'relative'}}>
        {visibleRows.map((rowIndex) => {
          const rowItems = data.slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow);

          return (
            <div
              key={rowIndex}
              style={{
                position: 'absolute',
                top: rowIndex * itemHeight,
                height: itemHeight,
                width: '100%',
                padding: viewMode === 'card' ? '12px 24px' : '0',
              }}
              className={viewMode === 'table' ? 'border-b border-slate-100 hover:bg-slate-50 transition-colors' : ''}
            >
              {viewMode === 'table' ? (
                <div className="flex items-center px-6 h-full text-sm text-slate-700">
                  <div className={`w-20 text-slate-400 ${gridStyle === 'excel' ? 'text-center' : ''}`}>
                    {rowItems[0].id}
                  </div>

                  {gridStyle === 'excel' ? (
                    <div className="w-64 flex items-center h-full">
                      <div className="w-1/2 h-full flex items-center justify-center border-l border-r border-slate-100 bg-slate-50/30">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
                          {rowItems[0].category}
                        </span>
                      </div>
                      <div className="w-1/2 h-full flex items-center justify-center border-r border-slate-100 text-slate-500">
                        {rowItems[0].subcategory}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-32">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
                          {rowItems[0].category}
                        </span>
                      </div>
                      <div className="w-32 text-slate-500">{rowItems[0].subcategory}</div>
                    </>
                  )}

                  <div className={`flex-1 font-medium ${gridStyle === 'excel' ? 'px-4' : ''}`}>{rowItems[0].name}</div>

                  {gridStyle === 'excel' ? (
                    <div className="w-80 flex items-center h-full">
                      <div className="w-32 h-full flex items-center justify-end pr-4 border-l border-r border-slate-100">
                        {rowItems[0].price.toLocaleString()}원
                      </div>
                      <div className="w-24 h-full flex items-center justify-end pr-4 border-r border-slate-100">
                        {rowItems[0].stock}개
                      </div>
                      <div className="w-24 h-full flex items-center justify-center border-r border-slate-100">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${rowItems[0].status === '판매중' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}
                        >
                          {rowItems[0].status}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-32 text-right">{rowItems[0].price.toLocaleString()}원</div>
                      <div className="w-24 text-right">{rowItems[0].stock}개</div>
                      <div className="w-24 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${rowItems[0].status === '판매중' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}
                        >
                          {rowItems[0].status}
                        </span>
                      </div>
                    </>
                  )}

                  <div className={`w-32 text-slate-400 ${gridStyle === 'excel' ? 'text-center' : 'text-right'}`}>
                    {rowItems[0].date}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
                  {rowItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
                          {item.category}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === '판매중' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-lg mb-1 line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-slate-500 mb-4">{item.subcategory}</p>

                      <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-end">
                        <div>
                          <p className="text-xs text-slate-400 mb-1">가격</p>
                          <p className="font-semibold text-slate-900">{item.price.toLocaleString()}원</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400 mb-1">재고</p>
                          <p className="text-sm font-medium text-slate-700">{item.stock}개</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
