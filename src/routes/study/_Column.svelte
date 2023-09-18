<script lang="ts">
	import Row from "./_Row.svelte"

	export let rows: KanaCheckboxRow[]
	export let label: string

	let animationDelay = 0

	function onAnimationFinished() {
		animationDelay = 0
	}
</script>

<section class="column" aria-label={label}>
	{#each rows as row, index}
		<Row
			bind:row
			animationDelay={animationDelay * index}
			on:animationFinished={index === rows.length - 1 && onAnimationFinished}
		/>
	{/each}
</section>

<style lang="postcss">
	.column {
		display: inline-block;
		margin-bottom: 3em;
	}

	.column :global(.row) {
		display: flex;
		align-items: center;

		&:not(:last-child):not(.select-all) {
			margin-bottom: 10px;
		}
	}

	/* checkbox */
	.column :global(.row .checkbox) {
		margin-right: 20px;
		font-size: 1.25em;
	}

	.column :global(.row > .checkbox-kana:not(:last-child)) {
		margin-right: 10px !important;
	}
</style>
