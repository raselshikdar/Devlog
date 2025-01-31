import Link from 'next/link';
import s from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.footerContent}>
        <div className={s.links}>
          <Link href="/rasel/about-us">About</Link>
          <Link href="/rasel/privacy-policy">Privacy</Link>
          <Link href="/rasel/terms-of-use">Terms</Link>
          <Link href="/rasel/sponsor-us">Advertise</Link>
          <Link href="/rasel/contact-us">Contact</Link>
          <Link href="/rasel/documentations">Documentations</Link>
        </div>
      </div>
      <div className={s.copy}>
        © {new Date().getFullYear()} <Link href="/">Devlog</Link>. All rights reserved.
      </div>
    </footer>
  );
}
