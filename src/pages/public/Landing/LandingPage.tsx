import React, {useState} from 'react';
import {
  ArrowRight,
  FileJson,
  Lock,
  Mail,
  UploadCloud,
  X,
} from 'lucide-react';
import {useUiStore} from '@/store/uiStore';

export function LandingPage() {
  const login = useUiStore((s) => s.login);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-8 py-6 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-2xl tracking-tight">
          <FileJson size={28} />
          collectSheet
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowLogin(true)}
            className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Sign Up
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-medium text-sm mb-8 border border-emerald-100">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          엑셀 데이터를 가장 빠르게 JSON API로 변환하세요
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 max-w-4xl">
          복잡한 엑셀 파일,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            AI가 분석하고 즉시 시각화합니다
          </span>
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed">
          수만 줄의 엑셀 데이터를 업로드만 하세요. AI가 데이터 구조를 파악하여 자동으로 분류하고, 빠른 검색과 필터링이 가능한 웹 뷰어와 JSON API를 즉시 제공합니다.
        </p>
        <button
          onClick={() => setShowLogin(true)}
          className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          무료로 시작하기 <ArrowRight size={20} />
        </button>

        <div className="mt-20 w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="p-8 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 border-2 border-dashed border-emerald-200 bg-emerald-50/50 rounded-xl p-8 flex flex-col items-center justify-center text-emerald-600">
              <UploadCloud size={48} className="mb-4" />
              <p className="font-medium">엑셀 파일 드래그 & 드롭</p>
            </div>
            <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="h-4 w-1/3 bg-slate-200 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-8 w-full bg-slate-100 rounded"></div>
                <div className="h-8 w-full bg-slate-100 rounded"></div>
                <div className="h-8 w-full bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showLogin && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">시작하기</h2>
              <button onClick={() => setShowLogin(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <button
                onClick={login}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google 계정으로 계속하기
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">또는 이메일로 로그인</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  login();
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">이메일</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">비밀번호</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors">
                  이메일로 로그인
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
