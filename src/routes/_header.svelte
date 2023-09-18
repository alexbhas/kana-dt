<script lang="ts">
	import MaterialIcon from "$/components/MaterialIcon.svelte"
	import { mdiGithub } from "@mdi/js"
</script>

<section class="header content-padding">
	<div class="content-width center">
		<h1>Kana DT</h1>
		<ul>
			<li>
				<a
					href="https://alexbhasin.ca"
					target="_blank"
					rel="nofollow"
					class="menu-link"
					aria-label="Author"
				>
					by Alexander Bhasin
				</a>
			</li>
			<li>
				<a
					href="https://github.com/alexbhas/kana-dt"
					target="_blank"
					rel="nofollow"
					class="menu-link"
					title="Source code"
					aria-label="Source code"
				>
					<MaterialIcon title="GitHub logo" size="1.25em" path={mdiGithub} />
				</a>
			</li>
		</ul>
	</div>
</section>

<style lang="postcss">
	.header {
		background: var(--background-contrast);
	}

	h1 {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5em;
	}

	ul {
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		gap: var(--line-space);
		justify-content: center;
	}

	li {
		list-style: none;
		white-space: nowrap;

		a {
			display: flex;
			align-items: center;
			gap: 0.3em;
			text-decoration: none;
			border-bottom: 1px solid transparent;

			&:hover {
				border-color: currentColor;
			}
		}
	}

	.menu-link {
		color: var(--text-color);

		&:active,
		&:focus-visible {
			outline: none;
			color: var(--text-color-on-focus-color);
			background: var(--focus-color);
			border-color: var(--focus-color);
		}
	}
</style>
