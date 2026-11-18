import Link from "next/link";
export default function NotFound() {
  return (
    <main className="not-found shell">
      <span className="eyebrow">404 / DAMIAN PÉREZ</span>
      <h1>
        Aquí empieza
        <br />
        otro camino.
      </h1>
      <p>Esta página no existe. The page you’re looking for doesn’t exist.</p>
      <Link className="button button-primary" href="/">
        Volver al portafolio / Back to portfolio ↗
      </Link>
    </main>
  );
}
