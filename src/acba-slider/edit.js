import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	MediaUpload,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	TextControl,
	ColorPalette,
	Button,
} from '@wordpress/components';
import { useState, useRef, useEffect } from 'react';
import '../plugin/editor.scss'; // Import custom styles

const AcbaColorControl = ({ label, value, onChange, isOpen, setIsOpen }) => {
	const colorCircleRef = useRef(null);
	const paletteRef = useRef(null);

	const handleKeyDown = (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			setIsOpen(label);
		}
	};

	const handlePaletteClick = (event) => {
		event.stopPropagation();
	};

	const handleColorChange = (color) => {
		onChange(color);
	};

	const handleCloseClick = () => {
		setIsOpen(null);
		colorCircleRef.current.focus();
	};

	const handleClickOutside = (event) => {
		if (paletteRef.current && !paletteRef.current.contains(event.target) && !colorCircleRef.current.contains(event.target)) {
			setIsOpen(null);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className="acba-color-control">
			<span>{label}</span>
			<div
				className="acba-color-circle"
				style={{ backgroundColor: value }}
				onClick={() => setIsOpen(label)}
				onKeyDown={handleKeyDown}
				tabIndex="0"
				ref={colorCircleRef}
				role="button"
				aria-expanded={isOpen === label}
				aria-label={`${label} color selector`}
			></div>
			{isOpen === label && (
				<div
					className={`components-color-palette acba-open`}
					onClick={handlePaletteClick}
					ref={paletteRef}
				>
					<button className="close-button" onClick={handleCloseClick} aria-label="Close color palette">
						&times;
					</button>
					<ColorPalette
						value={value}
						onChange={handleColorChange}
					/>
				</div>
			)}
		</div>
	);
};

