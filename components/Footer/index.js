import Link from 'next/link';
import s from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.footerContent}>
        <div className={s.links}>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/terms">Terms of Use</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/documentations">Documentation</Link>
        </div>
        <div className={s.copy}>
          © {new Date().getFullYear()} Devlog. All rights reserved.<br />
          Built with Next.js & Firebase. Deployed on Vercel.
        </div>
      </div>
    </footer>
  );
}
