<script lang="ts">
	let name: string = 'Svelte world';

	function greet(name: string) {
		alert(`Hello, ${name}!`);
	}

	let count:number = 0

	const setCount = (newCount: number)=>{
		count = newCount
	}
</script>
<br>
<button onclick={(e: Event) => greet(e.target.innerText)}>
	{name as string}
</button>

<p>Svelte Count: {count}</p>

<button onclick={()=> setCount(count +1)}>Svelte Count up</button>


