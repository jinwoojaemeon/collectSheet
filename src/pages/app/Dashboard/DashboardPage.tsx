import React, {useState} from 'react';
import {
  ArrowRight,
  Edit3,
  FileJson,
  FileSpreadsheet,
  LogOut,
  MoreVertical,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react';
import {MOCK_FILES} from '@/constants/mockFiles';
import {UploadModal} from '@/components/modals/UploadModal';
import {useUiStore} from '@/store/uiStore';
import type {GridStyle, SheetFileRecord} from '@/types/app';

export function DashboardPage() {
  const logout = useUiStore((s) => s.logout);
  const viewFile = useUiStore((s) => s.viewFile);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [files, setFiles] = useState<SheetFileRecord[]>(MOCK_FILES);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl tracking-tight">
          <FileJson size={24} />
          collectSheet
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
              U
            </div>
            <span className="font-medium text-slate-700 text-sm">User님</span>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-slate-600 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">내 파일 관리</h1>
            <p className="text-slate-500 mt-1">업로드한 엑셀 파일을 관리하고 데이터를 확인하세요.</p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={20} />
            새 엑셀 파일 등록
          </button>
        </div>

        {files.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
              <FileSpreadsheet size={40} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">아직 업로드된 엑셀 파일이 없습니다</h3>
            <p className="text-slate-500 mb-8 max-w-md">
              새로운 엑셀 파일을 등록하여 AI 기반의 자동 분류와 빠른 데이터 시각화를 경험해보세요.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-white border-2 border-emerald-600 text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
            >
              첫 파일 업로드하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all group relative"
              >
                <div className="absolute top-4 right-4">
                  <div className="relative group/menu">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <MoreVertical size={20} />
                    </button>
                    <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 py-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <Edit3 size={14} /> 이름 수정
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <Settings size={14} /> 재분류
                      </button>
                      <div className="h-px bg-slate-100 my-1"></div>
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <Trash2 size={14} /> 삭제
                      </button>
                    </div>
                  </div>
                </div>

                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <FileSpreadsheet size={24} />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-1 truncate pr-8" title={file.name}>
                  {file.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                  <span>{file.date}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{file.rows.toLocaleString()} rows</span>
                </div>

                <button
                  onClick={() => viewFile(file)}
                  className="w-full py-2.5 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  데이터 열람 <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {isUploadModalOpen && (
        <UploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onComplete={(viewStyle: GridStyle) => {
            setIsUploadModalOpen(false);
            setFiles([
              {
                id: Date.now(),
                name: 'New_Uploaded_File.xlsx',
                date: new Date().toISOString().split('T')[0],
                rows: 10000,
                viewStyle,
              },
              ...files,
            ]);
          }}
        />
      )}
    </div>
  );
}
