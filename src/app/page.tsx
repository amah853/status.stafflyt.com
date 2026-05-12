'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'up' | 'down' | 'degraded';
  lastUpdate: string;
  uptime: number;
  responseTime: number;
}

interface ServiceData {
  uptime: number;
  responseTime: number;
  status: 'up' | 'down' | 'degraded';
}

type UpptimeSummaryItem = {
  name?: string;
  slug?: string;
  status?: string;
  uptime?: string;
  time?: number;
};

type ShieldsBadge = {
  schemaVersion?: number;
  label?: string;
  message?: string;
  color?: string;
};

function parseFirstNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;
  const match = value.match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const num = Number(match[0]);
  return Number.isFinite(num) ? num : null;
}

function clamp(number: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, number));
}

function getServiceStatusFromUptime(uptimePercent: number): ServiceStatus['status'] {
  if (uptimePercent >= 99) return 'up';
  if (uptimePercent >= 95) return 'degraded';
  return 'down';
}

async function fetchStatusData(): Promise<ServiceStatus[]> {
  try {
    const services: Array<{ name: string; slug: string }> = [
      { name: 'Stafflyt Web', slug: 'stafflyt-web' },
      { name: 'Stafflyt Backend', slug: 'stafflyt-backend' },
      { name: 'Stafflyt Email Service', slug: 'stafflyt-email-service' },
    ];

    const summaryRes = await fetch('/api/summary', { cache: 'no-store' });
    if (!summaryRes.ok) {
      throw new Error(`Summary fetch failed: ${summaryRes.status}`);
    }

    const summary = (await summaryRes.json()) as UpptimeSummaryItem[];

    return services.map((service) => {
      const item = summary.find((s) => s.slug === service.slug);
      const uptimePercentage = clamp(parseFirstNumber(item?.uptime) ?? 0, 0, 100);
      const responseTime = Math.max(0, Math.round(item?.time ?? 0));

      const statusFromUpptime =
        item?.status === 'up'
          ? 'up'
          : item?.status === 'down'
            ? 'down'
            : null;

      return {
        name: service.name,
        status: statusFromUpptime ?? getServiceStatusFromUptime(uptimePercentage),
        lastUpdate: new Date().toISOString(),
        uptime: uptimePercentage,
        responseTime,
      };
    });
  } catch (error) {
    console.error('Error fetching status data:', error);
    return [];
  }
}

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500">
              <Image
                src="https://www.stafflyt.com/stafflyt.svg"
                alt="Stafflyt"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </div>
            <span className="text-lg font-bold text-dark">Status</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Status
            </Link>
            <Link
              href="/incidents"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Incidents
            </Link>
            <Link
              href="https://stafflyt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Stafflyt
            </Link>
            <Link
              href="https://github.com/amah853/stafflyt"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              GitHub
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Status
            </Link>
            <Link
              href="/incidents"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Incidents
            </Link>
            <Link
              href="https://stafflyt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Stafflyt
            </Link>
            <Link
              href="https://github.com/amah853/stafflyt"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              GitHub
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function ServiceCard({ service }: { service: ServiceStatus }) {
  const uptime = typeof service.uptime === 'number' ? service.uptime : 0;
  const responseTime =
    typeof service.responseTime === 'number' ? service.responseTime : 0;

  const statusIcon =
    service.status === 'up' ? (
      <CheckCircle2 className="h-5 w-5 text-success" />
    ) : service.status === 'degraded' ? (
      <AlertCircle className="h-5 w-5 text-warning" />
    ) : (
      <AlertCircle className="h-5 w-5 text-error" />
    );

  const statusText =
    service.status === 'up'
      ? 'All Systems Operational'
      : service.status === 'degraded'
        ? 'Degraded Performance'
        : 'Service Down';

  return (
    <div className="group relative rounded-2xl bg-white/50 backdrop-blur-sm p-6 shadow-sm ring-1 ring-gray-200/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:ring-primary/20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-dark mb-2">
            {service.name}
          </h3>
          <div className="flex items-center gap-2 mb-4">
            {statusIcon}
            <span
              className={`text-sm font-medium ${
                service.status === 'up'
                  ? 'text-success'
                  : service.status === 'degraded'
                    ? 'text-warning'
                    : 'text-error'
              }`}
            >
              {statusText}
            </span>
          </div>
        </div>
        <div
          className={`h-4 w-4 rounded-full ${
            service.status === 'up'
              ? 'bg-success'
              : service.status === 'degraded'
                ? 'bg-warning animate-pulse'
                : 'bg-error animate-pulse'
          }`}
        />
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-200/50">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Uptime (30 days)</span>
          <span className="font-semibold text-dark">
            {uptime.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Response Time
          </span>
          <span className="font-semibold text-dark">{responseTime}ms</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200/50">
        <p className="text-xs text-gray-500">
          Last updated: {new Date(service.lastUpdate).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function IncidentBanner({
  services,
  loading,
}: {
  services: ServiceStatus[];
  loading: boolean;
}) {
  const hasDown = services.some((s) => s.status === 'down');
  const hasDegraded = services.some((s) => s.status === 'degraded');

  const variant = loading
    ? 'loading'
    : hasDown
      ? 'down'
      : hasDegraded
        ? 'degraded'
        : 'up';

  const config =
    variant === 'down'
      ? {
          wrapper:
            'rounded-xl bg-gradient-to-r from-error/10 to-error/5 border border-error/20 p-4',
          icon: <AlertCircle className="h-5 w-5 text-error flex-shrink-0" />,
          title: 'Service Disruption',
          titleClass: 'text-sm font-medium text-error',
          message: 'One or more Stafflyt services are currently unavailable',
          messageClass: 'text-xs text-error/70',
        }
      : variant === 'degraded'
        ? {
            wrapper:
              'rounded-xl bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20 p-4',
            icon: <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />,
            title: 'Degraded Performance',
            titleClass: 'text-sm font-medium text-warning',
            message: 'Some Stafflyt services may be slower than usual',
            messageClass: 'text-xs text-warning/70',
          }
        : variant === 'loading'
          ? {
              wrapper:
                'rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-4',
              icon: <Clock className="h-5 w-5 text-primary flex-shrink-0" />,
              title: 'Checking Status',
              titleClass: 'text-sm font-medium text-primary',
              message: 'Fetching the latest service health data',
              messageClass: 'text-xs text-primary/70',
            }
          : {
              wrapper:
                'rounded-xl bg-gradient-to-r from-success/10 to-success/5 border border-success/20 p-4',
              icon: <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />,
              title: 'All Systems Operational',
              titleClass: 'text-sm font-medium text-success',
              message: 'All Stafflyt services are running normally',
              messageClass: 'text-xs text-success/70',
            };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
      <div className={config.wrapper}>
        <div className="flex items-center gap-3">
          {config.icon}
          <div>
            <p className={config.titleClass}>{config.title}</p>
            <p className={config.messageClass}>{config.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200/50 bg-white/50 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500">
              <Image
                src="https://www.stafflyt.com/stafflyt.svg"
                alt="Stafflyt"
                width={14}
                height={14}
                className="h-3.5 w-3.5"
              />
            </div>
            <span className="font-semibold text-gray-900">Stafflyt Status</span>
          </div>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <Link
              href="https://stafflyt.com/privacy"
              className="text-sm text-gray-500 hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Ahmad Mahrous. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLastUpdated, setPageLastUpdated] = useState<string>('');

  useEffect(() => {
    setPageLastUpdated(new Date().toLocaleString());

    const loadData = async () => {
      try {
        const data = await fetchStatusData();
        setServices(data);
        setPageLastUpdated(new Date().toLocaleString());
      } catch (error) {
        console.error('Failed to load status data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // Refresh data every 60 seconds
    const interval = setInterval(loadData, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navigation />

      <main className="min-h-[calc(100vh-4rem)] pb-16">
        <IncidentBanner services={services} loading={loading} />

        {/* Hero Section */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-dark mb-4">
              System Status
            </h1>
            <p className="text-lg text-gray-600">
              Real-time monitoring of Stafflyt's core services and infrastructure.
              {pageLastUpdated ? ` Last updated ${pageLastUpdated}` : ''}
            </p>
          </div>

          {/* Service Status Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/50 p-6 shadow-sm ring-1 ring-gray-200/50 animate-pulse"
                >
                  <div className="h-6 w-32 bg-gray-300 rounded mb-4" />
                  <div className="h-4 w-24 bg-gray-300 rounded mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-300 rounded" />
                    <div className="h-4 w-full bg-gray-300 rounded" />
                  </div>
                </div>
              ))
            ) : services.length > 0 ? (
              services.map((service) => (
                <ServiceCard key={service.name} service={service} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Unable to load status data</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white/50 backdrop-blur-sm ring-1 ring-gray-200/50 overflow-hidden">
            <div className="px-6 py-8 sm:px-8">
              <h2 className="text-2xl font-bold text-dark mb-6">Status Information</h2>
              <div className="grid gap-8 sm:grid-cols-3">
                <div>
                  <h3 className="font-semibold text-dark mb-2">Monitoring</h3>
                  <p className="text-gray-600 text-sm">
                    This page automatically updates every five minutes. 
                    Next refresh at {(() => {
                      const now = new Date();
                      const ms = now.getTime();
                      const fiveMin = 5 * 60 * 1000;
                      const next = new Date(Math.ceil(ms / fiveMin) * fiveMin);
                      return next.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                    })()}.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-dark mb-2">Notifications</h3>
                  <p className="text-gray-600 text-sm">
                    Need critical alerts? Contact us for real-time
                    notifications via email for your organization.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-dark mb-2">Support</h3>
                  <p className="text-gray-600 text-sm">
                    For issues or questions, don't hesistate to contact our support team at{' '}
                    <a
                      href="mailto:support@stafflyt.com"
                      className="text-primary hover:underline"
                    >
                      support@stafflyt.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
