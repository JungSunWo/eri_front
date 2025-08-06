'use client'

import { useEffect, useState } from 'react';

const FooterLayout = () => {
	const [currentYear, setCurrentYear] = useState('');

	useEffect(() => {
		setCurrentYear(new Date().getFullYear().toString());
	}, []);

	const drawFooter = (showYn) => {
		return (
			<footer className="relative w-full">
				{/* Footer Background Image */}
				<div className="relative w-full h-32 bg-cover bg-center bg-no-repeat rounded-t-lg"
					 style={{ backgroundImage: 'url(/footer-bg.svg)' }}>
					{/* Footer Content */}
					<div className="relative z-10 h-full flex flex-col justify-center px-8 text-white">
						{/* Top Section - Portal Title and Navigation */}
						<div className="flex items-center justify-between mb-2">
							{/* Left - Portal Title */}
							<div className="flex items-center space-x-3">
								<span className="text-lg font-bold">직원권익보호포털</span>
								<span className="text-sm text-gray-300">EOCare</span>
							</div>

							{/* Right - Navigation Links */}
							<div className="flex items-center space-x-4 text-sm">
								<a href="#" className="text-teal-300 hover:text-teal-200 transition-colors duration-200">
									직원권익보호관이란?
								</a>
								<span className="text-gray-400">|</span>
								<a href="#" className="hover:text-gray-200 transition-colors duration-200">
									공지사항
								</a>
								<span className="text-gray-400">|</span>
								<a href="#" className="hover:text-gray-200 transition-colors duration-200">
									상담, 프로그램 신청
								</a>
							</div>
						</div>

						{/* Bottom Section - Copyright and Contact */}
						<div className="flex items-center justify-between">
							{/* Copyright */}
							<div className="text-xs text-gray-300">
								Copyright. IBK(INDUSTRIAL BANK OF KOREA) All rights reserved.
							</div>

							{/* Contact Information */}
							<div className="flex items-center space-x-4 text-xs text-gray-300">
								<span>직원권익보호관 HOTLINE : 080-777-2525</span>
								<span className="text-gray-400">|</span>
								<span>eocare@ibk.co.kr</span>
							</div>
						</div>
					</div>
				</div>
			</footer>
		);
	};

	return drawFooter(true);
};

export default FooterLayout;
