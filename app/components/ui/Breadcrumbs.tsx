import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Only show breadcrumbs for dashboard pages
  if (!segments.includes('dashboard')) return null;

  // Build breadcrumb links
  const crumbs = [];
  let path = '';
  for (let i = 0; i < segments.length; i++) {
    path += '/' + segments[i];
    crumbs.push({
      label: segments[i]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      href: path,
      isLast: i === segments.length - 1,
    });
  }

  return (
    <nav className="flex items-center text-sm text-[#637488] mb-6" aria-label="Breadcrumb">
      {crumbs.map((crumb, idx) => (
        <span key={crumb.href} className="flex items-center">
          {idx > 0 && <span className="mx-2">/</span>}
          {crumb.isLast ? (
            <span className="text-[#111418] font-semibold">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:underline hover:text-[#1978e5] transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
} 