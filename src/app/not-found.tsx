'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/30 flex flex-col">
      {/* Navigation */}
      <nav className="glass border-b border-gray-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500">
                <Image
                  src="https://raw.githubusercontent.com/amah853/stafflyt/main/public/stafflyt.svg"
                  alt="Stafflyt"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </div>
              <span className="text-lg font-bold text-dark">Status</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 404 Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-dark mb-2">404</h1>
          <p className="text-xl text-gray-600 mb-8">Page not found</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
          >
            Return to Status
          </Link>
        </div>
      </main>
    </div>
  );
}
