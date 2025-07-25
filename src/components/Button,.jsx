
const Button = ({
	label = 'Button',
	type = 'button',
	className = '',
	disabled = false,
}) => {
	return (
		<button
			type={type}
			className={` text-white bg-[#00df9a] hover:bg-[#00c481] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center ${className} cursor-pointer`}
			disabled={disabled}
		>
			{label}
		</button>
	);
};

export default Button;
