<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import { mdiChevronRight, mdiAutorenew } from "@mdi/js"
	import Icon from "$/components/MaterialIcon.svelte"
	import { settings } from "$/stores/settings"
	import { getAnswers, isCorrectAnswer } from "$/lib/answer"

	export let input = ""
	export let currentKana: string = null
	export let inputElement: HTMLInputElement

	const WHITESPACE = /^\s+$/
	const dispatch = createEventDispatcher()

	let blocked = false
	let shakeAnimationPlaying = false

	function handleSubmit() {
		if (input === "") return

		const isCorrect = isCorrectAnswer(input, currentKana)

		if (!isCorrect) {
			if (blocked) return
			shakeAnimationPlaying = true

			if ($settings.autoCommit === "strict" && $settings.mistakeDelayMs !== 0) {
				blocked = true
				setTimeout(() => (blocked = false), $settings.mistakeDelayMs)
			}
		}

		dispatch("submit", { input })
		input = ""
	}

	function isCompositionEvent(event: InputEvent) {
		// `event.isComposing` is missing when using a Japanese IME on iOS Safari
		// so we instead check for `event.inputType`
		// https://rawgit.com/w3c/input-events/v1/index.html#interface-InputEvent-Attributes
		const composingInputTypes = [
			"insertCompositionText",
			"deleteCompositionText"
		]

		return event.isComposing || composingInputTypes.includes(event.inputType)
	}

	function handleInput(
		event: InputEvent & { currentTarget: EventTarget & HTMLInputElement }
	) {
		if (isCompositionEvent(event)) return
		if (currentKana === null) return
		if (event.data === null) return // control key was pressed

		// remove any excess spaces from string
		input = input.trim()

		if (WHITESPACE.test(event.data)) {
			// space was pressed
			handleSubmit()
			return
		}

		const answers = getAnswers(currentKana)
		if (
			($settings.autoCommit !== "disabled" &&
				isCorrectAnswer(input, currentKana)) ||
			($settings.autoCommit === "strict" &&
				!answers.some((answer) => answer.startsWith(input)))
		) {
			handleSubmit()
		}
	}
</script>

<form
	class="answer-input content-width"
	class:shake-animation-playing={shakeAnimationPlaying}
	on:submit|preventDefault={handleSubmit}
	on:animationend={() => (shakeAnimationPlaying = false)}
>
	<input
		type="text"
		class="text-field"
		bind:value={input}
		on:input={handleInput}
		placeholder="your answer"
		lang="ja"
		autocapitalize="none"
		autocomplete="off"
		autocorrect="off"
		spellcheck={false}
		bind:this={inputElement}
	/>
	{#if $settings.autoCommit === "disabled"}
		<button type="submit" class="button" title="Submit">
			<Icon size="1em" path={mdiChevronRight} ariaHidden={true} />
		</button>
	{:else}
		<button
			type="button"
			class="button"
			title="Auto submit active. Tap to disable."
			on:click={() => settings.set({ ...$settings, autoCommit: "disabled" })}
		>
			<Icon
				size="0.75em"
				path={mdiAutorenew}
				color="var(--accent-color)"
				ariaHidden={true}
			/>
		</button>
	{/if}
</form>

<style lang="postcss">
	.answer-input {
		display: flex;
		width: 100%;
		position: relative;
		background-color: var(--form-element-background);
		border-bottom: 1px solid var(--background-contrast-light);
		border-radius: 9999px;
		margin: 0 auto;
		font-size: 1.4em;
	}

	.text-field {
		margin: 0;
		width: 100%;
		text-align: center;
		height: 2.5em;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		font-family: inherit;
		font-size: inherit;

		&:focus {
			outline: none;
		}
		&::placeholder {
			color: var(--text-color-light);
		}
	}

	.button {
		color: inherit;
		background: none;
		margin: 0;
		border: 0;
		padding: 0;
		font-size: 1.75em;
		width: 1.5em;
		height: 100%;

		position: absolute;
		right: 0;

		/* center content */
		display: flex;
		align-items: center;
		justify-content: center;

		&:focus-visible {
			outline: var(--focus-color) solid 3px;
		}
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20%,
		60% {
			transform: translateX(-10px);
		}
		40%,
		80% {
			transform: translateX(10px);
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.shake-animation-playing {
			animation-name: shake;
			animation-duration: 300ms;
		}
	}
</style>
