<script lang="ts">
	import { getAnswers } from "$/lib/answer"
	import { gameConfig } from "$/stores/game-config"
	import { toKatakana, toRomaji } from "wanakana"
	import { playCheckboxSelectSound } from "$/lib/sound"
	import { longHover } from "$/lib/long-hover"
	import { createEventDispatcher } from "svelte"
	import { fade } from "svelte/transition"
	import { cubicOut } from "svelte/easing"

	export let item: KanaCheckbox
	export let rowIndex: number
	export let rowLength: number
	export let animationDelay = 0

	const dispatch = createEventDispatcher()

	let isLongHover = false

	const enableHover = () => (isLongHover = true)
	const disableHover = () => (isLongHover = false)

	//Need to change this, default should be hiragana & remove the possibility it can be both
	$: kanaType = $gameConfig.kanaStudy
	$: showPopover = false
	$: style = animationDelay
		? `animation-delay: ${animationDelay}ms; transition-delay: ${animationDelay}ms`
		: null

	function transitionEnd(event: TransitionEvent) {
		event.stopPropagation()

		// One transition event is fired per modified property. We want to make
		// sure to only catch one of these per animation cycle
		if (event.propertyName === "background-color") {
			dispatch("animationFinished")
		}
	}

	function animationEnd(event: AnimationEvent) {
		event.stopPropagation()

	}

	item.checked = true
</script>

<div class="kana-wrapper">
	<div class="kana-label">
		{toRomaji(item.kana.toLowerCase())}
	</div>
	<button
		class="checkbox-kana"
		role="checkbox"
		class:selected={item.checked}
		class:wide={item.kana === "ん"}
		{style}
		aria-pressed={item.checked}
		title={`Select '${getAnswers(item.kana)[0]}'`}
		on:click={() => {
			//Swap this with the audios we want to play
			//Call a function, pass the kana romaji through, the audio file will be named that and play according
			playCheckboxSelectSound(rowIndex, rowLength, item.checked)
		}}
		use:longHover={{
			delay: 500,
			start: enableHover,
			end: disableHover,
			enabled: showPopover
		}}
	>
		<div class="effect" aria-hidden="true">
			<div
				class="block base"
				class:hiragana={kanaType === "hiragana"}
				class:katakana={["katakana", "both"].includes(kanaType)}
				on:transitionend={transitionEnd}
				on:transitioncancel={transitionEnd}
			>
				{["katakana", "both"].includes(kanaType)
					? toKatakana(item.kana)
					: item.kana}
			</div>
			{#if showPopover}
				<div
					class="block hiragana popover"
					on:animationend={animationEnd}
					out:fade|local={{
						duration: 125,
						delay: animationDelay,
						easing: cubicOut
					}}
				>
					{item.kana}
				</div>
			{/if}
		</div>
	</button>
</div>

<style lang="postcss">
	.checkbox-kana {
		--border-width: 3px;

		all: initial;
		font-family: "M+ 2c";
		font-size: 1.5em;
		line-height: 1;
		white-space: nowrap;
		position: relative;
		user-select: none;
		flex-grow: 1; /* grow to fill any remaining space. used for ん/ン. */
	}

	.kana-wrapper {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		flex-grow: 1;
	}

	.checkbox-kana.extended-click-area::before {
		content: "";
		display: block;
		position: absolute;
		top: -4px;
		left: -4px;
		right: 4px;
		bottom: 4px;
		z-index: 1;
	}

	.effect {
		transition: transform 30ms var(--standard-curve);
		animation-delay: inherit;
		transition-delay: inherit;
	}

	.checkbox-kana:active .effect {
		transform: translateY(8%) scale(110%, 90%);
	}

	.checkbox-kana.wide:active .effect {
		transform: translateY(8%) scale(104%, 90%);
	}

	.block {
		--transition: 125ms var(--standard-curve) color,
			125ms var(--standard-curve) background,
			125ms var(--standard-curve) border-color;

		color: var(--text-color-light);
		background: var(--background-color);
		border: var(--border-width) solid var(--text-color-lighter);
		border-radius: var(--standard-border-radius);
		transition: var(--transition);
		padding: 0.25em;
		text-align: center;
		transition-delay: inherit;
	}

	.checkbox-kana.selected .block {
		border-color: transparent;

		&.hiragana {
			color: var(--text-color-on-accent-color);
			background: var(--accent-color);
		}
		&.katakana {
			color: var(--text-color-on-secondary-accent-color);
			background: var(--secondary-accent-color);
		}
	}

	@keyframes drop {
		0% {
			transform: translateY(-75%) scale(90%, 80%);
			z-index: 1;
			opacity: 1;
		}
		50% {
			transform: translateY(20%) scale(105%, 85%);
		}
		100% {
			transform: none;
			opacity: 1;
		}
	}

	.block.popover {
		pointer-events: none;
		position: absolute;
		top: -4px;
		left: -4px;
		right: 4px;
		bottom: 4px;

		/* opacity is overwritten by animation */
		opacity: 0;

		animation-name: drop;
		animation-duration: 125ms;
		animation-timing-function: var(--deceleration-curve);
		animation-fill-mode: forwards;
		animation-delay: inherit;
	}

	@keyframes flip {
		0% {
			transform: translateY(0);
			z-index: 1;
		}
		33% {
			transform: translateY(-50%) scale(90%, 80%);
			z-index: 1;
		}
		66% {
			transform: translateY(20%) scale(105%, 85%);
			z-index: -1;
		}
		100% {
			transform: none;
			z-index: -1;
		}
	}

	.checkbox-kana.long-hover .block.popover {
		opacity: 1;
		animation: none;
		animation-name: flip;
		animation-duration: 125ms;
		animation-timing-function: var(--deceleration-curve);
		animation-fill-mode: forwards;
	}

	.checkbox-kana:not(.selected):focus-visible .block {
		color: var(--focus-color);
		border-color: var(--focus-color);
		transition: var(--transition), 75ms var(--standard-curve) color,
			75ms var(--standard-curve) border-color;
	}

	.checkbox-kana.selected:focus-visible .block {
		border-color: var(--focus-color);
		transition: var(--transition), 75ms var(--standard-curve) border-color;
	}

	.kana-label {
		text-align: center;
		font-size: 1em;
		font-weight: bold;
		width: 3ch;
		display: inline-block;
		margin-bottom: 5px;
	}
</style>
