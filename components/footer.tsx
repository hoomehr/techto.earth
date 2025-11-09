import Link from "next/link"
import { Leaf } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-green-50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <span className="text-lg font-bold text-green-800">
                Techto<span className="text-emerald-600">.Earth</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600 mt-2">
              Technology for earthic and ecologic use cases. Building intelligent tools for sustainable living and
              environmental stewardship.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Products</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/career-path" className="text-sm text-gray-600 hover:text-green-700">
                  EarthBridge
                </Link>
              </li>
              <li>
                <Link href="/ecolog" className="text-sm text-gray-600 hover:text-green-700">
                  EcoLog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">EarthBridge</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/career-path/courses" className="text-sm text-gray-600 hover:text-green-700">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/career-path/events" className="text-sm text-gray-600 hover:text-green-700">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/career-path/groups" className="text-sm text-gray-600 hover:text-green-700">
                  Groups
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-green-700">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-green-700">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/blog/category/success-stories" className="text-sm text-gray-600 hover:text-green-700">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-green-700">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-green-700">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-green-700">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-green-700">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-green-700">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Techto.Earth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

