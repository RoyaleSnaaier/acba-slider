( () => {
	'use strict';

	( function () {
		var initializeSlider = function ( container: HTMLElement, settings: Record<string, any> ) {
			if ( settings === void 0 ) {
				settings = {};
			}
			if ( container.dataset.initSlider ) {
				return;
			}
			container.dataset.initSlider = '1';
			var beforeImage = container.querySelector( 'img[data-image="1"]' ) as HTMLImageElement;
			var afterImage = container.querySelector( 'img[data-image="2"]' ) as HTMLImageElement;
			if ( ! beforeImage || ! afterImage ) {
				console.error(
					'Before or After image is missing in the container.'
				);
				return;
			}
			var labels = container.querySelector( '.acbaslider__labels' );
			var beforeLabel: HTMLSpanElement | null = null;
			var afterLabel: HTMLSpanElement | null = null;
			var floatingLabelsEnabled =
				container.dataset.floatingLabels === 'true';

			if ( floatingLabelsEnabled ) {
				beforeLabel = document.createElement( 'span' );
				beforeLabel.className = 'acbaslider__floating-label -before';
				beforeLabel.innerText = 'Before';
				beforeLabel.style.backgroundColor =
					container.dataset.beforelabelcolor || '#FFFFFF';
				container.appendChild( beforeLabel );
				afterLabel = document.createElement( 'span' );
				afterLabel.className = 'acbaslider__floating-label -after';
				afterLabel.innerText = 'After';
				afterLabel.style.backgroundColor =
					container.dataset.afterlabelcolor || '#FFFFFF';
				container.appendChild( afterLabel );
			}

			var config = Object.assign(
				{
					step: parseInt( container.dataset.step || '1' ) || 1,
					startPosition:
						parseInt( container.dataset.startingposition || '50' ) || 50,
					mouseFollow: container.dataset.mousefollow === 'true',
					clickPosition: container.dataset.clickposition === 'true',
					autoSlide: container.dataset.autoslide === 'true',
					autoSliderSteps:
						parseInt( container.dataset.autoslidersteps || '5' ) || 5,
					slideSpeed:
						parseInt( container.dataset.slidespeed || '3000' ) || 3000,
					dividerColor: container.dataset.dividercolor || '#C5C5C5',
					handleColor: container.dataset.handlecolor || '#ACACAC',
					animationSpeed:
						parseInt( container.dataset.animationspeed || '70' ) || 70,
					handleVisible: container.dataset.handlevisible === 'true',
				},
				settings
			);

			if ( labels ) {
				(labels as HTMLElement).style.display = 'none';
			}

			if ( ! beforeImage || ! afterImage ) return;
			var setResponsiveSize = function () {
				if (
					! beforeImage || ! beforeImage.naturalWidth ||
					! beforeImage || ! beforeImage.naturalHeight
				) {
					console.log( 'Images are not fully loaded yet.' );
					return;
				}
				var aspectRatio =
					beforeImage.naturalHeight / beforeImage.naturalWidth;
				var containerWidth =
					container.clientWidth || beforeImage.naturalWidth;
				var height = containerWidth * aspectRatio;
				container.style.height = ''.concat( height.toString(), 'px' );
			};
			var initializeResponsiveSize = function () {
				setResponsiveSize();
				window.addEventListener( 'resize', setResponsiveSize );
			};
			initializeResponsiveSize();
			// Set initial styles for the container if u want to have it dynamic :) (remove the box-radius and box-shadow from the scss!)
			// container.style.borderRadius = '15px';
			// container.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.2)';
			afterImage.style.clipPath = 'inset(0 '.concat(
				(100 - config.startPosition).toString(),
				'% 0 0)'
			);
			var slider = document.createElement( 'div' );
			slider.className = 'acbaslider__divider';
			slider.style.backgroundColor = config.dividerColor; // Set divider color

			var handle = document.createElement( 'div' );
			handle.className = 'acbaslider__divider__handle';
			handle.style.backgroundColor = config.handleColor; // Set handle color
			handle.style.display = config.handleVisible ? 'block' : 'none'; // Set handle visibility
			slider.appendChild( handle );
			container.appendChild( slider );
			slider.style.left = ''.concat( config.startPosition.toString(), '%' );

			var isDragging = false;
			var autoSlideInterval: ReturnType<typeof setInterval> | undefined;

			// // Existing function to update slider position
			var updateSliderPosition = ( function () {
				var lastFrame = 0;
				return function ( percentage: number, smooth: boolean, isClick: boolean ) {
					if ( smooth === void 0 ) {
						smooth = false;
					}
					if ( isClick === void 0 ) {
						isClick = false;
					}
					var now = performance.now();
					if ( now - lastFrame < 16 ) return; // Maintain 60 FPS
					lastFrame = now;

					// Default transition duration based on animationSpeed from the config
					var defaultTransitionDuration = `${ config.animationSpeed }ms ease`; // Set based on config

					// Use a fixed transition duration for click
					var clickTransitionDuration = '0.3s ease'; // Keep fixed duration for click transition

					// Determine the transition duration based on the smooth flag
					var sliderTransition = smooth
						? defaultTransitionDuration
						: 'none';

					// Add a bit of extra time to the label transition duration
					var labelTransitionDuration = config.animationSpeed + 30; // Add 100ms to animationSpeed
					var labelTransition = smooth
						? `${ labelTransitionDuration }ms ease`
						: 'none';

					var afterImageClipValue = 100 - percentage;
					var beforeLabelOffset = `calc(${ percentage }% - 15%)`;
					var afterLabelOffset = `calc(${ percentage }% + 5%)`;

					slider.style.transition = sliderTransition;
					afterImage.style.transition = sliderTransition;
					slider.style.left = `${ percentage }%`;
					afterImage.style.clipPath = `inset(0 ${ afterImageClipValue }% 0 0)`;

					if ( floatingLabelsEnabled ) {
						if (beforeLabel) {
							beforeLabel.style.transition = labelTransition;
							beforeLabel.style.left = beforeLabelOffset;
						}
						if (afterLabel) {
							afterLabel.style.transition = labelTransition;
							afterLabel.style.left = afterLabelOffset;
						}
					}
				};
			} )();

			// Ensure floating labels update on slider load
			updateSliderPosition( config.startPosition, false, false );
			var onMouseMove = function ( e: MouseEvent | Touch ) {
				if ( isDragging || config.mouseFollow ) {
					var rect = container.getBoundingClientRect();
					var offsetX = e.clientX - rect.left;
					offsetX = Math.max( 0, Math.min( offsetX, rect.width ) );
					var percentage = ( offsetX / rect.width ) * 100;
					updateSliderPosition( percentage, true, false );
				}
			};
			var stopDragging = function () {
				isDragging = false;
				slider.style.transition = 'none';
				afterImage.style.transition = 'none';
			};
			slider.addEventListener( 'mousedown', function () {
				isDragging = true;
				slider.style.transition = 'none';
				afterImage.style.transition = 'none';
			} );
			container.addEventListener( 'mousemove', onMouseMove );
			document.addEventListener( 'mouseup', stopDragging );
			if ( config.clickPosition ) {
				container.addEventListener( 'click', function ( e ) {
					var rect = container.getBoundingClientRect();
					var offsetX = e.clientX - rect.left;
					var percentage = ( offsetX / rect.width ) * 100;
					updateSliderPosition( percentage, true, true );
				} );
			}
			// Automatic sliding feature
			var startAutoSlide = function () {
				var position = config.startPosition; // Starting position from config
				var direction = 1; // Initial direction for sliding
				var autoSliderSteps =
					parseFloat( config.autoSliderSteps.toString() ) || 5; // Allow decimal
				var slideSpeed =
					parseFloat( config.slideSpeed.toString() ) || 3000; // Allow decimal
				var updateDirection = function () {
					if ( position >= 100 ) {
						direction = -1; // Reverse direction if reaching max position
					} else if ( position <= 0 ) {
						direction = 1; // Reverse direction if reaching min position
					}
				};
				autoSlideInterval = setInterval( function () {
					position += autoSliderSteps * direction; // Move position by autoSliderSteps
					updateDirection(); // Check if direction needs to be updated
					position = Math.max( 0, Math.min( position, 100 ) ); // Clamp position between 0 and 100
					updateSliderPosition( position, true, false ); // Update the slider position on the UI
				}, slideSpeed ); // Use slideSpeed for interval timing
			};
			// Pause and resume functions
			var pauseAutoSlide = function () {
				clearInterval( autoSlideInterval ); // Clear the interval to pause
			};
			var resumeAutoSlide = function () {
				if ( config.autoSlide ) {
					startAutoSlide(); // Restart auto sliding if it's enabled
				}
			};
			// Initialize auto-slide if enabled
			if ( config.autoSlide ) {
				startAutoSlide(); // Start the auto sliding feature
				// Event listeners to pause and resume on user interaction
				container.addEventListener( 'mouseenter', pauseAutoSlide );
				container.addEventListener( 'mouseleave', resumeAutoSlide );
				container.addEventListener( 'mousedown', pauseAutoSlide );
				container.addEventListener( 'mouseup', resumeAutoSlide );
				container.addEventListener( 'touchstart', pauseAutoSlide );
				container.addEventListener( 'touchend', resumeAutoSlide );
			}
			slider.addEventListener( 'touchstart', function () {
				isDragging = true;
				slider.style.transition = 'none';
				afterImage.style.transition = 'none';
			} );
			document.addEventListener( 'touchmove', function ( e ) {
				var touch = e.touches[ 0 ];
				onMouseMove( touch as unknown as MouseEvent );
			} );
			document.addEventListener( 'touchend', stopDragging );
			slider.tabIndex = 0;
			slider.addEventListener( 'keydown', function ( e ) {
				var percentage =
					parseFloat( slider.style.left ) || config.startPosition;
				var stepSize = config.step;
				if ( e.key === 'ArrowLeft' && percentage > 0 ) {
					percentage = Math.max( 0, percentage - stepSize );
				}
				if ( e.key === 'ArrowRight' && percentage < 100 ) {
					percentage = Math.min( 100, percentage + stepSize );
				}
				updateSliderPosition( percentage, true, false);
			} );
			if ( beforeImage.complete && afterImage.complete ) {
				setResponsiveSize();
			} else {
				beforeImage.onload = afterImage.onload = setResponsiveSize;
			}
			var resizeObserver = new ResizeObserver( setResponsiveSize );
			resizeObserver.observe( container );
		};
		document.addEventListener( 'DOMContentLoaded', function () {
			var initMySlide = function ( el: string ) {
				var containers = document.querySelectorAll( el );
				containers.forEach( function ( container ) {
					var beforeImage = container.querySelector(
						'img[data-image="1"]'
					) as HTMLImageElement;
					var afterImage = container.querySelector(
						'img[data-image="2"]'
					) as HTMLImageElement;
					if ( ! beforeImage || ! afterImage ) {
						console.error(
							'Before or After image is missing in the container.'
						);
						return;
					}
					var config: Record<string, any> = {};
					[
						'step',
						'startingPosition',
						'mouseFollow',
						'clickPosition',
						'autoSlide',
						'slideSpeed',
					].forEach( function ( prop ) {
						if ( (container as HTMLElement).dataset[ prop ] ) {
							config[ prop ] = (container as HTMLElement).dataset[ prop ];
						}
					} );
					if ( beforeImage.complete && afterImage.complete ) {
						initializeSlider( container as HTMLElement, config );
					} else {
						beforeImage.onload = afterImage.onload = function () {
							return initializeSlider( container as HTMLElement, config );
						};
					}
				} );
			};
			initMySlide( '[data-component="beforeafterslider"]' );
		} );
	} )();
} )();