import { useState } from "react";

type ReactCountProps = {
	title: string;
};

export const ReactCount = ({ title }: ReactCountProps) => {
	const [count, setCount] = useState(0);

	return (
		<div>
			<p>
				current value: {count} {title}
			</p>
			<button onClick={() => setCount((prev) => prev + 1)}>
				React Count up
			</button>
		</div>
	);
};
