<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit"
</script>

<script lang="ts">
	import Header from "./_header.svelte"
	import Button from "$/components/Button.svelte"
	import Icon from "$/components/MaterialIcon.svelte"
	import { mdiArrowRight } from "@mdi/js"
	import { mdiSchool } from "@mdi/js"

</script>

<svelte:head>
	<title>Kana DT</title>
</svelte:head>

<Header/>
<section class="content-padding">
	<div class="content-width center">
		<p>
			Kana DT is an app that allows you to study & be quizzed on hiragana and katakana, the
			Japanese syllabaries.
		</p>

		<Button href="/study">
			Study
			<Icon size="1.25em" path={mdiSchool} />
		</Button>
		<span class="spacer"></span>
		<Button href="/setup">
			Setup Quiz
			<Icon size="1.25em" path={mdiArrowRight} />
		</Button>

	</div>
</section>

<style lang="postcss">
	* :global(.button .svg-icon) {
		margin-right: -0.5em;
	}
	.spacer{
		display:  inline-block;
		width:0.5rem;
	}
</style>
