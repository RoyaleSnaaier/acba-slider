document.addEventListener( 'DOMContentLoaded', function () {
	const sliders = document.querySelectorAll(
		'[data-component="beforeafterslider"]'
	);
	sliders.forEach( ( slider ) => {
		const handleColor = slider.getAttribute( 'data-handlecolor' );
		const dividerColor = slider.getAttribute( 'data-dividercolor' );
		const beforeLabelColor = slider.getAttribute( 'data-beforelabelcolor' );
		const afterLabelColor = slider.getAttribute( 'data-afterlabelcolor' );
		const handleVisible =
			slider.getAttribute( 'data-handlevisible' ) === 'true';

		const divider = slider.querySelector( '.acbaslider__divider' );
		const handle = slider.querySelector( '.acbaslider__divider__handle' );
		const beforeLabel = slider.querySelector(
			'.acbaslider__labels__label.-before'
		);
		const afterLabel = slider.querySelector(
			'.acbaslider__labels__label.-after'
		);

		const beforeImage = slider.querySelector( 'img[data-image="1"]' );
		const afterImage = slider.querySelector( 'img[data-image="2"]' );
		const beforeAlt = slider.getAttribute( 'data-beforealt' );
		const afterAlt = slider.getAttribute( 'data-afteralt' );

		if ( beforeImage ) {
			beforeImage.alt = beforeAlt || 'Before Image';
		}

		if ( afterImage ) {
			afterImage.alt = afterAlt || 'After Image';
		}

		if ( divider ) {
			divider.style.backgroundColor = dividerColor;
		}

		if ( handle ) {
			handle.style.backgroundColor = handleColor;
			handle.style.display = handleVisible ? 'block' : 'none';
		}

		if ( beforeLabel ) {
			beforeLabel.style.color = beforeLabelColor;
			beforeLabel.style.backgroundColor = beforeLabelColor;
		}

		if ( afterLabel ) {
			afterLabel.style.color = afterLabelColor;
			afterLabel.style.backgroundColor = afterLabelColor;
		}
	} );
} );