export default function Edit( { attributes, setAttributes } ) {
	const {
		beforeImage = '',
		afterImage = '',
		startPosition = 50,
		step = 5,
		mouseFollow = false,
		clickPosition = false,
		autoSlide = false,
		slideSpeed = 3000,
		floatingLabels = false,
		autoSliderSteps = 5,
		dividerColor = '#C5C5C5', // Changed to a neutral color
		handleColor = '#ACACAC', // Changed to a neutral color
		animationSpeed = 300,
		beforeAlt = '',
		afterAlt = '',
		beforeLabelColor = '#666666', // Changed to a neutral color
		afterLabelColor = '#666666', // Changed to a neutral color
		handleVisible = true,
	} = attributes;

	const blockProps = useBlockProps();
	const [openPalette, setOpenPalette] = useState(null);

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Slider Settings', 'ac-baslider' ) }>
					<RangeControl
						label={ __( 'Start Position', 'ac-baslider' ) }
						value={ startPosition }
						onChange={ ( value ) =>
							setAttributes( { startPosition: value } )
						}
						min={ 0 }
						max={ 100 }
					/>
					<RangeControl
						label={ __( 'Step', 'ac-baslider' ) }
						value={ step }
						onChange={ ( value ) =>
							setAttributes( { step: value } )
						}
						min={ 1 }
						max={ 100 }
					/>
					<ToggleControl
						label={ __( 'Mouse Follow', 'ac-baslider' ) }
						checked={ mouseFollow }
						onChange={ () =>
							setAttributes( { mouseFollow: ! mouseFollow } )
						}
					/>
					<ToggleControl
						label={ __( 'Click Position', 'ac-baslider' ) }
						checked={ clickPosition }
						onChange={ () =>
							setAttributes( { clickPosition: ! clickPosition } )
						}
					/>
					<ToggleControl
						label={ __( 'Auto Slide', 'ac-baslider' ) }
						checked={ autoSlide }
						onChange={ () =>
							setAttributes( { autoSlide: ! autoSlide } )
						}
					/>
					{ autoSlide && (
						<>
							<TextControl
								label={ __(
									'Slide Interval (ms)',
									'ac-baslider'
								) }
								value={ slideSpeed }
								type="number"
								onChange={ ( value ) =>
									setAttributes( {
										slideSpeed: parseInt( value, 10 ) || 0,
									} )
								}
							/>
							<TextControl
								label={ __(
									'Auto Slider Steps',
									'ac-baslider'
								) }
								value={ autoSliderSteps }
								type="number"
								onChange={ ( value ) =>
									setAttributes( {
										autoSliderSteps:
											parseInt( value, 10 ) || 0,
									} )
								}
							/>
						</>
					) }
					<ToggleControl
						label={ __( 'Floating Labels', 'ac-baslider' ) }
						checked={ floatingLabels }
						onChange={ () =>
							setAttributes( {
								floatingLabels: ! floatingLabels,
							} )
						}
					/>
					<ToggleControl
						label={ __( 'Handle Visible', 'ac-baslider' ) }
						checked={ handleVisible }
						onChange={ () =>
							setAttributes( { handleVisible: ! handleVisible } )
						}
					/>
					<TextControl
						label={ __( 'Animation Speed (ms)', 'ac-baslider' ) }
						value={ animationSpeed }
						type="number"
						onChange={ ( value ) =>
							setAttributes( {
								animationSpeed: parseInt( value, 10 ) || 70,
							} )
						}
					/>
				</PanelBody>

				<PanelBody title={ __( 'Appearance Settings', 'ac-baslider' ) }>
					<AcbaColorControl
						label={ __( 'Divider Color', 'ac-baslider' ) }
						value={ dividerColor }
						onChange={ ( color ) =>
							setAttributes( { dividerColor: color } )
						 }
						isOpen={openPalette}
						setIsOpen={setOpenPalette}
					/>
					{ handleVisible && (
						<AcbaColorControl
							label={ __( 'Handle Color', 'ac-baslider' ) }
							value={ handleColor }
							onChange={ ( color ) =>
								setAttributes( { handleColor: color } )
							}
							isOpen={openPalette}
							setIsOpen={setOpenPalette}
						/>
					) }
					{ floatingLabels && (
						<>
							<AcbaColorControl
								label={ __( 'Before Label Color', 'ac-baslider' ) }
								value={ beforeLabelColor }
								onChange={ ( color ) =>
									setAttributes( { beforeLabelColor: color } )
								}
								isOpen={openPalette}
								setIsOpen={setOpenPalette}
							/>
							<AcbaColorControl
								label={ __( 'After Label Color', 'ac-baslider' ) }
								value={ afterLabelColor }
								onChange={ ( color ) =>
									setAttributes( { afterLabelColor: color } )
								}
								isOpen={openPalette}
								setIsOpen={setOpenPalette}
							/>
						</>
					) }
				</PanelBody>
				<PanelBody title={ __( 'Images', 'ac-baslider' ) }>
					<div className="acbaslider__img-select-container">
						<MediaUpload
							label={ __( 'Before Image', 'ac-baslider' ) }
							allowedTypes={ [ 'image' ] }
							value={ beforeImage }
							onSelect={ ( image ) =>
								setAttributes( {
									beforeImage: image.url,
									beforeAlt: image.alt,
								} )
							}
							render={ ( { open } ) => (
								<div className="acbaslider-image-selection">
									{ beforeImage && (
										<img
											src={ beforeImage }
											alt={ __(
												'Before Image Preview',
												'ac-baslider'
											) }
										/>
									) }
									<div className="acbaslider-button-wrapper">
										<Button
											onClick={ open }
											variant="secondary"
											size="small"
										>
											{ beforeImage
												? __(
														'Change Before Image',
														'ac-baslider'
												  )
												: __(
														'Select Before Image',
														'ac-baslider'
												  ) }
										</Button>
									</div>
								</div>
							) }
						/>
						<MediaUpload
							label={ __( 'After Image', 'ac-baslider' ) }
							allowedTypes={ [ 'image' ] }
							value={ afterImage }
							onSelect={ ( image ) =>
								setAttributes( {
									afterImage: image.url,
									afterAlt: image.alt,
								} )
							}
							render={ ( { open } ) => (
								<div className="acbaslider-image-selection">
									{ afterImage && (
										<img
											src={ afterImage }
											alt={ __(
												'After Image Preview',
												'ac-baslider'
											) }
										/>
									) }
									<div className="acbaslider-button-wrapper">
										<Button
											onClick={ open }
											variant="secondary"
											size="small"
										>
											{ afterImage
												? __(
														'Change After Image',
														'ac-baslider'
												  )
												: __(
														'Select After Image',
														'ac-baslider'
												  ) }
										</Button>
									</div>
								</div>
							) }
						/>
					</div>
				</PanelBody>
			</InspectorControls>

			<div className="acbaslider-editor">
				{ beforeImage && afterImage ? (
					<div className="acbaslider-preview">
						<img
							src={ beforeImage }
							alt={
								beforeAlt || __( 'Before Image', 'ac-baslider' )
							}
						/>
						<img
							src={ afterImage }
							alt={
								afterAlt || __( 'After Image', 'ac-baslider' )
							}
						/>
					</div>
				) : (
					<div className="acbaslider-no-images">
						<p>{ __( 'No images selected.', 'ac-baslider' ) }</p>
					</div>
				) }
			</div>
		</div>
	);
}
