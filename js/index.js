import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/theme-cookie.js';
import 'https://cdn.kernvalley.us/components/share-button.js';
import 'https://cdn.kernvalley.us/components/slide-show/slide-show.js';
import 'https://cdn.kernvalley.us/components/github/user.js';
import 'https://cdn.kernvalley.us/components/current-year.js';
import 'https://cdn.kernvalley.us/components/bacon-ipsum.js';
import { ready, css } from 'https://cdn.kernvalley.us/js/std-js/dom.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/esQuery.js';
import { init } from 'https://cdn.kernvalley.us/js/std-js/data-handlers.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from 'https://cdn.kernvalley.us/js/std-js/google-analytics.js';
import { submitHandler } from './contact-demo.js';
import { GA } from './consts.js';

$(document.documentElement).toggleClass({
	'no-dialog': document.createElement('dialog') instanceof HTMLUnknownElement,
	'no-details': document.createElement('details') instanceof HTMLUnknownElement,
	'js': true,
	'no-js': false,
});

if (typeof GA === 'string' && GA.length !== 0) {
	requestIdleCallback(() => {
		importGa(GA).then(async ({ ga, hasGa }) => {
			if (hasGa()) {
				ga('create', GA, 'auto');
				ga('set', 'transport', 'beacon');
				ga('send', 'pageview');

				await ready();

				$('a[rel~="external"]').click(externalHandler, { passive: true, capture: true });
				$('a[href^="tel:"]').click(telHandler, { passive: true, capture: true });
				$('a[href^="mailto:"]').click(mailtoHandler, { passive: true, capture: true });
			}
		});
	});
}

Promise.allSettled([
	ready(),
]).then(() => {
	init().catch(console.error);

	$('#sun').animate([{
		transform: 'translate(-5vw, 20vh)',
		fill: '#f97718',
	}, {
		transform: 'none',
		fill: '#f3c80c',
	}], {
		duration: 8000,
		easing: 'ease-in',
		fill: 'both',
	});

	$('#bird').animate([{
		transform: 'translate(55vw, 2vh)'
	}, {
		transform: 'none',
	}], {
		delay: 2000,
		duration: 6000,
		easing: 'ease-out',
		fill: 'both',
	});

	if (location.pathname.startsWith('/contact')) {
		$('#contact-form').submit(submitHandler);
	} else if (location.pathname.startsWith('/portfolio')) {
		const $entries = $('.portfolio-entry');

		if ('IntersectionObserver' in window) {
			$entries.addClass('hidden');
			const observer = new IntersectionObserver(entries => {
				entries.forEach(({ target, isIntersecting }, i) => {
					if (isIntersecting) {
						target.animate([{
							transform: 'rotateX(-30deg) scale(0.85)',
							opacity: 0.3,
						}, {
							transform: 'none',
							opacity: 1,
						}], {
							duration: 300,
							delay: 100 * i,
							easing: 'ease-in-out',
						});
						target.classList.remove('hidden');
					} else {
						target.classList.add('hidden');
					}
				});
			});

			$entries.each(entry => observer.observe(entry));
		}

		$entries.click(async function() {
			const img = this.querySelector('img');

			if (img instanceof Element) {
				const dialog = document.createElement('dialog');
				const container = document.createElement('div');
				const cpy = img.cloneNode(true);

				container.classList.add('card', 'shadow', 'center');
				cpy.height = img.naturalHeight;
				cpy.width = img.naturalWidth;
				container.append(cpy);
				dialog.append(container);

				css(dialog, {
					'background-color': 'transparent',
					'border': 'none',
				});

				document.body.append(dialog);
				dialog.addEventListener('close', ({ target }) => target.remove());
				dialog.addEventListener('click', function() {
					this.close();
				}, { once: true });

				if (dialog.animate instanceof Function) {
					dialog.animate([{
						opacity: 0.1,
					}, {
						opacity: 1,
					}], {
						duration: 400,
						easing: 'ease-in-out',
					});
				}

				dialog.showModal();
			}
		});
	}
});
