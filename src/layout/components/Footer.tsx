const Footer = () => {
  const links = [
    { label: 'Github', href: '#' },
    { label: 'Mail', href: '#' },
  ];

  return (
    <footer className="w-full h-[267px] absolute bottom-0 bg-white border-t border-gray-200">
      <div className="flex flex-col items-center pt-[42px]">
        <div className="h-[27px] text-2xl font-bold text-[#757575] flex items-center">한눈</div>

        <nav className="flex justify-center mt-[30px] gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-[#6e6e6e] hover:text-black transition-colors no-underline"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-[29px] h-px w-full bg-gray-200" />

        <p className="mt-[30px] text-base text-[#6e6e6e]">
          © 2026 HANNOON Website. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
