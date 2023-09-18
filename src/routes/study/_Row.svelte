<script lang="ts">
	import { getAnswers } from "$/lib/answer"
	import KanaCheckbox from "./_KanaCheckbox.svelte"
	import KanaCheckboxSpacer from "./_KanaCheckboxSpacer.svelte"
	import { createEventDispatcher } from "svelte"
	import { browser } from "$app/env"

	const dispatch = createEventDispatcher()

	export let row: KanaCheckboxRow

	let columnAnimationDelay = 0
	let animationDelay = 0

	function onAnimationFinished() {
		animationDelay = 0
		dispatch("animationFinished")
	}

	export { columnAnimationDelay as animationDelay }
</script>

<div
	class="row"
	role="row"
	aria-label={getAnswers(row[0].kana)[0].slice(0, row[0].kana.length) +
		"- sounds"}
>
	{#each row as item, index (item?.kana ?? index)}
		{#if item && browser}
			<KanaCheckbox
				bind:item
				rowIndex={index}
				rowLength={row.length}
				animationDelay={columnAnimationDelay || animationDelay * index}
				on:animationFinished={index === row.length - 1 && onAnimationFinished}
			/>
		{:else}
			<KanaCheckboxSpacer {item} fill={!browser} />
		{/if}
	{/each}
</div>
