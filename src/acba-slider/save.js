import { useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const {
		beforeImage,
		afterImage,
		startPosition = 50,
		step = 5,
		mouseFollow = false,
		clickPosition = false,
		autoSlide = false,
		slideSpeed = 3000,
		floatingLabels = false,
		autoSliderSteps = 5,
		animationSpeed = 70,
		handleColor = '#ACACAC',
		dividerColor = '#C5C5C5',
		beforeLabelColor = '#000000',
		afterLabelColor = '#000000',
		handleVisible = true,
		beforeAlt = '',
		afterAlt = '',
	} = attributes;

	const blockProps = useBlockProps.save( {
		'data-component': 'beforeafterslider',
		'data-startingposition': startPosition,
		'data-step': step,
		'data-mousefollow': mouseFollow ? 'true' : 'false',
		'data-clickposition': clickPosition ? 'true' : 'false',
		'data-autoslide': autoSlide ? 'true' : 'false',
		'data-slidespeed': slideSpeed,
		'data-autoslidersteps': autoSliderSteps,
		'data-floating-labels': floatingLabels ? 'true' : 'false',
		'data-animationspeed': animationSpeed,
		'data-handlecolor': handleColor,
		'data-dividercolor': dividerColor,
		'data-beforelabelcolor': beforeLabelColor,
		'data-afterlabelcolor': afterLabelColor,
		'data-handlevisible': handleVisible ? 'true' : 'false',
		'data-beforealt': beforeAlt,
		'data-afteralt': afterAlt,
	} );

	return (
		<div
			{ ...blockProps }
			className={ `acbaslider ${
				floatingLabels ? 'acbaslider--floating-labels' : ''
			}` }
		>
			<div className="acbaslider__images">
				{ beforeImage ? (
					<img
						className="acbaslider__images__img"
						src={ beforeImage }
						data-image="1"
						alt={ beforeAlt || 'Before' }
					/>
				) : (
					<p>No Before Image</p>
				) }
				{ afterImage ? (
					<img
						className="acbaslider__images__img"
						src={ afterImage }
						data-image="2"
						alt={ afterAlt || 'After' }
					/>
				) : (
					<p>No After Image</p>
				) }
			</div>

			{ /* Labels for when JS is disabled (always visible) */ }
			<div className="acbaslider__labels">
				<span
					className="acbaslider__labels__label -before"
					style={ { color: '#000', backgroundColor: 'transparent' } }
				>
					Before
				</span>
				<div className="acbaslider__labels__separator"></div>
				<span
					className="acbaslider__labels__label -after"
					style={ { color: '#000', backgroundColor: 'transparent' } }
				>
					After
				</span>
			</div>
		</div>
	);
}
