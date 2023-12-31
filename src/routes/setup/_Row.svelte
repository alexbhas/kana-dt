<script lang="ts">
	import { getAnswers } from "$/lib/answer"
	import { playCheckboxSelectSeriesSound } from "$/lib/sound"
	import Checkbox from "$/components/Checkbox.svelte"
	import KanaCheckbox from "./_KanaCheckbox.svelte"
	import KanaCheckboxSpacer from "./_KanaCheckboxSpacer.svelte"
	import { createEventDispatcher } from "svelte"
	import { browser } from "$app/env"

	const dispatch = createEventDispatcher()

	export let row: KanaCheckboxRow

	let columnAnimationDelay = 0
	let animationDelay = 0

	function isRowSelected(row: KanaCheckboxRow): boolean {
		return row.filter((item) => item !== null).every((item) => item.checked)
	}

	function selectRow(state: boolean) {
		return function (row: KanaCheckboxRow) {
			animationDelay = 20
			return row.map((item) => {
				if (item === null) return null
				return { ...item, checked: state }
			})
		}
	}

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
	<Checkbox
		title="Select row"
		checked={isRowSelected(row)}
		indeterminate={!isRowSelected(row) &&
			row.filter((item) => item !== null).some((item) => item.checked)}
		on:click={() => {
			const newState = !isRowSelected(row)
			const diffItems = row
				.filter((item) => item !== null)
				.filter((item) => item.checked !== newState)
			const toPlay = Math.min(diffItems.length, 4)

			playCheckboxSelectSeriesSound(toPlay, newState)
			row = selectRow(newState)(row)
		}}
	/>
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
