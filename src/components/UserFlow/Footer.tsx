import { Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white px-10">
      <div className="container mx-auto px-4 py-4 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-lg font-bold mb-2">MakeMePro</h4>
            <p className="text-gray-500 text-sm mb-2">
              Join our Student Alumni or follow us on social media and stay connected with the latest news.
            </p>
            <div className="flex gap-2 justify-center md:justify-start">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Teachers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-2">Community</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  How it works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Get in touch
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-4 pt-4 flex flex-col items-center md:flex-row text-sm">
          <p className="text-gray-500">© 2025 MakeMePro. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}