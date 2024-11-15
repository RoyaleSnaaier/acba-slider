import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';

import './style.css';

registerBlockType( 'ac-baslider/before-after-slider', {
	edit: Edit,
	save: Save,
} );
