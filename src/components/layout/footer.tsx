import Image from "next/image";
import Link from "next/link";
import { Instagram, Youtube, Linkedin, Home, Info, FileText, Trophy, Flame, User, Settings, Upload, ScrollText, Mail, MessageSquare, Link as LinkIcon, Lock, Gavel } from "lucide-react";

// 最小侵入方案：href="#" 占位链接改为 span（不可爬取，视觉完全不变）
// 真实链接上线后换回 <Link href="/real-path">
function DisabledLink({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={className}
      aria-disabled="true"
      role="link"
      tabIndex={-1}
      style={{ cursor: "default", opacity: 0.6 }}
    >
      {children}
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#131a26] text-gray-300 py-12 px-4 md:px-8 lg:px-16 text-sm">
      <div className="mx-auto max-w-[1420px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        {/* Column 1: Brand */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="flex items-center gap-3">
            <Image
              src="/imgs/Plants-Vs-Brainrots-logo.png"
              alt="Plants vs Brainrots – Free Unblocked Games"
              width={88}
              height={36}
              className="object-contain shrink-0"
            />
          </div>
          <p className="text-gray-400 leading-relaxed">
            Plants vs Brainrots Unblocked hosts 600+ free browser games, updated daily. Play the
            viral Plants vs Brainrots Roblox tower defense game and hundreds of other unblocked
            games. Works on school chromebook.
          </p>

          {/* Social links */}
          <div className="flex gap-3">
            <DisabledLink className="bg-[#1f2937] p-2 rounded-md hover:bg-[#374151] transition-colors flex items-center">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="TikTok">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </DisabledLink>
            <DisabledLink className="bg-[#1f2937] p-2 rounded-md hover:bg-[#374151] transition-colors flex items-center">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Discord">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
            </DisabledLink>
            <DisabledLink className="bg-[#1f2937] p-2 rounded-md transition-colors flex items-center">
              <Instagram className="w-4 h-4" aria-label="Instagram" />
            </DisabledLink>
            <DisabledLink className="bg-[#1f2937] p-2 rounded-md transition-colors flex items-center">
              <Youtube className="w-4 h-4" aria-label="YouTube" />
            </DisabledLink>
            <DisabledLink className="bg-[#1f2937] p-2 rounded-md transition-colors flex items-center">
              <Linkedin className="w-4 h-4" aria-label="LinkedIn" />
            </DisabledLink>
          </div>
        </div>

        {/* Column 2: Pages */}
        <div>
          <h3 className="text-white font-semibold mb-6">Pages</h3>
          <ul className="space-y-4">
            <li>
              <Link href="/" className="flex items-center gap-2 hover:text-white transition-colors">
                <Home className="w-4 h-4 text-red-400" />
                Home
              </Link>
            </li>
            <li>
              <Link href="/about-game" className="flex items-center gap-2 hover:text-white transition-colors">
                <Info className="w-4 h-4 text-blue-400" />
                About PVB Game
              </Link>
            </li>
            <li>
              <Link href="/codes" className="flex items-center gap-2 hover:text-white transition-colors">
                <FileText className="w-4 h-4 text-orange-300" />
                PVB Codes
              </Link>
            </li>
            <li>
              <Link href="/discord" className="flex items-center gap-2 hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                Discord
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Features */}
        <div>
          <h3 className="text-white font-semibold mb-6">Features</h3>
          <ul className="space-y-4">
            {[
              { icon: <Trophy className="w-4 h-4 text-yellow-500" />, label: "Leaderboard" },
              { icon: <Flame className="w-4 h-4 text-orange-500" />, label: "Streak" },
              { icon: <User className="w-4 h-4 text-purple-400" />, label: "Profile" },
              { icon: <Settings className="w-4 h-4 text-gray-400" />, label: "Settings" },
              { icon: <Upload className="w-4 h-4 text-blue-400" />, label: "Upload" },
              { icon: <ScrollText className="w-4 h-4 text-amber-600" />, label: "Scroll Feed" },
            ].map(({ icon, label }) => (
              <li key={label}>
                <DisabledLink className="flex items-center gap-2 transition-colors">
                  {icon}
                  {label}
                </DisabledLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Support */}
        <div>
          <h3 className="text-white font-semibold mb-6">Support</h3>
          <ul className="space-y-4">
            <li>
              <Link href="mailto:support@plantsvsbrainrots.cc" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-gray-300" />
                Contact Us
              </Link>
            </li>
            <li>
              <DisabledLink className="flex items-center gap-2 transition-colors">
                <MessageSquare className="w-4 h-4 text-blue-300" />
                PVB Community
              </DisabledLink>
            </li>
            <li>
              <DisabledLink className="flex items-center gap-2 transition-colors">
                <LinkIcon className="w-4 h-4 text-gray-400" />
                Links
              </DisabledLink>
            </li>
          </ul>
        </div>

        {/* Column 5: Legal */}
        <div>
          <h3 className="text-white font-semibold mb-6">Legal</h3>
          <ul className="space-y-4">
            <li>
              <Link href="/terms-of-service" className="flex items-center gap-2 hover:text-white transition-colors">
                <FileText className="w-4 h-4 text-orange-400" />
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="flex items-center gap-2 hover:text-white transition-colors">
                <Lock className="w-4 h-4 text-yellow-500" />
                Privacy Policy
              </Link>
            </li>
            <li>
              <DisabledLink className="flex items-center gap-2 transition-colors">
                <Gavel className="w-4 h-4 text-orange-500" />
                DMCA Takedown
              </DisabledLink>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto max-w-[1420px] pt-6 border-t border-[#1f2937] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-500">
          © 2026 Plants vs Brainrots Unblocked. All rights reserved. v1.2.0
        </p>
        <Link
          href="mailto:support@plantsvsbrainrots.cc"
          className="text-xs bg-[#0f291e] text-[#4ade80] border border-[#14532d] px-4 py-2 rounded-md hover:bg-[#14532d] transition-colors"
        >
          support@plantsvsbrainrots.cc
        </Link>
      </div>
    </footer>
  );
}
