import { Footer as FooterType } from "@/types/blocks/footer";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";

export default function Footer({ footer }: { footer: FooterType }) {
  if (footer.disabled) {
    return null;
  }

  return (
    <footer id={footer.name} className="w-full bg-[#111827] text-slate-300 pt-16 pb-0 mt-auto">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1300px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 xl:gap-8 pb-[40px]">
          {/* Brand & Social section */}
          <div className="flex w-full lg:w-[35%] xl:max-w-[390px] shrink-0 flex-col items-start gap-3 lg:pr-4">
            {footer.brand && (
              <div className="w-full">
                <div className="flex items-center gap-3">
                  {footer.brand.logo && (
                    <img
                      src={footer.brand.logo.src}
                      alt={footer.brand.logo.alt || footer.brand.title}
                      className="h-[46px] w-[46px] object-contain rounded-[10px]"
                    />
                  )}
                  {footer.brand.title && (
                    <div>
                      <h2 className="text-[20px] font-extrabold text-white tracking-tight ml-[1px]">
                        {footer.brand.title}
                      </h2>
                      {footer.brand.subtitle && (
                        <p className="text-[12.5px] text-[#94a3b8] font-semibold mt-0.5 ml-0.5">
                          {footer.brand.subtitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {footer.brand.description && (
                  <p className="mt-[18px] text-[15px] leading-[1.65] text-[#94a3b8]">
                    {footer.brand.description}
                  </p>
                )}
              </div>
            )}
            
            {/* Social Links */}
            {footer.social && footer.social.items && footer.social.items.length > 0 && (
              <ul className="flex items-center gap-[10px] mt-4 mb-2 ml-[1px]">
                {footer.social.items.map((item, i) => (
                  <li key={i}>
                    <a
                      href={item.url || ""}
                      target={item.target || "_blank"}
                      rel="noopener noreferrer"
                      className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#1e2738] text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                      aria-label={item.title}
                    >
                      {item.icon && <Icon name={item.icon} className="h-[18px] w-[18px]" />}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            
            {/* Fallback for social links if not in JSON but matching the duckmath style */}
            {(!footer.social || !footer.social.items || footer.social.items.length === 0) && (
              <ul className="flex items-center gap-[10px] mt-4 mb-2 ml-[1px]">
                <li><a href="#" className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#1e2738] text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"><Icon name="RiTiktokLine" className="h-[18px] w-[18px]" /></a></li>
                <li><a href="#" className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#1e2738] text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"><Icon name="RiDiscordLine" className="h-[18px] w-[18px]" /></a></li>
                <li><a href="#" className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#1e2738] text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"><Icon name="RiInstagramLine" className="h-[18px] w-[18px]" /></a></li>
                <li><a href="#" className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#1e2738] text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"><Icon name="RiYoutubeLine" className="h-[18px] w-[18px]" /></a></li>
                <li><a href="#" className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#1e2738] text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"><Icon name="RiLinkedinLine" className="h-[18px] w-[18px]" /></a></li>
              </ul>
            )}
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 lg:gap-4 xl:gap-8 w-full lg:flex-1 lg:justify-end xl:pr-[40px] lg:pl-4">
            {footer.nav?.items?.map((item, i) => (
              <div key={i} className="flex flex-col lg:pl-6 xl:pl-8">
                <h4 className="mb-[20px] font-bold text-white text-[15px] pl-1">{item.title}</h4>
                <ul className="flex flex-col space-y-[16px] text-[14px]">
                  {item.children?.map((child, ii) => (
                    <li key={ii} className="group">
                      <Link 
                        href={child.url || ""} 
                        target={child.target}
                        className="flex items-center gap-2.5 font-medium transition-colors hover:text-white text-[#94a3b8]"
                      >
                        {child.icon && <span className="text-[18px] flex-shrink-0 w-6 text-center inline-block opacity-70 group-hover:opacity-100 transition-opacity">{child.icon}</span>}
                        {!child.icon && child.title === 'Home' && <span className="text-[18px] flex-shrink-0 w-6 text-center inline-block opacity-70 group-hover:opacity-100 transition-opacity">🏠</span>}
                        {!child.icon && child.title === 'About' && <span className="text-[18px] flex-shrink-0 w-6 text-center inline-block opacity-70 group-hover:opacity-100 transition-opacity">ℹ️</span>}
                        <span className="mt-0.5 whitespace-nowrap text-[15px]">{child.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            {/* If the current JSON doesn't have the 4th column (Legal), we render Agreement here */}
            {footer.agreement && footer.agreement.items && footer.agreement.items.length > 0 && (
              <div className="flex flex-col lg:pl-6 xl:pl-8">
                <h4 className="mb-[20px] font-bold text-white text-[15px] pl-1">Legal</h4>
                <ul className="flex flex-col space-y-[16px] text-[14px]">
                  {footer.agreement.items.map((item, i) => (
                    <li key={i} className="group">
                      <Link 
                        href={item.url || ""} 
                        target={item.target}
                        className="flex items-center gap-2.5 font-medium transition-colors hover:text-white text-[#94a3b8]"
                      >
                        <span className="text-[18px] flex-shrink-0 w-6 text-center inline-block opacity-70 group-hover:opacity-100 transition-opacity">📜</span>
                        <span className="mt-0.5 whitespace-nowrap text-[15px]">{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-slate-800/80 pt-6 pb-6 lg:flex-row">
          {footer.copyright && (
            <p className="text-[13px] font-semibold text-slate-500">
              {footer.copyright}
            </p>
          )}

          {footer.nav?.items?.find(i => i.title === 'Support' || i.title === '支持')?.children?.find(c => c.icon === '📧') && (
            <a 
              href={footer.nav.items.find(i => i.title === 'Support' || i.title === '支持')!.children!.find(c => c.icon === '📧')!.url || "mailto:support@duckmath.org"} 
              className="rounded-[6px] bg-[#142621] px-5 py-[8.5px] text-[13px] font-bold text-[#34d399] border border-[#1a382d] transition-colors hover:bg-[#152e24] hover:text-[#6ee7b7]"
            >
              {footer.nav.items.find(i => i.title === 'Support' || i.title === '支持')!.children!.find(c => c.icon === '📧')!.url?.replace('mailto:', '') || 'support@duckmath.org'}
            </a>
          )}
          
          {/* Fallback Contact Button */}
          {(!footer.nav?.items?.find(i => i.title === 'Support' || i.title === '支持')?.children?.find(c => c.icon === '📧')) && (
            <a 
              href="mailto:support@duckmath.org" 
              className="rounded-[6px] bg-[#142621] px-5 py-[8.5px] text-[13px] font-bold text-[#34d399] border border-[#1a382d] transition-colors hover:bg-[#152e24] hover:text-[#6ee7b7]"
            >
              support@duckmath.org
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
