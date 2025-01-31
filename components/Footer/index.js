export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="/about">About Us</a>
        <a href="/contact">Contact</a>
        <a href="/terms">Terms of Use</a>
        <a href="/privacy">Privacy Policy</a>
      </div>
      <div className="footer-credits">
        &copy; {new Date().getFullYear()} Devlog. All rights reserved.
      </div>
    </footer>
  );
}
