import { getCollection } from "astro:content";

const product = await getCollection("product");

export const GET = async ({}) => {
	return new Response(JSON.stringify(product), {
		headers: {
			"content-type": "application/json",
		},
		status: 200,
	});
};
