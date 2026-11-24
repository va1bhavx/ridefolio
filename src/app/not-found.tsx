import Link from "next/link"
export default function NotFound() {
  return (
    <main id="main-content" className="container-wide py-24">
      <p className="eyebrow">A road less travelled</p>
      <h1 className="page-title my-4">This page isn’t on our map.</h1>
      <p className="mb-8 text-muted-foreground">
        The motorcycle or guide may not be in our demo catalogue.
      </p>
      <Link className="link-button" href="/">
        Back to Ridefolio
      </Link>
    </main>
  )
}
