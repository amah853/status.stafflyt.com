'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function IncidentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-gray-200/50">
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

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Status
        </Link>

        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-dark mb-4">
            Incident History
          </h1>
          <p className="text-lg text-gray-600">
            Historical records of service incidents and resolutions
          </p>
        </div>

        {/* Empty State */}
        <div className="rounded-2xl bg-white/50 backdrop-blur-sm ring-1 ring-gray-200/50 p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-dark mb-2">
            No Incidents Reported
          </h2>
          <p className="text-gray-600">
            All systems have been operating normally. Great job!
          </p>
        </div>

        {/* Timeline would go here when there are incidents */}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 bg-white/50 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500">
                <Image
                  src="https://raw.githubusercontent.com/amah853/stafflyt/main/public/stafflyt.svg"
                  alt="Stafflyt"
                  width={14}
                  height={14}
                  className="h-3.5 w-3.5"
                />
              </div>
              <span className="font-semibold text-gray-900">Stafflyt Status</span>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Ahmad Mahrous. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
