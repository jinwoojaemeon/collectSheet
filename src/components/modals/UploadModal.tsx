import React, {useEffect, useState} from 'react';
import {
  CheckCircle2,
  LayoutGrid,
  List,
  UploadCloud,
  X,
} from 'lucide-react';
import type {GridStyle} from '@/types/app';

type UploadModalProps = {
  onClose: () => void;
  onComplete: (viewStyle: GridStyle) => void;
};

export function UploadModal({onClose, onComplete}: UploadModalProps) {
  const [step, setStep] = useState(1);
  const [viewStyle, setViewStyle] = useState<GridStyle>('db');
  const [applyToAllSheets, setApplyToAllSheets] = useState(true);
  const [activeSheet, setActiveSheet] = useState('Sheet1');

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => setStep(3), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-slate-800">새 엑셀 파일 등록</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full"></div>
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full transition-all duration-500"
              style={{width: `${(step - 1) * 25}%`}}
            ></div>

            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= s ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-white border-2 border-slate-200 text-slate-400'}`}
              >
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-2xl mx-auto mt-2 text-xs font-medium text-slate-500 px-1">
            <span className={step >= 1 ? 'text-emerald-700' : ''}>파일 업로드</span>
            <span className={step >= 2 ? 'text-emerald-700' : ''}>AI 분석</span>
            <span className={step >= 3 ? 'text-emerald-700' : ''}>뷰어 스타일</span>
            <span className={step >= 4 ? 'text-emerald-700' : ''}>데이터 매핑</span>
            <span className={step >= 5 ? 'text-emerald-700' : ''}>설정 완료</span>
          </div>
        </div>

        <div className="p-8 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="h-full flex flex-col items-center justify-center">
              <div
                className="w-full max-w-xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50/80 transition-colors group"
                onClick={() => setStep(2)}
              >
                <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">클릭하거나 파일을 이곳으로 드래그하세요</h3>
                <p className="text-slate-500">지원 형식: .xlsx, .xls, .csv (최대 50MB)</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="py-16 flex flex-col items-center justify-center text-center h-full">
              <div className="relative w-48 h-48 mb-10">
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1.5 p-3 bg-white shadow-sm border border-slate-100 rounded-2xl overflow-hidden">
                  {Array.from({length: 16}).map((_, i) => (
                    <div
                      key={i}
                      className="bg-emerald-100/50 rounded-md animate-pulse"
                      style={{animationDelay: `${i * 0.1}s`}}
                    />
                  ))}
                  <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent animate-scan" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">AI가 엑셀 데이터를 분석하고 있습니다</h3>
              <p className="text-slate-500 text-lg">데이터 구조를 파악하고 최적의 분류를 추천해 드립니다...</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">뷰어 스타일 선택</h3>
                <p className="text-slate-500">AI가 분석한 엑셀 구조를 바탕으로 원하는 데이터 표시 방식을 선택해주세요.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all ${viewStyle === 'db' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 hover:border-emerald-200'}`}
                  onClick={() => setViewStyle('db')}
                >
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${viewStyle === 'db' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}
                    >
                      {viewStyle === 'db' && <CheckCircle2 size={16} className="text-white" />}
                    </div>
                  </div>
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
                    ✨ AI 추천
                  </div>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 mt-2">
                    <List size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">DB 스타일 뷰 (평탄화)</h4>
                  <p className="text-sm text-slate-500 mb-4">
                    병합된 셀을 각각의 독립된 열로 분리합니다. 데이터 필터링, 정렬, 검색에 가장 최적화된 형태입니다.
                  </p>
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-400">
                    <div className="flex border-b border-slate-100 pb-2 mb-2 font-medium text-slate-600">
                      <div className="flex-1">카테고리</div>
                      <div className="flex-1">품목</div>
                      <div className="flex-1">상품명</div>
                    </div>
                    <div className="flex">
                      <div className="flex-1">전자제품</div>
                      <div className="flex-1">스마트폰</div>
                      <div className="flex-1">아이폰 15</div>
                    </div>
                  </div>
                </div>

                <div
                  className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all ${viewStyle === 'excel' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 hover:border-emerald-200'}`}
                  onClick={() => setViewStyle('excel')}
                >
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${viewStyle === 'excel' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}
                    >
                      {viewStyle === 'excel' && <CheckCircle2 size={16} className="text-white" />}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 mt-2">
                    <LayoutGrid size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">엑셀 원본 스타일 뷰</h4>
                  <p className="text-sm text-slate-500 mb-4">
                    원본 엑셀의 병합된 셀(다중 헤더) 구조를 그대로 유지합니다. 시각적으로 익숙한 형태를 제공합니다.
                  </p>
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-400">
                    <div className="border-b border-slate-100 pb-1 mb-1 text-center font-medium text-slate-600">전자제품</div>
                    <div className="flex border-b border-slate-100 pb-2 mb-2 font-medium text-slate-600">
                      <div className="flex-1 text-center border-r border-slate-100">스마트폰</div>
                      <div className="flex-1 text-center">노트북</div>
                    </div>
                    <div className="flex">
                      <div className="flex-1 text-center border-r border-slate-100">아이폰 15</div>
                      <div className="flex-1 text-center">맥북 프로</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="shrink-0 mt-0.5 text-blue-600" size={20} />
                <div>
                  <p className="font-semibold">AI 추천 데이터 역할 매핑이 완료되었습니다.</p>
                  <p className="text-sm opacity-90 mt-1">
                    엑셀의 원본 헤더명을 그대로 유지하며, 각 열이 앱에서 어떤{' '}
                    <span className="font-bold">역할(필터, 검색 등)</span>을 할지 지정합니다.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="px-6 py-4 w-32 text-center">엑셀 헤더</th>
                      {viewStyle === 'excel' && <th className="px-6 py-4 w-32">상위 헤더</th>}
                      <th className="px-6 py-4">데이터 예시</th>
                      <th className="px-6 py-4 w-56">데이터 역할 (AI 추천)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      {col: '카테고리', parent: '-', sample: '전자제품, 의류, 식품...', rec: '필터 기준 (대)'},
                      {col: '품목', parent: '상품 분류', sample: '스마트폰, 노트북...', rec: '필터 기준 (소)'},
                      {col: '상품명', parent: '상품 분류', sample: '아이폰 15, 갤럭시 S24...', rec: '검색 대상'},
                      {col: '가격', parent: '판매 정보', sample: '1500000, 35000...', rec: '숫자/금액'},
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-center font-bold text-slate-700 bg-slate-50/30">{row.col}</td>
                        {viewStyle === 'excel' && (
                          <td className="px-6 py-4 text-slate-500 font-medium">
                            {row.parent !== '-' ? (
                              <span className="px-2 py-1 bg-slate-100 rounded-md text-xs">{row.parent}</span>
                            ) : (
                              '-'
                            )}
                          </td>
                        )}
                        <td className="px-6 py-4 text-slate-600">{row.sample}</td>
                        <td className="px-6 py-4">
                          <select
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                            defaultValue={row.rec}
                          >
                            <option value="필터 기준 (대)">필터 기준 (대)</option>
                            <option value="필터 기준 (소)">필터 기준 (소)</option>
                            <option value="검색 대상">검색 대상</option>
                            <option value="숫자/금액">숫자/금액</option>
                            <option value="일반 데이터">일반 데이터</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">시트 설정</h3>
                <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between shadow-sm mb-6">
                  <div>
                    <p className="font-semibold text-slate-800 text-lg">모든 시트에 동일한 분류 기준 적용</p>
                    <p className="text-slate-500 mt-1">엑셀 파일 내의 모든 시트가 동일한 양식일 경우 켜주세요.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={applyToAllSheets}
                      onChange={(e) => setApplyToAllSheets(e.target.checked)}
                    />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {!applyToAllSheets && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <h4 className="text-sm font-bold text-slate-700 mb-3">개별 시트 설정</h4>
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                      {['Sheet1', 'Sheet2', 'Sheet3'].map((sheet) => (
                        <button
                          key={sheet}
                          onClick={() => setActiveSheet(sheet)}
                          className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors relative ${activeSheet === sheet ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                        >
                          {sheet}
                          {activeSheet === sheet && (
                            <div className="absolute bottom-[-9px] left-0 w-full h-0.5 bg-emerald-500"></div>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500">
                      <p className="font-medium text-slate-700 mb-1">{activeSheet}의 데이터 매핑을 설정합니다.</p>
                      <p className="text-sm">이전 단계(데이터 매핑)로 돌아가서 이 시트에 맞는 분류를 지정해주세요.</p>
                      <button
                        onClick={() => setStep(4)}
                        className="mt-4 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                      >
                        데이터 매핑으로 돌아가기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors">
            취소
          </button>
          {step >= 3 && step < 5 && (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
            >
              다음 단계
            </button>
          )}
          {step === 5 && (
            <button
              onClick={() => onComplete(viewStyle)}
              className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <CheckCircle2 size={18} /> 저장 및 변환
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
