import React from 'react';
import './Loading.css';

const Loading = () => {
	return (
		<div className="loader">
			<div className="svg-wrapper">
				<svg
					height="200"
					viewBox="0 0 455 455"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Loader</title>
					<defs>
						<linearGradient id="ttb" y2="1">
							<stop offset="100%" stopOpacity="1" stopColor="#87CEEB">
								<animate
									attributeName="offset"
									values="0;1;1;0"
									repeatCount="indefinite"
									repeatDur="2s"
									dur="2s"
									begin="0s"
								/>
							</stop>
							<stop offset="100%" stopOpacity="1" stopColor="#FFFFFF">
								<animate
									attributeName="offset"
									values="0;1;1;0"
									repeatCount="indefinite"
									repeatDur="2s"
									dur="2s"
									begin="0s"
								/>
							</stop>
						</linearGradient>
					</defs>

					{/* Aquí va el SVG de la nube */}
					<g fill="url(#ttb)">
						<path
							d="M391.016,135.059c-5.829-49.336-47.791-87.605-98.695-87.605c-33.184,0-62.556,16.272-80.607,41.262
              c2.108-0.081,4.223-0.127,6.349-0.127c74.519,0,138.462,50.218,157.487,120.164c21.304,4.704,40.866,15.374,56.667,31.173
              c1.403,1.403,2.764,2.836,4.085,4.297C447.852,232.648,455,216.682,455,199.04C455,163.704,426.352,135.059,391.016,135.059z"
						/>
						<path
							d="M350.359,236.02c-7.814-66.133-64.062-117.431-132.296-117.431c-68.234,0-124.482,51.298-132.296,117.431
              C38.402,236.02,0,274.417,0,321.783s38.397,85.763,85.763,85.763h264.601c47.366,0,85.763-38.397,85.763-85.763
              S397.725,236.02,350.359,236.02z"
						/>
					</g>
				</svg>
				<div className="loading-text"></div>
			</div>
		</div>
	);
};

export default Loading;
