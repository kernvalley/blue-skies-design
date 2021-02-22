import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/theme-cookie.js';
import 'https://cdn.kernvalley.us/components/share-button.js';
import 'https://cdn.kernvalley.us/components/share-to-button/share-to-button.js';
import 'https://cdn.kernvalley.us/components/slide-show/slide-show.js';
import 'https://cdn.kernvalley.us/components/github/user.js';
import 'https://cdn.kernvalley.us/components/current-year.js';
import 'https://cdn.kernvalley.us/components/bacon-ipsum.js';
import 'https://cdn.kernvalley.us/components/leaflet/map.js';
import 'https://cdn.kernvalley.us/components/leaflet/marker.js';
import 'https://cdn.kernvalley.us/components/pwa/install.js';
import 'https://cdn.kernvalley.us/components/ad/block.js';
import 'https://cdn.kernvalley.us/components/app/list-button.js';
// import { $, ready } from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import { ready, css } from 'https://cdn.kernvalley.us/js/std-js/dom.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/esQuery.js';
import { init } from 'https://cdn.kernvalley.us/js/std-js/data-handlers.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from 'https://cdn.kernvalley.us/js/std-js/google-analytics.js';
import { submitHandler } from './contact-demo.js';
import { GA } from './consts.js';

$(':root').css({'--viewport-height': `${window.innerHeight}px`});

requestIdleCallback(() => {
	$(window).debounce('resize', () => $(':root').css({'--viewport-height': `${window.innerHeight}px`}));

	$(window).on('scroll', () => {
		requestAnimationFrame(() => {
			$('#header').css({
				'background-position-y': `${-0.5 * scrollY}px`,
			});
		});
	}, { passive: true });
});

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
		transform: 'translate(45vw, 44vh)',
		fill: '#f97718',
	}, {
		transform: 'translate(60vw, 5vh)',
		fill: '#f3c80c',
	}], {
		duration: 8000,
		easing: 'ease-in-out',
		fill: 'both',
	});

	$('#bird').animate([{
		transform: 'translate(20vw, 10vh)'
	}, {
		transform: 'none',
	}], {
		duration: 10000,
		easing: 'linear',
		fill: 'both',
	});

	if (location.pathname.startsWith('/contact')) {
		$('#contact-form').submit(submitHandler);
	} else if (location.pathname.startsWith('/portfolio')) {
		$('.portfolio-entry').click(async function() {
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
